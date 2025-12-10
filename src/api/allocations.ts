// src/api/allocations.ts
import { supabase } from '../lib/supabase'
import type { Allocation, AllocationItem, Pocket } from '../types/models'
import { v4 as uuid } from 'uuid'

export async function listAllocations(moneyBookId: string): Promise<Allocation[]> {
  const { data, error } = await supabase
    .from('allocations')
    .select(`
      *,
      allocation_items(*)
    `)
    .eq('money_book_id', moneyBookId)
    .order('date', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function getAllocation(id: string): Promise<Allocation | null> {
  const { data, error } = await supabase
    .from('allocations')
    .select(`
      *,
      allocation_items(*)
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

interface CreateAllocationInput {
  moneyBookId: string
  sourceAmount: number
  date: string
  notes?: string
  pockets: Pocket[]
}

/**
 * Calculate allocation amounts from pockets and source amount
 * Uses floor rounding for each pocket, then distributes remainder to first pockets
 */
export function calculateAllocationAmounts(
  sourceAmount: number,
  pockets: Pocket[]
): { pocketId: string; amount: number }[] {
  const results: { pocketId: string; amount: number }[] = []
  let totalAllocated = 0

  // Calculate floor amounts for each pocket
  for (const pocket of pockets) {
    const exactAmount = (sourceAmount * pocket.percentage) / 100
    const floorAmount = Math.floor(exactAmount)
    results.push({ pocketId: pocket.id, amount: floorAmount })
    totalAllocated += floorAmount
  }

  // Distribute remainder to first pockets (one by one)
  let remainder = sourceAmount - totalAllocated
  let index = 0
  while (remainder > 0 && index < results.length) {
    const item = results[index]
    if (item) {
      item.amount += 1
    }
    remainder -= 1
    index += 1
  }

  return results
}

export async function createAllocation(input: CreateAllocationInput): Promise<Allocation> {
  const allocationId = uuid()

  // Calculate amounts for each pocket
  const calculatedAmounts = calculateAllocationAmounts(input.sourceAmount, input.pockets)

  // Create allocation record
  const newAllocation: Omit<Allocation, 'allocation_items'> = {
    id: allocationId,
    money_book_id: input.moneyBookId,
    source_amount: input.sourceAmount,
    date: input.date,
    notes: input.notes,
    created_at: new Date().toISOString()
  }

  const { data: allocationData, error: allocationError } = await supabase
    .from('allocations')
    .insert(newAllocation)
    .select()
    .single()

  if (allocationError) throw allocationError

  // Create allocation items (snapshot of pockets)
  const allocationItems: Omit<AllocationItem, 'id'>[] = input.pockets.map((pocket) => {
    const calculated = calculatedAmounts.find((c) => c.pocketId === pocket.id)
    if (!calculated) {
      throw new Error(`Calculated amount not found for pocket ${pocket.id}`)
    }
    return {
      allocation_id: allocationId,
      pocket_id: pocket.id,
      pocket_name: pocket.name,
      pocket_percentage: pocket.percentage,
      amount: calculated.amount
    }
  })

  const itemsWithIds = allocationItems.map((item) => ({
    id: uuid(),
    ...item
  }))

  const { error: itemsError } = await supabase
    .from('allocation_items')
    .insert(itemsWithIds)

  if (itemsError) throw itemsError

  // Return full allocation with items
  return {
    ...allocationData,
    allocation_items: itemsWithIds
  }
}

export async function deleteAllocation(id: string): Promise<void> {
  // Delete allocation (cascade will delete items)
  const { error } = await supabase.from('allocations').delete().eq('id', id)

  if (error) throw error
}
