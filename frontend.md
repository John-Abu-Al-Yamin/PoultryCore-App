# PoultryCore App — Frontend Documentation

## Overview

This document serves as the blueprint for building the PoultryCore React Native frontend application. It defines the architecture, navigation, screens, components, API integration, data flow, and state management approach based on the Product Requirements Document (PRD).

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native 0.81.5 |
| Platform | Expo SDK 54 |
| Routing | Expo Router 6 (file-based) |
| Language | TypeScript 5.9 |
| Navigation | @react-navigation/native + expo-router |
| Animations | react-native-reanimated 4.1 |
| Gestures | react-native-gesture-handler 2.28 |
| HTTP | fetch (built-in) or axios |
| Storage | expo-secure-store (tokens) + AsyncStorage (cache) |

---

## Project Structure

\\\
app/
├── (auth)/                          # Unauthenticated screens
│   ├── _layout.tsx                  # Stack: Login / Register
│   ├── login.tsx
│   └── register.tsx
├── (tabs)/                          # Authenticated screens
│   ├── _layout.tsx                  # Bottom tab navigator
│   ├── dashboard.tsx                # Main dashboard
│   ├── barns/
│   │   ├── _layout.tsx              # Stack for barn screens
│   │   ├── index.tsx                # Barn list
│   │   ├── create.tsx               # Create barn form
│   │   ├── [id]/
│   │   │   ├── index.tsx            # Barn detail + batch list
│   │   │   ├── edit.tsx             # Edit barn
│   │   │   └── batches/
│   │   │       ├── create.tsx       # Create batch
│   │   │       └── [batchId]/
│   │   │           ├── index.tsx    # Batch detail (overview)
│   │   │           ├── edit.tsx     # Edit batch / close batch
│   │   │           ├── expenses.tsx # Batch expenses list + create
│   │   │           ├── deaths.tsx   # Batch deaths list + create
│   │   │           ├── sales.tsx    # Batch sales list + create
│   │   │           └── purchases.tsx# Batch purchases list + create
│   ├── purchases/
│   │   ├── _layout.tsx
│   │   ├── index.tsx                # All purchases (with filters)
│   │   └── create.tsx               # Create purchase
│   ├── sales/
│   │   ├── _layout.tsx
│   │   ├── index.tsx                # All sales (with filters)
│   │   └── create.tsx               # Create sale
│   ├── expenses/
│   │   ├── _layout.tsx
│   │   ├── index.tsx                # All expenses (with filters)
│   │   └── create.tsx               # Create expense
│   ├── deaths/
│   │   ├── _layout.tsx
│   │   ├── index.tsx                # All deaths (with filters)
│   │   └── create.tsx               # Create death record
│   ├── customers/
│   │   ├── _layout.tsx
│   │   ├── index.tsx                # Customer list
│   │   ├── create.tsx               # Create customer
│   │   └── [id].tsx                 # Customer detail + payments
│   ├── suppliers/
│   │   ├── _layout.tsx
│   │   ├── index.tsx                # Supplier list
│   │   ├── create.tsx               # Create supplier
│   │   └── [id].tsx                 # Supplier detail + payments
│   ├── payments/
│   │   ├── _layout.tsx
│   │   ├── index.tsx                # Payments list
│   │   └── create.tsx               # Create payment
│   └── reports/
│       ├── _layout.tsx
│       └── index.tsx                # Reports hub (P&L, stock, debts)
├── _layout.tsx                      # Root layout (Stack: auth | tabs)
└── index.tsx                        # Entry — redirect based on auth state

constants/
├── colors.ts                        # Light + dark theme colors
├── spacing.ts                       # Spacing scale
└── typography.ts                    # Font sizes / weights

lib/
├── api.ts                           # HTTP client (axios or fetch wrapper)
├── auth.ts                          # Auth context / provider
├── storage.ts                       # Secure token storage
└── utils.ts                         # Formatting helpers (currency, date)

types/
├── api.ts                           # API response types
├── models.ts                        # Barn, Batch, Sale, Purchase, etc.
└── navigation.ts                    # Route param types

