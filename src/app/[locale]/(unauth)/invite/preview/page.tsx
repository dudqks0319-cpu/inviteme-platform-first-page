'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getTemplateById } from '@/features/invite/data/templates';
import type { Template } from '@/features/invite/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    MapPinIcon,
    ClockIcon,
    HeartIcon,
    BabyIcon,
    GiftIcon,
    ShareIcon,
    CopyIcon,
    CheckIcon,
    ArrowLeftIcon,
    DownloadIcon,
    ImageIcon
} from 'lucide-react';
import html2canvas from 'html2canvas';

interface InviteData {
    id: string;
    templateId: string;
    title: string;
    greeting: string;
    eventDate: string;
    eventTime: string;
    venueName: string;
    venueAddress: string;
    groomName?: string;
    brideName?: string;
    babyName?: string;
    name?: string;
    age?: string;
    createdAt: string;
}

export default function InvitePreviewPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const inviteId = searchParams.get('id');

    const [inviteData, setInviteData] = useState<InviteData | null>(null);
    const [template, setTemplate] = useState<Template | null>(null);
    const [copied, setCopied] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const previewRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (inviteId) {
            const savedData = localStorage.getItem(`invite-${inviteId}`);
            if (savedData) {
                const parsed = JSON.parse(savedData) as InviteData;
                setInviteData(parsed);
                const tmpl = getTemplateById(parsed.templateId);
                setTemplate(tmpl || null);
            }
        }
    }, [inviteId]);

    if (!inviteId || !inviteData || !template) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <h2 className="text-2xl font-bold">초대장을 찾을 수 없습니다</h2>
                <p className="text-muted-foreground">초대장이 만료되었거나 존재하지 않습니다.</p>
                <Button onClick={() => router.push('/en/invite/select')}>
                    새 초대장 만들기
                </Button>
            </div>
        );
    }

    const shareUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/en/invite/view?id=${inviteId}`
        : '';

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('복사 실패:', err);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: inviteData.title,
                    text: inviteData.greeting.substring(0, 100) + '...',
                    url: shareUrl,
                });
            } catch (err) {
                console.log('공유 취소 또는 실패');
            }
        } else {
            handleCopyLink();
        }
    };

    const handleDownloadImage = async () => {
        if (!previewRef.current) return;

        setDownloading(true);
        try {
            const canvas = await html2canvas(previewRef.current, {
                scale: 2,
                backgroundColor: null,
                useCORS: true,
            });

            const link = document.createElement('a');
            link.download = `invite-${inviteData.title || 'card'}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (err) {
            console.error('이미지 저장 실패:', err);
            alert('이미지 저장에 실패했습니다.');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="container mx-auto py-8 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                    돌아가기
                </Button>
                <h1 className="text-2xl font-bold">초대장 미리보기</h1>
                <div className="w-24" /> {/* Spacer */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="flex justify-center">
                    <div ref={previewRef} className="bg-slate-100 rounded-3xl p-4 border shadow-inner">
                        <div className="w-[320px] h-[580px] bg-white rounded-[32px] shadow-xl overflow-hidden border-4 border-slate-800 relative flex flex-col">

                            {/* Notch */}
                            <div className="h-6 bg-slate-800 w-full absolute top-0 z-20 flex justify-center">
                                <div className="w-1/3 h-5 bg-black rounded-b-lg"></div>
                            </div>

                            {/* Content */}
                            <div
                                className="flex-1 overflow-y-auto no-scrollbar pt-8"
                                style={{
                                    backgroundColor: template.backgroundColor,
                                    fontFamily: template.fontFamily
                                }}
                            >
                                {/* Main Section */}
                                <div
                                    className="min-h-[320px] flex flex-col items-center justify-center p-6 text-center"
                                    style={{ color: template.primaryColor }}
                                >
                                    <p className="text-xs tracking-widest uppercase mb-3 opacity-80">INVITATION</p>

                                    {template.type === 'wedding' && (
                                        <div className="space-y-2 mb-6">
                                            <HeartIcon className="w-8 h-8 mx-auto opacity-50 mb-4" />
                                            <h2 className="text-2xl font-bold">{inviteData.groomName || '신랑'}</h2>
                                            <div className="text-lg">&</div>
                                            <h2 className="text-2xl font-bold">{inviteData.brideName || '신부'}</h2>
                                        </div>
                                    )}

                                    {template.type === 'doljanchi' && (
                                        <div className="mb-6">
                                            <BabyIcon className="w-10 h-10 mx-auto mb-3 opacity-50" />
                                            <h2 className="text-2xl font-bold mb-1">{inviteData.babyName || '아기'}</h2>
                                            <p className="text-base">첫 번째 생일잔치</p>
                                        </div>
                                    )}

                                    {(template.type !== 'wedding' && template.type !== 'doljanchi') && (
                                        <div className="mb-6">
                                            <GiftIcon className="w-10 h-10 mx-auto mb-3 opacity-50" />
                                            <h2 className="text-2xl font-bold">{inviteData.name || '주인공'}</h2>
                                        </div>
                                    )}

                                    <div className="mt-4 space-y-1">
                                        <p className="text-base font-medium">{inviteData.eventDate}</p>
                                        <p className="text-sm">{inviteData.eventTime}</p>
                                        <p className="text-xs mt-3 opacity-75">{inviteData.venueName}</p>
                                    </div>
                                </div>

                                {/* Greeting */}
                                <div className="bg-white/80 backdrop-blur-sm p-6 m-3 rounded-xl shadow-sm text-center">
                                    <h3 className="font-bold mb-3 opacity-50 text-xs">인사말</h3>
                                    <p className="whitespace-pre-wrap leading-relaxed text-xs text-gray-700">
                                        {inviteData.greeting}
                                    </p>
                                </div>

                                {/* Venue */}
                                <div className="bg-white p-4 m-3 rounded-xl shadow-sm space-y-3">
                                    <div className="flex items-start gap-2">
                                        <MapPinIcon className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-sm">{inviteData.venueName}</h4>
                                            <p className="text-xs text-gray-500 mt-0.5">{inviteData.venueAddress}</p>
                                        </div>
                                    </div>
                                    <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">
                                        지도 영역
                                    </div>
                                </div>

                                <div className="h-16" /> {/* Bottom spacer */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Actions & Info */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShareIcon className="w-5 h-5" />
                                초대장 공유하기
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                아래 링크를 복사하여 카카오톡, 문자 등으로 공유하세요.
                            </p>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={shareUrl}
                                    readOnly
                                    className="flex-1 px-3 py-2 text-sm border rounded-md bg-gray-50 truncate"
                                />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleCopyLink}
                                >
                                    {copied ? <CheckIcon className="w-4 h-4 text-green-500" /> : <CopyIcon className="w-4 h-4" />}
                                </Button>
                            </div>

                            <div className="flex gap-2">
                                <Button className="flex-1" onClick={handleShare}>
                                    <ShareIcon className="w-4 h-4 mr-2" />
                                    공유하기
                                </Button>
                                <Button
                                    className="flex-1"
                                    variant="secondary"
                                    onClick={handleDownloadImage}
                                    disabled={downloading}
                                >
                                    <ImageIcon className="w-4 h-4 mr-2" />
                                    {downloading ? '저장 중...' : '이미지 저장'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Separator />

                    <Card>
                        <CardHeader>
                            <CardTitle>초대장 정보</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">템플릿</span>
                                <span className="font-medium">{template.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">생성일</span>
                                <span className="font-medium">{new Date(inviteData.createdAt).toLocaleDateString('ko-KR')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">ID</span>
                                <span className="font-mono text-xs text-muted-foreground">{inviteId.substring(0, 8)}...</span>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-2">
                        <Button variant="outline" className="flex-1" onClick={() => router.push('/en/invite/select')}>
                            새 초대장 만들기
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => router.push(`/en/invite/create?template=${template.id}`)}
                        >
                            수정하기
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
