import { and, desc, eq, sql } from 'drizzle-orm';

import { db } from '@/libs/DB';
import { inviteGuestbookSchema, inviteRsvpSchema, inviteSchema } from '@/models/Schema';

import type {
  InviteExtraData,
  InviteFormData,
  InviteGuestbookRecord,
  InviteRecord,
  InviteRsvpRecord,
} from '../types';

const parseExtraData = (value: string | null): InviteExtraData => {
  if (!value) {
    return {};
  }

  try {
    return JSON.parse(value) as InviteExtraData;
  } catch {
    return {};
  }
};

const serializeExtraData = (value?: InviteExtraData): string => {
  return JSON.stringify(value ?? {});
};

const generateShareId = () => {
  return crypto.randomUUID().replaceAll('-', '').slice(0, 12);
};

const mapInvite = (row: typeof inviteSchema.$inferSelect): InviteRecord => {
  return {
    id: row.id,
    shareId: row.shareId,
    ownerId: row.ownerId,
    templateId: row.templateId,
    type: row.type as InviteRecord['type'],
    title: row.title,
    greeting: row.greeting,
    eventDate: row.eventDate,
    eventTime: row.eventTime,
    venueName: row.venueName,
    venueAddress: row.venueAddress,
    hostName: row.hostName ?? undefined,
    extraData: parseExtraData(row.extraData),
    isPremium: row.isPremium,
    isPaid: row.isPaid,
    status: row.status as InviteRecord['status'],
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
};

const mapRsvp = (row: typeof inviteRsvpSchema.$inferSelect): InviteRsvpRecord => {
  return {
    id: row.id,
    inviteId: row.inviteId,
    guestName: row.guestName,
    guestPhone: row.guestPhone,
    guestCount: row.guestCount,
    attending: row.attending,
    message: row.message,
    createdAt: row.createdAt,
  };
};

const mapGuestbook = (row: typeof inviteGuestbookSchema.$inferSelect): InviteGuestbookRecord => {
  return {
    id: row.id,
    inviteId: row.inviteId,
    authorName: row.authorName,
    content: row.content,
    createdAt: row.createdAt,
  };
};

export const createInvite = async (input: InviteFormData, ownerId?: string | null) => {
  const id = crypto.randomUUID();
  const shareId = generateShareId();

  await db.insert(inviteSchema).values({
    id,
    shareId,
    ownerId: ownerId ?? null,
    templateId: input.templateId,
    type: input.type,
    title: input.title,
    greeting: input.greeting,
    eventDate: input.eventDate,
    eventTime: input.eventTime,
    venueName: input.venueName,
    venueAddress: input.venueAddress,
    hostName: input.hostName ?? null,
    extraData: serializeExtraData(input.extraData),
    isPremium: false,
    isPaid: false,
    status: 'published',
  });

  return { id, shareId };
};

export const updateInvite = async (id: string, input: InviteFormData, ownerId: string) => {
  const result = await db
    .update(inviteSchema)
    .set({
      templateId: input.templateId,
      type: input.type,
      title: input.title,
      greeting: input.greeting,
      eventDate: input.eventDate,
      eventTime: input.eventTime,
      venueName: input.venueName,
      venueAddress: input.venueAddress,
      hostName: input.hostName ?? null,
      extraData: serializeExtraData(input.extraData),
    })
    .where(and(eq(inviteSchema.id, id), eq(inviteSchema.ownerId, ownerId)))
    .returning();

  return result[0] ? mapInvite(result[0]) : null;
};

export const markInvitePaid = async (id: string, ownerId: string) => {
  const rows = await db
    .update(inviteSchema)
    .set({
      isPaid: true,
    })
    .where(and(eq(inviteSchema.id, id), eq(inviteSchema.ownerId, ownerId)))
    .returning();

  return rows[0] ? mapInvite(rows[0]) : null;
};

export const getInviteById = async (id: string) => {
  const rows = await db.select().from(inviteSchema).where(eq(inviteSchema.id, id)).limit(1);
  return rows[0] ? mapInvite(rows[0]) : null;
};

export const getInviteByIdAndOwner = async (id: string, ownerId: string) => {
  const rows = await db
    .select()
    .from(inviteSchema)
    .where(and(eq(inviteSchema.id, id), eq(inviteSchema.ownerId, ownerId)))
    .limit(1);
  return rows[0] ? mapInvite(rows[0]) : null;
};

export const deleteInvite = async (id: string, ownerId: string) => {
  const rows = await db
    .delete(inviteSchema)
    .where(and(eq(inviteSchema.id, id), eq(inviteSchema.ownerId, ownerId)))
    .returning();
  return rows[0] ? mapInvite(rows[0]) : null;
};

export const getInviteByShareId = async (shareId: string) => {
  const rows = await db
    .select()
    .from(inviteSchema)
    .where(and(eq(inviteSchema.shareId, shareId), eq(inviteSchema.status, 'published')))
    .limit(1);

  return rows[0] ? mapInvite(rows[0]) : null;
};

export const listInvitesByOwner = async (ownerId: string) => {
  const rows = await db
    .select()
    .from(inviteSchema)
    .where(eq(inviteSchema.ownerId, ownerId))
    .orderBy(desc(inviteSchema.createdAt));

  return rows.map(mapInvite);
};

export const addRsvp = async (
  inviteId: string,
  input: {
    guestName: string;
    guestPhone?: string;
    guestCount: number;
    attending: boolean;
    message?: string;
  },
) => {
  const rows = await db
    .insert(inviteRsvpSchema)
    .values({
      inviteId,
      guestName: input.guestName,
      guestPhone: input.guestPhone ?? null,
      guestCount: input.guestCount,
      attending: input.attending,
      message: input.message ?? null,
    })
    .returning();

  const created = rows[0];

  if (!created) {
    throw new Error('RSVP 생성에 실패했습니다.');
  }

  return mapRsvp(created);
};

export const listRsvps = async (inviteId: string) => {
  const rows = await db
    .select()
    .from(inviteRsvpSchema)
    .where(eq(inviteRsvpSchema.inviteId, inviteId))
    .orderBy(desc(inviteRsvpSchema.createdAt));

  return rows.map(mapRsvp);
};

export const getRsvpSummary = async (inviteId: string) => {
  const rows = await db
    .select({
      totalResponses: sql<number>`count(*)`,
      attendingCount: sql<number>`coalesce(sum(case when ${inviteRsvpSchema.attending} then ${inviteRsvpSchema.guestCount} else 0 end), 0)`,
      declineCount: sql<number>`coalesce(sum(case when not ${inviteRsvpSchema.attending} then 1 else 0 end), 0)`,
    })
    .from(inviteRsvpSchema)
    .where(eq(inviteRsvpSchema.inviteId, inviteId));

  const summary = rows[0];
  return {
    totalResponses: Number(summary?.totalResponses ?? 0),
    attendingCount: Number(summary?.attendingCount ?? 0),
    declineCount: Number(summary?.declineCount ?? 0),
  };
};

export const addGuestbookEntry = async (
  inviteId: string,
  input: {
    authorName: string;
    content: string;
  },
) => {
  const rows = await db
    .insert(inviteGuestbookSchema)
    .values({
      inviteId,
      authorName: input.authorName,
      content: input.content,
    })
    .returning();

  const created = rows[0];

  if (!created) {
    throw new Error('방명록 생성에 실패했습니다.');
  }

  return mapGuestbook(created);
};

export const listGuestbookEntries = async (inviteId: string) => {
  const rows = await db
    .select()
    .from(inviteGuestbookSchema)
    .where(eq(inviteGuestbookSchema.inviteId, inviteId))
    .orderBy(desc(inviteGuestbookSchema.createdAt));

  return rows.map(mapGuestbook);
};

export const getInviteDetailByShareId = async (shareId: string) => {
  const invite = await getInviteByShareId(shareId);

  if (!invite) {
    return null;
  }

  const [rsvps, guestbook, rsvpSummary] = await Promise.all([
    listRsvps(invite.id),
    listGuestbookEntries(invite.id),
    getRsvpSummary(invite.id),
  ]);

  return {
    invite,
    rsvps,
    guestbook,
    rsvpSummary,
  };
};
