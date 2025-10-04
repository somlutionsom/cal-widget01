/**
 * 유틸리티 함수들
 * FE 리드: 재사용 가능한 헬퍼 함수
 * PM/UX: 날짜 및 캘린더 관련 유틸리티
 */

import { DateInfo, CalendarEvent } from './types';

// 날짜 관련 유틸리티
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

// 캘린더 생성 유틸리티
export function generateCalendarDays(year: number, month: number): DateInfo[] {
  const firstDay = new Date(year, month, 1);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  
  const days: DateInfo[] = [];
  const currentDate = new Date(startDate);
  
  // 6주 * 7일 = 42일 생성
  for (let i = 0; i < 42; i++) {
    const date = new Date(currentDate);
    days.push({
      date,
      dateString: formatDate(date),
      isToday: isToday(date),
      isCurrentMonth: date.getMonth() === month,
      isWeekend: isWeekend(date),
      events: [],
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return days;
}

// 이벤트를 날짜별로 그룹화
export function groupEventsByDate(events: CalendarEvent[]): Map<string, CalendarEvent[]> {
  const grouped = new Map<string, CalendarEvent[]>();
  
  for (const event of events) {
    const existing = grouped.get(event.date) || [];
    existing.push(event);
    grouped.set(event.date, existing);
  }
  
  return grouped;
}

// 월 이름 가져오기
export function getMonthName(month: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month];
}

// 요일 이름 가져오기
export function getWeekdayNames(short = false): string[] {
  if (short) {
    return ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  }
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
}

// 디바운스 함수
export function debounce<T extends (...args: never[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function (...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

// 클래스명 조합 유틸리티
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

// 에러 메시지 포맷팅
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
}

// 상대 시간 포맷팅
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays === -1) return 'Tomorrow';
  if (diffInDays > 0 && diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 0 && diffInDays > -7) return `In ${Math.abs(diffInDays)} days`;
  
  return formatDate(date);
}

// 안전한 JSON 파싱
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

// URL 생성 유틸리티
export function buildUrl(base: string, params: Record<string, string | number | boolean>): string {
  const url = new URL(base);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });
  return url.toString();
}

