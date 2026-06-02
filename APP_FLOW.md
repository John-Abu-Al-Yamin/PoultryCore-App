# PoultryCore System — Full App Flow Document

## 1. Project Overview

PoultryCore is a poultry farm management application built with **React Native (Expo SDK 54)** for the frontend and **Laravel (Sanctum API)** for the backend. The app is fully **Arabic (RTL)** and supports **light/dark themes**. It uses **Expo Router** for file-based navigation and **NativeWind** (Tailwind CSS for React Native) for styling.

**Repository structure:**
```
PoultryCore-System/
  api/   -- Laravel REST API (PHP)
  app/   -- Expo / React Native frontend (TypeScript)
```

---

## 2. Technology Stack

| Category | Library | Version | Purpose |
|---|---|---|---|
| Framework | expo | ~54.0.33 | React Native framework |
| Navigation | expo-router | ~6.0.23 | File-based routing |
| Styling | nativewind | ^4.2.4 | Tailwind CSS for RN |
| Server State | @tanstack/react-query | ^5.100.14 | API caching & mutations |
| HTTP Client | axios | ^1.16.1 | API requests |
| Validation | zod | ^4.4.3 | Schema validation |
| Forms | react-hook-form | ^7.76.1 | Form state management |
| Secure Storage | expo-secure-store | ~15.0.8 | Token & user persistence |
| Icons | lucide-react-native | ^1.16.0 | Icon set |
| Animations | react-native-reanimated | ~4.1.1 | Tab bar animations |
| Toasts | react-native-toast-message | ^2.3.3 | Notifications |
| Date Picker | @react-native-community/datetimepicker | 8.4.4 | Date selection |
| Fonts | @expo-google-fonts/tajawal | ^0.4.1 | Arabic Tajawal font |

---

## 3. App Architecture

### 3.1 Directory Structure

```
app/                              -- Expo Router routes (file-based)
  _layout.tsx                     -- Root layout (fonts, providers, splash)
  index.tsx                       -- Entry point: auth guard redirect
  (auth)/
    _layout.tsx                   -- Auth guard layout
    login.tsx                     -- Login screen
    register.tsx                  -- Registration screen
  (setup)/
    _layout.tsx                   -- Setup guard layout
    barn.tsx                      -- Barn creation form
    batch.tsx                     -- Batch creation form
  (tabs)/
    _layout.tsx                   -- Tab layout with FloatingTabBar
    home.tsx                      -- Home/Dashboard screen
    barn.tsx                      -- Barns list screen (placeholder)
    purchases.tsx                 -- Purchases screen (placeholder)
    sales.tsx                     -- Sales screen (placeholder)

src/                              -- Source code
  components/
    custom/
      AppButton.tsx               -- Reusable button
      AppInput.tsx                -- Reusable text input
      AppScreen.tsx               -- Screen wrapper
      AppText.tsx                 -- Typography component
      AppDatePicker.tsx           -- Date picker
      AppSelect.tsx               -- Searchable dropdown selector
      FloatingTabBar.tsx          -- Animated floating tab bar
      FormError.tsx               -- Form error message
    ToastConfig.tsx               -- Custom toast components
  config/
    fonts.ts                      -- Tajawal font loading
    rtl.ts                        -- RTL layout enablement
    splash.ts                     -- Splash screen config
  constants/
    colors.ts                     -- Light/dark color palettes
    tabs.ts                       -- Tab definitions
  contexts/
    ThemeContext.tsx               -- Theme context provider
  hooks/
    useAuthGuard.ts               -- Auth state checker
    Actions/
      auth/
        useLogin.jsx              -- Login mutation
        useRegister.jsx           -- Register mutation
      barn/
        useCurdsBarn.tsx          -- Barn CRUD hooks
      batch/
        useCurdBatch.tsx          -- Batch CRUD hooks
      users/
        useCurdsUser.jsx          -- User CRUD hooks
    curdsHook/
      usePostData.tsx             -- Generic POST mutation
      useGetData.tsx              -- Generic GET query
      usePutData.tsx              -- Generic PUT mutation
      useDeleteData.tsx           -- Generic DELETE mutation
    EndPoints/
      endPoints.ts                -- API endpoint constants
      queryKeys.ts                -- Query key constants
    handleRequest/
      PostRequest.ts              -- POST request wrapper
      GetRequest.ts               -- GET request wrapper
      PutRequest.ts               -- PUT request wrapper
      DeleteRequest.ts            -- DELETE request wrapper
      PatchRequest.ts             -- PATCH request wrapper
  providers/
    TanstackProvider.tsx          -- QueryClient provider
  services/
    clientService.ts              -- Axios instance (baseURL + Bearer token)
    cookies.ts                    -- SecureStore wrapper
    toast.ts                      -- Toast helper functions
  types/
    index.ts                      -- Re-exports all types
    api.ts                        -- API request/response types
    auth.ts                       -- Auth context type
    hooks.ts                      -- Hook option types
    theme.ts                      -- Theme types
    user.ts                       -- User interface
  validationSchema/
    auth/
      login.ts                    -- Login Zod schema
      register.ts                 -- Register Zod schema
    barn/
      barn.ts                     -- Barn Zod schema
    batch/
      batch.ts                    -- Batch Zod schema
```

### 3.2 Navigation Structure (Expo Router)

```
Root Stack (_layout.tsx)
  |-- index.tsx (redirect only, renders nothing visible)
  |
  |-- (auth) Group (Stack Navigator)
  |     |-- login.tsx
  |     |-- register.tsx
  |
  |-- (setup) Group (Stack Navigator)
  |     |-- barn.tsx
  |     |-- batch.tsx
  |
  |-- (tabs) Group (4 tabs, custom FloatingTabBar)
        |-- home.tsx
        |-- barn.tsx
        |-- sales.tsx
        |-- purchases.tsx
```

### 3.3 Data Flow Layers

```
Screen (UI)
  |  uses
Action Hook (e.g., useLogin, useAddBarn)
  |  uses
CRUD Hook (e.g., usePostData, useGetData)
  |  uses
Request Handler (e.g., PostRequest, GetRequest)
  |  uses
Client Service (Axios instance with Bearer token injection)
  |
  v
Laravel REST API (http://192.168.100.8:8000/api)
```

---

## 4. Initialization & Boot Flow

### 4.1 App Launch Sequence

```
App Entry (package.json → "main": "expo-router/entry")
  |
  v
Root Layout (app/_layout.tsx)
  |
  1. Enable RTL ---------------------- src/config/rtl.ts
     - I18nManager.allowRTL(true)
     - I18nManager.forceRTL(true)
  |
  2. Set default font ---------------- src/config/fonts.ts
     - Sets Tajawal as default fontFamily on React Native's Text
  |
  3. Init splash screen -------------- src/config/splash.ts
     - SplashScreen.preventAutoHideAsync()
  |
  4. Load Tajawal fonts -------------- @expo-google-fonts/tajawal
     - Tajawal_400Regular, Tajawal_700Bold
     - Renders null while fonts load
  |
  5. OnLayout callback hides splash -- SplashScreen.hideAsync()
  |
  6. Render provider tree:
     SafeAreaProvider
       SafeAreaView (bg-background, flex: 1, edges: [top, bottom])
         TanstackProvider (QueryClient)
           ThemeProvider (ThemeContext)
             ThemeAwareStatusBar (dark/light based on theme)
             ThemedStack (Stack with themed background)
             Toast (react-native-toast-message with custom config)
```

### 4.2 Auth Guard — Entry Redirect

**File:** `app/index.tsx`

The `useAuthGuard()` hook reads from **SecureStore** synchronously at mount:

```
useAuthGuard():
  1. Check if "Realestate_TOKEN" exists in SecureStore
  2. If no token → { isAuthenticated: false }
  3. If token exists → Read "Realestate_USER" from SecureStore
  4. Return { user, isAuthenticated, hasCompletedSetup: user.has_completed_setup }
```

The `index.tsx` screen renders nothing visible and performs redirect:

```
if isLoading → return null (do nothing)
if !isAuthenticated → router.replace("/(auth)/login")
if !hasCompletedSetup → router.replace("/(setup)/barn")
else → router.replace("/(tabs)/home")
```

### 4.3 Route Guard Layouts

Each route group has a layout that re-checks auth and redirects if the user does not belong there:

