'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ClockIcon, HeartIcon, Loader2Icon, MapPinIcon, UserIcon } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { InviteMobilePreview } from '@/features/invite/components/InviteMobilePreview';
import { getTemplateById } from '@/features/invite/data/templates';
import type { InviteFormData } from '@/features/invite/types';
import { type InviteFormInput, inviteFormSchema } from '@/features/invite/utils/invite-form-schema';
import { getI18nPath } from '@/utils/Helpers';

type InviteApiModel = InviteFormData & {
  id: string;
  shareId: string;
  isPremium: boolean;
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
};

const createDefaultValues = (templateId: string): InviteFormInput => {
  const template = getTemplateById(templateId);

  return {
    templateId,
    type: template?.type ?? 'general',
    title: template ? `${template.name} 초대장` : '초대장',
    greeting: '소중한 분들을 모십니다. 부디 오셔서 자리를 빛내주세요.',
    eventDate: format(new Date(), 'yyyy-MM-dd'),
    eventTime: '12:00',
    venueName: '',
    venueAddress: '',
    hostName: '',
    extraData: {},
  };
};

const mapInviteToFormValues = (invite: InviteApiModel): InviteFormInput => {
  return {
    templateId: invite.templateId,
    type: invite.type,
    title: invite.title,
    greeting: invite.greeting,
    eventDate: invite.eventDate,
    eventTime: invite.eventTime,
    venueName: invite.venueName,
    venueAddress: invite.venueAddress,
    hostName: invite.hostName ?? '',
    extraData: invite.extraData ?? {},
  };
};

