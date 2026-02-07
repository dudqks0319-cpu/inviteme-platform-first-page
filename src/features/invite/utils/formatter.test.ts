import { describe, expect, it } from 'vitest';
import {
  calculateDday,
  formatAddress,
  formatDate,
  formatDateWithDay,
  formatPhone,
  formatTime,
  unformatPhone,
} from './formatter';

describe('포맷터 유틸리티', () => {
  describe('formatDate', () => {
    it('날짜를 한국어 형식으로 포맷팅해야 함', () => {
      expect(formatDate('2026-06-15')).toBe('2026년 06월 15일');
      expect(formatDate('2026-01-01')).toBe('2026년 01월 01일');
      expect(formatDate('2026-12-31')).toBe('2026년 12월 31일');
    });
  });

  describe('formatDateWithDay', () => {
    it('날짜를 요일 포함 형식으로 포맷팅해야 함', () => {
      // 2026-06-15는 월요일
      expect(formatDateWithDay('2026-06-15')).toBe('2026년 06월 15일 (월)');
    });

    it('다른 요일도 올바르게 포맷팅해야 함', () => {
      // 2026-02-07은 토요일
      expect(formatDateWithDay('2026-02-07')).toBe('2026년 02월 07일 (토)');
    });
  });

  describe('formatTime', () => {
    it('오전 시간을 올바르게 포맷팅해야 함', () => {
      expect(formatTime('09:00')).toBe('오전 9시');
      expect(formatTime('09:30')).toBe('오전 9시 30분');
      expect(formatTime('11:45')).toBe('오전 11시 45분');
    });

    it('정오를 올바르게 포맷팅해야 함', () => {
      expect(formatTime('12:00')).toBe('오후 12시');
    });

    it('오후 시간을 올바르게 포맷팅해야 함', () => {
      expect(formatTime('14:00')).toBe('오후 2시');
      expect(formatTime('18:30')).toBe('오후 6시 30분');
      expect(formatTime('23:59')).toBe('오후 11시 59분');
    });

    it('분이 00일 때 생략해야 함', () => {
      expect(formatTime('15:00')).toBe('오후 3시');
    });
  });

  describe('calculateDday', () => {
    it('미래 날짜에 대해 D-day를 계산해야 함', () => {
      const today = new Date('2026-01-01');
      const futureDate = '2026-01-31';

      // Mock 시간 설정이 없으므로 실제 날짜 차이로 테스트
      const result = calculateDday(futureDate);

      expect(result).toMatch(/^D-\d+$/);
    });

    it('오늘 날짜는 D-Day여야 함', () => {
      const today = new Date().toISOString().split('T')[0];

      const result = calculateDday(today);

      expect(result).toBe('D-Day');
    });

    it('과거 날짜는 D+로 표시해야 함', () => {
      const pastDate = '2020-01-01';

      const result = calculateDday(pastDate);

      expect(result).toMatch(/^D\+\d+$/);
    });
  });

  describe('formatPhone', () => {
    it('숫자만 있는 전화번호를 하이픈 형식으로 변환해야 함', () => {
      expect(formatPhone('01012345678')).toBe('010-1234-5678');
      expect(formatPhone('01098765432')).toBe('010-9876-5432');
    });

    it('이미 하이픈이 있는 전화번호는 그대로 반환해야 함', () => {
      expect(formatPhone('010-1234-5678')).toBe('010-1234-5678');
    });

    it('빈 문자열은 빈 문자열을 반환해야 함', () => {
      expect(formatPhone('')).toBe('');
    });
  });

  describe('unformatPhone', () => {
    it('하이픈을 제거하고 숫자만 반환해야 함', () => {
      expect(unformatPhone('010-1234-5678')).toBe('01012345678');
      expect(unformatPhone('010-9876-5432')).toBe('01098765432');
    });

    it('숫자만 있는 전화번호는 그대로 반환해야 함', () => {
      expect(unformatPhone('01012345678')).toBe('01012345678');
    });

    it('빈 문자열은 빈 문자열을 반환해야 함', () => {
      expect(unformatPhone('')).toBe('');
    });
  });

  describe('formatAddress', () => {
    it('쉼표를 줄바꿈으로 변환해야 함', () => {
      expect(formatAddress('서울시 강남구 테헤란로 123, 4층')).toBe(
        '서울시 강남구 테헤란로 123\n4층'
      );
    });

    it('쉼표가 없으면 그대로 반환해야 함', () => {
      expect(formatAddress('서울시 강남구 테헤란로 123')).toBe(
        '서울시 강남구 테헤란로 123'
      );
    });

    it('여러 개의 쉼표를 모두 줄바꿈으로 변환해야 함', () => {
      expect(formatAddress('서울시 강남구 테헤란로 123, 그랜드빌딩, 4층')).toBe(
        '서울시 강남구 테헤란로 123\n그랜드빌딩\n4층'
      );
    });
  });
});