| Layout | Renders when | Redirect |
|---|---|---|
| `(auth)/_layout.tsx` | User is NOT authenticated | `(tabs)/home` or `(setup)/barn` if authenticated |
| `(setup)/_layout.tsx` | User IS authenticated AND has NOT completed setup | `(auth)/login` if no token; `(tabs)/home` if setup done |
| `(tabs)/_layout.tsx` | User IS authenticated AND has completed setup | `(auth)/login` if no token; `(setup)/barn` if setup not done |

---

## 5. Authentication Flow

### 5.1 Registration Screen — Step-by-Step Interaction

**Screen:** `app/(auth)/register.tsx`
**Route:** `/register`

#### 5.1.1 Screen Appearance

The user arrives at the register screen after tapping "سجل الآن" (Register Now) from the login screen. The screen renders inside an `AppScreen` wrapper which provides:

- **`KeyboardAvoidingView`** with `behavior="padding"` — pushes content up when the keyboard opens so fields remain visible.
- **`ScrollView`** with `contentContainerClassName="items-center px-4 pt-20 justify-start"` — content is centered horizontally, starts 80px from the top, and is scrollable if the keyboard covers fields.
- Background color: `bg-background-light dark:bg-background-dark` (white in light mode, `#242424` in dark mode).

At the top of the scrollable area, a **card** (`max-w-md`, `rounded-2xl`, `p-6`) contains all form elements.

#### 5.1.2 Header Section

Inside the card, the header contains:

1. **Icon container** — a 48x48 rounded square (`rounded-xl`) with `secondary` background and `border` border. Inside sits a `User` icon (lucide-react-native) at 24px, colored with the theme's `text` color.
2. **Title** — `AppText variant="h1"` displaying "إنشاء حساب جديد" (Create New Account), center-aligned.
3. **Subtitle** — `AppText variant="body"` with `muted={true}` displaying "أدخل بياناتك للتسجيل" (Enter your data to register), center-aligned, slightly transparent.

#### 5.1.3 Name Field

| Property | Value |
|---|---|
| **Label** | "الاسم" (Name) — `AppText variant="label"` |
| **Icon** | `User` icon (18px, `mutedForeground` color), positioned inside a right-icon slot on the `AppInput` |
| **Placeholder** | "أدخل اسمك" (Enter your name) |
| **Keyboard type** | Default |
| **Text alignment** | `textAlign="right"` |
| **Validation** | Required, min 1 character via Zod |

**Interaction sequence:**
1. User taps the field → `TextInput` receives focus → keyboard opens (default type).
2. As the user types, `react-hook-form`'s `Controller` calls `onChange` on each keystroke.
3. Validation runs on every change (`mode: "onChange"` in `useForm`).
4. If the field is empty and touched, the Zod error `"الاسم مطلوب"` (Name is required) appears below the input as an `AppText variant="error"` inside `FormError`, with a red border around the input (`border-error-light dark:border-error-dark`).
5. On valid input, the error disappears and the border reverts to `border-border-light dark:border-border-dark`.

#### 5.1.4 Phone Field

| Property | Value |
|---|---|
| **Label** | "رقم الموبيل" (Phone Number) |
| **Icon** | `Phone` icon (18px) |
| **Placeholder** | "أدخل رقم الموبيل" (Enter your phone number) |
| **Keyboard type** | `phone-pad` (numeric keypad with phone-specific symbols) |
| **Text alignment** | Right |
| **Validation** | Required + regex `^01[0-2,5]{1}[0-9]{8}$` (Egyptian mobile: starts with 01, followed by 0,1,2, or 5, then 8 digits) |

**Interaction sequence:**
1. User taps → `phone-pad` keyboard opens.
2. Validation regex checked on each change.
3. Invalid format → shows "رقم الموبايل غير صحيح" (Phone number is incorrect).
4. Empty → shows "رقم الموبايل مطلوب" (Phone number is required).

#### 5.1.5 Password Field

| Property | Value |
|---|---|
| **Label** | "كلمة المرور" (Password) |
| **Left icon** | `Lock` icon (18px) — positioned left side |
| **Right icon** | `Eye`/`EyeOff` toggle (18px) — pressable |
| **Placeholder** | "أدخل كلمة المرور" (Enter your password) |
| **Secure entry** | `true` when hidden, `false` when visible |
| **Validation** | Required, min 6 characters |

**Visibility toggle interaction:**
1. Initial state: `showPassword = false`, so `secureTextEntry={true}` — dots mask the input, right icon shows `Eye`.
2. User taps the Eye icon → `setShowPassword(!showPassword)` → `showPassword = true` → `secureTextEntry={false}` → password characters are readable, icon switches to `EyeOff`.
3. User taps EyeOff → reverses.

#### 5.1.6 Confirm Password Field

| Property | Value |
|---|---|
| **Label** | "تأكيد كلمة المرور" (Confirm Password) |
| **Left icon** | `Lock` icon |
| **Right icon** | `Eye`/`EyeOff` toggle (separate state: `showpassword_confirmation`) |
| **Placeholder** | "أعد إدخال كلمة المرور" (Re-enter your password) |
| **Secure entry** | Controlled by `showpassword_confirmation` |
| **Validation** | Required, min 6 characters, AND must match `password` via Zod `.refine()` |

**Cross-field validation:**
- The `registerSchema` uses `.refine()` to compare `password === password_confirmation`.
- If they don't match, an error is added to `password_confirmation`'s path: "كلمتا المرور غير متطابقتين" (Passwords do not match).
- This is checked on every change, so as soon as the user corrects one field, the error disappears.

#### 5.1.7 Submit Button

`AppButton` with `variant="primary"` (default), displaying "إنشاء حساب" (Create Account).

| State | Visual |
|---|---|
| **Idle** | Solid black/dark background, white text, full width, rounded-xl, 14px vertical padding |
| **Loading** (`isPending=true`) | All interaction disabled via `disabled={true}` + `opacity-50`; text replaced by `ActivityIndicator` spinner (color matches `colors.background`) |
| **Invalid form** | Button IS enabled (validation errors do NOT disable the button — `handleSubmit` blocks submission) |

#### 5.1.8 Link to Login

At the bottom of the card:
- Text: "لديك حساب بالفعل؟" (Already have an account?) in `bodySmall` muted.
- Link: "تسجيل الدخول" (Login) in `primary` color, wrapped in `<Link href="/login">` from expo-router.
- Both inside a `flex-row justify-center items-center` container.

#### 5.1.9 Submit Execution Flow

1. User fills in all 4 fields and taps "إنشاء حساب".
2. `handleSubmit(onSubmit)` is called. If Zod validation fails at the field level, the form does NOT submit and each invalid field shows its respective error message.
3. If validation passes, `mutate({ data: { name, phone, password, password_confirmation } })` fires.
4. Inside `usePostData`, the `mutationFn` runs:

   ```
   → toast.loading("جاري المعالجة...")   // Persistent loading toast at top of screen
   → postRequest("/register", data)       // Axios POST to http://192.168.100.8:8000/api/register
   → Waits for response
   ```

5. **On success (HTTP 200/201):**
   - Loading toast dismissed via `toast.dismiss(toastId)`.
   - Token extracted: `data?.data?.data?.token || data?.data?.token`.
   - Token saved to SecureStore: `setAuthToken(token)` (key: `"Realestate_TOKEN"`).
   - User extracted: `data?.data?.data?.user`.
   - User saved to SecureStore: `setUser(user)` (key: `"Realestate_USER"`, JSON stringified).
   - Query cache invalidated for keys `["/register"]`.
   - Success toast: API's `message` field shown.
   - `router.replace("/(setup)/barn")` — user moves to onboarding.

6. **On error (HTTP 422/400/500):**
   - Loading toast dismissed.
   - Error parsed from Axios response:
     - `error.response.data.message` as string → toast that message (e.g., "رقم الموبايل مسجل بالفعل").
     - `error.response.data.message` as object → toast each value separately.
     - `error.response.data.errors` as array → toast first error message.
     - Fallback: "حدث خطأ غير متوقع" (Unexpected error).
   - `errorMsg` state set (not displayed in UI, only logged to console).

#### 5.1.10 Post-Success Navigation

`router.replace("/(setup)/barn")` navigates using `replace` so the register screen is removed from the stack — no back navigation to it. The `(setup)` layout re-runs `useAuthGuard` and, seeing the user is authenticated but `hasCompletedSetup = false`, renders the barn creation screen.

---

### 5.2 Login Screen — Step-by-Step Interaction