components/
├── ui/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Select.tsx
│   ├── Badge.tsx
│   ├── Modal.tsx
│   └── LoadingSpinner.tsx
├── forms/
│   ├── BarnForm.tsx
│   ├── BatchForm.tsx
│   ├── SaleForm.tsx
│   ├── PurchaseForm.tsx
│   ├── ExpenseForm.tsx
│   ├── DeathForm.tsx
│   ├── CustomerForm.tsx
│   ├── SupplierForm.tsx
│   └── PaymentForm.tsx
├── layout/
│   ├── ScreenHeader.tsx
│   ├── EmptyState.tsx
│   └── ErrorState.tsx
├── charts/
│   ├── ProfitChart.tsx
│   └── StockChart.tsx
└── shared/
    ├── SummaryCard.tsx
    ├── DebtBadge.tsx
    ├── PaymentStatusBadge.tsx
    └── ConfirmDialog.tsx

hooks/
├── useAuth.ts
├── useBarns.ts
├── useBatches.ts
├── useSales.ts
├── usePurchases.ts
├── useExpenses.ts
├── useDeaths.ts
├── useCustomers.ts
├── useSuppliers.ts
├── usePayments.ts
├── useThemeColor.ts
└── useDebouncedValue.ts

contexts/
├── AuthContext.tsx
└── ThemeContext.tsx
\\\

---

## Navigation Architecture

### Root Layout (\pp/_layout.tsx\)

\\\	ypescript
// Pseudocode
<ThemeProvider>
  <AuthProvider>
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  </AuthProvider>
</ThemeProvider>
\\\

### Auth Flow

- On app launch, check for stored token in expo-secure-store
- If token exists, validate via \GET /api/auth/me\
- If valid → render \(tabs)\
- If invalid/missing → render \(auth)\
- On logout → clear token → redirect to \(auth)\

### Tab Navigator (\pp/(tabs)/_layout.tsx\)

| Tab | Icon | Screen |
|-----|------|--------|
| Dashboard | home | dashboard.tsx |
| Barns | barn | barns/_layout.tsx (stack) |
| Purchases | cart | purchases/_layout.tsx (stack) |
| Sales | tag | sales/_layout.tsx (stack) |
| More | ellipsis-horizontal | modal / action sheet |

The "More" tab opens a bottom sheet or modal with links to:
- Expenses
- Deaths
- Customers
- Suppliers
- Payments
- Reports

---

## Theme System

### Colors (\constants/colors.ts\)

\\\	ypescript
export const lightColors = {
  primary: "#111111",
  secondary: "#F5F5F5",
  background: "#FFFFFF",
  card: "#FFFFFF",
  text: "#242424",
  muted: "#F5F5F5",
  border: "#EAEAEA",
  success: "#16a34a",
  error: "#9a3412",
  warning: "#eab308",
};

export const darkColors = {
  primary: "#EAEAEA",
  secondary: "#3F3F3F",
  background: "#242424",
  card: "#111111",
  text: "#FAFAFA",
  muted: "#3F3F3F",
  border: "#FFFFFF1A",
  success: "#22c55e",
  error: "#f87171",
  warning: "#fbbf24",
};
\\\

### Spacing (\constants/spacing.ts\)

\\\	ypescript
export const spacing = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
};
\\\

### Typography (\constants/typography.ts\)

\\\	ypescript
import { TextStyle } from "react-native";

export const typography: Record<string, TextStyle> = {
  h1: { fontSize: 28, fontWeight: "700" },
  h2: { fontSize: 24, fontWeight: "600" },
  h3: { fontSize: 20, fontWeight: "600" },
  body: { fontSize: 16, fontWeight: "400" },
  caption: { fontSize: 14, fontWeight: "400" },
  small: { fontSize: 12, fontWeight: "400" },
};
\\\

### Theme Hook (\hooks/useThemeColor.ts\)

Resolves light/dark colors based on system color scheme. Returns a ColorValue object matching the active theme.

---

## API Integration

