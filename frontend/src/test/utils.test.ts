import { describe, it, expect } from 'vitest'
import { formatDate, formatTime, getStatusColor, cn } from '../lib/utils'

describe('formatDate', () => {
  it('should format date string', () => {
    const result = formatDate('2026-04-09')
    expect(result).toContain('9')
    expect(result).toContain('abr')
  })

  it('should format Date object', () => {
    const result = formatDate(new Date('2026-04-09'))
    expect(result).toContain('9')
  })
})

describe('formatTime', () => {
  it('should format time from ISO string', () => {
    const result = formatTime('2026-04-09T14:30:00')
    expect(result).toMatch(/\d{1,2}:\d{2}/)
  })
})

describe('getStatusColor', () => {
  it('should return yellow for pending', () => {
    expect(getStatusColor('pending')).toBe('bg-yellow-100 text-yellow-800')
  })

  it('should return green for confirmed', () => {
    expect(getStatusColor('confirmed')).toBe('bg-green-100 text-green-800')
  })

  it('should return gray for completed', () => {
    expect(getStatusColor('completed')).toBe('bg-gray-100 text-gray-800')
  })

  it('should return red for cancelled', () => {
    expect(getStatusColor('cancelled')).toBe('bg-red-100 text-red-800')
  })

  it('should return default gray for unknown status', () => {
    expect(getStatusColor('unknown')).toBe('bg-gray-100 text-gray-800')
  })
})

describe('cn', () => {
  it('should merge class names', () => {
    const result = cn('bg-red-500', 'text-white')
    expect(result).toContain('bg-red-500')
    expect(result).toContain('text-white')
  })

  it('should handle conditional classes', () => {
    const isActive = true
    const result = cn('base-class', isActive && 'active-class')
    expect(result).toContain('base-class')
    expect(result).toContain('active-class')
  })
})