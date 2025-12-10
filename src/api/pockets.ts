// src/api/pockets.ts
import { supabase } from '../lib/supabase'
import type { Pocket } from '../types/models'
import { v4 as uuid } from 'uuid'

export async function listPockets(moneyBookId: string): Promise<Pocket[]> {
    const { data, error } = await supabase
        .from('pockets')
        .select('*')
        .eq('money_book_id', moneyBookId)
        .order('order_index', { ascending: true })

    if (error) throw error
    return data ?? []
}

export async function createPocket(
    moneyBookId: string,
    name: string,
    percentage: number,
    orderIndex: number
): Promise<Pocket> {
    const newPocket: Pocket = {
        id: uuid(),
        money_book_id: moneyBookId,
        name,
        percentage,
        order_index: orderIndex
    }

    const { data, error } = await supabase
        .from('pockets')
        .insert(newPocket)
        .select()
        .single()

    if (error) throw error
    return data
}

export async function updatePocket(
    id: string,
    name: string,
    percentage: number,
    orderIndex: number
): Promise<Pocket> {
    const { data, error } = await supabase
        .from('pockets')
        .update({ name, percentage, order_index: orderIndex })
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data
}

export async function deletePocket(id: string): Promise<void> {
    const { error } = await supabase
        .from('pockets')
        .delete()
        .eq('id', id)

    if (error) throw error
}

export async function updatePocketsOrder(pockets: Pocket[]): Promise<void> {
    const updates = pockets.map((pocket, index) => ({
        id: pocket.id,
        order_index: index
    }))

    for (const update of updates) {
        const { error } = await supabase
            .from('pockets')
            .update({ order_index: update.order_index })
            .eq('id', update.id)

        if (error) throw error
    }
}

// Frontend validation helper
export function validatePocketPercentages(pockets: Pocket[]): { valid: boolean; total: number } {
    const total = pockets.reduce((sum, pocket) => sum + pocket.percentage, 0)
    return {
        valid: Math.abs(total - 100) < 0.01, // Allow tiny floating point errors
        total
    }
}
