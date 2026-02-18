import { NextResponse } from 'next/server';

import { getOptionalUserId } from '@/features/invite/server/auth';
import { createInvite, listInvitesByOwner } from '@/features/invite/server/repository';
import { inviteFormSchema } from '@/features/invite/utils/invite-form-schema';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mineOnly = searchParams.get('mine') === 'true';

  if (!mineOnly) {
    return NextResponse.json({ items: [] });
  }

  const userId = await getOptionalUserId();
  if (!userId) {
    return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });
  }

  const items = await listInvitesByOwner(userId);
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = inviteFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: '입력값이 올바르지 않습니다.',
        issues: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const userId = await getOptionalUserId();
  const created = await createInvite(parsed.data, userId);

  return NextResponse.json({
    id: created.id,
    shareId: created.shareId,
  });
}
