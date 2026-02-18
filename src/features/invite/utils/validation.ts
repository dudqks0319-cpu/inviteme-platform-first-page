import { z } from 'zod';

import type { InviteType } from '../types';

// ============ 공통 필드 스키마 ============
const commonFieldsSchema = z.object({
  eventDate: z.string().refine(
    (date) => {
      const parsed = new Date(date);
      return !Number.isNaN(parsed.getTime()) && parsed > new Date();
    },
    { message: '이벤트 날짜는 미래 날짜여야 합니다' },
  ),
  eventTime: z.string().regex(/^([01]?\d|2[0-3]):[0-5]\d$/, {
    message: '시간 형식이 올바르지 않습니다 (HH:MM)',
  }),
  venueName: z.string().min(1, '장소명을 입력해주세요').max(100),
  venueAddress: z.string().min(1, '주소를 입력해주세요').max(200),
  greeting: z.string().max(1000, '인사말은 1000자를 초과할 수 없습니다').optional(),
});

// ============ 청첩장 스키마 ============
export const weddingInviteSchema = commonFieldsSchema.extend({
  type: z.literal('wedding'),
  groomName: z.string().min(1, '신랑 이름을 입력해주세요').max(50),
  brideName: z.string().min(1, '신부 이름을 입력해주세요').max(50),
  groomFather: z.string().max(50).optional(),
  groomMother: z.string().max(50).optional(),
  brideFather: z.string().max(50).optional(),
  brideMother: z.string().max(50).optional(),
  groomPhone: z.string().regex(/^010-\d{4}-\d{4}$/, {
    message: '전화번호 형식: 010-0000-0000',
  }).optional(),
  bridePhone: z.string().regex(/^010-\d{4}-\d{4}$/, {
    message: '전화번호 형식: 010-0000-0000',
  }).optional(),
  groomAccount: z.string().max(200).optional(),
  brideAccount: z.string().max(200).optional(),
});

// ============ 돌잔치 스키마 ============
export const doljanchiInviteSchema = commonFieldsSchema.extend({
  type: z.literal('doljanchi'),
  babyName: z.string().min(1, '아기 이름을 입력해주세요').max(50),
  babyGender: z.enum(['male', 'female'], {
    errorMap: () => ({ message: '성별을 선택해주세요' }),
  }),
  birthDate: z.string().refine(
    (date) => {
      const parsed = new Date(date);
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      return !Number.isNaN(parsed.getTime()) && parsed > oneYearAgo && parsed < new Date();
    },
    { message: '출생일은 1년 이내여야 합니다' },
  ),
  parentNames: z.string().min(1, '부모님 이름을 입력해주세요').max(100),
  parentPhone: z.string().regex(/^010-\d{4}-\d{4}$/).optional(),
  parentAccount: z.string().max(200).optional(),
});

// ============ 생일 초대장 스키마 ============
export const birthdayInviteSchema = commonFieldsSchema.extend({
  type: z.literal('birthday'),
  name: z.string().min(1, '이름을 입력해주세요').max(50),
  age: z.number().int().min(1).max(150).optional(),
  hostName: z.string().max(50).optional(),
  phone: z.string().regex(/^010-\d{4}-\d{4}$/).optional(),
});

// ============ 집들이 스키마 ============
export const housewarmingInviteSchema = commonFieldsSchema.extend({
  type: z.literal('housewarming'),
  hostNames: z.string().min(1, '주최자 이름을 입력해주세요').max(100),
  phone: z.string().regex(/^010-\d{4}-\d{4}$/).optional(),
  newAddress: z.string().min(1, '새 주소를 입력해주세요').max(200),
});

// ============ 환갑잔치 스키마 ============
export const hwangapInviteSchema = commonFieldsSchema.extend({
  type: z.literal('hwangap'),
  celebrantName: z.string().min(1, '환갑 맞이하시는 분 이름을 입력해주세요').max(50),
  celebrantGender: z.enum(['male', 'female']).optional(),
  birthYear: z.number().int().min(1900).max(new Date().getFullYear() - 60),
  hostNames: z.string().min(1, '자녀 이름을 입력해주세요').max(100),
  phone: z.string().regex(/^010-\d{4}-\d{4}$/).optional(),
});

// ============ 일반 초대장 스키마 ============
export const generalInviteSchema = commonFieldsSchema.extend({
  type: z.literal('general'),
  title: z.string().min(1, '제목을 입력해주세요').max(100),
  hostName: z.string().max(50).optional(),
  phone: z.string().regex(/^010-\d{4}-\d{4}$/).optional(),
});

// ============ 통합 스키마 (Union) ============
export const inviteDataSchema = z.discriminatedUnion('type', [
  weddingInviteSchema,
  doljanchiInviteSchema,
  birthdayInviteSchema,
  housewarmingInviteSchema,
  hwangapInviteSchema,
  generalInviteSchema,
]);

// ============ 타입 추론 ============
export type WeddingInviteData = z.infer<typeof weddingInviteSchema>;
export type DoljanchiInviteData = z.infer<typeof doljanchiInviteSchema>;
export type BirthdayInviteData = z.infer<typeof birthdayInviteSchema>;
export type HousewarmingInviteData = z.infer<typeof housewarmingInviteSchema>;
export type HwangapInviteData = z.infer<typeof hwangapInviteSchema>;
export type GeneralInviteData = z.infer<typeof generalInviteSchema>;
export type InviteData = z.infer<typeof inviteDataSchema>;

// ============ 검증 함수 ============
export function validateInviteData(data: unknown): {
  success: boolean;
  data?: InviteData;
  errors?: z.ZodError;
} {
  const result = inviteDataSchema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  return {
    success: false,
    errors: result.error,
  };
}

export function getSchemaByType(type: InviteType): z.ZodSchema {
  const schemaMap = {
    wedding: weddingInviteSchema,
    doljanchi: doljanchiInviteSchema,
    birthday: birthdayInviteSchema,
    housewarming: housewarmingInviteSchema,
    hwangap: hwangapInviteSchema,
    general: generalInviteSchema,
  };

  return schemaMap[type];
}
