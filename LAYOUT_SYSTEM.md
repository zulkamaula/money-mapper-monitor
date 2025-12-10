# Layout System Documentation

## 📐 Layout Architecture

The application uses a layout wrapper system for consistent structure across all pages.

---

## 🎨 Available Layouts

### 1. **DefaultLayout** (With Navbar & Footer)

**Location:** `src/layouts/DefaultLayout.vue`

**Purpose:** Standard layout for authenticated pages with full navigation.

**Structure:**

```
┌─────────────────────────────┐
│        AppNavbar            │
├─────────────────────────────┤
│                             │
│         <slot />            │ <- Page content goes here
│                             │
├─────────────────────────────┤
│        AppFooter            │
└─────────────────────────────┘
```

**Used By:**

- Dashboard (`/dashboard`)
- Privacy Policy (`/privacy`) - if needed
- Terms (`/terms`) - if needed

**Usage:**

```vue
<script setup lang="ts">
import DefaultLayout from '../layouts/DefaultLayout.vue'
</script>

<template>
  <DefaultLayout>
    <!-- Your page content -->
  </DefaultLayout>
</template>
```

---

### 2. **BlankLayout** (No Navbar/Footer)

**Location:** `src/layouts/BlankLayout.vue`

**Purpose:** Minimal layout for login/landing pages without navigation.

**Structure:**

```
┌─────────────────────────────┐
│                             │
│         <slot />            │ <- Page content goes here
│                             │
└─────────────────────────────┘
```

**Used By:**

- Home/Login (`/`)

**Usage:**

```vue
<script setup lang="ts">
import BlankLayout from '../layouts/BlankLayout.vue'
</script>

<template>
  <BlankLayout>
    <!-- Your page content -->
  </BlankLayout>
</template>
```

---

## 📂 File Structure

```
src/
├── layouts/
│   ├── DefaultLayout.vue    # With navbar & footer
│   └── BlankLayout.vue      # Blank (no nav/footer)
│
├── pages/
│   ├── Home.vue            # Uses BlankLayout
│   ├── Dashboard.vue       # Uses DefaultLayout
│   ├── PrivacyPolicy.vue
│   └── Terms.vue
│
└── components/
    ├── AppNavbar.vue       # Used in DefaultLayout
    └── AppFooter.vue       # Used in DefaultLayout
```

---

## 🚀 Dashboard Layout Structure

### Grid Layout (Desktop)

```
┌────────────────────────────────────────────────────┐
│                  Top Row (mb-6)                    │
├──────────────────────────────┬─────────────────────┤
│   MoneyBookSelector          │   StatsCards        │
│   (8/12 cols - 67%)          │   (4/12 cols - 33%) │
│   - Create input at top      │   - Compact design  │
│   - Horizontal scroll books  │   - 3 stats info    │
│   - Inline editing           │   - Minimal height  │
└──────────────────────────────┴─────────────────────┘
                      ↓
┌────────────────────────────────────────────────────┐
│                  Bottom Row                        │
├──────────────────────────────┬─────────────────────┤
│   PocketsManager             │ AllocationsHistory  │
│   (4/12 cols - 33%)          │ (8/12 cols - 67%)   │
│   - Dialog for new pocket    │ - Expandable items  │
│   - Inline editing           │ - Copy feature      │
│   - Max-height: 600px        │ - Max-height: 400px │
│   - Auto scroll              │ - Auto scroll       │
└──────────────────────────────┴─────────────────────┘
```

### Responsive (Mobile < 960px)

```
┌──────────────────────┐
│  MoneyBookSelector   │ (Full width)
└──────────────────────┘
┌──────────────────────┐
│    StatsCards        │ (Full width)
└──────────────────────┘
┌──────────────────────┐
│  PocketsManager      │ (Full width)
└──────────────────────┘
┌──────────────────────┐
│ AllocationsHistory   │ (Full width)
└──────────────────────┘
```

---

## 🎯 Design Rationale

### Why Two Columns in Top Row?

**MoneyBookSelector (8 cols):**

- Primary action (create/select book)
- Needs more horizontal space for book list scrolling
- User interacts with this frequently

**StatsCards (4 cols):**

- Information display only (read-only)
- Compact design saves space
- Quick overview at a glance
- Height matches MoneyBookSelector for visual consistency

### Why Different Column Sizes in Bottom Row?

**PocketsManager (4 cols):**

- Narrow vertical list
- Simple pocket items
- Dialog for adding new (saves space)
- Taller max-height (600px) to utilize vertical space

**AllocationsHistory (8 cols):**

- Wider content needed for:
  - Amount display
  - Expandable details
  - Pocket breakdown
  - Copy buttons
- More complex data structure

---

## 📏 Height Consistency Strategy

### Top Row