**Screen:** `app/(auth)/login.tsx`
**Route:** `/login`

#### 5.2.1 Screen Appearance

Same `AppScreen` wrapper: `KeyboardAvoidingView` + `ScrollView`. Background and card layout identical to register. The `(auth)/_layout.tsx` guard has verified the user is NOT authenticated, so the Stack renders the login screen normally.

#### 5.2.2 Header Section

1. **Icon container** — 48x48 rounded square with `Lock` icon (24px).
2. **Title** — "مرحباً بعودتك" (Welcome Back) — `h1` variant, center-aligned.
3. **Subtitle** — "أدخل بيانات الدخول الخاصة بك" (Enter your login credentials) — `body` muted.

#### 5.2.3 Phone Field

Same configuration as register:
- Label: "رقم الموبيل", `Phone` icon, placeholder "أدخل رقم الموبيل"
- `keyboardType="phone-pad"`, validation: Egyptian mobile regex

**Interaction:**
- User taps → `phone-pad` opens.
- Typing triggers validation — errors appear/disappear in real time.
- Error messages: "رقم الموبايل مطلوب" or "رقم الموبايل غير صحيح".

#### 5.2.4 Password Field

- Label: "كلمة المرور", `Lock` icon left, `Eye`/`EyeOff` right
- Placeholder: "أدخل كلمة المرور"
- `secureTextEntry` toggled by `showPassword`
- Validation: min 6 chars, error: "كلمة المرور لازم تكون 6 أحرف على الأقل"

#### 5.2.5 Submit Button

"تسجيل الدخول" (Login) — same `AppButton` behavior:
- Idle: solid primary background
- Loading: spinner replaces text, opacity reduced, disabled
- On press: `handleSubmit(onSubmit)` triggers Zod validation first

#### 5.2.6 Link to Register

