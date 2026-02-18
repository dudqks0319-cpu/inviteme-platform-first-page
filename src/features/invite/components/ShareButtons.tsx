'use client';

import html2canvas from 'html2canvas';
import { QRCodeSVG } from 'qrcode.react';
import { type RefObject, useState } from 'react';

type KakaoSharePayload = {
  objectType: 'feed';
  content: {
    title: string;
    description: string;
    imageUrl: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  };
  buttons: Array<{
    title: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  }>;
};

type KakaoClient = {
  init: (appKey: string) => void;
  isInitialized: () => boolean;
  Share: {
    sendDefault: (payload: KakaoSharePayload) => void;
  };
};

type ShareButtonsProps = {
  inviteUrl: string;
  title: string;
  description: string;
  captureRef: RefObject<HTMLDivElement>;
  onMessage?: (message: string) => void;
};

const isValidInviteUrl = (value: string) => {
  try {
    const parsed = new URL(value);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

const getKakaoClient = (): KakaoClient | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const windowWithKakao = window as typeof window & { Kakao?: KakaoClient };
  return windowWithKakao.Kakao;
};

const getKakaoAppKey = () =>
  process.env.NEXT_PUBLIC_KAKAO_APP_KEY || process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;

export default function ShareButtons({
  inviteUrl,
  title,
  description,
  captureRef,
  onMessage,
}: ShareButtonsProps) {
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const hasValidInviteUrl = isValidInviteUrl(inviteUrl);

  const notify = (message: string) => {
    onMessage?.(message);
  };

  const handleKakaoShare = () => {
    const kakao = getKakaoClient();

    if (!kakao) {
      notify('카카오 SDK가 아직 준비되지 않았어요. 잠시 후 다시 시도해주세요.');
      return;
    }

    if (!isValidInviteUrl(inviteUrl)) {
      notify('공유할 초대장 URL이 올바르지 않습니다.');
      return;
    }

    if (!kakao.isInitialized()) {
      const kakaoKey = getKakaoAppKey();
      if (!kakaoKey) {
        notify('카카오 공유 키가 설정되지 않았습니다. (NEXT_PUBLIC_KAKAO_APP_KEY 또는 NEXT_PUBLIC_KAKAO_MAP_KEY)');
        return;
      }

      kakao.init(kakaoKey);
    }

    kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: title || '초대합니다',
        description: description?.slice(0, 100) || '소중한 자리에 초대합니다.',
        imageUrl: 'https://via.placeholder.com/300x200/FFF5F5/E91E63?text=InviteMe',
        link: {
          mobileWebUrl: inviteUrl,
          webUrl: inviteUrl,
        },
      },
      buttons: [
        {
          title: '초대장 보기',
          link: {
            mobileWebUrl: inviteUrl,
            webUrl: inviteUrl,
          },
        },
      ],
    });

    notify('카카오톡 공유 창을 열었습니다.');
  };

  const handleDownloadImage = async () => {
    if (!hasValidInviteUrl) {
      notify('공유 링크가 준비되면 이미지 저장을 사용할 수 있어요.');
      return;
    }

    if (!captureRef.current) {
      notify('저장할 미리보기 영역을 찾지 못했습니다.');
      return;
    }

    setDownloading(true);
    try {
      const canvas = await html2canvas(captureRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#FFFFFF',
      });

      const link = document.createElement('a');
      link.download = `invitation-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      notify('이미지를 저장했습니다.');
    } catch {
      notify('이미지 저장 중 문제가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyLink = async () => {
    if (!hasValidInviteUrl) {
      notify('공유 링크가 준비되면 다시 시도해주세요.');
      return;
    }

    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      notify('링크를 복사했습니다.');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = inviteUrl;
      document.body.append(textArea);
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
      setCopied(true);
      notify('링크를 복사했습니다.');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <button
          type="button"
          onClick={handleKakaoShare}
          disabled={!hasValidInviteUrl}
          className="flex flex-col items-center gap-2 rounded-xl bg-[#FEE500] px-4 py-3 text-sm font-medium text-[#3C1E1E] shadow-sm transition hover:brightness-95 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="text-xl">💬</span>
          <span>카카오톡</span>
        </button>

        <button
          type="button"
          onClick={handleDownloadImage}
          disabled={downloading || !hasValidInviteUrl}
          className="flex flex-col items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="text-xl">{downloading ? '⏳' : '📷'}</span>
          <span>{downloading ? '저장 중...' : '이미지 저장'}</span>
        </button>

        <button
          type="button"
          onClick={() => setShowQR(prev => !prev)}
          disabled={!hasValidInviteUrl}
          className={`flex flex-col items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-sm transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${showQR ? 'bg-indigo-600' : 'bg-indigo-500 hover:bg-indigo-600'}`}
        >
          <span className="text-xl">📱</span>
          <span>QR코드</span>
        </button>

        <button
          type="button"
          onClick={handleCopyLink}
          disabled={!hasValidInviteUrl}
          className="flex flex-col items-center gap-2 rounded-xl bg-slate-700 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="text-xl">{copied ? '✅' : '🔗'}</span>
          <span>{copied ? '복사됨!' : '링크 복사'}</span>
        </button>
      </div>

      {showQR && hasValidInviteUrl && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white p-6 shadow-inner">
          <QRCodeSVG value={inviteUrl} size={180} level="H" includeMargin />
          <p className="text-xs text-slate-500">QR코드를 스캔하면 초대장으로 이동합니다.</p>
        </div>
      )}
    </div>
  );
}
