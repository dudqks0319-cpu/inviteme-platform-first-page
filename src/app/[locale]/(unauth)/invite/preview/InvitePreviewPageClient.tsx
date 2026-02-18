'use client';

import { ArrowLeftIcon, Loader2Icon } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { InviteMobilePreview } from '@/features/invite/components/InviteMobilePreview';
import ShareButtons from '@/features/invite/components/ShareButtons';
import { getTemplateById } from '@/features/invite/data/templates';
import type { InviteFormData, InviteRecord } from '@/features/invite/types';
import { getI18nPath } from '@/utils/Helpers';

type InviteApiModel = InviteRecord & {
  createdAt: string;
  updatedAt: string;
};

export default function InvitePreviewPageClient() {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const inviteId = searchParams.get('id');
  const [invite, setInvite] = useState<InviteApiModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [paying, setPaying] = useState(false);

  const captureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!inviteId) {
      return;
    }

    let mounted = true;

    const fetchInvite = async () => {
      setLoading(true);
      setMessage('');

      const endpoint = getI18nPath(`/invite/api/invites/${inviteId}`, locale);
      const response = await fetch(endpoint);
      const data = await response.json().catch(() => null);

      if (!mounted) {
        return;
      }

      if (!response.ok || !data?.invite) {
        setMessage('초대장을 찾을 수 없습니다.');
        setLoading(false);
        return;
      }

      setInvite(data.invite as InviteApiModel);
      setLoading(false);
    };

    void fetchInvite();

    return () => {
      mounted = false;
    };
  }, [inviteId, locale]);

  const template = invite ? getTemplateById(invite.templateId) : null;

  const previewData: InviteFormData | null = invite
    ? {
        templateId: invite.templateId,
        type: invite.type,
        title: invite.title,
        greeting: invite.greeting,
        eventDate: invite.eventDate,
        eventTime: invite.eventTime,
        venueName: invite.venueName,
        venueAddress: invite.venueAddress,
        hostName: invite.hostName,
        extraData: invite.extraData,
      }
    : null;

  const shareUrl = (typeof window !== 'undefined' && invite)
    ? `${window.location.origin}${getI18nPath(`/invite/view/${invite.shareId}`, locale)}`
    : '';

  const handleCheckout = async () => {
    if (!invite) {
      return;
    }

    setPaying(true);
    setMessage('');

    const endpoint = getI18nPath(`/invite/api/invites/${invite.id}/checkout`, locale);
    const response = await fetch(endpoint, {
      method: 'POST',
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setMessage(data?.message || '결제 처리에 실패했습니다.');
      setPaying(false);
      return;
    }

    setMessage('프리미엄 템플릿 결제가 완료되었습니다.');
    if (data?.invite) {
      setInvite(data.invite as InviteApiModel);
    }

    setPaying(false);
  };

  if (!inviteId) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-2xl font-bold">초대장 ID가 없습니다</h2>
        <Button onClick={() => router.push(getI18nPath('/invite/select', locale))}>
          템플릿 선택하러 가기
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center gap-2 text-sm text-muted-foreground">
        <Loader2Icon className="size-4 animate-spin" />
        초대장을 불러오는 중입니다...
      </div>
    );
  }

  if (!invite || !template || !previewData) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-2xl font-bold">초대장을 찾을 수 없습니다</h2>
        {message && <p className="text-sm text-rose-600">{message}</p>}
        <Button onClick={() => router.push(getI18nPath('/invite/select', locale))}>
          새 초대장 만들기
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeftIcon className="mr-2 size-4" />
          돌아가기
        </Button>
        <h1 className="text-2xl font-bold">초대장 미리보기</h1>
        <div className="w-20" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <div ref={captureRef} className="rounded-2xl border bg-slate-100 p-4 shadow-inner">
          <InviteMobilePreview template={template} invite={previewData} />
        </div>

        <div className="space-y-6">
          {message && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
              {message}
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>공유하기</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border bg-muted px-3 py-2 text-xs text-muted-foreground">
                {shareUrl || '공유 링크를 생성 중입니다...'}
              </div>

              <ShareButtons
                inviteUrl={shareUrl}
                title={invite.title}
                description={invite.greeting}
                captureRef={captureRef}
                onMessage={setMessage}
              />
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
                <span className="text-muted-foreground">공개 링크</span>
                <span className="font-mono text-xs">
                  /
                  {invite.shareId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">생성일</span>
                <span>{new Date(invite.createdAt).toLocaleString('ko-KR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">결제 상태</span>
                <span className={invite.isPaid ? 'text-emerald-600' : 'text-amber-600'}>
                  {invite.isPaid ? '결제 완료' : '미결제'}
                </span>
              </div>
            </CardContent>
          </Card>

          {!invite.isPaid && template.isPremium && (
            <Card>
              <CardHeader>
                <CardTitle>프리미엄 템플릿 활성화</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  프리미엄 템플릿은 결제 후 워터마크 제거와 추가 효과를 활성화할 수 있습니다.
                </p>
                <Button onClick={handleCheckout} disabled={paying}>
                  {paying ? '처리 중...' : '데모 결제 완료 처리'}
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(getI18nPath('/invite/select', locale))}
            >
              새 초대장 만들기
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                router.push(
                  getI18nPath(`/invite/create?template=${invite.templateId}&id=${invite.id}`, locale),
                )}
            >
              수정하기
            </Button>
            <Button
              onClick={() =>
                router.push(getI18nPath(`/invite/view/${invite.shareId}`, locale))}
            >
              공개 페이지 보기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
