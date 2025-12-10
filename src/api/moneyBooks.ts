// src/api/moneyBooks.ts
import { supabase } from '../lib/supabase'
import type { MoneyBook } from '../types/models'
import { v4 as uuid } from 'uuid'

export async function listMoneyBooks(userId: string): Promise<MoneyBook[]> {
    const { data, error } = await supabase
        .from('money_books')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data ?? []
}

export async function getMoneyBook(id: string): Promise<MoneyBook | null> {
    const { data, error } = await supabase
        .from('money_books')
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error
    return data
}

export async function createMoneyBook(userId: string, name: string): Promise<MoneyBook> {
    const newBook: MoneyBook = {
        id: uuid(),
        user_id: userId,
        name,
        created_at: new Date().toISOString()
    }

    const { data, error } = await supabase
        .from('money_books')
        .insert(newBook)
        .select()
        .single()

    if (error) throw error
    return data
}

export async function updateMoneyBook(id: string, name: string): Promise<MoneyBook> {
    const { data, error } = await supabase
        .from('money_books')
        .update({ name })
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data
}

export async function deleteMoneyBook(id: string): Promise<void> {
    const { error } = await supabase
        .from('money_books')
        .delete()
        .eq('id', id)

    if (error) throw error
}
