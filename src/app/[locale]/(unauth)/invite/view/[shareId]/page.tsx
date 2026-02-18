'use client';

import { CalendarIcon, Loader2Icon, MapPinIcon, MessageSquareIcon, UsersIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { type FormEvent, useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { InviteMobilePreview } from '@/features/invite/components/InviteMobilePreview';
import KakaoMap from '@/features/invite/components/KakaoMap';
import { getTemplateById } from '@/features/invite/data/templates';
import type {
  InviteFormData,
  InviteGuestbookRecord,
  InviteRecord,
  InviteRsvpRecord,
} from '@/features/invite/types';
import { formatDateWithDay, formatTime } from '@/features/invite/utils/formatter';
import { getI18nPath } from '@/utils/Helpers';

type InviteDetailResponse = {
  invite: InviteRecord & {
    createdAt: string;
    updatedAt: string;
  };
  rsvps: Array<InviteRsvpRecord & { createdAt: string }>;
  guestbook: Array<InviteGuestbookRecord & { createdAt: string }>;
  rsvpSummary: {
    totalResponses: number;
    attendingCount: number;
    declineCount: number;
  };
};

const defaultRsvpForm = {
  guestName: '',
  guestPhone: '',
  guestCount: 1,
  attending: true,
  message: '',
};

const defaultGuestbookForm = {
  authorName: '',
  content: '',
};

export default function InviteViewPage() {
  const { locale, shareId } = useParams<{ locale: string; shareId: string }>();

  const [detail, setDetail] = useState<InviteDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const [rsvpForm, setRsvpForm] = useState(defaultRsvpForm);
  const [guestbookForm, setGuestbookForm] = useState(defaultGuestbookForm);
  const [submittingRsvp, setSubmittingRsvp] = useState(false);
  const [submittingGuestbook, setSubmittingGuestbook] = useState(false);

  useEffect(() => {
    if (!shareId) {
      return;
    }

    let mounted = true;

    const fetchDetail = async () => {
      setLoading(true);
      setMessage('');

      const endpoint = getI18nPath(`/invite/api/share/${shareId}`, locale);
      const response = await fetch(endpoint);
      const data = await response.json().catch(() => null);

      if (!mounted) {
        return;
      }

      if (!response.ok || !data?.invite) {
        setDetail(null);
        setMessage('초대장을 찾을 수 없거나 비공개 상태입니다.');
        setLoading(false);
        return;
      }

      setDetail(data as InviteDetailResponse);
      setLoading(false);
    };

    void fetchDetail();

    return () => {
      mounted = false;
    };
  }, [locale, shareId]);

  const template = useMemo(() => {
    return detail ? getTemplateById(detail.invite.templateId) : null;
  }, [detail]);

  const previewData: InviteFormData | null = detail
    ? {
        templateId: detail.invite.templateId,
        type: detail.invite.type,
        title: detail.invite.title,
        greeting: detail.invite.greeting,
        eventDate: detail.invite.eventDate,
        eventTime: detail.invite.eventTime,
        venueName: detail.invite.venueName,
        venueAddress: detail.invite.venueAddress,
        hostName: detail.invite.hostName,
        extraData: detail.invite.extraData,
      }
    : null;

  const refreshDetail = async () => {
    if (!shareId) {
      return;
    }

    const endpoint = getI18nPath(`/invite/api/share/${shareId}`, locale);
    const response = await fetch(endpoint);
    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.invite) {
      return;
    }

    setDetail(data as InviteDetailResponse);
  };

  const handleSubmitRsvp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!detail) {
      return;
    }

    setSubmittingRsvp(true);
    setMessage('');

    const endpoint = getI18nPath(`/invite/api/invites/${detail.invite.id}/rsvps`, locale);
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...rsvpForm,
        guestCount: Number(rsvpForm.guestCount),
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setMessage(data?.message || '참석 응답 저장에 실패했습니다.');
      setSubmittingRsvp(false);
      return;
    }

    setRsvpForm(defaultRsvpForm);
    await refreshDetail();
    setMessage('참석 의사를 전달했어요. 감사합니다!');
    setSubmittingRsvp(false);
  };

  const handleSubmitGuestbook = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!detail) {
      return;
    }

    setSubmittingGuestbook(true);
    setMessage('');

    const endpoint = getI18nPath(`/invite/api/invites/${detail.invite.id}/guestbook`, locale);
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(guestbookForm),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setMessage(data?.message || '방명록 저장에 실패했습니다.');
      setSubmittingGuestbook(false);
      return;
    }

    setGuestbookForm(defaultGuestbookForm);
    await refreshDetail();
    setMessage('축하 메시지가 등록되었어요.');
    setSubmittingGuestbook(false);
  };

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center gap-2 text-sm text-muted-foreground">
        <Loader2Icon className="size-4 animate-spin" />
        초대장을 불러오는 중입니다...
      </div>
    );
  }

  if (!detail || !template || !previewData) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl font-bold">초대장을 찾을 수 없습니다</h1>
        <p className="text-sm text-muted-foreground">
          {message || '링크가 만료되었거나 잘못된 주소일 수 있습니다.'}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl py-8">
      <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="rounded-2xl border bg-slate-100 p-4 shadow-inner">
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
              <CardTitle className="text-xl">{detail.invite.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">{detail.invite.greeting}</p>
              <Separator />
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarIcon className="size-4" />
                  {formatDateWithDay(detail.invite.eventDate)}
                  {' '}
                  {formatTime(detail.invite.eventTime)}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPinIcon className="size-4" />
                  {detail.invite.venueName}
                </div>
              </div>

              <KakaoMap address={detail.invite.venueAddress} placeName={detail.invite.venueName} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UsersIcon className="size-5" />
                참석 의사 전달
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 rounded-md border bg-muted/40 p-3 text-sm sm:grid-cols-3">
                <p>
                  응답
                  {' '}
                  <strong>{detail.rsvpSummary.totalResponses}</strong>
                  건
                </p>
                <p>
                  참석 인원
                  {' '}
                  <strong>{detail.rsvpSummary.attendingCount}</strong>
                  명
                </p>
                <p>
                  불참
                  {' '}
                  <strong>{detail.rsvpSummary.declineCount}</strong>
                  건
                </p>
              </div>

              <form className="space-y-3" onSubmit={handleSubmitRsvp}>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    value={rsvpForm.guestName}
                    placeholder="이름"
                    onChange={event => setRsvpForm(prev => ({ ...prev, guestName: event.target.value }))}
                  />
                  <Input
                    value={rsvpForm.guestPhone}
                    placeholder="연락처(선택)"
                    onChange={event => setRsvpForm(prev => ({ ...prev, guestPhone: event.target.value }))}
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    value={rsvpForm.guestCount}
                    onChange={event => setRsvpForm(prev => ({ ...prev, guestCount: Number(event.target.value) }))}
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant={rsvpForm.attending ? 'default' : 'outline'}
                      onClick={() => setRsvpForm(prev => ({ ...prev, attending: true }))}
                    >
                      참석
                    </Button>
                    <Button
                      type="button"
                      variant={!rsvpForm.attending ? 'default' : 'outline'}
                      onClick={() => setRsvpForm(prev => ({ ...prev, attending: false }))}
                    >
                      불참
                    </Button>
                  </div>
                </div>

                <Textarea
                  value={rsvpForm.message}
                  placeholder="전달 메시지 (선택)"
                  onChange={event => setRsvpForm(prev => ({ ...prev, message: event.target.value }))}
                />

                <Button type="submit" disabled={submittingRsvp}>
                  {submittingRsvp ? '저장 중...' : '참석 의사 전달'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquareIcon className="size-5" />
                방명록
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form className="space-y-3" onSubmit={handleSubmitGuestbook}>
                <Input
                  value={guestbookForm.authorName}
                  placeholder="이름"
                  onChange={event =>
                    setGuestbookForm(prev => ({
                      ...prev,
                      authorName: event.target.value,
                    }))}
                />
                <Textarea
                  value={guestbookForm.content}
                  placeholder="축하 메시지를 남겨주세요."
                  onChange={event =>
                    setGuestbookForm(prev => ({
                      ...prev,
                      content: event.target.value,
                    }))}
                />
                <Button type="submit" disabled={submittingGuestbook}>
                  {submittingGuestbook ? '등록 중...' : '메시지 남기기'}
                </Button>
              </form>

              <Separator />

              <div className="space-y-3">
                {detail.guestbook.length === 0 && (
                  <p className="text-sm text-muted-foreground">아직 등록된 방명록이 없습니다.</p>
                )}

                {detail.guestbook.map(entry => (
                  <div key={entry.id} className="rounded-lg border bg-muted/40 p-3">
                    <div className="flex items-center justify-between">
                      <strong className="text-sm">{entry.authorName}</strong>
                      <span className="text-xs text-muted-foreground">
                        {new Date(entry.createdAt).toLocaleString('ko-KR')}
                      </span>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{entry.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
