import { describe, it, expect } from 'vitest'
import { arrayDiffById, findIdKey } from './VersionComparison'

describe('VersionComparison helpers', () => {
  it('finds id key in object and arrays', () => {
    const obj = { id: 'a', name: 'A' }
    expect(findIdKey(obj)).toBe('id')

    const arr = [{ name: 'x' }, { code: 'c1' }]
    expect(findIdKey(arr)).toBe('code')

    const none = [{ name: 'x' }, { title: 't' }]
    expect(findIdKey(none)).toBeNull()
  })

  it('diffs arrays of objects by id and detects modified entries', () => {
    const cur = [
      { id: 'a', name: 'Alpha v2', severity: 'high' },
      { id: 'b', name: 'Beta' },
    ]
    const prev = [
      { id: 'a', name: 'Alpha v1', severity: 'low' },
      { id: 'c', name: 'Gamma' },
    ]

    const res = arrayDiffById(cur, prev) as any
    // added: b
    expect(res.added).toHaveLength(1)
    expect(res.added[0].id).toBe('b')
    // removed: c
    expect(res.removed).toHaveLength(1)
    expect(res.removed[0].id).toBe('c')
    // modified: a
    expect(res.modified).toHaveLength(1)
    expect(res.modified[0].id).toBe('a')
    expect(res.modified[0].previous.name).toBe('Alpha v1')
    expect(res.modified[0].current.name).toBe('Alpha v2')
    expect(res.idKey).toBe('id')
  })

  it('diffs arrays of primitives', () => {
    const cur = [1, 2]
    const prev = [2, 3]
    const res = arrayDiffById(cur as any[], prev as any[]) as any
    expect(res.added).toEqual([1])
    expect(res.removed).toEqual([3])
    expect(res.idKey).toBeNull()
  })
})