- MoneyBookSelector: Dynamic height based on content
- StatsCards: Compact (`pa-4`, smaller icons/fonts) to match MoneyBookSelector

### Bottom Row

- PocketsManager: `max-height: 600px` (increased from 400px)
- AllocationsHistory: `max-height: 400px` (standard)
- Both use custom scrollbars when content exceeds max-height

---

## 🔧 Layout Configuration

### Breakpoints (Vuetify)

- **xs:** < 600px (Mobile)
- **sm:** 600px - 960px (Tablet)
- **md:** 960px - 1264px (Desktop) ← Main breakpoint
- **lg:** 1264px - 1904px (Large Desktop)
- **xl:** > 1904px (Extra Large)

### Column Distribution

- Desktop (≥ md):
  - Top: 8/12 + 4/12
  - Bottom: 4/12 + 8/12
- Mobile (< md): All 12/12 (full width, stacked)

---

## 🎨 Visual Consistency

### Card Styling (All Components)

```css
.card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(15, 118, 110, 0.1);
}
```

### Scrollbar Styling (All Components)

```css
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(15, 118, 110, 0.05);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(15, 118, 110, 0.2);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(15, 118, 110, 0.3);
}
```

---

## 🔄 Page Rendering Flow

```
User navigates to route
         ↓
Router loads page component
         ↓
Page wraps content with layout
         ↓
Layout renders structure:
  - BlankLayout: Just <slot />
  - DefaultLayout: Navbar + <slot /> + Footer
         ↓
Page content renders inside <slot />
```

---

## 📝 Adding New Pages

### With Navigation (DefaultLayout)

```vue
<!-- src/pages/NewPage.vue -->
<script setup lang="ts">
import DefaultLayout from '../layouts/DefaultLayout.vue'
</script>

<template>
  <DefaultLayout>
    <div class="page-main">
      <VContainer>
        <!-- Your content -->
      </VContainer>
    </div>
  </DefaultLayout>
</template>

<style scoped>
.page-main {
  background: linear-gradient(...);
  min-height: 100vh;
  padding-top: 80px;
  padding-bottom: 80px;
}
</style>
```

### Without Navigation (BlankLayout)

```vue
<!-- src/pages/Landing.vue -->
<script setup lang="ts">
import BlankLayout from '../layouts/BlankLayout.vue'
</script>

<template>
  <BlankLayout>
    <div class="landing-container">
      <!-- Your content -->
    </div>
  </BlankLayout>
</template>
```

---

## 🚦 Router Integration

```typescript
// src/router/index.ts
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../pages/Home.vue'), // Uses BlankLayout
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../pages/Dashboard.vue'), // Uses DefaultLayout
  },
]
```

**Note:** No layout prop needed in routes - each page imports its own layout.

---

## ✅ Benefits of This System

### 1. **Consistency**

- All pages with navigation look the same
- Easy to maintain navbar/footer globally

### 2. **Flexibility**

- Pages can choose their layout
- Easy to add new layout variants

### 3. **Clean Code**

- No VApp duplication in every page
- Layout logic centralized

### 4. **Reusability**

- Layouts can be reused across pages
- Components are layout-agnostic

### 5. **Maintainability**

- Update navbar → affects all DefaultLayout pages
- Clear separation of concerns

---

## 🎓 Best Practices

### DO ✅

- Use DefaultLayout for authenticated pages
- Use BlankLayout for public/landing pages
- Keep page content inside layout slot
- Match padding for consistent spacing

### DON'T ❌

- Don't wrap VApp in page components
- Don't duplicate navbar/footer code
- Don't hardcode layout-specific styling in pages
- Don't nest layouts (one layout per page)

---

## 🔮 Future Enhancements

### Possible Layout Variants

- **AdminLayout:** Sidebar navigation for admin pages
- **FullscreenLayout:** No padding, edge-to-edge content
- **TwoColumnLayout:** Fixed sidebar + scrollable content
- **SplitLayout:** 50/50 split for comparison views

### Layout Props (If Needed)

```vue
<DefaultLayout :show-navbar="true" :show-footer="true" navbar-variant="transparent">
  <template #navbar-actions>
    <VBtn>Custom Action</VBtn>
  </template>
  <!-- Page content -->
</DefaultLayout>
```

---

## 📊 Current Implementation

| Page         | Layout        | Has Navbar | Has Footer |
| ------------ | ------------- | ---------- | ---------- |
| Home (Login) | BlankLayout   | ❌         | ❌         |
| Dashboard    | DefaultLayout | ✅         | ✅         |
| Privacy      | (TBD)         | (TBD)      | (TBD)      |
| Terms        | (TBD)         | (TBD)      | (TBD)      |

---

Created: 2024-12-10
Version: 1.0
Status: Production Ready ✅
