import { describe, expect, it } from 'vitest';
import {
  getSchemaByType,
  inviteDataSchema,
  validateInviteData,
  weddingInviteSchema,
} from './validation';

describe('초대장 데이터 검증', () => {
  describe('validateInviteData', () => {
    it('유효한 청첩장 데이터를 검증해야 함', () => {
      const validWedding = {
        type: 'wedding',
        groomName: '김철수',
        brideName: '이영희',
        eventDate: '2026-06-15',
        eventTime: '14:00',
        venueName: '그랜드볼룸',
        venueAddress: '서울시 강남구 테헤란로 123',
        greeting: '저희 두 사람의 결혼식에 초대합니다.',
      };

      const result = validateInviteData(validWedding);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(validWedding);
      expect(result.errors).toBeUndefined();
    });

    it('필수 필드 누락 시 실패해야 함', () => {
      const invalidWedding = {
        type: 'wedding',
        groomName: '김철수',
        // brideName 누락
        eventDate: '2026-06-15',
        eventTime: '14:00',
        venueName: '그랜드볼룸',
        venueAddress: '서울시 강남구',
      };

      const result = validateInviteData(invalidWedding);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.data).toBeUndefined();
    });

    it('과거 날짜는 거부해야 함', () => {
      const pastDateWedding = {
        type: 'wedding',
        groomName: '김철수',
        brideName: '이영희',
        eventDate: '2020-01-01', // 과거 날짜
        eventTime: '14:00',
        venueName: '그랜드볼룸',
        venueAddress: '서울시 강남구',
      };

      const result = validateInviteData(pastDateWedding);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('잘못된 시간 형식은 거부해야 함', () => {
      const invalidTime = {
        type: 'wedding',
        groomName: '김철수',
        brideName: '이영희',
        eventDate: '2026-06-15',
        eventTime: '25:00', // 잘못된 시간
        venueName: '그랜드볼룸',
        venueAddress: '서울시 강남구',
      };

      const result = validateInviteData(invalidTime);

      expect(result.success).toBe(false);
    });

    it('유효한 돌잔치 데이터를 검증해야 함', () => {
      const validDoljanchi = {
        type: 'doljanchi',
        babyName: '김도윤',
        babyGender: 'male',
        birthDate: '2025-03-01',
        parentNames: '김철수, 이영희',
        eventDate: '2026-03-01',
        eventTime: '12:00',
        venueName: '호텔 연회장',
        venueAddress: '서울시 강남구',
      };

      const result = validateInviteData(validDoljanchi);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(validDoljanchi);
    });

    it('1년 이상 지난 출생일은 거부해야 함', () => {
      const oldBirthDate = {
        type: 'doljanchi',
        babyName: '김도윤',
        babyGender: 'male',
        birthDate: '2023-01-01', // 1년 넘음
        parentNames: '김철수, 이영희',
        eventDate: '2026-03-01',
        eventTime: '12:00',
        venueName: '호텔 연회장',
        venueAddress: '서울시 강남구',
      };

      const result = validateInviteData(oldBirthDate);

      expect(result.success).toBe(false);
    });

    it('잘못된 전화번호 형식은 거부해야 함', () => {
      const invalidPhone = {
        type: 'wedding',
        groomName: '김철수',
        brideName: '이영희',
        groomPhone: '01012345678', // 하이픈 없음
        eventDate: '2026-06-15',
        eventTime: '14:00',
        venueName: '그랜드볼룸',
        venueAddress: '서울시 강남구',
      };

      const result = validateInviteData(invalidPhone);

      expect(result.success).toBe(false);
    });
  });

  describe('getSchemaByType', () => {
    it('wedding 타입에 대해 올바른 스키마를 반환해야 함', () => {
      const schema = getSchemaByType('wedding');

      expect(schema).toBe(weddingInviteSchema);
    });

    it('doljanchi 타입에 대해 올바른 스키마를 반환해야 함', () => {
      const schema = getSchemaByType('doljanchi');

      expect(schema).toBeDefined();
    });

    it('birthday 타입에 대해 올바른 스키마를 반환해야 함', () => {
      const schema = getSchemaByType('birthday');

      expect(schema).toBeDefined();
    });

    it('housewarming 타입에 대해 올바른 스키마를 반환해야 함', () => {
      const schema = getSchemaByType('housewarming');

      expect(schema).toBeDefined();
    });

    it('hwangap 타입에 대해 올바른 스키마를 반환해야 함', () => {
      const schema = getSchemaByType('hwangap');

      expect(schema).toBeDefined();
    });

    it('general 타입에 대해 올바른 스키마를 반환해야 함', () => {
      const schema = getSchemaByType('general');

      expect(schema).toBeDefined();
    });
  });

  describe('Zod 스키마 직접 테스트', () => {
    it('weddingInviteSchema: 유효한 데이터 파싱', () => {
      const validData = {
        type: 'wedding',
        groomName: '김철수',
        brideName: '이영희',
        eventDate: '2026-12-25',
        eventTime: '15:30',
        venueName: '웨딩홀',
        venueAddress: '서울시',
      };

      const result = weddingInviteSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('weddingInviteSchema: 선택적 필드 포함', () => {
      const dataWithOptional = {
        type: 'wedding',
        groomName: '김철수',
        brideName: '이영희',
        groomFather: '김아버지',
        groomMother: '김어머니',
        brideFather: '이아버지',
        brideMother: '이어머니',
        groomPhone: '010-1234-5678',
        bridePhone: '010-9876-5432',
        groomAccount: '국민은행 123-456-789',
        brideAccount: '신한은행 987-654-321',
        eventDate: '2026-12-25',
        eventTime: '15:30',
        venueName: '웨딩홀',
        venueAddress: '서울시',
        greeting: '축하해주세요!',
      };

      const result = weddingInviteSchema.safeParse(dataWithOptional);

      expect(result.success).toBe(true);
    });

    it('inviteDataSchema: 여러 타입 구분', () => {
      const weddingData = {
        type: 'wedding',
        groomName: '김철수',
        brideName: '이영희',
        eventDate: '2026-12-25',
        eventTime: '15:30',
        venueName: '웨딩홀',
        venueAddress: '서울시',
      };

      const doljanchiData = {
        type: 'doljanchi',
        babyName: '김도윤',
        babyGender: 'male',
        birthDate: '2025-06-01',
        parentNames: '김철수, 이영희',
        eventDate: '2026-06-01',
        eventTime: '12:00',
        venueName: '연회장',
        venueAddress: '서울시',
      };

      expect(inviteDataSchema.safeParse(weddingData).success).toBe(true);
      expect(inviteDataSchema.safeParse(doljanchiData).success).toBe(true);
    });
  });
});
