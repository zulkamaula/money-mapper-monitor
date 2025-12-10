# Component Structure Documentation

## 📂 Project Structure

```
src/
├── components/
│   ├── dashboard/              # Dashboard-specific components
│   │   ├── MoneyBookSelector.vue
│   │   ├── StatsCards.vue
│   │   ├── PocketsManager.vue
│   │   ├── AllocationsHistory.vue
│   │   └── AllocationDialog.vue
│   ├── AppNavbar.vue
│   ├── AppFooter.vue
│   ├── AppNotification.vue
│   └── ConfirmDialog.vue
├── views/
│   └── DashboardView.vue      # Main dashboard orchestrator
├── pages/
│   ├── Home.vue
│   ├── PrivacyPolicy.vue
│   └── Terms.vue
├── api/
│   ├── moneyBooks.ts
│   ├── pockets.ts
│   └── allocations.ts
├── stores/
│   ├── auth.ts
│   ├── notification.ts
│   └── dialog.ts
└── types/
    └── models.ts
```

---

## 🧩 Component Breakdown

### 1. **MoneyBookSelector.vue**

**Location:** `src/components/dashboard/MoneyBookSelector.vue`

**Purpose:** Manages money book selection, creation, editing, and deletion.

**Features:**

- ✅ Empty state with "Create a money book to get started" button
- ✅ Slide-down animation when showing selector
- ✅ Create input at top with auto-focus
- ✅ Horizontal scrollable book list at bottom
- ✅ Inline editing with keyboard shortcuts (Enter to save, Esc to cancel)
- ✅ Hover-to-reveal edit/delete buttons
- ✅ Custom scrollbar styling

**Props:**

```typescript
{
  books: MoneyBook[]
  selectedBook: MoneyBook | null
  loading?: boolean
  creatingBook?: boolean
}
```

**Emits:**

```typescript
{
  'select': (book: MoneyBook) => void
  'create': (name: string) => void
  'update': (book: MoneyBook, name: string) => void
  'delete': (book: MoneyBook) => void
}
```

**Usage:**

```vue
<MoneyBookSelector
  :books="moneyBooks"
  :selected-book="selectedBook"
  :creating-book="creatingBook"
  @select="selectBook"
  @create="handleCreateBook"
  @update="handleUpdateBook"
  @delete="handleDeleteBook"
/>
```

---

### 2. **StatsCards.vue**

**Location:** `src/components/dashboard/StatsCards.vue`

**Purpose:** Displays key statistics in a unified card with flex-column layout.

**Features:**

- ✅ Single card with 3 stats sections
- ✅ Vertical layout (flex-col)
- ✅ Dynamic percentage color (warning/success/error)
- ✅ Icon + value + label layout
- ✅ Dividers between sections

**Props:**

```typescript
{
  totalPockets: number
  totalPercentage: number
  totalAllocations: number
}
```

**Design:**

```
┌─────────────────────┐
│ 👛  3  Total Pockets │
│     [85.00%]         │
├─────────────────────┤
│ 📊  12  Total        │
│         Allocations  │
├─────────────────────┤
│ 📅  10  December     │
│         2024         │
└─────────────────────┘
```

---

### 3. **PocketsManager.vue**

**Location:** `src/components/dashboard/PocketsManager.vue`

**Purpose:** Manages pockets (budget categories) with CRUD operations.

**Features:**

- ✅ "New" button in card header (consistent with AllocationsHistory)
- ✅ Dialog for adding new pockets
- ✅ Inline editing for existing pockets
- ✅ Max-height with auto-scroll (400px)
- ✅ Custom scrollbar styling
- ✅ Empty state with icon
- ✅ Skeleton loaders during loading
- ✅ Validation: total percentage ≤ 100%
- ✅ Visual feedback for available percentage

**Props:**

```typescript
{
  pockets: Pocket[]
  loading?: boolean
}
```

**Emits:**

```typescript
{
  'create': (pocket: { name: string; percentage: number }) => void
  'update': (pocket: Pocket) => void
  'delete': (pocketId: string) => void
}
```

**Layout:**

