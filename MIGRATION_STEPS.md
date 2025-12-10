# Migration Steps - Fix Money Books Issue

## 🔴 Root Cause

Money books tidak muncul setelah refresh karena **foreign key constraint** ke `auth.users` yang **tidak accessible** dari client.

## Issue di Schema Lama:

```sql
user_id uuid not null references auth.users(id) on delete cascade
```

## ✅ Fix:

```sql
user_id uuid not null references public.profiles(id) on delete cascade
```

---

## Migration Steps

### Step 1: Backup Data (PENTING!)

```sql
-- Backup money_books
CREATE TABLE money_books_backup AS SELECT * FROM public.money_books;

-- Backup pockets
CREATE TABLE pockets_backup AS SELECT * FROM public.pockets;

-- Backup allocations
CREATE TABLE allocations_backup AS SELECT * FROM public.allocations;

-- Backup allocation_items
CREATE TABLE allocation_items_backup AS SELECT * FROM public.allocation_items;
```

### Step 2: Drop Existing Tables (CASCADE)

```sql
-- Drop in reverse dependency order
DROP TABLE IF EXISTS public.allocation_items CASCADE;
DROP TABLE IF EXISTS public.allocations CASCADE;
DROP TABLE IF EXISTS public.pockets CASCADE;
DROP TABLE IF EXISTS public.money_books CASCADE;
```

### Step 3: Run Fixed Schema

Run the entire `supabase_schema_FIXED.sql` file in Supabase SQL Editor.

### Step 4: Restore Data (if you have backup data)

```sql
-- Restore money_books
INSERT INTO public.money_books (id, user_id, name, created_at)
SELECT id, user_id, name, created_at
FROM money_books_backup;

-- Restore pockets
INSERT INTO public.pockets (id, money_book_id, name, percentage, order_index)
SELECT id, money_book_id, name, percentage, order_index
FROM pockets_backup;

-- Restore allocations
INSERT INTO public.allocations (id, money_book_id, source_amount, date, notes, created_at)
SELECT id, money_book_id, source_amount, date, notes, created_at
FROM allocations_backup;

-- Restore allocation_items
INSERT INTO public.allocation_items (id, allocation_id, pocket_id, pocket_name, pocket_percentage, amount)
SELECT id, allocation_id, pocket_id, pocket_name, pocket_percentage, amount
FROM allocation_items_backup;
```

### Step 5: Verify

```sql
-- Check profiles exist
SELECT id, created_at FROM public.profiles;

-- Check money_books
SELECT * FROM public.money_books;

-- Test insert
INSERT INTO public.money_books (id, user_id, name)
VALUES (gen_random_uuid(), auth.uid(), 'Test Book');

-- Test RLS
SELECT * FROM public.money_books WHERE user_id = auth.uid();
```

---

## Alternative: Clean Start (No Data Loss if DB is Empty)

If you haven't created important data yet:

1. Go to Supabase Dashboard → SQL Editor
2. Run this:

```sql
-- Drop all tables
DROP TABLE IF EXISTS public.allocation_items CASCADE;
DROP TABLE IF EXISTS public.allocations CASCADE;
DROP TABLE IF EXISTS public.pockets CASCADE;
DROP TABLE IF EXISTS public.money_books CASCADE;
```

3. Run the entire `supabase_schema_FIXED.sql`

---

## Frontend Changes Made

### Dashboard.vue Updates:

✅ **Added auth state waiting**

- Wait for auth.loading to complete before loading data
- Prevents race condition where user ID not ready yet

✅ **Added error handling & debugging**

- Console logs to track user ID and API calls
- Notification on load failures

✅ **Better error messages**

- Shows specific errors in console and notifications

---

## Testing After Migration

1. **Refresh browser** with DevTools Console open (F12)
2. **Look for logs:**
   - "Loading dashboard for user: [UUID]"
   - "Fetching money books for user: [UUID]"
   - "Loaded money books: [count]"

3. **Create new money book:**
   - Should appear immediately
   - Should persist after refresh
4. **Check browser console for errors:**
   - No "permission denied" errors
   - No "foreign key constraint" errors

---

## Expected Console Output (Success):

```
Loading dashboard for user: 123e4567-e89b-12d3-a456-426614174000
Fetching money books for user: 123e4567-e89b-12d3-a456-426614174000
Loaded money books: 2
```

## Error Output (If Still Failing):

```
Error loading money books: Error: new row for relation "money_books" violates foreign key constraint
```

↑ This means schema not updated yet.

---

## Quick Verification Queries

Run in Supabase SQL Editor:

```sql
-- 1. Check table structure
\d public.money_books

-- 2. Check foreign key constraints
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'money_books';

-- Expected: user_id should reference public.profiles(id), not auth.users(id)
```
