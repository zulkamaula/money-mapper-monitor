// src/api/envelopes.ts
import { supabase } from '../lib/supabase'
import { v4 as uuid } from 'uuid'
import type { Envelope } from '../types/models'

export async function listEnvelopes(): Promise<Envelope[]> {
  const { data, error } = await supabase
    .from('envelopes')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function addEnvelope(userId: string, payload: { name: string; color?: string; balance?: number }): Promise<Envelope> {
  const row: Envelope = {
    id: uuid(),
    user_id: userId,
    name: payload.name,
    color: payload.color ?? '#4CAF50',
    balance: payload.balance ?? 0
  }
  const { error } = await supabase.from('envelopes').insert(row)
  if (error) throw error
  return row
}

export async function updateEnvelope(envelope: Pick<Envelope, 'id' | 'name' | 'color' | 'balance'>): Promise<void> {
  const { error } = await supabase
    .from('envelopes')
    .update({ name: envelope.name, color: envelope.color, balance: envelope.balance })
    .eq('id', envelope.id)
  if (error) throw error
}

export async function deleteEnvelope(id: string): Promise<void> {
  const { error } = await supabase.from('envelopes').delete().eq('id', id)
  if (error) throw error
}
