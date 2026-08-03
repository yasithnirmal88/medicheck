import React from 'react'
import { FormField, SearchInput } from './ContentLayout'
import { Plus, X } from 'lucide-react'

type SearchableEntity = {
  id: string
  name?: string
  title?: string
  code?: string
}

interface EntitySearchSelectorProps<T extends SearchableEntity> {
  label: string
  selected: T[]
  onAdd: (item: T) => void
  onRemove: (item: T) => void
  searchValue: string
  onSearchChange: (value: string) => void
  results: T[]
  loading?: boolean
  placeholder?: string
}

export function EntitySearchSelector<T extends SearchableEntity>({
  label,
  selected,
  onAdd,
  onRemove,
  searchValue,
  onSearchChange,
  results,
  loading = false,
  placeholder,
}: EntitySearchSelectorProps<T>) {
  const renderLabel = (item: T) => item.name || item.title || item.code || item.id

  return (
    <FormField label={label}>
      <SearchInput value={searchValue} onChange={onSearchChange} placeholder={placeholder || `Search ${label.toLowerCase()}...`} />
      <div className="mt-3 flex flex-wrap gap-2">
        {selected.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onRemove(item)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs"
          >
            <span>{renderLabel(item)}</span>
            <X className="w-3 h-3" />
          </button>
        ))}
      </div>

      <div className="mt-3 space-y-2 max-h-52 overflow-y-auto">
        {loading ? (
          <p className="text-sm text-slate-500">Loading suggestions...</p>
        ) : results.length ? (
          results.map((item) => {
            const labelText = renderLabel(item)
            const alreadySelected = selected.some((selectedItem) => selectedItem.id === item.id)
            return (
              <div key={item.id} className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{labelText}</p>
                  {item.code && <p className="text-xs text-slate-500 dark:text-slate-400">{item.code}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => onAdd(item)}
                  disabled={alreadySelected}
                  className="px-2 py-1 text-xs font-medium rounded-lg transition text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {alreadySelected ? 'Added' : 'Add'}
                </button>
              </div>
            )
          })
        ) : (
          <p className="text-sm text-slate-500">No results found. Try a different term.</p>
        )}
      </div>
    </FormField>
  )
}

export default React.memo(EntitySearchSelector)