- "ليس لديك حساب؟" (Don't have an account?) in muted bodySmall
- "سجل الآن" (Register Now) → `<Link href="/register">` in primary color

#### 5.2.7 Submit Execution Flow

1. User enters phone + password and taps "تسجيل الدخول".
2. `mutate({ data: { phone, password } })` fires.
3. `useLogin` hook → `usePostData("/login", ["/login"], ["/login"])`:

   ```
   mutationFn:
     → toast.loading("جاري المعالجة...")
     → postRequest("/login", { phone, password })
     → Axios POST to http://192.168.100.8:8000/api/login
   ```

4. **On success:**
   - Loading toast dismissed.
   - Token saved to SecureStore.
   - User saved to SecureStore.
   - Success toast shown.
   - `router.replace("/(setup)/barn")`.

5. **On error:**
   - Loading toast dismissed.
   - Error parsed and toasted.
   - `errorMsg` state set (logged to console).
   - User stays on login screen to retry.

#### 5.2.8 Key Difference from Register

The `useLogin` hook manages all success/error logic via a `useEffect` watching `isSuccess`/`isError`/`data`. The screen only passes optional `onSuccess`/`onError` callbacks (used for console logging). No user data refresh or setup check occurs here — that happens in the `(setup)` layout guard.

---

### 5.3 Logout — Step-by-Step Interaction

**Screen:** `app/(tabs)/home.tsx`

#### 5.3.1 The Logout Button

A `TouchableOpacity` with:
- `className="mt-6 bg-red-500 px-4 py-2 rounded"`
- Contains `AppText variant="body"` with white text: "تسجيل الخروج" (Logout).

There is **no confirmation dialog** — the action fires immediately on press.

#### 5.3.2 Execution

```
handleLogout:
  removeAuthToken()  → SecureStore.deleteItemAsync("Realestate_TOKEN")
  removeUser()        → SecureStore.deleteItemAsync("Realestate_USER")
  router.replace("/login")
```

**Note:** The backend `POST /api/logout` (which revokes the Sanctum token) is NOT called. Logout is entirely client-side. On next app launch, `useAuthGuard` finds no token, returns `isAuthenticated: false`, and redirects to `/(auth)/login`.

#### 5.3.3 Post-Logout Navigation

`router.replace("/login")` sends the user to the login screen. The `(tabs)/_layout.tsx` guard also re-runs `useAuthGuard`, detects `!isAuthenticated`, and redirects to `(auth)/login` as a safety net — but the explicit navigation already accomplishes this.

---

### 5.4 Token Management

**File:** `src/services/cookies.ts`

| Function | Key | Action |
|---|---|---|
| `setAuthToken(token)` | `Realestate_TOKEN` | Save token |
| `getAuthToken()` | `Realestate_TOKEN` | Read token (or empty string) |
| `checkAuthToken()` | `Realestate_TOKEN` | Returns `boolean` |
| `removeAuthToken()` | `Realestate_TOKEN` | Delete token |
| `setUser(user)` | `Realestate_USER` | Save user as JSON |
| `getUser()` | `Realestate_USER` | Read and parse user JSON |
| `removeUser()` | `Realestate_USER` | Delete user |

### 5.5 Axios Bearer Token Injection

**File:** `src/services/clientService.ts`

Every API request automatically reads the token from SecureStore and injects it:

```
const request = async (options, tokenOverride) => {
  const token = tokenOverride ?? (await getAuthToken());
  return axios.request({
    ...options,
    headers: {
      ...options.headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
};
```

### 5.6 Backend Auth (Laravel Sanctum)

| Endpoint | Auth | Controller |
|---|---|---|
| `POST /api/register` | Public | AuthController@register |
| `POST /api/login` | Public | AuthController@login |
| `POST /api/logout` | Sanctum | AuthController@logout |
| `GET /api/user` | Sanctum | AuthController@user |

---

## 6. Onboarding / Setup Flow

After successful registration or login, new users who have `has_completed_setup === false` are guided through a **2-step onboarding** process to set up their first barn and batch.

### 6.1 Route Guard

**File:** `app/(setup)/_layout.tsx`

The `(setup)` layout renders only when:
- User IS authenticated (`isAuthenticated === true`) AND
- User has NOT completed setup (`hasCompletedSetup === false`)

**Guard logic:**
```
useEffect:
  if isLoading → return (do nothing, render null)
  if !isAuthenticated → router.replace("/(auth)/login")
  if hasCompletedSetup → router.replace("/(tabs)/home")
  else → render the Stack with barn/batch screens
```

On mount, the guard re-reads SecureStore via `useAuthGuard()`. If the user just registered, the token and user are already in SecureStore, so `isAuthenticated = true` and `hasCompletedSetup = false` → the stack renders the barn form.

Once the user completes step 2 (batch creation), the backend sets `has_completed_setup = true`. The frontend then refreshes the user object in SecureStore, and the next layout re-check redirects to `(tabs)/home`.

### 6.2 Step 1: Barn Creation — Step-by-Step Interaction

**Screen:** `app/(setup)/barn.tsx`
**Route:** `/(setup)/barn`

#### 6.2.1 Screen Appearance

After successful auth redirect, the user lands on the barn creation screen. Same `AppScreen` wrapper: `KeyboardAvoidingView` + `ScrollView`, same background, same card layout as auth screens.

#### 6.2.2 Header Section

1. **Icon container** — 48x48 rounded square with `Warehouse` icon (24px).
2. **Title** — "بيانات العنبر" (Barn Data) — `h1` variant.
3. **Subtitle** — "أدخل بيانات العنبر الجديدة" (Enter new barn data) — `body` muted.

#### 6.2.3 Name Field

| Property | Value |
|---|---|
| **Label** | "اسم العنبر" (Barn Name) |
| **Icon** | `Warehouse` icon (18px) |
| **Placeholder** | "أدخل اسم العنبر" (Enter barn name) |
| **Validation** | Required, max 255 chars |

**Error messages:**
- Empty: "اسم العنبر مطلوب" (Barn name is required)
- >255 chars: "اسم العنبر لا يمكن أن يتجاوز 255 حرفًا" (Barn name cannot exceed 255 characters)

#### 6.2.4 Location Field (Optional)

| Property | Value |
|---|---|
| **Label** | "الموقع" (Location) |
| **Icon** | `MapPin` icon (18px) |
| **Placeholder** | "أدخل الموقع (اختياري)" (Enter location — optional) |
| **Validation** | Optional, max 255 chars |

If left empty, the Zod schema accepts `""` as a valid value (via `.optional().or(z.literal(""))`).

#### 6.2.5 Capacity Field

| Property | Value |
|---|---|
| **Label** | "السعة" (Capacity) |
| **Icon** | `Hash` icon (18px) |
| **Placeholder** | "أدخل السعة" (Enter capacity) |
| **Keyboard type** | `numeric` |
| **Validation** | Required, must be a positive integer > 0 |

**Error messages:**
- Empty: Rejected by `.refine()` — "سعة العنبر يجب أن تكون رقمًا صحيحًا أكبر من 0" (Capacity must be a positive integer greater than 0)
- Non-integer (e.g., "abc", "1.5"): Same error — the refine checks `Number.isInteger(num) && num > 0`

The value is typed as `string` in the form (to support `keyboardType="numeric"`) but converted to `number` implicitly on send.

#### 6.2.6 Notes Field (Optional)

| Property | Value |
|---|---|
| **Label** | "ملاحظات" (Notes) |
| **Icon** | `FileText` icon |
| **Placeholder** | "أدخل ملاحظات (اختياري)" (Enter notes — optional) |
| **Multiline** | Yes, `numberOfLines={3}` |
| **Validation** | Optional |

#### 6.2.7 Submit Button

`AppButton` displaying "حفظ" (Save). Same behavior as auth buttons: idle, loading (spinner + dim), invalid form (no explicit disable, but `handleSubmit` blocks submission).

#### 6.2.8 Submit Execution Flow

1. User fills in barn details and taps "حفظ".
2. `handleSubmit(onSubmit)` validates via Zod `barnSchema`.
3. If valid, `mutate({ data: { name, location, capacity, notes } })` fires.
4. **Toast lifecycle:**
   - Loading toast appears: "جاري المعالجة..." (Processing...)
   - Axios POST to `http://192.168.100.8:8000/api/barns` with Bearer token.
5. **On success:**
   - Loading toast dismissed.
   - Success toast: API message (e.g., "تم إنشاء العنبر بنجاح" / Barn created successfully).
   - Cache invalidated for `["/barns", "/barns/add"]`.
   - `router.replace("/(setup)/batch")` — navigates to step 2.
6. **On error:**
   - Loading toast dismissed.
   - Error toasted (e.g., validation errors from server like duplicate barn name).
   - User stays on barn form to correct and retry.

#### 6.2.9 Navigation to Batch

`router.replace("/(setup)/batch")` uses `replace` so there is no back navigation to the barn form. The `(setup)/_layout.tsx` guard still protects the route.

---

### 6.3 Step 2: Batch Creation — Step-by-Step Interaction

**Screen:** `app/(setup)/batch.tsx`
**Route:** `/(setup)/batch`

#### 6.3.1 Screen Appearance

Same `AppScreen` wrapper and card layout. After barn creation, the batch form appears.

#### 6.3.2 Header Section

1. **Icon container** — 48x48 rounded square with `Tags` icon (24px).
2. **Title** — "بيانات الدفعة" (Batch Data) — `h1`.
3. **Subtitle** — "أدخل بيانات الدفعة الجديدة" (Enter new batch data) — `body` muted.

#### 6.3.3 Barn Selector (AppSelect)

| Property | Value |
|---|---|
| **Label** | "العنبر" (Barn) |
| **Left icon** | `Warehouse` icon (18px) |
| **Placeholder** | "اختر العنبر" (Select barn) |

**Data loading:**
- On mount, `useGetAllBarns()` fires `GET /api/barns` with `page=1, limit=20`.
- The response is typed as `{ data: { data: { id: number, name: string }[] } }`.
- Results are mapped to `{ label: barn.name, value: barn.id }` options.
- While loading, the trigger shows a `loading` state with `ActivityIndicator` in the modal.

**Dropdown interaction sequence:**
1. User taps the trigger → `Keyboard.dismiss()` is called to close any open keyboard.
2. `setModalVisible(true)` opens the Modal overlay.
3. Modal renders:
   - **Header**: Shows the currently selected label (or placeholder text "اختر العنبر") + an `X` close button.
   - **Search bar** (_searchable = true_): A `TextInput` with `Search` icon, placeholder "بحث..." (Search...), and a clear button that appears when text is entered. The search query is stored in `searchQuery` state.
   - **FlatList**: Renders filtered options. Filtering is case-insensitive and matches against both `label` and `value`:
     ```
     filteredOptions = options.filter(opt =>
       opt.label.toLowerCase().includes(query) ||
       String(opt.value).toLowerCase().includes(query)
     )
     ```
   - **Empty state**: If no options match, shows "لا توجد خيارات" (No options).
   - **Separator**: 1px line between each item.
4. User taps an option:
   - `onChange(option.value)` fires → the form value updates to `barn_id`.
   - `onBlur()` fires.
   - `setModalVisible(false)` closes the modal.
   - The trigger now shows the selected barn's name.
5. User taps the `X` or backdrop → `handleClose()` fires → `onBlur()` + `setModalVisible(false)`.

**Validation:** `barn_id` must be a positive integer > 0. Error: "معرّف العنبر مطلوب ويجب أن يكون رقمًا صحيحًا" (Barn ID is required and must be an integer).

#### 6.3.4 Poultry Type Field

| Property | Value |
|---|---|
| **Label** | "نوع الدواجن" (Poultry Type) |
| **Icon** | `Tags` icon |
| **Placeholder** | "أدخل نوع الدواجن" (Enter poultry type) |
| **Validation** | Required, max 255 chars |

Examples: "دجاج لاحم" (Broiler), "دجاج بياض" (Layer), "بط" (Duck).

#### 6.3.5 Initial Quantity Field

| Property | Value |
|---|---|
| **Label** | "الكمية الابتدائية" (Initial Quantity) |
| **Icon** | `Hash` icon |
| **Placeholder** | "أدخل الكمية الابتدائية" (Enter initial quantity) |
| **Keyboard type** | `numeric` |
| **Validation** | Required, integer >= 1 |

Error: "الكمية الابتدائية يجب أن تكون رقمًا صحيحًا وأكبر من 0" (Initial quantity must be an integer greater than 0).

#### 6.3.6 Start Date Picker (AppDatePicker)

| Property | Value |
|---|---|
| **Label** | "تاريخ البداية" (Start Date) |
| **Left icon** | `Calendar` icon |
| **Placeholder** | "اختر تاريخ البداية" (Select start date) |
| **Validation** | Required, valid parseable date |

**Interaction sequence (Android):**
1. User taps the date trigger → `tempDate` is set to the current `value` (or today if empty).
2. `setShow(true)` opens the native `DateTimePicker` as a dialog, `mode="date"`.
3. User scrolls to select year, month, day and taps OK.
4. `onChange` fires with `type !== "dismissed"` → `onChange(formatDate(selectedDate))` sets the date as `YYYY-MM-DD` string.
5. `setShow(false)` closes the dialog.

**Interaction sequence (iOS):**
1. User taps the date trigger → `tempDate` is set, `setShow(true)`.
2. The native `DateTimePicker` appears inline with `display="spinner"` (spinning wheels for month/day/year).
3. User spins the wheels to the desired date. `onChange` fires on each spin but only updates `tempDate` (does NOT commit).
4. User taps the "تم" (Done) button below the picker → `handleDone()` → `onChange(formatDate(tempDate))` commits the date, `setShow(false)` closes.
5. User can also tap outside or the dismiss gesture to cancel (no date set).

**Constraints:** The `end_date` value is watched via `useWatch`. If `end_date` is set, `maximumDate` is set to `parsedEnd`, preventing the user from picking a start date after the end date.

#### 6.3.7 End Date Picker (Optional)

| Property | Value |
|---|---|
| **Label** | "تاريخ النهاية" (End Date) |
| **Left icon** | `Calendar` icon |
| **Placeholder** | "اختر تاريخ النهاية (اختياري)" (Select end date — optional) |
| **Validation** | Optional, must be >= start_date if provided |

**Cross-validation interaction:**
- `useWatch` tracks both `start_date` and `end_date`.
- End date's `minimumDate` = `parsedStart` (the start date). The user cannot select an end date before the start date.
- A `useEffect` watches `start_date`: if `startDate` changes and `endDate` is before it, `setValue("end_date", "")` clears the end date with validation.
- The Zod schema also includes a `.superRefine()` that checks `end_date >= start_date` at submission time, adding a custom error if violated.

#### 6.3.8 Notes Field (Optional)

Identical to barn notes: `FileText` icon, multiline, 3 lines, optional.

#### 6.3.9 Submit Button

"حفظ" (Save) — same behavior.

#### 6.3.10 Submit Execution Flow

1. User fills/selects all fields and taps "حفظ".
2. `handleSubmit(onSubmit)` validates via Zod `batchSchema`.
3. Data conversion before mutation:
   ```typescript
   {
     barn_id: Number(barn_id),         // Convert to number
     poultry_type,
     initial_quantity: Number(initial_quantity), // Convert to number
     start_date,
     end_date,
     notes,
   }
   ```
4. `mutate({ data, onSuccess: async () => { ... } })` fires.
5. **Toast lifecycle:**
   - Loading toast: "جاري المعالجة..."
   - Axios POST to `http://192.168.100.8:8000/api/batches`.
6. **On success:**
   - Loading toast dismissed.
   - Query cache invalidated for `["/batches", "/batches/add", "/user"]`.
   - **Critical: User data refresh** — the `onSuccess` callback runs:
     ```
     // 1. Fetch fresh user data
     const refreshedUserData = await queryClient.fetchQuery({
       queryKey: ["/user"],
       queryFn: () => getRequest("/user"),
     });
     // 2. Extract user from response (nested: data.data.data)
     const user = refreshedUserData.data.data;
     // 3. Update SecureStore with new user (has_completed_setup = true)
     await setUser(user);
     // 4. Navigate to main app
     router.replace("/(tabs)/home");
     ```
   - Success toast: API message (e.g., "تم إنشاء الدفعة بنجاح" / Batch created successfully).

7. **On error:**
   - Loading toast dismissed.
   - Error toasted.
   - User stays on batch form.

#### 6.3.11 Post-Success Navigation

`router.replace("/(tabs)/home")` replaces the setup stack with the tabs layout. The `(tabs)/_layout.tsx` guard re-checks auth. Since `hasCompletedSetup` is now `true` (from the refreshed SecureStore), the guard allows rendering the tabs.

---

---

## 7. Main App — Tab Flow

After completing onboarding, the user enters the main app with 4 tabs. The `(tabs)/_layout.tsx` guard ensures only authenticated users with `hasCompletedSetup === true` reach this area.

### 7.1 Tab Configuration

**File:** `src/constants/tabs.ts`

```typescript
[
  { name: "home",      title: "الرئيسية" (Home),      icon: Home },
  { name: "barn",      title: "العنابر" (Barns),      icon: Building2 },
  { name: "sales",     title: "المبيعات" (Sales),     icon: BarChart3 },
  { name: "purchases", title: "المشتريات" (Purchases), icon: ShoppingBag },
]
```

### 7.2 Tabs Layout Guard

**File:** `app/(tabs)/_layout.tsx`

```
useEffect:
  if isLoading → return null
  if !isAuthenticated → router.replace("/(auth)/login")
  if !hasCompletedSetup → router.replace("/(setup)/barn")
```

If the guard passes, it renders:

```tsx
<Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <FloatingTabBar {...props} />}>
  {TABS.map((tab) => <Tabs.Screen key={tab.name} name={tab.name} />)}
</Tabs>
```

**Key implementation detail:** The `TABS` constant is iterated to generate all `Tabs.Screen` entries dynamically. Each tab screen file must exist in `app/(tabs)/` matching the `name` property or Expo Router will throw.

### 7.3 Floating Tab Bar — Interaction Detail

**File:** `src/components/custom/FloatingTabBar.tsx`

#### 7.3.1 Visual Structure

```
┌──────────────────────────────────────────────┐
│   ● الرئيسية   ○ العنابر   ○ المبيعات   ○ المشتريات  │
└──────────────────────────────────────────────┘
     [home]       [barn]      [sales]     [purchases]
```

The tab bar is positioned `absolute` at the bottom of the screen (not inline), meaning it floats above the content. Content scrolls behind it.

#### 7.3.2 Container

- `position: "absolute", bottom: 0, left: 0, right: 0` — overlays the content.
- `pointerEvents="box-none"` — allows touch events to pass through to content below when not interacting with the bar.
- Inner bar:
  - `marginHorizontal: 16, marginBottom: 8` — creates 16px horizontal gaps from screen edges.
  - `borderRadius: 28` — rounded pill shape.
  - `paddingVertical: 4, paddingHorizontal: 8` — internal spacing.
  - `flexDirection: "row"` — horizontal layout.
  - `justifyContent: "space-evenly"` — equal spacing.
  - Background: `colors.card` (from theme).
  - Shadow (iOS): `shadowColor: "#000", shadowOffset: {0, 4}, shadowOpacity: 0.15, shadowRadius: 12`.
  - Elevation (Android): `elevation: 8`.
- Bottom padding: `Math.max(insets.bottom, 8)` — respects iPhone home indicator.

#### 7.3.3 Tab Item Animation

Each tab is wrapped in `Animated.View` with `useAnimatedStyle`:

```typescript
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: withSpring(isFocused ? 1 : 0.88, { damping: 16, stiffness: 260 }) }],
}));
```

**Tap interaction flow:**
1. User taps an inactive tab → `onPress` fires.
2. `navigation.emit({ type: "tabPress", ... })` emits the tab press event.
3. If `!isFocused && !event.defaultPrevented`, `navigation.navigate(tab.name)` navigates.
4. As the focused tab changes, Reanimated springs the previous tab to scale 0.88 and the new tab to scale 1.0.
5. The active tab simultaneously:
   - Shows a circular background (`36x36`, `borderRadius: 18`) behind the icon.
   - Inverts icon/label colors (black circle in light mode → white icon; white circle in dark mode → black icon).
   - Increases icon `strokeWidth` from 2 to 2.5.
   - Increases label opacity from 0.6 to 1.0.

**Long press:** Emits `tabLongPress` event (no custom behavior in current code).

### 7.4 Tab Screens — Interaction Detail

#### 7.4.1 Home Screen (`app/(tabs)/home.tsx`)
**Route:** `/(tabs)/home`

**Current implementation** is a minimal placeholder.

**Screen layout:**
- `AppScreen` with `contentContainerClassName="items-center justify-center px-4 flex-1"` — vertically centered.
- **Title:** `AppText variant="h1"` — "الرئيسية" (Home).
- **Subtitle:** `AppText variant="body" muted` — "مرحباً بك في التطبيق" (Welcome to the app).
- **Logout button:** A `TouchableOpacity` with red background (`bg-red-500`), padding, rounded corners, containing white "تسجيل الخروج" (Logout) text.

**All user can do on this screen currently:**
1. Read the welcome message.
2. Tap the logout button (see section 5.3).

**Backend endpoint available but not connected:**
`GET /api/dashboard` returns:
- Barn count, active batch count
- Financial summary (total purchases, total sales, outstanding payments)
- Production insights (current poultry count, mortality rate)
- Alerts (low inventory, upcoming tasks)
- Recent activity (latest purchases, sales, deaths)

#### 7.4.2 Barn Tab (`app/(tabs)/barn.tsx`)
**Route:** `/(tabs)/barn`

**Current implementation:** Placeholder. Renders a single `<AppText>` with the text "barn".

**Available but unused CRUD hooks:**
| Hook | Method | Endpoint |
|---|---|---|
| `useGetAllBarns(page, limit)` | GET | `/barns?page=&limit=` |
| `useAddBarn()` | POST | `/barns` |
| `useDeleteBarn()` | DELETE | `/barns/{id}` |
| `useUpdateBarn()` | PUT | `/barns/{id}` |

**Expected future flow:**
- Listing: Display barns from `useGetAllBarns` in a FlatList with pull-to-refresh.
- Create: Navigate to a form (could reuse the setup barn form in a modal or new screen).
- Edit: Tap a barn → pre-filled form via `useUpdateBarn`.
- Delete: Swipe to delete or long-press → confirmation dialog → `useDeleteBarn` with `id`.

#### 7.4.3 Sales Tab (`app/(tabs)/sales.tsx`)
**Route:** `/(tabs)/sales`

**Current implementation:** Placeholder. Renders text "sales".

**Backend endpoints ready:**
- `GET /sales` — List sales (paginated)
- `POST /sales` — Create sale
- `GET /sales/{id}` — Show sale
- `PUT /sales/{id}` — Update sale
- `DELETE /sales/{id}` — Soft delete sale

Related: `GET /customers`, `POST /customers`, etc.

#### 7.4.4 Purchases Tab (`app/(tabs)/purchases.tsx`)
**Route:** `/(tabs)/purchases`

**Current implementation:** Placeholder. Renders text "purchases".

**Backend endpoints ready:**
- `GET /purchases` — List purchases
- `POST /purchases` — Create purchase
- `GET /purchases/{id}` — Show purchase
- `PUT /purchases/{id}` — Update purchase
- `DELETE /purchases/{id}` — Soft delete

Related: `GET /suppliers`, `POST /suppliers`, etc.

### 7.5 Tab Navigation Behavior

**Initial tab:** After onboarding redirect, the default tab is `home` (the first tab in the `TABS` array).

**State persistence:** Expo Router keeps all tab screens mounted. Switching tabs does NOT unmount the previous tab — each tab maintains its scroll position and form state if any.

**Tab bar visibility:** The custom `FloatingTabBar` is used instead of the default bottom tab bar. It is rendered by the `tabBar` prop and applies globally to all tabs within the group.

---

---

## 8. Component Library

### 8.1 AppButton (`src/components/custom/AppButton.tsx`)

A themed button with 3 variants:
| Variant | Background | Text |
|---|---|---|
| `primary` | `bg-primary` | `text-background` |
| `secondary` | `bg-secondary` | `text-text` |
| `outline` | Transparent + border | `text-text` |

Props: `loading` (shows ActivityIndicator), `disabled` (reduces opacity), plus all `TouchableOpacityProps`.

### 8.2 AppInput (`src/components/custom/AppInput.tsx`)

A themed text input with:
- `leftIcon` / `rightIcon` slots (absolute positioned)
- Error state with red border + FormError message below
- Dark mode support via color tokens
- Passes through all `TextInputProps`

### 8.3 AppScreen (`src/components/custom/AppScreen.tsx`)

Screen wrapper providing:
- `KeyboardAvoidingView` (behavior="padding")
- Optional `ScrollView` (default: scrollable)
- `contentContainerClassName` for ScrollView styling
- Safe area status bar offset for iOS

### 8.4 AppText (`src/components/custom/AppText.tsx`)

Typography component with variants:
| Variant | Style |
|---|---|
| `h1` | text-2xl, font-bold |
| `h2` | text-xl, font-bold |
| `h3` | text-lg, font-bold |
| `body` | text-base |
| `bodySmall` | text-sm |
| `label` | text-sm, font-medium |
| `caption` | text-xs |
| `error` | text-sm, error color |

Muted variant reduces opacity to 0.8.

### 8.5 AppSelect (`src/components/custom/AppSelect.tsx`)

A searchable dropdown selector with:
- Pressable trigger showing selected value or placeholder
- ChevronDown icon
- Modal overlay with:
  - Header with selected label + close button
  - Search bar with TextInput (filterable by label/value)
  - FlatList of filtered options
  - Radio-button-style selection indicator
  - Empty state message ("لا توجد خيارات")
  - Loading state with ActivityIndicator
  - Item separator lines

### 8.6 AppDatePicker (`src/components/custom/AppDatePicker.tsx`)

A date picker that:
- Shows a pressable trigger with Calendar icon
- On press, opens `@react-native-community/datetimepicker`
- **Android:** Picker appears as dialog; auto-dismiss and format date on selection
- **iOS:** Picker appears inline with spinner mode + "تم" (Done) button
- Supports `minimumDate` and `maximumDate` constraints
- Formats dates as `YYYY-MM-DD`

### 8.7 FloatingTabBar (`src/components/custom/FloatingTabBar.tsx`)

Detailed in section 7.2 above.

### 8.8 FormError (`src/components/custom/FormError.tsx`)

Renders an `AppText variant="error"` message only when the `message` prop is truthy.

---

## 9. API Integration Layer

### 9.1 Endpoint Constants

**File:** `src/hooks/EndPoints/endPoints.ts`

```typescript
const endPoints = {
  login:    "/login",
  register: "/register",
  barns:    "/barns",
  batches:  "/batches",
  user:     "/user",
};
```

### 9.2 Query Keys

**File:** `src/hooks/EndPoints/queryKeys.ts`

```typescript
const queryKeys = {
  login:         "/login",
  register:      "/register",
  user:          "/user",
  barns:         "/barns",
  addBarns:      "/barns/add",
  deleteBarns:   "/barns/delete",
  updateBarns:   "/barns/update",
  batches:       "/batches",
  addBatches:    "/batches/add",
  deleteBatches: "/batches/delete",
  updateBatches: "/batches/update",
};
```

### 9.3 Generic CRUD Hooks

All follow the same pattern. `usePostData` is the most complex:

#### usePostData (POST)

**File:** `src/hooks/curdsHook/usePostData.tsx`

```
usePostData(url, mutationKeys, invalidateQueryKey)
  ↓
useMutation({
  mutationFn: ({ data, url: overrideUrl }) => {
    Show loading toast "جاري المعالجة..."
    return postRequest(finalUrl, data);
  },
  onSuccess: (data, variables) => {
    Dismiss loading toast
    Invalidate all queries matching invalidateQueryKey[0]
    Show success toast (or suppress if disableSuccessToast)
    Call variables.onSuccess if provided
  },
  onError: (error, variables) => {
    Dismiss loading toast
    Parse error response:
      - If errorData.message is an object → toast each value
      - If errorData.message is a string → toast the message
      - If errorData.errors is an array → toast first error
      - Otherwise → toast "حدث خطأ غير متوقع" (Unexpected error)
    Call variables.onError if provided
  },
})
```

#### useGetData (GET)

```
useGetData({ url, queryKeys, enabled, params })
  ↓
useQuery({
  queryKey: [...queryKeys, params.page, params.limit],
  queryFn: () => getRequest(url, params),
  enabled: ..., staleTime: 0, gcTime: 0, retry: 1,
  refetchOnWindowFocus: true, refetchOnMount: true,
})
```

#### usePutData (PUT)

Same pattern as `usePostData` but calls `putRequest(url, data)`.

#### useDeleteData (DELETE)

```
useMutation({
  mutationFn: ({ url: overrideUrl, id }) => {
    const finalUrl = id ? `${url}/${id}` : overrideUrl;
    return deleteRequest(finalUrl);
  },
  onMutate: () => { Show loading toast "جاري الحذف..." },
  onSuccess: Show success toast, invalidate queries
  onError: Show error toast
})
```

### 9.4 Full Backend API (Laravel)

All endpoints are available at `http://192.168.100.8:8000/api/`:

**Public:**
| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Register new user |
| POST | `/login` | Login user |

**Protected (Sanctum):**
| Method | Endpoint | Description |
|---|---|---|
| POST | `/logout` | Logout user |
| GET | `/user` | Get authenticated user |
| GET | `/dashboard` | Dashboard statistics |
| GET/POST | `/barns` | List/Create barns |
| GET/PUT/DELETE | `/barns/{id}` | Show/Update/Delete barn |
| GET/POST | `/batches` | List/Create batches |
| GET/PUT/DELETE | `/batches/{id}` | Show/Update/Delete batch |
| POST | `/batches/{id}/close` | Close a batch |
| CRUD | `/suppliers` | Supplier management |
| CRUD | `/purchases` | Purchase management |
| CRUD | `/payments` | Payment management |
| CRUD | `/customers` | Customer management |
| CRUD | `/sales` | Sales management |
| CRUD | `/deaths` | Death records |
| CRUD | `/expenses` | Expense management |

**API Response Format:**
```json
// Success
{ "success": true, "status": 200, "message": "...", "data": { ... } }

// Error
{ "success": false, "status": 422, "message": "...", "errors": [...] }
```

### 9.5 Request Handlers

Each a thin wrapper around `clientService.request`:

| Handler | Method |
|---|---|
| `PostRequest(url, data)` | POST |
| `GetRequest(url, token, options)` | GET |
| `PutRequest(url, data)` | PUT |
| `DeleteRequest(url)` | DELETE |
| `PatchRequest(url, data)` | PATCH |

---

## 10. State Management

| State Type | Mechanism | Details |
|---|---|---|
| **Server Data** | TanStack React Query | Cached via `useQuery` / `useMutation`, invalidated on mutations |
| **Auth State** | SecureStore + `useAuthGuard` | Read on mount; no global context (each layout checks independently) |
| **Theme** | React Context (`ThemeContext`) | Wraps NativeWind's `useColorScheme`, provides `colors`, `theme`, `toggleTheme` |
| **Form State** | react-hook-form + zod | `Controller` components, `useForm` with `zodResolver`, `useWatch` for cross-field validation |
| **Navigation** | Expo Router | File-based routing, automatic back/forward handling |

---

## 11. Theme & Styling

### 11.1 Theme Context

**File:** `src/contexts/ThemeContext.tsx`

- Uses NativeWind's `useColorScheme()` hook
- Provides `colors` (light or dark palette), `theme` ("light"|"dark"), `toggleTheme`, `setTheme`
- All components consume via `useTheme()`

### 11.2 Color Palettes

**File:** `src/constants/colors.ts`

| Token | Light | Dark |
|---|---|---|
| `primary` | `#111111` | `#EAEAEA` |
| `secondary` | `#F5F5F5` | `#3F3F3F` |
| `background` | `#FFFFFF` | `#242424` |
| `card` | `#FFFFFF` | `#111111` |
| `text` | `#242424` | `#FAFAFA` |
| `muted` | `#F5F5F5` | `#3F3F3F` |
| `mutedForeground` | `#6B7280` | `#9CA3AF` |
| `border` | `#EAEAEA` | `#FFFFFF1A` |
| `success` | `#16a34a` | `#22c55e` |
| `error` | `#9a3412` | `#f87171` |
| `warning` | `#eab308` | `#fbbf24` |

### 11.3 Styling Approach

- **NativeWind** (Tailwind CSS for React Native) for most styling
- `className` props with light/dark variants: `bg-background-light dark:bg-background-dark`
- Platform-specific shadows via `StyleSheet.create` in `FloatingTabBar`
- Theme-aware colors passed as inline styles when needed (e.g., `style={{ color: colors.mutedForeground }}`)
- Tailwind config extends colors with `light`/`dark` variants for each token

---

## 12. Toast Notifications

**File:** `src/services/toast.ts` + `src/components/ToastConfig.tsx`

### 12.1 Toast Types

| Type | Icon | Color | Auto-hide |
|---|---|---|---|
| `success` | Check | Green accent | 2s |
| `error` | X | Red accent | 4s |
| `loading` | Spinner | Gray accent | Persistent (dismissed manually) |

### 12.2 Custom Toast Components

Each toast is a card with:
- Left/right colored accent bar (RTL-aware)
- Circular icon container with tinted background (20% opacity)
- Text in Tajawal font
- Writing direction respects RTL

### 12.3 Toast Usage

```typescript
toast.loading("جاري المعالجة...")   // Returns ID, persists until dismissed
toast.success("تم الحفظ بنجاح!")
toast.error("حدث خطأ")
toast.dismiss(id)
```

CRUD hooks manage toast lifecycle automatically (show loading → dismiss → show success/error).

---

## 13. Complete User Flows — Narrative Walkthroughs

### Flow A: New User Registration (End-to-End)

**Starting state:** App not installed, or user has no account. Device may be in light or dark mode.

```
PHASE 1: APP LAUNCH
═══════════════════
1. User taps the app icon.
2. Splash screen appears (Expo default or custom).
3. RootLayout mounts:
   a. I18nManager.forceRTL(true) — all layouts flip to right-to-left.
   b. Default font set to Tajawal (Arabic).
   c. SplashScreen.preventAutoHideAsync() — splash stays visible.
   d. Fonts load: Tajawal_400Regular, Tajawal_700Bold (from Google Fonts).
   e. OnLayout fires → SplashScreen.hideAsync() — splash disappears.
   f. Provider tree renders:
      - SafeAreaProvider > SafeAreaView
        - TanstackProvider (QueryClient)
          - ThemeProvider (ThemeContext, uses system color scheme)
            - StatusBar (light/dark based on theme)
            - ThemedStack (initial route: index.tsx)
            - Toast component (positioned at top of screen)
4. index.tsx renders:
   a. useAuthGuard() runs:
      - SecureStore.getItemAsync("Realestate_TOKEN") → null (no token)
      - Returns { isAuthenticated: false, isLoading: false }
   b. useEffect detects: !isAuthenticated → router.replace("/(auth)/login")

PHASE 2: AUTH SCREEN
════════════════════
5. (auth)/_layout.tsx renders:
   a. useAuthGuard() re-runs → isAuthenticated = false → renders Stack.
6. Login screen (app/(auth)/login.tsx) appears:
   - White/light background (or dark if system dark mode).
   - Card with Lock icon, "مرحباً بعودتك" title, "أدخل بيانات الدخول..." subtitle.
   - Phone field with Phone icon, placeholder "أدخل رقم الموبيل".
   - Password field with Lock icon + Eye toggle, placeholder "أدخل كلمة المرور".
   - "تسجيل الدخول" button.
   - "ليس لديك حساب؟ سجل الآن" link at bottom.
7. User reads the screen and taps "سجل الآن" (Register link).
8. router pushes to /register → screen transition (platform default).

PHASE 3: REGISTRATION
═════════════════════
9. Register screen appears:
   - Header: User icon, "إنشاء حساب جديد", "أدخل بياناتك للتسجيل".
   - Form fields with labels (Arabic) and icons:
     [الاسم]     User icon    "أدخل اسمك"
     [رقم الموبيل] Phone icon   "أدخل رقم الموبيل"  (phone-pad keyboard)
     [كلمة المرور] Lock + Eye   "أدخل كلمة المرور"  (masked initially)
     [تأكيد كلمة المرور] Lock + Eye "أعد إدخال كلمة المرور"
   - "إنشاء حساب" button.
   - "لديك حساب بالفعل؟ تسجيل الدخول" link.
10. User fills in fields:
    a. Taps Name field → keyboard opens → types name.
    b. Taps Phone field → phone-pad keyboard → types Egyptian mobile number.
    c. Taps Password field → types password (dots shown) → taps Eye icon to verify.
    d. Taps Confirm Password field → types same password.
11. During typing, each field validates in real-time:
    - Empty name → red border + "الاسم مطلوب" error below field → disappears when typed.
    - Invalid phone format → "رقم الموبايل غير صحيح" error.
    - Short password → "كلمة المرور لازم تكون 6 أحرف على الأقل" error.
    - Mismatched confirm → "كلمتا المرور غير متطابقتين" error on confirm field.
12. All fields valid → button remains enabled.
13. User taps "إنشاء حساب":
    a. handleSubmit runs → Zod final validation passes.
    b. Loading toast appears at top of screen: "جاري المعالجة..." (spinner icon, gray border).
    c. Button shows ActivityIndicator spinner, becomes disabled + dimmed.
    d. Axios POST to http://192.168.100.8:8000/api/register
       Body: { name, phone, password, password_confirmation }
14a. SUCCESS PATH:
    - Server returns 201 with { success: true, data: { token: "...", user: { id, name, phone, has_completed_setup: false } } }
    - Loading toast dismissed.
    - Token saved to SecureStore (key: "Realestate_TOKEN").
    - User object saved to SecureStore (key: "Realestate_USER", JSON).
    - Success toast: "تم التسجيل بنجاح" (green check, 2s auto-hide).
    - Query cache invalidated for ["/register"].
    - router.replace("/(setup)/barn") — screen transitions to onboarding.
14b. ERROR PATH (e.g., phone already registered):
    - Loading toast dismissed.
    - Error toast: "رقم الموبايل مسجل بالفعل" (red X, 4s auto-hide).
    - Button returns to idle "إنشاء حساب" state.
    - User corrects phone and retries, or taps login link if already registered.

PHASE 4: ONBOARDING — STEP 1 (BARN)
════════════════════════════════════
15. (setup)/_layout.tsx renders:
    a. useAuthGuard() → isAuthenticated = true, hasCompletedSetup = false → renders Stack.
16. Barn creation screen appears:
    - Header: Warehouse icon, "بيانات العنبر", "أدخل بيانات العنبر الجديدة".
    - Form fields:
      [اسم العنبر]  Warehouse icon  "أدخل اسم العنبر"          (required)
      [الموقع]      MapPin icon     "أدخل الموقع (اختياري)"     (optional)
      [السعة]       Hash icon       "أدخل السعة"               (required, numeric keyboard, integer > 0)
      [ملاحظات]     FileText icon   "أدخل ملاحظات (اختياري)"   (optional, multiline)
    - "حفظ" button.
17. User fills in barn details and taps "حفظ":
    a. Loading toast: "جاري المعالجة...".
    b. POST /api/barns with { name, location, capacity, notes }.
    c. Server creates barn record, returns success.
    d. Loading toast dismissed.
    e. Success toast: "تم إنشاء العنبر بنجاح" (2s).
    f. Cache invalidated for ["/barns", "/barns/add"].
    g. router.replace("/(setup)/batch") → screen transitions to step 2.

PHASE 5: ONBOARDING — STEP 2 (BATCH)
════════════════════════════════════
18. Batch creation screen appears:
    - Header: Tags icon, "بيانات الدفعة", "أدخل بيانات الدفعة الجديدة".
    - Barn selector: pull data from API → GET /api/barns runs in background.
    - While barns load, selector shows "اختر العنبر" placeholder.
19. User interacts with barn selector:
    a. Taps trigger → Modal opens with search bar + barn list.
    b. Sees the barn just created.
    c. Taps barn name → value selected, modal closes.
20. User fills remaining fields:
    - [نوع الدواجن]    Tags icon          "أدخل نوع الدواجن" (e.g., "دجاج لاحم")
    - [الكمية الابتدائية] Hash icon       "أدخل الكمية الابتدائية" (e.g., 5000)
    - [تاريخ البداية]   Calendar icon     Taps → native date picker → selects today's date
    - [تاريخ النهاية]   Calendar icon     Taps → native date picker → selects future date (optional)
    - [ملاحظات]        FileText icon     "أدخل ملاحظات (اختياري)" (optional)
21. Cross-validation in action:
    - User picks start_date = 2026-06-01, end_date = 2026-05-30.
    - useEffect detects end_date < start_date → clears end_date field.
    - User picks end_date = 2026-07-01 instead.
22. User taps "حفظ":
    a. Loading toast: "جاري المعالجة...".
    b. POST /api/batches with converted data.
    c. Server creates batch AND sets user.has_completed_setup = true.
    d. Loading toast dismissed.
    e. Success toast: "تم إنشاء الدفعة بنجاح".
    f. Cache invalidated for ["/batches", "/batches/add", "/user"].
    g. ON SUCCESS CALLBACK:
       - fetchQuery({ queryKey: ["/user"], queryFn: getRequest("/user") })
       - Extracts user from response (data.data.data).
       - setUser(user) → updates SecureStore with has_completed_setup = true.
       - router.replace("/(tabs)/home") → navigates to main app.

PHASE 6: MAIN APP — HOME
════════════════════════
23. (tabs)/_layout.tsx renders:
    a. useAuthGuard() → isAuthenticated = true, hasCompletedSetup = true → renders Tabs.
    b. FloatingTabBar appears at bottom with 4 tabs.
24. Home screen is the initial tab:
    - "الرئيسية" title.
    - "مرحباً بك في التطبيق" welcome message.
    - Red "تسجيل الخروج" button.
    - Tab bar animates: Home icon has black circle background, white icon; others are muted.

Total screens visited: 7 (Splash → Login → Register → Barn → Batch → Tabs Layout → Home)
Total API calls: 3 (register → barn → batch)
```

### Flow B: Returning User Login (Fast Path)

**Starting state:** User has an account, app was previously used, token and user exist in SecureStore.

```
1. User taps app icon.
2. Splash screen appears.
3. Fonts load, providers mount.
4. index.tsx renders:
   a. useAuthGuard():
      - SecureStore.getItemAsync("Realestate_TOKEN") → returns "1|abc123..."
      - SecureStore.getItemAsync("Realestate_USER") → returns JSON string
      - Parsed user: { id: 1, name: "Ahmed", phone: "01012345678", has_completed_setup: true }
      - Returns { isAuthenticated: true, hasCompletedSetup: true, isLoading: false }
   b. useEffect → router.replace("/(tabs)/home")
5. (tabs)/_layout.tsx guard passes → renders Tabs with FloatingTabBar.
6. Home screen displays immediately.
   - No loading state, no API calls needed for auth.
   - Total screens: 1 (direct to home).
   - Elapsed time: < 2 seconds typically.

Edge case — token expired or invalid:
   - If an API call returns 401, the generic CRUD hooks would show an error toast.
   - There is NO automatic redirect to login on 401. The user would need to manually log out.
   - This is a known gap in the current implementation.
```

### Flow C: Returning User Without Setup

**Starting state:** User registered but closed the app during onboarding (e.g., after barn creation but before batch).

```
1. App launch → useAuthGuard():
   - Token exists → isAuthenticated = true.
   - User data: has_completed_setup = false.
2. index.tsx → router.replace("/(setup)/barn").
3. (setup)/_layout.tsx guard:
   - isAuthenticated = true, hasCompletedSetup = false → renders Stack.
4. Barn creation screen appears.
   - If the user already created a barn (previous session), they see the CREATE form again, not a list.
   - The app does NOT check if barns already exist.
5. User must fill and submit barn form again.
   - If they try to submit a barn with the same name, the server returns a duplicate name error (unique constraint on [user_id, name]).
   - User would need to use a different name or this would be a poor UX — a known gap.
```

### Flow D: User Logout

**Starting state:** User is on the Home tab.

```
1. User reads the welcome message on the Home screen.
2. User taps the red "تسجيل الخروج" button.
   a. removeAuthToken() → SecureStore.deleteItemAsync("Realestate_TOKEN").
   b. removeUser() → SecureStore.deleteItemAsync("Realestate_USER").
   c. router.replace("/login").
3. Login screen appears. No success/error toast — logout is silent.
4. If the user presses the back gesture or button, they cannot go back to the tabs — replace removes the previous route.
5. Backend token is NOT revoked. The Sanctum token remains valid until it expires or is manually cleaned up server-side.
```

### Flow E: App Launch with No Network

**Starting state:** User has a valid token in SecureStore but no internet connection.

```
1. App launch → useAuthGuard() succeeds (reads from local SecureStore).
2. User is redirected to (tabs)/home.
3. Home screen renders successfully (no API calls on home screen currently).
4. If the user tries any action that requires an API call:
   - The CRUD hook's useMutation fires.
   - Axios request fails (network error).
   - onError handler runs.
   - Error toast: "حدث خطأ غير متوقع" (Unexpected error) with 4s auto-hide.
   - User remains on the same screen.
5. The app does NOT crash — TanStack Query and error boundaries handle failures gracefully.
```

### Flow F: Form Validation Errors (All Screens)

**Applicable to:** Register, Login, Barn creation, Batch creation.

```
1. User types invalid data into a field.
2. react-hook-form's Controller calls onChange.
3. Zod resolver validates the schema.
4. If invalid:
   a. The field's error state is set (errors.fieldName.message).
   b. AppInput re-renders with red border (border-error-light dark:border-error-dark).
   c. FormError component renders below the input with the Arabic error message.
5. On the next keystroke, validation re-runs.
   - If valid now: error disappears, border reverts to default.
   - If still invalid: error updates to match current state.
6. At submission time:
   - handleSubmit checks all validation.
   - If ANY field is invalid, submission is blocked.
   - All invalid fields show their errors simultaneously.
   - No loading toast or API call is made.
```

---

---

## 14. Data Models (Frontend Types)

### User (`src/types/user.ts`)
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  has_completed_setup: boolean;
  [key: string]: unknown;
}
```

### Mutation Variables (`src/types/api.ts`)
```typescript
interface MutationVariables {
  data?: Record<string, unknown>;
  url?: string;
  id?: string | number;
  disableSuccessToast?: boolean;
  disableErrorToast?: boolean;
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
}
```

### UseGetDataOptions (`src/types/hooks.ts`)
```typescript
interface UseGetDataOptions {
  url?: string;
  queryKeys?: string[];
  enabled?: boolean | (() => boolean);
  params?: Record<string, unknown>;
  other?: Partial<RequestConfig>;
}
```

---

## 15. Under Development / Next Steps

The following areas are identified as placeholder or in-development:

1. **Dashboard (`home.tsx`)** — Backend `GET /api/dashboard` exists but frontend only shows placeholder text + logout button.
2. **Barn list (`(tabs)/barn.tsx`)** — Placeholder; CRUD hooks exist but no list/management UI.
3. **Sales screen (`(tabs)/sales.tsx`)** — Placeholder.
4. **Purchases screen (`(tabs)/purchases.tsx`)** — Placeholder.
5. **Logout API call** — Only clears local storage; does not call `POST /api/logout`.
6. **User CRUD hooks (`useCurdsUser.jsx`)** — Defined but not used in any screen.
7. **PatchRequest** — Defined but not used.
