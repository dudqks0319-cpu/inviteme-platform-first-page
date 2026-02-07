import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

// ============ 날짜 포맷팅 ============

/**
 * 날짜를 한국어 형식으로 포맷팅
 * @example formatDate('2026-06-15') => '2026년 06월 15일'
 */
export function formatDate(dateString: string): string {
  // TODO: TDD로 구현
  throw new Error('Not implemented');
}

/**
 * 날짜를 요일 포함 형식으로 포맷팅
 * @example formatDateWithDay('2026-06-15') => '2026년 06월 15일 (월)'
 */
export function formatDateWithDay(dateString: string): string {
  // TODO: TDD로 구현
  throw new Error('Not implemented');
}

/**
 * 시간을 오전/오후 형식으로 포맷팅
 * @example formatTime('14:30') => '오후 2시 30분'
 */
export function formatTime(timeString: string): string {
  // TODO: TDD로 구현
  throw new Error('Not implemented');
}

/**
 * D-Day 계산
 * @example calculateDday('2026-06-15') => 'D-150' (오늘이 2026-01-16인 경우)
 */
export function calculateDday(dateString: string): string {
  // TODO: TDD로 구현
  throw new Error('Not implemented');
}

// ============ 전화번호 포맷팅 ============

/**
 * 전화번호를 하이픈 형식으로 포맷팅
 * @example formatPhone('01012345678') => '010-1234-5678'
 */
export function formatPhone(phone: string): string {
  // TODO: TDD로 구현
  throw new Error('Not implemented');
}

/**
 * 하이픈이 포함된 전화번호에서 숫자만 추출
 * @example unformatPhone('010-1234-5678') => '01012345678'
 */
export function unformatPhone(phone: string): string {
  // TODO: TDD로 구현
  throw new Error('Not implemented');
}

// ============ 주소 포맷팅 ============

/**
 * 주소를 줄바꿈 형식으로 포맷팅
 * @example formatAddress('서울시 강남구 테헤란로 123, 4층')
 *   => '서울시 강남구 테헤란로 123\n4층'
 */
export function formatAddress(address: string): string {
  // TODO: TDD로 구현
  throw new Error('Not implemented');
}