### HTTP Client (\lib/api.ts\)

- Base URL from \EXPO_PUBLIC_API_URL\ env variable
- Automatically attaches \Authorization: Bearer <token>\ from secure storage
- Handles 401 responses by redirecting to login
- Returns typed responses

\\\	ypescript
// lib/api.ts — interface
class ApiClient {
  get<T>(url: string, params?: Record<string, any>): Promise<T>;
  post<T>(url: string, body?: any): Promise<T>;
  put<T>(url: string, body?: any): Promise<T>;
  delete<T>(url: string): Promise<T>;
}
\\\

### Auth Context (\contexts/AuthContext.tsx\)

Provides:
- \user\ — current user object
- \	oken\ — JWT token
- \isLoading\ — initial auth check loading
- \isAuthenticated\ — boolean
- \login(email, password)\ — authenticate and store token
- \egister(name, email, password)\ — create account
- \logout()\ — clear token and redirect

### Custom Hooks Pattern

Each entity (barns, batches, sales, etc.) has a custom hook that wraps API calls:

\\\	ypescript
// hooks/useBarns.ts — interface
function useBarns() {
  barns: Barn[];                        // cached list
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;         // re-fetch
  create: (data: CreateBarnInput) => Promise<Barn>;
  update: (id: number, data: UpdateBarnInput) => Promise<Barn>;
  remove: (id: number) => Promise<void>;
}
\\\

---

## Data Models

### Barn
| Field | Type | Notes |
|-------|------|-------|
| id | number | |
| user_id | number | Isolated per user |
| name | string | Required |
| location | string | Optional |
| capacity | number | Optional |
| notes | string | Optional |
| created_at | string | ISO date |
| updated_at | string | ISO date |
| batches_count | number | Computed (from API) |

### Batch
| Field | Type | Notes |
|-------|------|-------|
| id | number | |
| barn_id | number | FK to barns |
| user_id | number | Isolated per user |
| poultry_type | string | e.g. "duck", "chick" |
| current_quantity | number | Updated by purchases/deaths/sales |
| initial_quantity | number | |
| start_date | string | ISO date |
| end_date | string | Null if active |
| status | "active" \| "closed" | |
| notes | string | Optional |

### Sale
| Field | Type | Notes |
|-------|------|-------|
| id | number | |
| batch_id | number | FK to batches |
| user_id | number | |
| customer_id | number | FK to customers |
| quantity | number | |
| unit_price | number | |
| total_price | number | Computed |
| sale_date | string | ISO date |
| payment_type | "cash" \| "credit" | |
| remaining_amount | number | 0 if cash |
| payment_status | "paid" \| "partial" \| "unpaid" | |
| notes | string | |

### Purchase
| Field | Type | Notes |
|-------|------|-------|
| id | number | |
| batch_id | number | FK to batches |
| user_id | number | |
| supplier_id | number | FK to suppliers |
| poultry_type | string | |
| quantity | number | |
| unit_price | number | |
| total_price | number | |
| purchase_date | string | |
| payment_type | "cash" \| "credit" | |
| remaining_amount | number | |
| payment_status | "paid" \| "partial" \| "unpaid" | |

### Expense
| Field | Type | Notes |
|-------|------|-------|
| id | number | |
| batch_id | number | FK to batches |
| user_id | number | |
| type | string | Feed, Treatment, Medicine, etc. |
| amount | number | |
| date | string | |
| notes | string | |

### Death
| Field | Type | Notes |
|-------|------|-------|
| id | number | |
| batch_id | number | FK to batches |
| user_id | number | |
| quantity | number | |
| reason | string | |
| date | string | |

### Customer
| Field | Type | Notes |
|-------|------|-------|
| id | number | |
| user_id | number | |
| name | string | |
| phone | string | |
| address | string | |
| total_debts | number | Computed |
| created_at | string | |

### Supplier
| Field | Type | Notes |
|-------|------|-------|
| id | number | |
| user_id | number | |
| name | string | |
| phone | string | |
| address | string | |
| total_dues | number | Computed |
| created_at | string | |

