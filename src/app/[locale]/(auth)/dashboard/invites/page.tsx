import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { listInvitesByOwner } from '@/features/invite/server/repository';
import { formatDateWithDay, formatTime } from '@/features/invite/utils/formatter';
import { getI18nPath } from '@/utils/Helpers';

export default async function DashboardInvitesPage(props: {
  params: {
    locale: string;
  };
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect(getI18nPath('/sign-in', props.params.locale));
  }

  const invites = await listInvitesByOwner(userId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">내 초대장 관리</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          생성한 초대장을 수정하거나 공개 링크를 확인할 수 있습니다.
        </p>
      </div>

      {invites.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            아직 생성한 초대장이 없습니다.
            {' '}
            <Link href={getI18nPath('/invite/select', props.params.locale)} className="text-primary underline">
              첫 초대장 만들기
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {invites.map(invite => (
          <Card key={invite.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2 text-base">
                <span>{invite.title}</span>
                <span className="text-xs font-medium text-muted-foreground">
                  /
                  {invite.shareId}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid gap-2 sm:grid-cols-2">
                <p>
                  일정:
                  {' '}
                  {formatDateWithDay(invite.eventDate)}
                  {' '}
                  {formatTime(invite.eventTime)}
                </p>
                <p>
                  장소:
                  {' '}
                  {invite.venueName}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  href={getI18nPath(`/invite/create?template=${invite.templateId}&id=${invite.id}`, props.params.locale)}
                  className="rounded-md border px-3 py-1 text-xs hover:bg-muted"
                >
                  수정
                </Link>
                <Link
                  href={getI18nPath(`/invite/preview?id=${invite.id}`, props.params.locale)}
                  className="rounded-md border px-3 py-1 text-xs hover:bg-muted"
                >
                  미리보기
                </Link>
                <Link
                  href={getI18nPath(`/invite/view/${invite.shareId}`, props.params.locale)}
                  className="rounded-md border px-3 py-1 text-xs hover:bg-muted"
                >
                  공개 페이지
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
