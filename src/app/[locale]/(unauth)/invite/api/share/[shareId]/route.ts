import { NextResponse } from 'next/server';

import { getInviteDetailByShareId } from '@/features/invite/server/repository';

export async function GET(
  _request: Request,
  context: { params: { shareId: string } },
) {
  const detail = await getInviteDetailByShareId(context.params.shareId);

  if (!detail) {
    return NextResponse.json({ message: '초대장을 찾을 수 없습니다.' }, { status: 404 });
  }

  return NextResponse.json(detail);
}