### Payment
| Field | Type | Notes |
|-------|------|-------|
| id | number | |
| user_id | number | |
| payable_type | "customer" \| "supplier" | |
| payable_id | number | Polymorphic FK |
| amount | number | |
| date | string | |
| payment_method | string | cash, transfer, etc. |
| notes | string | |

---

## Screen Specifications

### 1. Dashboard (\pp/(tabs)/dashboard.tsx\)

**Purpose:** Show a real-time summary of the user's poultry business.

**Sections:**
- Header: greeting + user name
- Summary cards row (scrollable horizontally):
  - Total poultry (current stock across all batches)
  - Total revenue (sum of all sales)
  - Total expenses (sum of all expenses)
  - Total purchases cost
- Debt summary cards:
  - Receivables (total customer debts) — with badge color
  - Payables (total supplier dues) — with badge color
- Net profit card (revenue - (purchases + expenses))
- Quick stats row:
  - Active batches count
  - Barns count
  - Active barns
- Quick action buttons:
  - Record Sale
  - Record Purchase
  - Record Expense
  - Record Death

**API calls:**
- \GET /api/dashboard\ (aggregated data endpoint)

---

### 2. Barns Screens (\pp/(tabs)/barns/\)

#### List (\index.tsx\)
- FlatList of barn cards
- Each card shows: name, location, capacity, active batches count
- Pull-to-refresh
- FAB (+) to create new barn
- Swipe to delete with confirmation

#### Create (\create.tsx\)
- Form fields: name (required), location, capacity, notes
- Validation: name is required, capacity must be positive number
- On success: navigate back to list

#### Detail (\[id]/index.tsx\)
- Barn info header (name, location, capacity, notes)
- List of batches in this barn
- Each batch card: poultry_type, current_quantity, status (active/closed badge), start_date
- Tap batch → navigate to batch detail
- FAB (+) to create new batch

#### Edit (\[id]/edit.tsx\)
- Same form as create, pre-filled
- Save button updates barn

---

### 3. Batch Screens (\arns/[id]/batches/\)

#### Create (\create.tsx\)
- Form: poultry_type (select), initial_quantity, start_date (date picker), notes
- On success: navigate to batch detail

#### Detail (\[batchId]/index.tsx\)
- Batch header: type, status badge, current quantity / initial quantity
- Quick stats: total sales, total purchases, total expenses, deaths count
- Quick action buttons row: Add Expense, Add Sale, Add Purchase, Add Death
- Tab view or section list:
  - Recent expenses (last 5)
  - Recent sales (last 5)
  - Recent deaths (last 5)
- "Close Batch" button (only when status = active) — confirmation dialog
- Loading state, empty state, error state

#### Close Batch
- Confirmation dialog warns: "This will close the batch and archive it. Continue?"
- On confirm: \PUT /api/batches/{id}\ with status=closed
- Redirect to barn detail

---

### 4. Sales Screens

#### List (\pp/(tabs)/sales/index.tsx\)
- FlatList with filters:
  - Date range
  - Payment type (cash / credit / all)
  - Batch filter
- Each item: customer name, quantity, total price, payment status badge
- Pull-to-refresh
- FAB (+) for new sale

#### Create (\create.tsx\)
- Select batch (dropdown from active batches)
- Select customer (dropdown, or create new inline)
- Quantity (numeric input)
- Unit price (numeric input — total auto-calculated)
- Payment type: Cash / Credit toggle
- If Credit: remaining_amount = total (auto-filled)
- Sale date (defaults to today)
- Notes (optional)
- Validation: batch required, customer required, quantity > 0, price > 0

---

### 5. Purchases Screens

#### List (\pp/(tabs)/purchases/index.tsx\)
- Same pattern as sales list
- Filters: date range, payment type, supplier, batch
- Items: supplier name, poultry type, quantity, total price, payment status badge

#### Create (\create.tsx\)
- Similar to sale create
- Select batch, select supplier, poultry_type, quantity, unit_price
- Payment type toggle
- Date, notes

---

### 6. Expenses Screens

