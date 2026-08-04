import { describe, expect, it } from 'vitest'
import { bmiCategory, bmiCategoryTone, calcAge, calcBMI, calcIdealWeight, calcWaistHipRatio, computeMetrics } from './calculate'

describe('calcAge', () => {
  it('returns null for empty or invalid input', () => {
    expect(calcAge()).toBeNull()
    expect(calcAge('not-a-date')).toBeNull()
  })

  it('computes full years from date of birth', () => {
    const past = new Date()
    past.setFullYear(past.getFullYear() - 30)
    past.setMonth(past.getMonth() - 1)
    expect(calcAge(past.toISOString().slice(0, 10))).toBe(30)
  })
})

describe('calcBMI', () => {
  it('returns null when inputs are missing', () => {
    expect(calcBMI(null, 170)).toBeNull()
    expect(calcBMI(70, null)).toBeNull()
  })

  it('computes BMI rounded to one decimal', () => {
    // 70kg / 1.75m^2 = 22.857... -> 22.9
    expect(calcBMI(70, 175)).toBe(22.9)
  })
})

describe('bmiCategory', () => {
  it('maps categories by threshold', () => {
    expect(bmiCategory(null)).toBeNull()
    expect(bmiCategory(17)).toBe('Underweight')
    expect(bmiCategory(22)).toBe('Normal')
    expect(bmiCategory(27)).toBe('Overweight')
    expect(bmiCategory(32)).toBe('Obese')
  })
})

describe('bmiCategoryTone', () => {
  it('returns a tone per category', () => {
    expect(bmiCategoryTone('Normal').color).toBe('text-emerald-600')
    expect(bmiCategoryTone(null).color).toBe('text-emerald-600')
    expect(bmiCategoryTone('Overweight').color).toBe('text-amber-600')
    expect(bmiCategoryTone('Obese').color).toBe('text-red-500')
  })
})

describe('calcWaistHipRatio', () => {
  it('computes ratio rounded to two decimals', () => {
    expect(calcWaistHipRatio(80, 100)).toBe(0.8)
    expect(calcWaistHipRatio(null, 100)).toBeNull()
  })
})

describe('calcIdealWeight', () => {
  it('computes range for a height', () => {
    // 1.75m: 18.5*1.75^2=56.7, 24.9*1.75^2=76.3
    expect(calcIdealWeight(175)).toEqual({ min: 56.7, max: 76.3 })
    expect(calcIdealWeight(null)).toBeNull()
  })
})

describe('computeMetrics', () => {
  it('aggregates health metrics', () => {
    const result = computeMetrics({ heightCm: 175, weightKg: 70 })
    expect(result.bmi).toBe(22.9)
    expect(result.bmiCategory).toBe('Normal')
    expect(result.waistHipRatio).toBeNull()
  })
})