```
┌──────────────────────────────┐
│ Pockets            [+ New]   │
├──────────────────────────────┤
│ ┌──────────────────────────┐ │
│ │ Emergency Fund  [25.00%] │ │ <- Auto scroll
│ │              ✏️ 🗑️       │ │    if content
│ └──────────────────────────┘ │    exceeds
│ ┌──────────────────────────┐ │    400px
│ │ Savings        [30.00%]  │ │
│ └──────────────────────────┘ │
└──────────────────────────────┘
```

---

### 4. **AllocationsHistory.vue**

**Location:** `src/components/dashboard/AllocationsHistory.vue`

**Purpose:** Displays allocation history with expandable details and copy feature.

**Features:**

- ✅ "New" button in card header
- ✅ Max-height with auto-scroll (400px)
- ✅ Expandable allocation items (click to expand)
- ✅ **Copy feature** for each amount (click icon to copy raw number)
- ✅ Visual feedback when copied (checkmark icon for 2 seconds)
- ✅ Smooth expand/collapse animation
- ✅ Shows pocket breakdown with percentages
- ✅ Optional notes display
- ✅ Delete button per allocation
- ✅ Skeleton loaders during loading
- ✅ Empty state

**Props:**

```typescript
{
  allocations: Allocation[]
  loading?: boolean
  isPercentageValid?: boolean
}
```

**Emits:**

```typescript
{
  'create': () => void
  'delete': (id: string) => void
}
```

**Layout:**

```
┌────────────────────────────────────┐
│ Recent Allocations      [+ New]    │
├────────────────────────────────────┤
│ ┌────────────────────────────────┐ │
│ │ Rp 5,000,000    🗑️ ⌄          │ │ <- Click to expand
│ │ 10 Dec 2024                    │ │
│ ├────────────────────────────────┤ │
│ │ Emergency  25%  Rp 1,250,000 📋│ │ <- Copy icon
│ │ Savings    30%  Rp 1,500,000 📋│ │
│ │ Bills      45%  Rp 2,250,000 📋│ │
│ └────────────────────────────────┘ │
└────────────────────────────────────┘
```

**Copy Feature:**

- Click copy icon → Copies raw number (e.g., `1250000`)
- Icon changes to checkmark (✓) for 2 seconds
- Uses `navigator.clipboard.writeText()`
- Error handling for copy failures

---

### 5. **AllocationDialog.vue**

**Location:** `src/components/dashboard/AllocationDialog.vue`

**Purpose:** Dialog for creating new allocations with live preview.

**Features:**

- ✅ Input for source amount, date, and notes
- ✅ Live preview of allocation calculation
- ✅ Shows breakdown by pocket with percentages
- ✅ Auto-calculates with floor rounding + remainder distribution
- ✅ Formatted currency display
- ✅ v-model for dialog visibility

**Props:**

```typescript
{
  modelValue: boolean
  pockets: Pocket[]
}
```

**Emits:**

```typescript
{
  'update:modelValue': (value: boolean) => void
  'save': (data: {
    sourceAmount: number
    date: string
    notes: string
  }) => void
}
```

**Usage:**

```vue
<AllocationDialog v-model="showDialog" :pockets="pockets" @save="handleCreateAllocation" />
```

---

### 6. **DashboardView.vue**

**Location:** `src/views/DashboardView.vue`

**Purpose:** Main orchestrator that composes all dashboard components.

**Responsibilities:**

- State management (books, pockets, allocations)
- API calls
- Event handling
- Loading states
- Error handling with notifications
- Confirmation dialogs

**Layout Structure:**

```
┌──────────────────────────────────────────┐
│ MoneyBookSelector (Full Width)           │
└──────────────────────────────────────────┘
┌───────────────┬──────────────────────────┐
│ Left Column   │ Right Column             │
│ (4/12 cols)   │ (8/12 cols)              │
│               │                          │
│ StatsCards    │ AllocationsHistory       │
│               │                          │
│ PocketsManager│                          │
│               │                          │
└───────────────┴──────────────────────────┘
```

**Responsive:**

- Desktop (≥960px): 2 columns (33% / 67%)
- Mobile (<960px): Stacked (100% width each)

---

## 🎨 Design Principles

### KISS (Keep It Simple, Stupid)

