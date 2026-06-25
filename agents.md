# agents.md — FinTrack AI Project

> This file is the single source of truth for every AI agent, developer, and contributor working on this project.
> Read this before writing a single line of code. Every decision made here must be respected consistently across all files, pages, and components.

---

## 1. PROJECT OVERVIEW

**Name:** GereTonNkap
**Type:** Frontend Web Application (React + Vite, no backend)
**Purpose:** A smart personal finance and small business accounting dashboard with AI-assisted expense management.
**App Name (display):** GereTonNkap
**Target User:** Individual users and small business owners who want to track income, expenses, budgets, and get AI-powered financial insights.
**Defense Context:** This is an academic software engineering defense project. The codebase must demonstrate clean architecture, UML-aligned design, and practical AI integration.

---

## 2. CORE PRINCIPLES

These principles guide every technical and design decision:

1. **Simplicity over complexity** — No backend, no database. All data lives in `localStorage`. Every feature must be achievable in the browser.
2. **Consistency above all** — Every page must look and feel identical in layout rhythm, spacing, and color. No page should feel out of place.
3. **Domain confidence** — The app speaks the language of finance. Labels, actions, and messages use real accounting vocabulary (e.g., "Ledger", "Debit", "Credit", "Net Balance", "Fiscal Period").
4. **AI as a co-pilot, not a gimmick** — The AI feature must solve a real user problem (expense categorization, financial summaries). It must feel integrated, not bolted on.
5. **Demo-ready at all times** — The app must always be in a state that can be demoed live. No broken states, no empty screens without placeholder data.

---

## 3. ARCHITECTURE

### 3.1 Tech Stack

| Concern          | Technology              | Notes                                      |
|------------------|-------------------------|--------------------------------------------|
| Framework        | React 18 + Vite         | Fast build, modern JSX                     |
| Styling          | Tailwind CSS            | Utility-first, enforces consistency        |
| Charts           | Recharts                | Finance-grade data visualization           |
| Routing          | React Router v6         | Client-side page navigation                |
| State Management | React Context + useState | No Redux — keep it simple                 |
| Data Persistence | localStorage            | No backend required                        |
| AI Integration   | Anthropic Claude API    | claude-sonnet-4-6 via fetch                |
| Icons            | Lucide React            | Clean, minimal icon set                    |
| Hosting          | Vercel or Netlify       | Free, one-click deploy from GitHub         |

### 3.2 Folder Structure

```
mymoney/
├── public/
│   └── favicon.ico
├── src/
│   ├── api/
│   │   └── claude.js          # All Claude API calls live here
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx    # Persistent navigation sidebar
│   │   │   ├── TopBar.jsx     # Page title + user info bar
│   │   │   └── PageWrapper.jsx # Consistent page container
│   │   ├── ui/
│   │   │   ├── Button.jsx     # Global button component
│   │   │   ├── Card.jsx       # Stat/info card component
│   │   │   ├── Badge.jsx      # Category labels
│   │   │   ├── Modal.jsx      # Reusable modal
│   │   │   └── Input.jsx      # Styled form input
│   │   └── charts/
│   │       ├── BarChart.jsx
│   │       ├── LineChart.jsx
│   │       └── DonutChart.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx      # Overview / home page
│   │   ├── Transactions.jsx   # Add & list transactions
│   │   ├── Budget.jsx         # Budget limits by category
│   │   ├── Reports.jsx        # Visual analytics & charts
│   │   └── AIAssistant.jsx    # Smart expense assistant
│   ├── context/
│   │   └── FinanceContext.jsx # Global state: transactions, budgets
│   ├── hooks/
│   │   └── useLocalStorage.js # Custom hook for persistence
│   ├── utils/
│   │   ├── formatters.js      # Currency, date formatting
│   │   └── categories.js      # Expense category definitions
│   ├── App.jsx
│   └── main.jsx
├── agents.md                  # This file
├── index.html
├── tailwind.config.js
└── vite.config.js
```

### 3.3 Data Model

All data stored in `localStorage` as JSON.

```js
// Transaction object
{
  id: "uuid-v4",
  type: "income" | "expense",
  amount: 15000,           // stored in smallest unit (e.g., XAF francs)
  category: "Food",        // from predefined categories list
  description: "Market groceries",
  date: "2025-06-15",      // ISO string
  aiCategorized: false     // true if AI suggested this category
}

// Budget object
{
  category: "Food",
  limit: 50000,
  period: "monthly"
}
```

---

## 4. DESIGN SYSTEM

> Every agent and developer must use ONLY the values defined here. Do not invent new colors, fonts, or spacing outside this system.

