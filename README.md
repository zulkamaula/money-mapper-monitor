# 💰 M3 - Money Mapper Monitor

A modern web application for managing personal finance allocation across multiple money books and pockets. Built with Vue 3, TypeScript, Vuetify 3, and Supabase.

![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)
![Vuetify](https://img.shields.io/badge/Vuetify-3.7-1867C0?logo=vuetify)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Requirements](#-requirements)
- [Installation & Setup](#-installation--setup)
- [Environment Configuration](#-environment-configuration)
- [Database Setup](#-database-setup)
- [Usage Guide](#-usage-guide)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Deployment](#-deployment)
- [Documentation](#-documentation)

## ✨ Features

### 💼 Money Book Management

- Create and manage multiple money books (Personal, Business, Family, etc.)
- Inline editing for renaming books
- Delete books with confirmation
- Horizontal scrollable list view

### 👛 Pocket System

- Create custom allocation pockets with percentages
- Percentage validation (must total 100%)
- Edit and delete pockets
- Visual percentage display with color coding

### 💸 Allocation Tracking

- Create new allocations with source amount
- Automatic distribution based on pocket percentages
- Floor rounding with smart remainder distribution
- Expandable allocation details
- Copy-to-clipboard for amounts
- Date and notes support

### 🎨 Modern UI/UX

- Glass morphism design with backdrop blur
- Responsive 2-column grid layout
- Empty states with guidance
- Three-dots dropdown menus
- Inline editing capabilities
- Smooth animations and transitions
- Loading states with skeleton loaders
- Mobile-friendly design

### 🏗️ Architecture

- Component-based architecture
- Layout system (Default & Blank layouts)
- TypeScript for type safety
- Modular and maintainable code structure

## 🛠 Tech Stack

### Frontend

- **Vue 3** - Progressive JavaScript framework (Composition API)
- **TypeScript** - Type-safe JavaScript
- **Vuetify 3** - Material Design component framework
- **Vite** - Next-generation frontend tooling
- **Vue Router** - Official routing library
- **Pinia** - State management

### Backend

- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication
  - Row Level Security (RLS)
  - Real-time subscriptions

### Tools & Libraries

- **Day.js** - Date manipulation
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📦 Requirements

### System Requirements

- **Node.js**: >= 18.x
- **npm**: >= 9.x (or yarn/pnpm)
- **Git**: Latest version

### Recommended IDE

- [VS Code](https://code.visualstudio.com/)
- Extensions:
  - [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (Vue Language Features)
  - [TypeScript Vue Plugin](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

### Browser Requirements

- Modern browsers with ES6+ support
- Chromium-based (Chrome, Edge, Brave) - recommended
- Firefox
- Safari (latest)

### Developer Tools (Optional)

- [Vue DevTools](https://devtools.vuejs.org/) - Browser extension for debugging

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
# Clone from GitHub repository
git clone https://github.com/zulkamaula/money-mapper-monitor.git

# Navigate to project directory
cd money-mapper-monitor
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Or using yarn
yarn install

# Or using pnpm
pnpm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **⚠️ Security Note:**  
> Never commit your `.env` file to version control. It's already included in `.gitignore`.  
> The database schema and RLS policies shown below are safe to share publicly.  
> Only keep your **Supabase URL** and **API keys** private in your `.env` file.

**How to get Supabase credentials:**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy **Project URL** and **anon public** key

## 🗄️ Database Setup

### 1. Create Supabase Project

1. Sign up at [Supabase](https://supabase.com)
2. Create a new project
3. Wait for database provisioning

### 2. Run Database Migrations

Execute the following SQL in Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create money_books table
CREATE TABLE money_books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pockets table
CREATE TABLE pockets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    money_book_id UUID NOT NULL REFERENCES money_books(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    percentage DECIMAL(5,2) NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create allocations table
CREATE TABLE allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    money_book_id UUID NOT NULL REFERENCES money_books(id) ON DELETE CASCADE,
    source_amount DECIMAL(15,2) NOT NULL,
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create allocation_items table
CREATE TABLE allocation_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    allocation_id UUID NOT NULL REFERENCES allocations(id) ON DELETE CASCADE,
    pocket_id UUID NOT NULL REFERENCES pockets(id) ON DELETE CASCADE,
    pocket_name VARCHAR(255) NOT NULL,
    pocket_percentage DECIMAL(5,2) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_money_books_user_id ON money_books(user_id);
CREATE INDEX idx_pockets_money_book_id ON pockets(money_book_id);
CREATE INDEX idx_allocations_money_book_id ON allocations(money_book_id);
CREATE INDEX idx_allocation_items_allocation_id ON allocation_items(allocation_id);

-- Enable Row Level Security (RLS)
ALTER TABLE money_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE pockets ENABLE ROW LEVEL SECURITY;
ALTER TABLE allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE allocation_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for money_books
CREATE POLICY "Users can view their own money books"
    ON money_books FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own money books"
    ON money_books FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own money books"
    ON money_books FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own money books"
    ON money_books FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for pockets
CREATE POLICY "Users can view pockets of their money books"
    ON pockets FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM money_books
            WHERE money_books.id = pockets.money_book_id
            AND money_books.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create pockets in their money books"
    ON pockets FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM money_books
            WHERE money_books.id = pockets.money_book_id
            AND money_books.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update pockets in their money books"
    ON pockets FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM money_books
            WHERE money_books.id = pockets.money_book_id
            AND money_books.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete pockets in their money books"
    ON pockets FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM money_books
            WHERE money_books.id = pockets.money_book_id
            AND money_books.user_id = auth.uid()
        )
    );

-- RLS Policies for allocations
CREATE POLICY "Users can view allocations of their money books"
    ON allocations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM money_books
            WHERE money_books.id = allocations.money_book_id
            AND money_books.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create allocations in their money books"
    ON allocations FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM money_books
            WHERE money_books.id = allocations.money_book_id
            AND money_books.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete allocations in their money books"
    ON allocations FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM money_books
            WHERE money_books.id = allocations.money_book_id
            AND money_books.user_id = auth.uid()
        )
    );

-- RLS Policies for allocation_items
CREATE POLICY "Users can view allocation items of their allocations"
    ON allocation_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM allocations
            JOIN money_books ON money_books.id = allocations.money_book_id
            WHERE allocations.id = allocation_items.allocation_id
            AND money_books.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create allocation items in their allocations"
    ON allocation_items FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM allocations
            JOIN money_books ON money_books.id = allocations.money_book_id
            WHERE allocations.id = allocation_items.allocation_id
            AND money_books.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete allocation items in their allocations"
    ON allocation_items FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM allocations
            JOIN money_books ON money_books.id = allocations.money_book_id
            WHERE allocations.id = allocation_items.allocation_id
            AND money_books.user_id = auth.uid()
        )
    );
```

### 3. Enable Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email templates (optional)

## 📖 Usage Guide

### Step 1: Start Development Server

```bash
npm run dev
```

Open browser at `http://localhost:5173`

### Step 2: Create Account

1. Navigate to home page
2. Click "Sign Up" or register link
3. Enter email and password
4. Check email for confirmation (if required)
5. Login with credentials

### Step 3: Create Your First Money Book

1. After login, you'll see empty dashboard
2. Click **"Create Your First One"** button
3. Enter money book name (e.g., "Personal Finance")
4. Click **"Next"** button

### Step 4: Create Pockets

1. Click **"New Pocket"** button in Pockets Manager card
2. Enter pocket details:
   - **Name**: e.g., "Emergency Fund"
   - **Percentage**: e.g., 25 (must total 100% across all pockets)
3. Click **"Save"**
4. Repeat to create more pockets (e.g., "Savings 30%", "Investment 25%", "Daily Expenses 20%")

### Step 5: Create Allocation

1. Ensure total pocket percentage = 100%
2. Click **"New Allocation"** button in Recent Allocations card
3. Enter allocation details:
   - **Source Amount**: Total amount to allocate (e.g., 10,000,000)
   - **Date**: Allocation date
   - **Notes**: Optional description
4. Preview shows automatic distribution
5. Click **"Save Allocation"**

### Step 6: View & Manage

- **Edit Money Book**: Click three-dots → Edit → Change name → Enter
- **Delete Money Book**: Click three-dots → Delete → Confirm
- **Edit Pocket**: Click three-dots → Edit → Modify → Save
- **Delete Pocket**: Click three-dots → Delete → Confirm
- **View Allocation Details**: Click allocation to expand
- **Copy Amount**: Click copy icon next to amount
- **Delete Allocation**: Click trash icon → Confirm

## 📁 Project Structure

```
money-mapper-monitor/
├── src/
│   ├── api/                    # API service layer
│   │   ├── allocations.ts      # Allocation CRUD operations
│   │   ├── moneyBooks.ts       # Money book CRUD operations
│   │   └── pockets.ts          # Pocket CRUD operations
│   ├── assets/                 # Static assets (images, styles)
│   ├── components/             # Reusable components
│   │   ├── dashboard/          # Dashboard-specific components
│   │   │   ├── AllocationDialog.vue
│   │   │   ├── AllocationsHistory.vue
│   │   │   ├── MoneyBookSelector.vue
│   │   │   ├── PocketsManager.vue
│   │   │   └── StatsCards.vue
│   │   ├── AppFooter.vue       # Application footer
│   │   ├── AppNavbar.vue       # Application navbar
│   │   └── LoginForm.vue       # Login/signup form
│   ├── layouts/                # Layout wrappers
│   │   ├── BlankLayout.vue     # Minimal layout (login page)
│   │   └── DefaultLayout.vue   # Full layout (authenticated pages)
│   ├── lib/                    # Third-party library configs
│   │   └── supabase.ts         # Supabase client initialization
│   ├── pages/                  # Page components
│   │   ├── Dashboard.vue       # Main dashboard page
│   │   └── Home.vue            # Home/login page
│   ├── plugins/                # Vue plugins
│   │   └── vuetify.ts          # Vuetify configuration
│   ├── router/                 # Vue Router configuration
│   │   └── index.ts            # Route definitions
│   ├── stores/                 # Pinia state stores
│   │   ├── auth.ts             # Authentication state
│   │   └── notification.ts     # Notification state
│   ├── types/                  # TypeScript type definitions
│   │   └── models.ts           # Data model interfaces
│   ├── App.vue                 # Root component
│   └── main.ts                 # Application entry point
├── public/                     # Public static files
├── .env                        # Environment variables (create this)
├── .env.example                # Environment template
├── .gitignore                  # Git ignore rules
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration
├── COMPONENT_STRUCTURE.md      # Component documentation
├── LAYOUT_SYSTEM.md            # Layout system documentation
└── README.md                   # This file
```

## 💻 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run type checking
npm run type-check

# Run linting
npm run lint

# Format code
npm run format
```

### Code Style

- **TypeScript**: Strict mode enabled
- **Composition API**: Use `<script setup>` syntax
- **Components**: PascalCase naming
- **Props/Emits**: Proper TypeScript interfaces
- **State Management**: Pinia stores for global state
- **API Layer**: Separate service files

### Best Practices

1. **Component Design**:
   - Keep components focused and single-responsibility
   - Use props for data down, emits for events up
   - Extract reusable logic into composables

2. **State Management**:
   - Use local state (`ref`, `reactive`) when possible
   - Use Pinia stores for shared/global state
   - Keep stores focused on specific domains

3. **API Calls**:
   - Handle loading states
   - Show error notifications
   - Implement proper error handling

4. **Type Safety**:
   - Define interfaces for all data models
   - Type all props and emits
   - Avoid `any` type

## 🚀 Deployment

### Build for Production

```bash
# Create production build
npm run build

# Output will be in /dist directory
```

### Deploy to Netlify

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

Quick deploy:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

### Environment Variables (Production)

In Netlify Dashboard:

1. Go to **Site settings** → **Environment variables**
2. Add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## 📚 Documentation

- [Component Structure](./COMPONENT_STRUCTURE.md) - Detailed component architecture
- [Layout System](./LAYOUT_SYSTEM.md) - Layout wrapper documentation
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Step-by-step deployment instructions

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'feat: Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Zulkamaula**

- GitHub: [@zulkamaula](https://github.com/zulkamaula)

## 🙏 Acknowledgments

- [Vue.js](https://vuejs.org/)
- [Vuetify](https://vuetifyjs.com/)
- [Supabase](https://supabase.com/)
- [Vite](https://vitejs.dev/)

---

**Built with ❤️ using Vue 3 + TypeScript + Vuetify 3**
