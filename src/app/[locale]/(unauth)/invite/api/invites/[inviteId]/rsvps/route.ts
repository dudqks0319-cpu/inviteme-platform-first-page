import { NextResponse } from 'next/server';

import { addRsvp, getInviteById, getRsvpSummary, listRsvps } from '@/features/invite/server/repository';
import {
  buildRateLimitKey,
  checkRateLimit,
  createRateLimitResponse,
} from '@/features/invite/server/route-security';
import { inviteRsvpSchema } from '@/features/invite/utils/invite-form-schema';

export async function GET(
  _request: Request,
  context: { params: { inviteId: string } },
) {
  const invite = await getInviteById(context.params.inviteId);
  if (!invite) {
    return NextResponse.json({ message: '초대장을 찾을 수 없습니다.' }, { status: 404 });
  }

  const [items, summary] = await Promise.all([
    listRsvps(context.params.inviteId),
    getRsvpSummary(context.params.inviteId),
  ]);

  return NextResponse.json({ items, summary });
}

export async function POST(
  request: Request,
  context: { params: { inviteId: string } },
) {
  const rateLimit = checkRateLimit(buildRateLimitKey(`invite-rsvp:${context.params.inviteId}`, request), {
    limit: 10,
    windowMs: 60_000,
  });
  if (!rateLimit.ok) {
    return createRateLimitResponse(rateLimit);
  }

  const invite = await getInviteById(context.params.inviteId);
  if (!invite) {
    return NextResponse.json({ message: '초대장을 찾을 수 없습니다.' }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = inviteRsvpSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: '입력값이 올바르지 않습니다.',
        issues: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const item = await addRsvp(context.params.inviteId, parsed.data);
  const summary = await getRsvpSummary(context.params.inviteId);

  return NextResponse.json({ item, summary }, { status: 201 });
}
