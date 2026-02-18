// 초대장 타입
export type InviteType = 'wedding' | 'doljanchi' | 'birthday' | 'housewarming' | 'hwangap' | 'general';

export type InviteStatus = 'draft' | 'published' | 'archived';

// 템플릿 스타일
export type TemplateStyle = 'floral' | 'classic' | 'modern' | 'elegant' | 'luxury' | 'cute' | 'minimal';

// 템플릿 정의
export type Template = {
  id: string;
  type: InviteType;
  name: string;
  style: TemplateStyle;
  isPremium: boolean;
  backgroundColor: string;
  primaryColor: string;
  fontFamily: string;
  description: string;
};

export type InviteExtraData = {
  groomName?: string;
  brideName?: string;
  babyName?: string;
  babyGender?: 'male' | 'female';
  celebrantName?: string;
  celebrantGender?: 'male' | 'female';
  hostNames?: string;
  hostName?: string;
  parentNames?: string;
  birthDate?: string;
  birthYear?: number;
  age?: number;
  contactPhone?: string;
  accountInfo?: string;
};

export type InviteFormData = {
  templateId: string;
  type: InviteType;
  title: string;
  greeting: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
  hostName?: string;
  extraData?: InviteExtraData;
};

export type InviteRecord = InviteFormData & {
  id: string;
  shareId: string;
  ownerId: string | null;
  isPremium: boolean;
  isPaid: boolean;
  status: InviteStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type InviteRsvpRecord = {
  id: number;
  inviteId: string;
  guestName: string;
  guestPhone: string | null;
  guestCount: number;
  attending: boolean;
  message: string | null;
  createdAt: Date;
};

export type InviteGuestbookRecord = {
  id: number;
  inviteId: string;
  authorName: string;
  content: string;
  createdAt: Date;
};

export type ShareData = {
  inviteUrl: string;
  title: string;
  description: string;
};
