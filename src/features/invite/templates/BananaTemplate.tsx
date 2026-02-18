import { CalendarIcon, MapPinIcon, MessageSquareIcon, SparklesIcon, UsersIcon } from 'lucide-react';
import { type FormEvent, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { InviteMobilePreview } from '@/features/invite/components/InviteMobilePreview';
import KakaoMap from '@/features/invite/components/KakaoMap';
import { getTemplateById } from '@/features/invite/data/templates';
import { formatDateWithDay, formatTime } from '@/features/invite/utils/formatter';

import type { InviteTemplateProps } from './types';

export function BananaTemplate({
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
    <div className="min-h-screen bg-yellow-50 py-8 font-sans text-yellow-950">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <span className="text-4xl">🍌</span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-yellow-600 sm:text-4xl">
            {detail.invite.title}
          </h1>
          <span className="text-4xl">🎉</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
          <div className="overflow-hidden rounded-3xl border-4 border-yellow-300 bg-white p-4 shadow-xl">
            <InviteMobilePreview template={template} invite={previewData} />
          </div>

          <div className="space-y-6">
            <Card className="border-2 border-yellow-200 bg-white/80 shadow-lg backdrop-blur-sm">
              <CardContent className="space-y-6 p-6">
                <div className="rounded-2xl bg-yellow-100 p-6 text-center">
                  <p className="whitespace-pre-wrap text-lg leading-relaxed text-yellow-900">
                    {detail.invite.greeting}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col items-center gap-2 rounded-xl bg-orange-50 p-4 text-orange-800">
                    <CalendarIcon className="size-6 text-orange-500" />
                    <span className="font-bold">{formatDateWithDay(detail.invite.eventDate)}</span>
                    <span>{formatTime(detail.invite.eventTime)}</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 rounded-xl bg-orange-50 p-4 text-orange-800">
                    <MapPinIcon className="size-6 text-orange-500" />
                    <span className="font-bold">{detail.invite.venueName}</span>
                    <span className="text-xs">{detail.invite.venueAddress}</span>
                  </div>
                </div>

                <div className="overflow-hidden rounded-xl border-2 border-yellow-200">
                  <KakaoMap address={detail.invite.venueAddress} placeName={detail.invite.venueName} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-yellow-200 bg-white/80 shadow-lg">
              <CardHeader className="bg-yellow-100/50 pb-4 pt-6">
                <CardTitle className="flex items-center justify-center gap-2 text-xl text-yellow-800">
                  <UsersIcon className="size-6" />
                  참석 여부 알려주세요!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="flex justify-center gap-8 text-center">
                  <div>
                    <div className="text-2xl font-black text-yellow-500">{detail.rsvpSummary.attendingCount}</div>
                    <div className="text-xs font-bold text-yellow-700">참석해요</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-stone-400">{detail.rsvpSummary.declineCount}</div>
                    <div className="text-xs font-bold text-stone-500">마음만..</div>
                  </div>
                </div>

                <form className="space-y-4" onSubmit={handleSubmitRsvp}>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input
                      className="border-yellow-200 bg-yellow-50 focus-visible:ring-yellow-400"
                      value={rsvpForm.guestName}
                      placeholder="이름 (누구신가요?)"
                      onChange={event => setRsvpForm(prev => ({ ...prev, guestName: event.target.value }))}
                    />
                    <Input
                      className="border-yellow-200 bg-yellow-50 focus-visible:ring-yellow-400"
                      value={rsvpForm.guestPhone}
                      placeholder="연락처 (선택)"
                      onChange={event => setRsvpForm(prev => ({ ...prev, guestPhone: event.target.value }))}
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input
                      type="number"
                      min={1}
                      max={20}
                      className="border-yellow-200 bg-yellow-50 focus-visible:ring-yellow-400"
                      value={rsvpForm.guestCount}
                      onChange={event => setRsvpForm(prev => ({ ...prev, guestCount: Number(event.target.value) }))}
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        className={`flex-1 ${rsvpForm.attending ? 'bg-yellow-400 text-yellow-900 hover:bg-yellow-500' : 'border-2 border-stone-100 bg-white text-stone-500 hover:bg-stone-50'}`}
                        onClick={() => setRsvpForm(prev => ({ ...prev, attending: true }))}
                      >
                        🙆‍♂️ 갈게요!
                      </Button>
                      <Button
                        type="button"
                        className={`flex-1 ${!rsvpForm.attending ? 'bg-stone-500 text-white hover:bg-stone-600' : 'border-2 border-stone-100 bg-white text-stone-500 hover:bg-stone-50'}`}
                        onClick={() => setRsvpForm(prev => ({ ...prev, attending: false }))}
                      >
                        🙅‍♂️ 힘들어요
                      </Button>
                    </div>
                  </div>

                  <Textarea
                    className="min-h-[80px] border-yellow-200 bg-yellow-50 focus-visible:ring-yellow-400"
                    value={rsvpForm.message}
                    placeholder="신랑신부에게 한마디! (선택)"
                    onChange={event => setRsvpForm(prev => ({ ...prev, message: event.target.value }))}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-yellow-500 text-lg font-bold text-white hover:bg-yellow-600"
                    disabled={submittingRsvp}
                  >
                    {submittingRsvp ? '전송 중... 🚀' : '답변 보내기 💌'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-2 border-yellow-200 bg-white/80 shadow-lg">
              <CardHeader className="bg-yellow-100/50 pb-4 pt-6">
                <CardTitle className="flex items-center justify-center gap-2 text-xl text-yellow-800">
                  <MessageSquareIcon className="size-6" />
                  축하 메시지
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <form className="space-y-3" onSubmit={handleSubmitGuestbook}>
                  <div className="flex gap-2">
                    <Input
                      className="w-1/3 border-yellow-200 bg-yellow-50 focus-visible:ring-yellow-400"
                      value={guestbookForm.authorName}
                      placeholder="이름"
                      onChange={event =>
                        setGuestbookForm(prev => ({
                          ...prev,
                          authorName: event.target.value,
                        }))}
                    />
                    <Input
                      className="flex-1 border-yellow-200 bg-yellow-50 focus-visible:ring-yellow-400"
                      value={guestbookForm.content}
                      placeholder="축하해요! 🎉"
                      onChange={event =>
                        setGuestbookForm(prev => ({
                          ...prev,
                          content: event.target.value,
                        }))}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-orange-400 font-bold text-white hover:bg-orange-500"
                    disabled={submittingGuestbook}
                  >
                    {submittingGuestbook ? '등록 중...' : '남기기 ✨'}
                  </Button>
                </form>

                <div className="space-y-3">
                  {detail.guestbook.length === 0 && (
                    <div className="py-8 text-center text-yellow-600/60">
                      <SparklesIcon className="mx-auto mb-2 size-8 opacity-50" />
                      <p>첫 번째 축하 메시지를 남겨주세요!</p>
                    </div>
                  )}

                  {detail.guestbook.map(entry => (
                    <div key={entry.id} className="relative rounded-xl border-2 border-yellow-100 bg-yellow-50/50 p-4 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
                      <div className="mb-2 flex items-center justify-between border-b border-yellow-100 pb-2">
                        <strong className="text-yellow-900">{entry.authorName}</strong>
                        <span className="text-xs text-yellow-600/60">
                          {new Date(entry.createdAt).toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap text-yellow-800">{entry.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
