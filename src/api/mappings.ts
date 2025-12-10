// src/api/mappings.ts
import { supabase } from '../lib/supabase'
import { v4 as uuid } from 'uuid'
import type { Mapping, MappingItem } from '../types/models'

export async function createMapping(userId: string, entry: {
  date: string
  fromAmount: number
  notes?: string
  items: { envelopeId: string; amount: number }[]
}): Promise<string> {
  const mappingId = uuid()
  const header: Omit<Mapping, 'mapping_items'> = {
    id: mappingId,
    user_id: userId,
    date: entry.date,
    from_amount: entry.fromAmount,
    notes: entry.notes
  }
  const { error: e1 } = await supabase.from('mappings').insert(header)
  if (e1) throw e1

  const detail: MappingItem[] = entry.items.map((it) => ({
    id: uuid(),
    mapping_id: mappingId,
    envelope_id: it.envelopeId,
    amount: it.amount
  }))
  const { error: e2 } = await supabase.from('mapping_items').insert(detail)
  if (e2) throw e2

  // Saldo envelope akan bertambah via trigger di DB
  return mappingId
}

export async function listMappings(): Promise<Mapping[]> {
  const { data, error } = await supabase
    .from('mappings')
    .select('id,date,from_amount,notes,mapping_items(id,mapping_id,envelope_id,amount)')
    .order('date', { ascending: false })
  if (error) throw error
  return data ?? []
}
