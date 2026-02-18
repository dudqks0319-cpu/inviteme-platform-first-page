import {
  bigint,
  boolean,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

// This file defines the structure of your database tables using the Drizzle ORM.

// To modify the database schema:
// 1. Update this file with your desired changes.
// 2. Generate a new migration by running: `npm run db:generate`

// The generated migration file will reflect your schema changes.
// The migration is automatically applied during the next database interaction,
// so there's no need to run it manually or restart the Next.js server.

// Need a database for production? Check out https://www.prisma.io/?via=saasboilerplatesrc
// Tested and compatible with Next.js Boilerplate
export const organizationSchema = pgTable(
  'organization',
  {
    id: text('id').primaryKey(),
    stripeCustomerId: text('stripe_customer_id'),
    stripeSubscriptionId: text('stripe_subscription_id'),
    stripeSubscriptionPriceId: text('stripe_subscription_price_id'),
    stripeSubscriptionStatus: text('stripe_subscription_status'),
    stripeSubscriptionCurrentPeriodEnd: bigint(
      'stripe_subscription_current_period_end',
      { mode: 'number' },
    ),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => {
    return {
      stripeCustomerIdIdx: uniqueIndex('stripe_customer_id_idx').on(
        table.stripeCustomerId,
      ),
    };
  },
);

export const todoSchema = pgTable('todo', {
  id: serial('id').primaryKey(),
  ownerId: text('owner_id').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const inviteSchema = pgTable(
  'invite',
  {
    id: text('id').primaryKey(),
    shareId: text('share_id').notNull(),
    ownerId: text('owner_id'),
    templateId: text('template_id').notNull(),
    type: text('type').notNull(),
    title: text('title').notNull(),
    greeting: text('greeting').notNull(),
    eventDate: text('event_date').notNull(),
    eventTime: text('event_time').notNull(),
    venueName: text('venue_name').notNull(),
    venueAddress: text('venue_address').notNull(),
    hostName: text('host_name'),
    isPremium: boolean('is_premium').default(false).notNull(),
    isPaid: boolean('is_paid').default(false).notNull(),
    status: text('status').default('published').notNull(),
    extraData: text('extra_data').default('{}').notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  table => ({
    shareIdUniqueIdx: uniqueIndex('invite_share_id_unique_idx').on(table.shareId),
    ownerIdIdx: index('invite_owner_id_idx').on(table.ownerId),
    statusIdx: index('invite_status_idx').on(table.status),
  }),
);

export const inviteRsvpSchema = pgTable(
  'invite_rsvp',
  {
    id: serial('id').primaryKey(),
    inviteId: text('invite_id').notNull(),
    guestName: text('guest_name').notNull(),
    guestPhone: text('guest_phone'),
    guestCount: integer('guest_count').default(1).notNull(),
    attending: boolean('attending').notNull(),
    message: text('message'),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  },
  table => ({
    inviteIdIdx: index('invite_rsvp_invite_id_idx').on(table.inviteId),
  }),
);

export const inviteGuestbookSchema = pgTable(
  'invite_guestbook',
  {
    id: serial('id').primaryKey(),
    inviteId: text('invite_id').notNull(),
    authorName: text('author_name').notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  },
  table => ({
    inviteIdIdx: index('invite_guestbook_invite_id_idx').on(table.inviteId),
  }),
);