#### List (\pp/(tabs)/expenses/index.tsx\)
- Filter by: batch, expense type, date range
- Items: type, amount, batch name, date

#### Create (\create.tsx\)
- Select batch (required)
- Expense type (preset list: Feed, Treatment, Medicine, Tools, Electricity, Transportation, Other)
- Amount, date, notes

---

### 7. Deaths Screens

#### List (\pp/(tabs)/deaths/index.tsx\)
- Filter by: batch, date range
- Items: quantity, reason, date, batch name

#### Create (\create.tsx\)
- Select batch (required)
- Quantity, reason, date
- Note: recording death automatically reduces batch current_quantity

---

### 8. Customers Screens

#### List (\pp/(tabs)/customers/index.tsx\)
- Search bar (name/phone)
- FlatList: name, phone, total_debts (with warning badge if > 0)
- FAB (+) to create

#### Create / Detail
- Form: name (required), phone, address
- Detail view: customer info + transaction history (sales + payments)
- "Record Payment" button → navigates to payment create with customer pre-selected

---

### 9. Suppliers Screens

#### List (\pp/(tabs)/suppliers/index.tsx\)
- Same pattern as customers
- Shows total_dues

#### Create / Detail
- Same pattern as customers
- Shows purchase history + payments made to supplier

---

### 10. Payments Screens (\pp/(tabs)/payments/\)

#### List (\index.tsx\)
- Filter by: type (incoming / outgoing), customer/supplier, date range
- Items: amount, customer/supplier name, date, payment method
- Two tabs or filter chips: Collections | Supplier Payments

#### Create (\create.tsx\)
- Payment type: Collection (from customer) | Payment (to supplier)
- Select customer or supplier based on type
- Amount, date, payment method (cash, transfer, cheque), notes
- On success: updates customer/supplier debt balance

---

### 11. Reports Screen (\pp/(tabs)/reports/index.tsx\)

**Purpose:** Business intelligence and analytics.

**Sections:**
- Profit & Loss Report
  - Revenue vs Expenses vs Purchases line/bar chart
  - Net profit number
  - Date range selector
- Stock Report
  - Current stock per batch
  - Stock movement over time
- Debts Report
  - Receivables vs Payables summary
  - Top debtors / creditors list
- Batch Performance
  - Select batch → view its full P&L
- Barn Performance
  - Select barn → view all batches performance

---

## Business Logic (Frontend)

These calculations should be confirmed by the API but can also be displayed locally:

\\\	ypescript
// utils/calculations.ts
export function calculateTotalCost(purchases: number, expenses: number, deathLosses: number): number {
  return purchases + expenses + deathLosses;
}

export function calculatePayables(purchaseDebts: number, creditExpenses: number): number {
  return purchaseDebts + creditExpenses;
}

export function calculateReceivables(creditSales: number, customerPayments: number): number {
  return creditSales - customerPayments;
}

export function calculateProfit(revenue: number, purchases: number, expenses: number): number {
  return revenue - (purchases + expenses);
}

export function calculateCurrentStock(initial: number, purchases: number, deaths: number, sales: number): number {
  return initial + purchases - deaths - sales;
}
\\\

---

## Component Library

### UI Components (\components/ui/\)

| Component | Props | Description |
|-----------|-------|-------------|
| Button | title, variant (primary/secondary/danger), loading, onPress | Styled pressable |
| Card | children, style | Rounded card with shadow |
| Input | label, value, onChangeText, error, secureTextEntry | Text input with label |
| Select | label, options, value, onValueChange | Dropdown/picker |
| Badge | text, variant (success/warning/error/info) | Status badge |
| LoadingSpinner | size, color | Centered spinner |
| EmptyState | icon, title, message | Empty list placeholder |
| ErrorState | message, onRetry | Error with retry button |
| ConfirmDialog | title, message, onConfirm, onCancel | Alert-style confirmation |

### Form Components (\components/forms/\)

Each form component wraps the relevant fields and validation for its entity. They accept:
- \initialValues\ — for edit mode
- \onSubmit\ — callback with form data
- \isLoading\ — disable while saving

