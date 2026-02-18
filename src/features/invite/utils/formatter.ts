import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

const normalizeDate = (value: string) => {
  return parseISO(`${value}T00:00:00`);
};

// ============ 날짜 포맷팅 ============

/**
 * 날짜를 한국어 형식으로 포맷팅
 * @example formatDate('2026-06-15') => '2026년 06월 15일'
 */
export function formatDate(dateString: string): string {
  const parsed = normalizeDate(dateString);
  return format(parsed, 'yyyy년 MM월 dd일', { locale: ko });
}

/**
 * 날짜를 요일 포함 형식으로 포맷팅
 * @example formatDateWithDay('2026-06-15') => '2026년 06월 15일 (월)'
 */
export function formatDateWithDay(dateString: string): string {
  const parsed = normalizeDate(dateString);
  return format(parsed, 'yyyy년 MM월 dd일 (E)', { locale: ko });
}

/**
 * 시간을 오전/오후 형식으로 포맷팅
 * @example formatTime('14:30') => '오후 2시 30분'
 */
export function formatTime(timeString: string): string {
  const [rawHour = '0', rawMinute = '0'] = timeString.split(':');
  const hour = Number.parseInt(rawHour, 10);
  const minute = Number.parseInt(rawMinute, 10);

  const period = hour < 12 ? '오전' : '오후';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;

  if (minute === 0) {
    return `${period} ${displayHour}시`;
  }

  return `${period} ${displayHour}시 ${minute}분`;
}

/**
 * D-Day 계산
 * @example calculateDday('2026-06-15') => 'D-150' (오늘이 2026-01-16인 경우)
 */
export function calculateDday(dateString: string): string {
  const targetDate = normalizeDate(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffMs = targetDate.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'D-Day';
  }

  if (diffDays > 0) {
    return `D-${diffDays}`;
  }

  return `D+${Math.abs(diffDays)}`;
}

// ============ 전화번호 포맷팅 ============

/**
 * 전화번호를 하이픈 형식으로 포맷팅
 * @example formatPhone('01012345678') => '010-1234-5678'
 */
export function formatPhone(phone: string): string {
  if (!phone) {
    return '';
  }

  if (/^010-\d{4}-\d{4}$/.test(phone)) {
    return phone;
  }

  const digits = phone.replaceAll(/\D/g, '');
  if (/^010\d{8}$/.test(digits)) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }

  return phone;
}

/**
 * 하이픈이 포함된 전화번호에서 숫자만 추출
 * @example unformatPhone('010-1234-5678') => '01012345678'
 */
export function unformatPhone(phone: string): string {
  if (!phone) {
    return '';
  }

  return phone.replaceAll(/\D/g, '');
}

// ============ 주소 포맷팅 ============

/**
 * 주소를 줄바꿈 형식으로 포맷팅
 * @example formatAddress('서울시 강남구 테헤란로 123, 4층')
 *   => '서울시 강남구 테헤란로 123\n4층'
 */
export function formatAddress(address: string): string {
  if (!address) {
    return '';
  }

  return address
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
    .join('\n');
}
