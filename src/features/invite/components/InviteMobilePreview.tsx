import { BabyIcon, GiftIcon, HeartIcon, MapPinIcon } from 'lucide-react';

import { formatDate, formatTime } from '@/features/invite/utils/formatter';

import type { InviteFormData, Template } from '../types';

type InviteMobilePreviewProps = {
  template: Template;
  invite: InviteFormData;
  className?: string;
};

const getHeroTitle = (invite: InviteFormData) => {
  if (invite.type === 'wedding') {
    return {
      primary: invite.extraData?.groomName || '신랑',
      secondary: invite.extraData?.brideName || '신부',
      icon: <HeartIcon className="mx-auto mb-3 size-8 opacity-50" />,
    };
  }

  if (invite.type === 'doljanchi') {
    return {
      primary: invite.extraData?.babyName || '아기',
      subtitle: '첫 번째 생일잔치',
      icon: <BabyIcon className="mx-auto mb-3 size-8 opacity-50" />,
    };
  }

  if (invite.type === 'hwangap') {
    return {
      primary: invite.extraData?.celebrantName || '주인공',
      subtitle: '환갑을 축하합니다',
      icon: <GiftIcon className="mx-auto mb-3 size-8 opacity-50" />,
    };
  }

  return {
    primary: invite.hostName || invite.extraData?.hostName || '주인공',
    icon: <GiftIcon className="mx-auto mb-3 size-8 opacity-50" />,
  };
};

export const InviteMobilePreview = ({ template, invite, className }: InviteMobilePreviewProps) => {
  const hero = getHeroTitle(invite);

  return (
    <div className={className}>
      <div className="relative flex h-[620px] w-[340px] flex-col overflow-hidden rounded-[32px] border-4 border-slate-800 bg-white shadow-2xl">
        <div className="absolute top-0 z-20 flex h-6 w-full justify-center bg-slate-800">
          <div className="h-5 w-1/3 rounded-b-lg bg-black" />
        </div>

        <div
          className="flex-1 overflow-y-auto pt-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{
            backgroundColor: template.backgroundColor,
            fontFamily: template.fontFamily,
          }}
        >
          <div
            className="flex min-h-[320px] flex-col items-center justify-center p-6 text-center"
            style={{ color: template.primaryColor }}
          >
            <p className="mb-3 text-xs uppercase tracking-[0.2em] opacity-80">INVITATION</p>
            {hero.icon}
            <h2 className="text-2xl font-bold">{hero.primary}</h2>

            {hero.secondary && (
              <>
                <div className="text-lg">&</div>
                <h2 className="text-2xl font-bold">{hero.secondary}</h2>
              </>
            )}

            {hero.subtitle && <p className="mt-2 text-sm opacity-80">{hero.subtitle}</p>}

            <div className="mt-6 space-y-1">
              <p className="text-base font-semibold">{formatDate(invite.eventDate)}</p>
              <p className="text-sm">{formatTime(invite.eventTime)}</p>
              <p className="mt-3 text-xs opacity-80">{invite.venueName}</p>
            </div>
          </div>

          <div className="mx-3 rounded-xl bg-white/85 p-5 text-center shadow-sm backdrop-blur-sm">
            <h3 className="mb-2 text-xs font-bold opacity-50">초대 메시지</h3>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">{invite.greeting}</p>
          </div>

          <div className="m-3 mt-4 rounded-xl bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-start gap-2">
              <MapPinIcon className="mt-0.5 size-4 shrink-0 text-gray-500" />
              <div>
                <h4 className="text-sm font-semibold text-gray-900">{invite.venueName}</h4>
                <p className="text-xs text-gray-500">{invite.venueAddress}</p>
              </div>
            </div>
            <div className="flex h-24 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
              지도 영역 (카카오맵 연동 가능)
            </div>
          </div>

          <div className="h-20" />
        </div>

        <div className="flex h-16 items-center justify-center border-t bg-white px-4">
          <button
            type="button"
            className="w-full rounded-full px-4 py-2 text-sm font-semibold text-white"
            style={{ backgroundColor: template.primaryColor }}
            disabled
          >
            참석 의사 전달하기
          </button>
        </div>
      </div>
    </div>
  );
};