### 4.1 Color Palette — Light Mode (Soft White & Blue)

Inspired by a modern, clean light aesthetic: soft white background, crisp text, and a primary soft blue accent.

| Token                | Hex Value   | Usage                                          |
|----------------------|-------------|------------------------------------------------|
| `--bg-base`          | `#f8fafc`   | Main app background                            |
| `--bg-surface`       | `#ffffff`   | Cards, panels, sidebar                         |
| `--bg-elevated`      | `#f1f5f9`   | Modals, dropdowns, hover states                |
| `--border-subtle`    | `#e2e8f0`   | All dividers, card borders, input borders      |
| `--border-default`   | `#cbd5e1`   | Focused or active borders                      |
| `--text-primary`     | `#0f172a`   | Main headings and body text                    |
| `--text-secondary`   | `#475569`   | Labels, captions, placeholders                 |
| `--text-muted`       | `#94a3b8`   | Disabled states, fine print                    |
| `--accent-blue`      | `#3b82f6`   | Primary action buttons, success, main highlights |
| `--accent-blue-dim`  | `#2563eb`   | Blue button hover state                        |
| `--accent-white`     | `#ffffff`   | Secondary buttons, icon buttons                |
| `--accent-red`       | `#ef4444`   | Expense indicators, errors, over-budget alerts |
| `--accent-yellow`    | `#eab308`   | Warnings, "approaching limit" indicators       |

### 4.2 Typography

| Role         | Font            | Weight | Size       | Usage                        |
|--------------|-----------------|--------|------------|------------------------------|
| Display      | Inter           | 700    | 2xl–4xl    | Page titles, hero numbers    |
| Body         | Inter           | 400    | sm–base    | Paragraphs, descriptions     |
| Data / Mono  | JetBrains Mono  | 400    | xs–sm      | Amounts, IDs, dates, code    |
| Label        | Inter           | 500    | xs         | Category badges, table headers |

Load both from Google Fonts. All currency amounts and financial figures must use `JetBrains Mono`.

### 4.3 Spacing Scale

Use Tailwind's default scale. Maintain this discipline:
- **Page padding:** `px-6 py-6` on all `PageWrapper` instances
- **Card padding:** `p-5` consistently
- **Gap between cards:** `gap-4` or `gap-6`
- **Section spacing:** `mb-8` between major sections on a page

### 4.4 Border Radius

| Element         | Radius   |
|-----------------|----------|
| Cards           | `rounded-xl` (12px) |
| Buttons         | `rounded-lg` (8px)  |
| Inputs          | `rounded-lg` (8px)  |
| Badges          | `rounded-full`      |
| Modals          | `rounded-2xl`       |

### 4.5 Button System

Two button types only:

**Primary (Blue):**
```jsx
<button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold px-4 py-2 rounded-lg transition-colors">
  Add Transaction
</button>
```

**Secondary (White Outline):**
```jsx
<button className="border border-[#e2e8f0] text-[#0f172a] hover:bg-[#f1f5f9] px-4 py-2 rounded-lg transition-colors">
  Cancel
</button>
```

No other button styles. No colored backgrounds other than blue for primary actions.

### 4.6 Card Component

All stat cards and content panels follow this pattern:
```jsx
<div className="bg-[#ffffff] border border-[#e2e8f0] rounded-xl p-5 shadow-sm">
  {/* content */}
</div>
```

### 4.7 Sidebar Layout

- Fixed left sidebar, width: `w-56` (224px)
- Background: `bg-[#ffffff]` with `border-r border-[#e2e8f0]`
- Active nav item: `bg-[#f1f5f9] text-[#3b82f6]` with a left blue bar accent `border-l-2 border-[#3b82f6]`
- Inactive nav item: `text-[#475569] hover:text-[#0f172a] hover:bg-[#f8fafc]`

### 4.8 Page Layout Pattern

Every page must follow this exact layout:

```
┌─────────────────────────────────────────────┐
│ SIDEBAR (fixed, left, full height)          │
│  Logo                                       │
│  Nav links                                  │
│                                             │
├─────────────────────────────────────────────┤
│ TOPBAR (full width minus sidebar)           │
│  Page title                  [User avatar]  │
├─────────────────────────────────────────────┤
│ PAGE CONTENT (scrollable)                   │
│  px-6 py-6                                  │
│                                             │
│  [Stat Cards Row]                           │
│                                             │
│  [Main Content Area]                        │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 5. PAGES & FEATURES

### Page 1: Dashboard (`/`)
- **Stat cards (top row):** Total Balance, Total Income, Total Expenses, Savings Rate
- **Chart:** Monthly income vs expense bar chart (last 6 months)
- **Recent Transactions:** Last 5 transactions list
- **Budget Overview:** Mini progress bars per category

### Page 2: Transactions (`/transactions`)
- Button to add new transaction (opens modal)
- Transaction form: type, amount, category, description, date
- Filterable and searchable transaction table
- Color-coded: green for income, red for expense

### Page 3: Budget (`/budget`)
- Set monthly spending limits per category
- Visual progress bars: green → yellow → red as limit approaches
- Alert when a category exceeds its budget

### Page 4: Reports (`/reports`)
- Donut chart: expense breakdown by category
- Line chart: balance trend over time
- Bar chart: income vs expense by month
- Summary text: highest spending category, best saving month

### Page 5: AI Assistant (`/ai`)
- Chat-style interface
- User types a message like "I spent 3000 XAF on transport today"
- Claude parses it, suggests: category, amount, and offers to log it
- Also answers general finance questions
- Shows "Thinking..." loader while API call is in progress

---

## 6. AI INTEGRATION

### 6.1 API Call Pattern

All Claude API calls go through `src/api/claude.js`:

```js
export async function askClaude(userMessage, systemPrompt) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }]
    })
  });
  const data = await response.json();
  return data.content[0].text;
}
```

### 6.2 AI Assistant System Prompt

```
You are GereTonNkap AI, a smart financial assistant embedded in a personal finance app.
Your job is to help users log expenses, understand their spending, and get financial insights.

When the user describes a transaction (e.g. "I spent 5000 on food"), respond in this exact JSON format:
{
  "intent": "log_transaction",
  "type": "expense",
  "amount": 5000,
  "category": "Food",
  "description": "User expense",
  "message": "Got it! I'll log 5,000 XAF under Food. Want me to add it?"
}

If the user asks a general finance question, respond with:
{
  "intent": "answer",
  "message": "Your answer here"
}

Categories available: Food, Transport, Housing, Health, Education, Entertainment, Shopping, Utilities, Salary, Business, Other.
Always respond in JSON only. No markdown, no extra text.
```

### 6.3 AI Rules
- Never call the AI on every keystroke — only on explicit user submit
- Always show a loading state while waiting for the API
- If the API fails, show a graceful error message, never a blank screen
- The AI must never store conversation history — each call is stateless

---

## 7. UML ARTIFACTS (Required for Defense)

These diagrams must be produced and included in the final defense documentation:

| Diagram         | Tool          | Status  |
|-----------------|---------------|---------|
| Use Case        | draw.io       | Pending |
| Class Diagram   | draw.io       | Pending |
| Activity: Add Transaction | draw.io | Pending |
| Sequence: AI Assistant Flow | draw.io | Pending |

---

## 8. CONSTRAINTS & RULES

### Hard Constraints
- ❌ No backend server
- ❌ No database (MySQL, MongoDB, etc.)
- ❌ No user authentication system (out of scope)
- ❌ No paid third-party APIs except Claude
- ❌ No CSS frameworks other than Tailwind
- ❌ No dark/light mode toggle — dark mode is permanent

### Code Quality Rules
- ✅ Every component must be in its own file
- ✅ No inline styles — use Tailwind classes only
- ✅ All financial amounts formatted with a utility function (`formatCurrency`)
- ✅ All dates formatted with a utility function (`formatDate`)
- ✅ No hardcoded colors outside of `tailwind.config.js` or the design tokens above
- ✅ Every page must use `<PageWrapper>` as its outermost container

### Naming Conventions
- Components: `PascalCase` (e.g., `TransactionCard.jsx`)
- Hooks: `camelCase` starting with `use` (e.g., `useLocalStorage.js`)
- Utilities: `camelCase` (e.g., `formatCurrency.js`)
- CSS classes: Tailwind only, no custom class names unless absolutely necessary

---

## 9. DEFENSE CHECKLIST

Before the defense date, confirm all of the following:

- [ ] All 5 pages are functional and navigable
- [ ] Transactions can be added, listed, and persisted across page reload
- [ ] Budget limits display correct progress
- [ ] At least 3 chart types are visible on the Reports page
- [ ] AI Assistant can parse at least one natural language transaction
- [ ] App looks pixel-perfect on a 1080p laptop screen
- [ ] All 4 UML diagrams are complete and printed
- [ ] A short demo script (3–5 minutes) is prepared
- [ ] The project is deployed on Vercel or Netlify with a live URL

---

*Last updated: June 2025 — MyMoney Defense Project*
