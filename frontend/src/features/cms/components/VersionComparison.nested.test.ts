import { describe, it, expect } from 'vitest'
import { arrayDiffById, findIdKey } from './VersionComparison'

describe('VersionComparison nested object diffs', () => {
  it('detects modified nested fields inside array items', () => {
    const cur = [
      { id: 'a', name: 'Alpha', details: { severity: 'high', onset: { days: 5 } } },
      { id: 'b', name: 'Beta', details: { severity: 'low' } },
    ]
    const prev = [
      { id: 'a', name: 'Alpha', details: { severity: 'moderate', onset: { days: 3 } } },
      { id: 'c', name: 'Gamma', details: { severity: 'low' } },
    ]

    const res = arrayDiffById(cur, prev) as any
    expect(res.idKey).toBe('id')

    // modified should include 'a' with nested changes
    const modified = res.modified
    expect(Array.isArray(modified)).toBe(true)
    const modA = modified.find((m: any) => m.id === 'a')
    expect(modA).toBeDefined()
    expect(modA.previous.details.onset.days).toBe(3)
    expect(modA.current.details.onset.days).toBe(5)
    expect(modA.previous.details.severity).toBe('moderate')
    expect(modA.current.details.severity).toBe('high')

    // added should include 'b'
    expect(res.added.map((x: any) => x.id)).toContain('b')
    // removed should include 'c'
    expect(res.removed.map((x: any) => x.id)).toContain('c')
  })

  it('findIdKey locates keys inside array elements even when nested shapes vary', () => {
    const arr = [{ meta: { uuid: 'u1' }, name: 'X' }, { id: 'b', name: 'B' }]
    // findIdKey scans array and should find 'uuid' or 'id' (first found)
    const key = findIdKey(arr)
    expect(['uuid', 'id', 'code', 'slug', 'key']).toContain(key)
  })
})
