export const bodySystems = [
  { id: 'cardiovascular', name: 'Cardiovascular', icon: 'heart-pulse', colorHex: '#ef4444' },
  { id: 'respiratory', name: 'Respiratory', icon: 'wind', colorHex: '#3b82f6' },
  { id: 'neurology', name: 'Neurological', icon: 'brain', colorHex: '#a855f7' },
  { id: 'kidneys', name: 'Kidneys', icon: 'kidney', colorHex: '#14b8a8' },
  { id: 'liver', name: 'Liver', icon: 'liver', colorHex: '#eab308' },
  { id: 'digestive', name: 'Digestive', icon: 'heart-hand', colorHex: '#84cc16' },
  { id: 'endocrine', name: 'Endocrine', icon: 'activity', colorHex: '#a855f7' },
  { id: 'mental', name: 'Mental Health', icon: 'brain-circuit', colorHex: '#8b5cf6' },
  { id: 'musculoskeletal', name: 'Musculoskeletal', icon: 'bone', colorHex: '#d97706' },
  { id: 'eyes', name: 'Eyes', icon: 'eye', colorHex: '#06b6d4' },
  { id: 'skin', name: 'Skin', icon: 'skin', colorHex: '#d4a574' },
  { id: 'hormonal', name: 'Hormonal', icon: 'activity', colorHex: '#ec4899' },
] as const satisfies readonly {
  id: string
  name: string
  icon: string
  colorHex: string
}[]