---

## State Management

### Approach: React Context + Custom Hooks (no Redux needed)

- **Auth state:** AuthContext (token, user, login/logout)
- **Server state:** Custom hooks that call API and cache results locally
- **UI state:** Local component state (\useState\)

### Data Fetching Pattern

Each custom hook follows this pattern:

\\\	ypescript
function useData<T>(fetchFn: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => { refresh(); }, [refresh]);

  return { data, isLoading, error, refresh };
}
\\\

---

## Error Handling

- Global error boundary at root level
- API errors: parse error response, show toast/snackbar
- Network errors: "No internet connection" message
- Validation errors: show inline under fields
- 401 errors: auto-redirect to login
- 403 errors: "You don't have permission" message
- 500 errors: "Something went wrong" with retry button

---

## Loading & Empty States

Every list screen must handle:
1. **Loading state:** Show spinner or skeleton
2. **Empty state:** Show illustration + message ("No barns yet. Create your first barn!")
3. **Error state:** Show error message + retry button
4. **Data state:** Show the list

---

## Environment Variables

\\\
EXPO_PUBLIC_API_URL=http://localhost:8000/api
EXPO_PUBLIC_APP_NAME=PoultryCore
\\\

---

## Dependencies to Install

\\\ash
# Core
npx expo install expo-secure-store
npx expo install @react-native-async-storage/async-storage

# UI / UX
npx expo install react-native-toast-message
npx expo install @react-native-community/datetimepicker
npx expo install react-native-safe-area-context   # (already installed)

# Charts (for reports)
npx expo install react-native-svg
npm install victory-native                       # or react-native-chart-kit

# Forms (optional but recommended)
npm install react-hook-form zod @hookform/resolvers

# Navigation
# Already installed: expo-router, @react-navigation/native
\\\

---

## Screens Summary (Total: ~30 screens)

| Priority | Screen | Route |
|----------|--------|-------|
| P0 | Login | (auth)/login |
| P0 | Register | (auth)/register |
| P0 | Dashboard | (tabs)/dashboard |
| P0 | Barn List | (tabs)/barns/index |
| P0 | Barn Create | (tabs)/barns/create |
| P0 | Barn Detail | (tabs)/barns/[id]/index |
| P0 | Batch Create | (tabs)/barns/[id]/batches/create |
| P0 | Batch Detail | (tabs)/barns/[id]/batches/[batchId]/index |
| P0 | Sale List | (tabs)/sales/index |
| P0 | Sale Create | (tabs)/sales/create |
| P0 | Purchase List | (tabs)/purchases/index |
| P0 | Purchase Create | (tabs)/purchases/create |
| P0 | Expense Create | (tabs)/expenses/create |
| P0 | Death Create | (tabs)/deaths/create |
| P1 | Expense List | (tabs)/expenses/index |
| P1 | Death List | (tabs)/deaths/index |
| P1 | Customer List | (tabs)/customers/index |
| P1 | Customer Create | (tabs)/customers/create |
| P1 | Customer Detail | (tabs)/customers/[id] |
| P1 | Supplier List | (tabs)/suppliers/index |
| P1 | Supplier Create | (tabs)/suppliers/create |
| P1 | Supplier Detail | (tabs)/suppliers/[id] |
| P1 | Payment List | (tabs)/payments/index |
| P1 | Payment Create | (tabs)/payments/create |
| P2 | Reports | (tabs)/reports/index |
| P2 | Barn Edit | (tabs)/barns/[id]/edit |
| P2 | Batch Edit | (tabs)/barns/[id]/batches/[batchId]/edit |
| P2 | Batch Expenses | (tabs)/barns/[id]/batches/[batchId]/expenses |
| P2 | Batch Deaths | (tabs)/barns/[id]/batches/[batchId]/deaths |
| P2 | Batch Sales | (tabs)/barns/[id]/batches/[batchId]/sales |
| P2 | Batch Purchases | (tabs)/barns/[id]/batches/[batchId]/purchases |
