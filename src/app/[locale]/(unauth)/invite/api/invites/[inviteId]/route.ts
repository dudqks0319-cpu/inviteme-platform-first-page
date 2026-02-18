import { NextResponse } from 'next/server';

import { getOptionalUserId } from '@/features/invite/server/auth';
import { deleteInvite, getInviteByIdAndOwner, updateInvite } from '@/features/invite/server/repository';
import {
  buildRateLimitKey,
  checkRateLimit,
  createOriginErrorResponse,
  createRateLimitResponse,
  validateSameOrigin,
} from '@/features/invite/server/route-security';
import { inviteFormSchema } from '@/features/invite/utils/invite-form-schema';

export async function GET(
  _request: Request,
  context: { params: { inviteId: string } },
) {
  const userId = await getOptionalUserId();

  if (!userId) {
    return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });
  }

  // 타이밍 공격 방지: 내 초대장이 아니면 존재 여부조차 모르게 404 처리
  const invite = await getInviteByIdAndOwner(context.params.inviteId, userId);

  if (!invite) {
    return NextResponse.json({ message: '초대장을 찾을 수 없습니다.' }, { status: 404 });
  }

  return NextResponse.json({ invite });
}

export async function PATCH(
  request: Request,
  context: { params: { inviteId: string } },
) {
  if (!validateSameOrigin(request)) {
    return createOriginErrorResponse();
  }

  const rateLimit = checkRateLimit(buildRateLimitKey(`invite-update:${context.params.inviteId}`, request), {
    limit: 20,
    windowMs: 60_000,
  });
  if (!rateLimit.ok) {
    return createRateLimitResponse(rateLimit);
  }

  const userId = await getOptionalUserId();

  if (!userId) {
    return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });
  }

  // 권한 체크 및 존재 확인 (DB 레벨 ownerId 필터)
  const target = await getInviteByIdAndOwner(context.params.inviteId, userId);

  if (!target) {
    return NextResponse.json({ message: '초대장을 찾을 수 없습니다.' }, { status: 404 });
  }

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

  // updateInvite 내부에서도 where ownerId 체크함 (이중 방어)
  const updated = await updateInvite(context.params.inviteId, parsed.data, userId);

  return NextResponse.json({ invite: updated });
}

export async function DELETE(
  request: Request,
  context: { params: { inviteId: string } },
) {
  if (!validateSameOrigin(request)) {
    return createOriginErrorResponse();
  }

  const userId = await getOptionalUserId();

  if (!userId) {
    return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });
  }

  const deleted = await deleteInvite(context.params.inviteId, userId);

  if (!deleted) {
    return NextResponse.json({ message: '초대장을 찾을 수 없거나 삭제할 수 없습니다.' }, { status: 404 });
  }

  return NextResponse.json({ message: '삭제되었습니다.', id: deleted.id });
}
