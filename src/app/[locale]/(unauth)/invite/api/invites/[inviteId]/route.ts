import { NextResponse } from 'next/server';

import { getOptionalUserId } from '@/features/invite/server/auth';
import { getInviteById, updateInvite } from '@/features/invite/server/repository';
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
  const invite = await getInviteById(context.params.inviteId);

  if (!invite) {
    return NextResponse.json({ message: '초대장을 찾을 수 없습니다.' }, { status: 404 });
  }

  const userId = await getOptionalUserId();
  if (!userId || invite.ownerId !== userId) {
    return NextResponse.json({ message: '조회 권한이 없습니다.' }, { status: 403 });
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

  const target = await getInviteById(context.params.inviteId);

  if (!target) {
    return NextResponse.json({ message: '초대장을 찾을 수 없습니다.' }, { status: 404 });
  }

  const userId = await getOptionalUserId();

  if (!userId || target.ownerId !== userId) {
    return NextResponse.json({ message: '수정 권한이 없습니다.' }, { status: 403 });
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

  const updated = await updateInvite(context.params.inviteId, parsed.data, userId);

  return NextResponse.json({ invite: updated });
}
