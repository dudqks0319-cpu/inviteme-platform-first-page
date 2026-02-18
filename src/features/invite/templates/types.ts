import type {
  InviteFormData,
  InviteGuestbookRecord,
  InviteRecord,
  InviteRsvpRecord,
} from '@/features/invite/types';

export type InviteDetailData = {
  invite: InviteRecord & { createdAt: string; updatedAt: string };
  rsvps: Array<InviteRsvpRecord & { createdAt: string }>;
  guestbook: Array<InviteGuestbookRecord & { createdAt: string }>;
  rsvpSummary: {
    totalResponses: number;
    attendingCount: number;
    declineCount: number;
  };
};

export type InviteTemplateProps = {
  locale: string;
  detail: InviteDetailData;
  previewData: InviteFormData;
  onSubmitRsvp: (data: {
    guestName: string;
    guestPhone: string;
    guestCount: number;
    attending: boolean;
    message: string;
  }) => Promise<void>;
  onSubmitGuestbook: (data: {
    authorName: string;
    content: string;
  }) => Promise<void>;
  submittingRsvp: boolean;
  submittingGuestbook: boolean;
};
