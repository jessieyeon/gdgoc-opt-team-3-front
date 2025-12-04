import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Fact-Check 정확도를 등급으로 변환
 * @param {number} accuracy - 정확도 (0-100)
 * @param {number} criticalCount - critical 오류 개수
 * @returns {string} S, A, 또는 B 등급
 */
export function getAccuracyGrade(accuracy, criticalCount = 0) {
  if (criticalCount > 0) {
    return 'B'
  }
  if (accuracy >= 90) {
    return 'S'
  }
  if (accuracy >= 70) {
    return 'A'
  }
  return 'B'
}

/**
 * AI 서비스의 grade를 등급으로 변환
 * @param {string} grade - AI 서비스의 grade (excellent, good, poor, needs_revision)
 * @returns {string} S, A, 또는 B 등급
 */
export function convertGradeToLetter(grade) {
  const gradeMap = {
    excellent: 'S',
    good: 'A',
    poor: 'B',
    needs_revision: 'B',
  }
  return gradeMap[grade] || 'B'
}

/**
 * 등급에 따른 색상 클래스 반환
 * @param {string} grade - S, A, 또는 B
 * @returns {string} Tailwind CSS 클래스
 */
export function getGradeColorClass(grade) {
  const colorMap = {
    S: 'text-green-600 bg-green-50 border-green-200',
    A: 'text-blue-600 bg-blue-50 border-blue-200',
    B: 'text-orange-600 bg-orange-50 border-orange-200',
  }
  return colorMap[grade] || colorMap.B
}
