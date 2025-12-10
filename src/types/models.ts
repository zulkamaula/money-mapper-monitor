// src/types/models.ts

// New Schema Types
export interface MoneyBook {
  id: string
  user_id: string
  name: string
  created_at?: string
}

export interface Pocket {
  id: string
  money_book_id: string
  name: string
  percentage: number
  order_index: number
}

export interface AllocationItem {
  id: string
  allocation_id: string
  pocket_id: string
  pocket_name: string
  pocket_percentage: number
  amount: number
}

export interface Allocation {
  id: string
  money_book_id: string
  source_amount: number
  date: string // YYYY-MM-DD
  notes?: string
  created_at?: string
  allocation_items?: AllocationItem[]
}

// Old Schema Types (deprecated - will be removed)
export interface Envelope {
  id: string
  user_id: string
  name: string
  color: string
  balance: number
  created_at?: string
}

export interface MappingItem {
  id: string
  mapping_id: string
  envelope_id: string
  amount: number
}

export interface Mapping {
  id: string
  user_id?: string
  date: string // YYYY-MM-DD
  from_amount: number
  notes?: string
  created_at?: string
  mapping_items?: MappingItem[]
}
