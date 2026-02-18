import { CalendarIcon, MapPinIcon, MessageSquareIcon, UsersIcon } from 'lucide-react';
import { type FormEvent, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { InviteMobilePreview } from '@/features/invite/components/InviteMobilePreview';
import KakaoMap from '@/features/invite/components/KakaoMap';
import { getTemplateById } from '@/features/invite/data/templates';
import { formatDateWithDay, formatTime } from '@/features/invite/utils/formatter';

import type { InviteTemplateProps } from './types';

export function DefaultTemplate({
  detail,
  previewData,
  onSubmitRsvp,
  onSubmitGuestbook,
  submittingRsvp,
  submittingGuestbook,
}: InviteTemplateProps) {
  const [rsvpForm, setRsvpForm] = useState({
    guestName: '',
    guestPhone: '',
    guestCount: 1,
    attending: true,
    message: '',
  });

  const [guestbookForm, setGuestbookForm] = useState({
    authorName: '',
    content: '',
  });

  const template = getTemplateById(detail.invite.templateId) || getTemplateById('default')!;

  const handleSubmitRsvp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmitRsvp(rsvpForm);
    setRsvpForm({
      guestName: '',
      guestPhone: '',
      guestCount: 1,
      attending: true,
      message: '',
    });
  };

  const handleSubmitGuestbook = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmitGuestbook(guestbookForm);
    setGuestbookForm({
      authorName: '',
      content: '',
    });
  };

  return (
    <div className="container mx-auto max-w-5xl py-8">
      <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="rounded-2xl border bg-slate-100 p-4 shadow-inner">
          <InviteMobilePreview template={template} invite={previewData} />
        </div>

        <div className="space-y-6">
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
