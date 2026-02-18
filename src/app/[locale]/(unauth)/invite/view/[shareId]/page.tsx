'use client';

import { Loader2Icon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { getTemplateComponent } from '@/features/invite/templates/registry';
import type { InviteDetailData } from '@/features/invite/templates/types';
import type { InviteFormData } from '@/features/invite/types';
import { getI18nPath } from '@/utils/Helpers';

export default function InviteViewPage() {
  const { locale, shareId } = useParams<{ locale: string; shareId: string }>();

  const [detail, setDetail] = useState<InviteDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
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

      setDetail(data as InviteDetailData);
      setLoading(false);
    };

    void fetchDetail();

    return () => {
      mounted = false;
    };
  }, [locale, shareId]);

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

    setDetail(data as InviteDetailData);
  };

  const handleSubmitRsvp = async (formData: any) => {
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
      body: JSON.stringify(formData),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setMessage(data?.message || '참석 응답 저장에 실패했습니다.');
      setSubmittingRsvp(false);
      return;
    }

    await refreshDetail();
    setMessage('참석 의사를 전달했어요. 감사합니다!');
    setSubmittingRsvp(false);
  };

  const handleSubmitGuestbook = async (formData: any) => {
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
      body: JSON.stringify(formData),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setMessage(data?.message || '방명록 저장에 실패했습니다.');
      setSubmittingGuestbook(false);
      return;
    }

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

  const TemplateComponent = detail ? getTemplateComponent(detail.invite.templateId) : null;

  if (!detail || !TemplateComponent) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl font-bold">초대장을 찾을 수 없습니다</h1>
        <p className="text-sm text-muted-foreground">
          {message || '링크가 만료되었거나 잘못된 주소일 수 있습니다.'}
        </p>
      </div>
    );
  }

  const previewData: InviteFormData = {
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
  };

  return (
    <TemplateComponent
      locale={locale}
      detail={detail}
      previewData={previewData}
      onSubmitRsvp={handleSubmitRsvp}
      onSubmitGuestbook={handleSubmitGuestbook}
      submittingRsvp={submittingRsvp}
      submittingGuestbook={submittingGuestbook}
    />
  );
}
