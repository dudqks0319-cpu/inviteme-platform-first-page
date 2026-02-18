import { z } from 'zod';

import { getTemplateById } from '../data/templates';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^([01]?\d|2[0-3]):[0-5]\d$/;

const extraDataSchema = z.object({
  groomName: z.string().trim().max(50).optional(),
  brideName: z.string().trim().max(50).optional(),
  babyName: z.string().trim().max(50).optional(),
  babyGender: z.enum(['male', 'female']).optional(),
  celebrantName: z.string().trim().max(50).optional(),
  celebrantGender: z.enum(['male', 'female']).optional(),
  hostNames: z.string().trim().max(100).optional(),
  hostName: z.string().trim().max(100).optional(),
  parentNames: z.string().trim().max(100).optional(),
  birthDate: z.string().regex(dateRegex).optional(),
  birthYear: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
  age: z.number().int().min(1).max(150).optional(),
  contactPhone: z.string().trim().max(20).optional(),
  accountInfo: z.string().trim().max(200).optional(),
});

export const inviteFormSchema = z
  .object({
    templateId: z.string().min(1),
    type: z.enum(['wedding', 'doljanchi', 'birthday', 'housewarming', 'hwangap', 'general']),
    title: z.string().trim().min(1, '제목을 입력해주세요').max(100),
    greeting: z.string().trim().min(10, '인사말은 10자 이상 입력해주세요').max(1000),
    eventDate: z.string().regex(dateRegex, '날짜 형식이 올바르지 않습니다.'),
    eventTime: z.string().regex(timeRegex, '시간 형식이 올바르지 않습니다.'),
    venueName: z.string().trim().min(1, '장소명을 입력해주세요').max(100),
    venueAddress: z.string().trim().min(1, '주소를 입력해주세요').max(200),
    hostName: z.string().trim().max(100).optional(),
    extraData: extraDataSchema.default({}),
  })
  .superRefine((value, ctx) => {
    const template = getTemplateById(value.templateId);
    if (!template) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '존재하지 않는 템플릿입니다.',
        path: ['templateId'],
      });
      return;
    }

    if (template.type !== value.type) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '템플릿 타입과 초대장 타입이 일치하지 않습니다.',
        path: ['type'],
      });
    }

    if (value.type === 'wedding') {
      if (!value.extraData.groomName?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '신랑 이름을 입력해주세요.',
          path: ['extraData', 'groomName'],
        });
      }
      if (!value.extraData.brideName?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '신부 이름을 입력해주세요.',
          path: ['extraData', 'brideName'],
        });
      }
    }

    if (value.type === 'doljanchi' && !value.extraData.babyName?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '아기 이름을 입력해주세요.',
        path: ['extraData', 'babyName'],
      });
    }

    if ((value.type === 'birthday' || value.type === 'general') && !value.hostName?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '주최자/주인공 이름을 입력해주세요.',
        path: ['hostName'],
      });
    }

    if (value.type === 'housewarming' && !value.extraData.hostNames?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '주최자 이름을 입력해주세요.',
        path: ['extraData', 'hostNames'],
      });
    }

    if (value.type === 'hwangap' && !value.extraData.celebrantName?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '환갑 주인공 이름을 입력해주세요.',
        path: ['extraData', 'celebrantName'],
      });
    }
  });

export const inviteRsvpSchema = z.object({
  guestName: z.string().trim().min(1, '이름을 입력해주세요').max(50),
  guestPhone: z.string().trim().max(20).optional(),
  guestCount: z.number().int().min(1).max(20).default(1),
  attending: z.boolean(),
  message: z.string().trim().max(300).optional(),
});

export const inviteGuestbookSchema = z.object({
  authorName: z.string().trim().min(1, '이름을 입력해주세요').max(50),
  content: z.string().trim().min(1, '메시지를 입력해주세요').max(500),
});

export type InviteFormInput = z.infer<typeof inviteFormSchema>;
export type InviteRsvpInput = z.infer<typeof inviteRsvpSchema>;
export type InviteGuestbookInput = z.infer<typeof inviteGuestbookSchema>;
