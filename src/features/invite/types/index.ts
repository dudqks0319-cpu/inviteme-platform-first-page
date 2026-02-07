// 초대장 타입
export type InviteType = 'wedding' | 'doljanchi' | 'birthday' | 'housewarming' | 'hwangap' | 'general';

// 템플릿 스타일
export type TemplateStyle = 'floral' | 'classic' | 'modern' | 'elegant' | 'luxury' | 'cute' | 'minimal';

// 템플릿 인터페이스
export interface Template {
  id: string;
  type: InviteType;
  name: string;
  style: TemplateStyle;
  isPremium: boolean;
  backgroundColor: string;
  primaryColor: string;
  fontFamily: string;
  description: string;
}

// 초대장 데이터 (기존 URL 인코딩 방식)
export interface InviteData {
  templateId: string;
  type: InviteType;
  greeting?: string;
  contact?: string;
  account?: string;
  eventData: Record<string, any>;
}

// DB 저장용 초대장 (향후 사용)
export interface InviteRecord {
  id: string;
  userId: string;
  templateId: string;
  type: InviteType;
  status: 'draft' | 'published' | 'expired';
  isPaid: boolean;
  greeting?: string;
  contact?: string;
  account?: string;
  eventData: Record<string, any>;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

// 공유 데이터
export interface ShareData {
  inviteUrl: string;
  title: string;
  description: string;
}