export default function InviteCreatePageClient() {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const inviteId = searchParams.get('id');
  const templateIdFromQuery = searchParams.get('template') ?? '';

  const [selectedTemplateId, setSelectedTemplateId] = useState(templateIdFromQuery);
  const [loadingInvite, setLoadingInvite] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);

  const template = useMemo(() => {
    return selectedTemplateId ? getTemplateById(selectedTemplateId) : null;
  }, [selectedTemplateId]);

  const form = useForm<InviteFormInput>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: createDefaultValues(templateIdFromQuery),
  });

  const draftStorageKey = `invite-draft:${selectedTemplateId || templateIdFromQuery || 'unknown'}`;

  useEffect(() => {
    if (!selectedTemplateId) {
      return;
    }

    if (inviteId) {
      return;
    }

    const defaults = createDefaultValues(selectedTemplateId);
    form.reset(defaults);
  }, [form, inviteId, selectedTemplateId]);

  useEffect(() => {
    if (inviteId || !selectedTemplateId || typeof window === 'undefined') {
      return;
    }

    const rawDraft = window.localStorage.getItem(draftStorageKey);
    if (!rawDraft) {
      setDraftLoaded(false);
      return;
    }

    let parsedDraft: unknown;
    try {
      parsedDraft = JSON.parse(rawDraft);
    } catch {
      window.localStorage.removeItem(draftStorageKey);
      setDraftLoaded(false);
      return;
    }

    const parsed = inviteFormSchema.safeParse(parsedDraft);
    if (!parsed.success) {
      window.localStorage.removeItem(draftStorageKey);
      setDraftLoaded(false);
      return;
    }

    form.reset(parsed.data);
    setDraftLoaded(true);
    setSubmitMessage('임시 저장된 작성 내용이 복원되었습니다.');
  }, [draftStorageKey, form, inviteId, selectedTemplateId]);

  useEffect(() => {
    if (inviteId || !selectedTemplateId || typeof window === 'undefined') {
      return;
    }

    const subscription = form.watch((values) => {
      const parsed = inviteFormSchema.safeParse(values);
      if (!parsed.success) {
        return;
      }

      window.localStorage.setItem(draftStorageKey, JSON.stringify(parsed.data));
    });

    return () => subscription.unsubscribe();
  }, [draftStorageKey, form, inviteId, selectedTemplateId]);

  useEffect(() => {
    if (!inviteId) {
      return;
    }

    let mounted = true;

    const fetchInvite = async () => {
      setLoadingInvite(true);
      setSubmitError('');

      const endpoint = getI18nPath(`/invite/api/invites/${inviteId}`, locale);
      const response = await fetch(endpoint);
      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.invite) {
        if (mounted) {
          setSubmitError('수정할 초대장을 불러오지 못했습니다.');
        }
        setLoadingInvite(false);
        return;
      }

      if (!mounted) {
        return;
      }

      const invite = data.invite as InviteApiModel;
      setSelectedTemplateId(invite.templateId);
      form.reset(mapInviteToFormValues(invite));
      setLoadingInvite(false);
    };

    void fetchInvite();

    return () => {
      mounted = false;
    };
  }, [form, inviteId, locale]);

  const watched = form.watch();
  const previewData: InviteFormData = {
    templateId: template?.id ?? watched.templateId,
    type: template?.type ?? watched.type,
    title: watched.title || '초대장',
    greeting: watched.greeting || '인사말을 입력해주세요.',
    eventDate: watched.eventDate || format(new Date(), 'yyyy-MM-dd'),
    eventTime: watched.eventTime || '12:00',
    venueName: watched.venueName || '장소명',
    venueAddress: watched.venueAddress || '주소를 입력해주세요',
    hostName: watched.hostName,
    extraData: watched.extraData,
  };

  const handleSubmit = async (values: InviteFormInput) => {
    setSubmitError('');
    setSubmitMessage('');
    setSubmitting(true);

    const endpoint = inviteId
      ? getI18nPath(`/invite/api/invites/${inviteId}`, locale)
      : getI18nPath('/invite/api/invites', locale);

    const response = await fetch(endpoint, {
      method: inviteId ? 'PATCH' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setSubmitError(data?.message || '초대장 저장에 실패했습니다.');
      setSubmitting(false);
      return;
    }

    if (!inviteId && typeof window !== 'undefined') {
      window.localStorage.removeItem(draftStorageKey);
    }

    const targetId = inviteId || data.id;
    if (!targetId) {
      setSubmitError('저장 결과를 확인할 수 없습니다. 다시 시도해주세요.');
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    router.push(getI18nPath(`/invite/preview?id=${targetId}`, locale));
  };

  if (!template) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
        <h2 className="text-2xl font-bold">템플릿을 찾을 수 없습니다</h2>
        <p className="text-sm text-muted-foreground">
          템플릿을 먼저 선택한 뒤 초대장을 작성해주세요.
        </p>
        <Button onClick={() => router.push(getI18nPath('/invite/select', locale))}>
          템플릿 다시 선택하기
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section className="space-y-6 rounded-2xl border bg-card p-6 shadow-sm">
          <header>
            <h1 className="text-3xl font-bold">초대장 만들기</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              선택한 템플릿:
              {' '}
              <span className="font-semibold text-primary">{template.name}</span>
            </p>
          </header>

          <Separator />

          {submitError && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {submitError}
            </div>
          )}

          {submitMessage && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {submitMessage}
            </div>
          )}

          {draftLoaded && !inviteId && (
            <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <span>이전에 작성하던 임시 저장본을 불러왔습니다.</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.localStorage.removeItem(draftStorageKey);
                  }
                  form.reset(createDefaultValues(selectedTemplateId));
                  setDraftLoaded(false);
                  setSubmitMessage('임시 저장본을 삭제하고 기본값으로 초기화했습니다.');
                }}
              >
                임시저장 삭제
              </Button>
            </div>
          )}

          {loadingInvite
            ? (
                <div className="flex items-center justify-center gap-2 rounded-lg border bg-muted p-8 text-sm text-muted-foreground">
                  <Loader2Icon className="size-4 animate-spin" />
                  초대장 데이터를 불러오는 중입니다...
                </div>
              )
            : (
                <Form {...form}>
                  <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className="space-y-4">
                      <h2 className="flex items-center gap-2 text-lg font-semibold">
                        <UserIcon className="size-5" />
                        기본 정보
                      </h2>

                      {template.type === 'wedding' && (
                        <div className="grid gap-4 sm:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="extraData.groomName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>신랑 이름</FormLabel>
                                <FormControl>
                                  <Input placeholder="김신랑" {...field} value={field.value ?? ''} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="extraData.brideName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>신부 이름</FormLabel>
                                <FormControl>
                                  <Input placeholder="이신부" {...field} value={field.value ?? ''} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}

                      {template.type === 'doljanchi' && (
                        <FormField
                          control={form.control}
                          name="extraData.babyName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>아기 이름</FormLabel>
                              <FormControl>
                                <Input placeholder="김아기" {...field} value={field.value ?? ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      {(template.type === 'birthday' || template.type === 'general') && (
                        <FormField
                          control={form.control}
                          name="hostName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>주인공 이름</FormLabel>
                              <FormControl>
                                <Input placeholder="홍길동" {...field} value={field.value ?? ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      {template.type === 'housewarming' && (
                        <FormField
                          control={form.control}
                          name="extraData.hostNames"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>주최자 이름</FormLabel>
                              <FormControl>
                                <Input placeholder="김철수, 이영희" {...field} value={field.value ?? ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      {template.type === 'hwangap' && (
                        <FormField
                          control={form.control}
                          name="extraData.celebrantName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>환갑 주인공 이름</FormLabel>
                              <FormControl>
                                <Input placeholder="김영수" {...field} value={field.value ?? ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>초대장 제목</FormLabel>
                            <FormControl>
                              <Input placeholder="결혼합니다" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h2 className="flex items-center gap-2 text-lg font-semibold">
                        <ClockIcon className="size-5" />
                        일시 및 장소
                      </h2>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="eventDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>날짜</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="eventTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>시간</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="venueName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1">
                              <MapPinIcon className="size-4" />
                              장소명
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="예: 신라호텔 영빈관" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="venueAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>상세 주소</FormLabel>
                            <FormControl>
                              <Input placeholder="서울시 중구 ..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h2 className="flex items-center gap-2 text-lg font-semibold">
                        <HeartIcon className="size-5" />
                        인사말
                      </h2>

                      <FormField
                        control={form.control}
                        name="greeting"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                className="min-h-[140px]"
                                placeholder="초대 메시지를 작성해주세요."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <Button type="submit" size="lg" className="min-w-[180px]" disabled={submitting || loadingInvite}>
                        {submitting
                          ? '저장 중...'
                          : inviteId
                            ? '수정 내용 저장하기'
                            : '초대장 생성하기'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        onClick={() => router.push(getI18nPath('/invite/select', locale))}
                      >
                        템플릿 다시 고르기
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
        </section>

        <aside className="lg:sticky lg:top-6 lg:h-fit">
          <div className="rounded-2xl border bg-slate-100 p-4 shadow-inner">
            <InviteMobilePreview template={template} invite={previewData} />
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            저장 전 실시간 미리보기 화면입니다.
          </p>
        </aside>
      </div>
    </div>
  );
}
