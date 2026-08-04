import { describe, expect, it } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it('joins truthy classes and drops falsy values', () => {
    expect(cn('a', 'b', null, undefined, false, '')).toBe('a b')
    expect(cn()).toBe('')
  })
})