- Each component has a single, clear responsibility
- Props and emits are straightforward
- No complex state management within components

### DRY (Don't Repeat Yourself)

- Reusable components for common patterns
- Shared styling via scoped CSS
- Consistent patterns across all components

### Separation of Concerns

- **Views:** Orchestration and business logic
- **Components:** UI presentation and user interaction
- **API:** Data fetching and persistence
- **Stores:** Global state (auth, notifications, dialogs)

### Consistent UX Patterns

- All cards: Glass morphism with backdrop blur
- All scrollable areas: Max-height 400px with custom scrollbar
- All forms: Outlined variant text fields
- All buttons: Consistent sizing and colors
- All animations: Smooth transitions (0.2s - 0.4s)

---

## 🔄 Data Flow

```
┌─────────────────────────────────────────────┐
│            DashboardView.vue                 │
│  (State + API calls + Event handlers)        │
└─────────────────────────────────────────────┘
         │                              │
         │ Props ↓        Emits ↑       │
         ▼                              ▼
┌──────────────────┐          ┌──────────────────┐
│ MoneyBookSelector│          │  StatsCards      │
│                  │          │  (Display only)  │
│  @select         │          └──────────────────┘
│  @create         │
│  @update         │          ┌──────────────────┐
│  @delete         │          │ PocketsManager   │
└──────────────────┘          │                  │
                              │  @create         │
                              │  @update         │
                              │  @delete         │
                              └──────────────────┘

                              ┌──────────────────┐
                              │AllocationsHistory│
                              │                  │
                              │  @create         │
                              │  @delete         │
                              └──────────────────┘
```

---

## 📝 Key Improvements

### 1. **Empty State Experience**

- Clear call-to-action button when no books exist
- Smooth slide-down animation reveals input
- Auto-focus on input for immediate typing

### 2. **Better Visual Hierarchy**

- Input at top (primary action)
- Books list at bottom (secondary display)
- Stats in single unified card
- Consistent header layouts across all cards

### 3. **Horizontal Scrolling**

- Books list scrolls horizontally to save vertical space
- Custom scrollbar matches app theme
- Smooth scroll behavior

### 4. **Copy Feature**

- Quick copy of raw amounts for pasting elsewhere
- Visual feedback (icon changes to checkmark)
- Clipboard API with error handling

### 5. **Consistent Card Actions**

- Both Pockets and Allocations have "New" button in header
- Consistent button styling and placement
- Clear visual separation between sections

### 6. **Max-Height + Scroll**

- Prevents cards from growing too large
- Consistent 400px max-height
- Smooth scroll with custom styled scrollbar
- Content always accessible

### 7. **Component Reusability**

- Each component can be used independently
- Clear props/emits interface
- No tight coupling to parent
- Easy to test and maintain

---

## 🧪 Testing Recommendations

### Unit Testing

- Test each component in isolation
- Mock props and emit events
- Verify UI states (loading, empty, error)

### Integration Testing

- Test DashboardView with all components
- Verify data flow between components
- Test API call sequences

### E2E Testing

- Create money book → Create pockets → Create allocation
- Edit and delete operations
- Copy feature functionality
- Responsive behavior

---

## 🚀 Performance Optimizations

1. **Lazy Loading:** Components loaded via dynamic imports in router
2. **Skeleton Loaders:** Visual feedback during data fetching
3. **Efficient Scrolling:** Virtual scrolling not needed (max 10 items shown)
4. **Event Debouncing:** Scroll event uses passive listener
5. **Computed Properties:** Reactive calculations cached automatically

---

## 📱 Responsive Design

- Mobile-first approach
- Flexbox for adaptive layouts
- Breakpoint: 960px (md)
- Touch-friendly button sizes
- Readable text at all sizes

---

## 🎯 Future Enhancements

- [ ] Drag-and-drop reordering for pockets
- [ ] Export allocations to CSV/PDF
- [ ] Search/filter allocations by date range
- [ ] Charts and visualizations
- [ ] Budget vs actual tracking
- [ ] Recurring allocations
- [ ] Multi-currency support

---

Created: 2024-12-10
Version: 2.0
Status: Production Ready ✅
