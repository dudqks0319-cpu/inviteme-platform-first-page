import { NextResponse } from 'next/server';

import { getOptionalUserId } from '@/features/invite/server/auth';
import { getInviteById, markInvitePaid } from '@/features/invite/server/repository';

export async function POST(
  request: Request,
  context: { params: { inviteId: string; locale: string } },
) {
  const invite = await getInviteById(context.params.inviteId);

  if (!invite) {
    return NextResponse.json({ message: '초대장을 찾을 수 없습니다.' }, { status: 404 });
  }

  const userId = await getOptionalUserId();
  if (invite.ownerId && invite.ownerId !== userId) {
    return NextResponse.json({ message: '결제 권한이 없습니다.' }, { status: 403 });
  }

  // 데모 환경에서는 실제 Stripe Checkout 대신 즉시 결제 성공 처리합니다.
  // Stripe 키를 연결하면 이 라우트를 Stripe 세션 생성으로 교체하면 됩니다.
  const updated = await markInvitePaid(invite.id, userId);

  const { origin } = new URL(request.url);
  return NextResponse.json({
    ok: true,
    invite: updated,
    redirectUrl: `${origin}/${context.params.locale}/invite/preview?id=${invite.id}&paid=true`,
  });
}
