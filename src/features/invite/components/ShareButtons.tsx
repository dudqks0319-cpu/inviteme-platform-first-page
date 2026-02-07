"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";

declare global {
    interface Window {
        Kakao: any;
    }
}

type ShareButtonsProps = {
    inviteUrl: string;
    title: string;
    description: string;
    captureRef: React.RefObject<HTMLDivElement>;
};

export default function ShareButtons({
    inviteUrl,
    title,
    description,
    captureRef,
}: ShareButtonsProps) {
    const [showQR, setShowQR] = useState(false);
    const [copied, setCopied] = useState(false);
    const [downloading, setDownloading] = useState(false);

    // URL 검증 함수
    const isValidUrl = (url: string): boolean => {
        try {
            const parsed = new URL(url);
            // 개발 환경에서는 localhost 허용, 프로덕션에서는 도메인 제한
            const allowedHosts = ['localhost', '127.0.0.1'];
            if (process.env.NODE_ENV === 'production') {
                allowedHosts.push('yourdomain.com'); // 실제 도메인으로 변경
            }
            return allowedHosts.some(host => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`));
        } catch {
            return false;
        }
    };

    const handleKakaoShare = () => {
        if (!window.Kakao) {
            alert("카카오 SDK가 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
            return;
        }

        // URL 검증
        if (!isValidUrl(inviteUrl)) {
            console.error('유효하지 않은 초대장 URL입니다.');
            alert('초대장 URL이 유효하지 않습니다.');
            return;
        }

        if (!window.Kakao.isInitialized()) {
            const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_APP_KEY;
            if (!kakaoKey) {
                console.error('Kakao App Key가 설정되지 않았습니다.');
                alert('카카오 공유 기능을 사용할 수 없습니다. 관리자에게 문의하세요.');
                return;
            }
            window.Kakao.init(kakaoKey);
        }

        window.Kakao.Share.sendDefault({
            objectType: "feed",
            content: {
                title: title || "초대합니다",
                description: description?.slice(0, 100) || "소중한 자리에 초대합니다",
                imageUrl: "https://via.placeholder.com/300x200/FFF5F5/E91E63?text=InviteMe",
                link: {
                    mobileWebUrl: inviteUrl,
                    webUrl: inviteUrl,
                },
            },
            buttons: [
                {
                    title: "초대장 보기",
                    link: {
                        mobileWebUrl: inviteUrl,
                        webUrl: inviteUrl,
                    },
                },
            ],
        });
    };

    const handleDownloadImage = async () => {
        if (!captureRef.current) return;

        setDownloading(true);
        try {
            const canvas = await html2canvas(captureRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: "#FFFFFF",
            });

            const link = document.createElement("a");
            link.download = `invitation-${Date.now()}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        } catch (error) {
            console.error("이미지 다운로드 실패:", error);
            alert("이미지 다운로드에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setDownloading(false);
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(inviteUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for older browsers
            const textArea = document.createElement("textarea");
            textArea.value = inviteUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {/* 카카오톡 공유 */}
                <button
                    onClick={handleKakaoShare}
                    className="flex flex-col items-center gap-2 rounded-xl bg-[#FEE500] px-4 py-3 text-sm font-medium text-[#3C1E1E] shadow-sm hover:brightness-95 active:scale-95 transition"
                >
                    <span className="text-xl">💬</span>
                    <span>카카오톡</span>
                </button>

                {/* 이미지 다운로드 */}
                <button
                    onClick={handleDownloadImage}
                    disabled={downloading}
                    className="flex flex-col items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-emerald-600 active:scale-95 transition disabled:opacity-50"
                >
                    <span className="text-xl">{downloading ? "⏳" : "📷"}</span>
                    <span>{downloading ? "저장 중..." : "이미지 저장"}</span>
                </button>

                {/* QR코드 */}
                <button
                    onClick={() => setShowQR(!showQR)}
                    className={`flex flex-col items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-sm active:scale-95 transition ${showQR ? 'bg-indigo-600 text-white' : 'bg-indigo-500 text-white hover:bg-indigo-600'}`}
                >
                    <span className="text-xl">📱</span>
                    <span>QR코드</span>
                </button>

                {/* 링크 복사 */}
                <button
                    onClick={handleCopyLink}
                    className="flex flex-col items-center gap-2 rounded-xl bg-slate-700 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-slate-800 active:scale-95 transition"
                >
                    <span className="text-xl">{copied ? "✅" : "🔗"}</span>
                    <span>{copied ? "복사됨!" : "링크 복사"}</span>
                </button>
            </div>

            {/* QR코드 표시 */}
            {showQR && (
                <div className="flex flex-col items-center gap-3 rounded-xl bg-white p-6 shadow-inner border border-slate-200">
                    <QRCodeSVG
                        value={inviteUrl}
                        size={180}
                        level="H"
                        includeMargin
                    />
                    <p className="text-xs text-slate-500">QR코드를 스캔하면 초대장으로 이동합니다</p>
                </div>
            )}
        </div>
    );
}
