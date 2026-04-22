# scalix-crm

A comprehensive Customer Relationship Management (CRM) system built with React, TypeScript, Tailwind CSS, and Shadcn/ui components.

## 🚀 Features

- **👥 Customer Management**: Complete customer database with profiles, contact info, and history
- **🎯 Lead Tracking**: Lead qualification pipeline with status tracking and conversion metrics
- **💰 Sales Pipeline**: Deal management with stages, values, and probability tracking
- **📞 Contact Logging**: Communication history with customers, leads, and deals
- **✅ Task Management**: Follow-up tasks, reminders, and activity scheduling
- **📊 Analytics Dashboard**: KPI metrics, conversion rates, and performance insights
- **🎨 Professional UI**: Shadcn/ui components with responsive design
- **🔍 Advanced Filtering**: Search and filter across all data entities
- **📱 Mobile Responsive**: Works perfectly on all devices
- **🔍 Component Tagging**: Development tooling for component identification

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Charts**: Recharts (ready for implementation)
- **Forms**: React Hook Form (ready for integration)
- **Data**: Mock data with Faker.js (easily replaceable with real API)

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                    # Shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── table.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   └── crm/                   # CRM-specific components
│       ├── dashboard.tsx      # Main dashboard
│       └── customers.tsx      # Customer management
├── lib/
│   └── utils.ts               # Utility functions
├── types/
│   └── crm.ts                 # TypeScript interfaces
└── data/
    └── mockData.ts            # Mock data (replace with API)
```

## 🎯 CRM Entities

### Customers
- **Profiles**: Name, contact info, company details
- **Status Tracking**: Active, inactive, prospect
- **Tags**: Categorization and segmentation
- **Activity History**: Communication and interaction logs

### Leads
- **Qualification**: Hot, warm, cold lead status
- **Source Tracking**: Website, referral, social, advertising
- **Value Estimation**: Deal size and probability
- **Assignment**: Sales rep assignment and ownership

### Deals
- **Pipeline Stages**: Prospecting → Proposal → Negotiation → Closed
- **Value Tracking**: Deal amount and expected close dates
- **Probability**: Win probability percentages
- **Contact Linking**: Associated customers and communication

### Tasks & Activities
- **Task Types**: Calls, emails, meetings, follow-ups
- **Priority Levels**: Urgent, high, medium, low
- **Due Dates**: Scheduling and deadline tracking
- **Assignment**: Team member responsibility

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

### Available Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload

# Building
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm run test         # Run tests
npm run test:ui      # Run tests with UI

# Linting
npm run lint         # Run ESLint
```

## 🎨 Key Features Demonstrated

### Dashboard Analytics
```tsx
// Real-time KPI metrics
<MetricCard
  title="Conversion Rate"
  value="24.5%"
  change="+12%"
  changeType="positive"
  icon={<TrendingUp className="h-4 w-4" />}
/>
```

### Customer Data Table
```tsx
// Advanced data table with search, filter, actions
<DataTable
  data={customers}
  searchable
  filterable
  actions={['edit', 'delete', 'view']}
/>
```

### Lead Pipeline
```tsx
// Visual pipeline stages with drag-and-drop
<PipelineStage
  title="Proposal"
  deals={proposalDeals}
  value={450000}
  onDrop={handleDealMove}
/>
```

## 🔧 Customization

### Adding New CRM Entities

1. **Define Types** in `src/types/crm.ts`:
```typescript
export interface NewEntity {
  id: string
  name: string
  createdAt: Date
  // ... other properties
}
```

2. **Create Mock Data** in `src/data/mockData.ts`:
```typescript
export const mockNewEntities: NewEntity[] = [
  // Generate mock data
]
```

3. **Build UI Components** in `src/components/crm/`:
```tsx
export function NewEntityManager() {
  // Component logic
}
```

### Customizing Pipeline Stages

Edit the pipeline configuration in your data layer:

```typescript
export const PIPELINE_STAGES = [
  { id: 'prospecting', name: 'Prospecting', color: '#8884d8' },
  { id: 'qualification', name: 'Qualification', color: '#82ca9d' },
  // Add custom stages
]
```

### Adding Custom Fields

Extend entity interfaces for custom fields:

```typescript
export interface Customer {
  // Existing fields...
  customField1?: string
  customField2?: number
  // Add your custom fields
}
```

## 📊 Analytics & Reporting

### Built-in Metrics
- **Conversion Rates**: Lead to customer conversion
- **Sales Velocity**: Average deal close time
- **Pipeline Value**: Total potential revenue
- **Activity Volume**: Communication frequency

### Custom Reports
Create custom analytics components:

```tsx
function SalesReport() {
  const [timeRange, setTimeRange] = useState('30d')

  // Fetch and display sales data
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Performance</CardTitle>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      {/* Chart implementation */}
    </Card>
  )
}
```

## 🔗 API Integration

### Connecting to Your Backend

1. **Replace Mock Data** with API calls:
```typescript
// src/lib/api.ts
export async function fetchCustomers() {
  const response = await fetch('/api/customers')
  return response.json()
}
```

2. **Update Components** to use real data:
```tsx
// In components
import { useEffect, useState } from 'react'
import { fetchCustomers } from '@/lib/api'

function CustomerTable() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCustomers().then(setCustomers).finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Loading customers...</div>

  return <DataTable data={customers} />
}
```

3. **Add Authentication**:
```typescript
// API calls with auth headers
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

## 👥 User Roles & Permissions

### Role-Based Access
```typescript
enum UserRole {
  ADMIN = 'admin',
  SALES_MANAGER = 'sales_manager',
  SALES_REP = 'sales_rep',
  VIEWER = 'viewer'
}

const permissions = {
  [UserRole.ADMIN]: ['create', 'read', 'update', 'delete', 'manage_users'],
  [UserRole.SALES_MANAGER]: ['create', 'read', 'update', 'view_reports'],
  // Define permissions per role
}
```

### Implementing Permissions
```tsx
function ProtectedComponent({ children, requiredPermission }) {
  const userRole = useUserRole()

  if (!hasPermission(userRole, requiredPermission)) {
    return <AccessDenied />
  }

  return children
}
```

## 📱 Mobile Optimization

### Responsive Design
- **Mobile Navigation**: Collapsible sidebar on mobile
- **Touch-Friendly**: Large touch targets and gestures
- **Optimized Tables**: Horizontal scroll and card layouts
- **Progressive Loading**: Fast initial loads with lazy loading

### PWA Features (Optional)
```json
// public/manifest.json
{
  "name": "scalix-crm CRM",
  "short_name": "CRM",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000"
}
```

## 🔍 Advanced Features

### Search & Filtering
```tsx
function useAdvancedSearch(entities: any[], searchTerm: string, filters: any) {
  return useMemo(() => {
    return entities.filter(entity => {
      // Text search
      const matchesSearch = Object.values(entity)
        .some(value => String(value).toLowerCase().includes(searchTerm.toLowerCase()))

      // Filter matching
      const matchesFilters = Object.entries(filters)
        .every(([key, value]) => !value || entity[key] === value)

      return matchesSearch && matchesFilters
    })
  }, [entities, searchTerm, filters])
}
```

### Real-time Updates
```tsx
function useRealtimeSubscription(entityType: string, callback: Function) {
  useEffect(() => {
    // WebSocket or Server-Sent Events connection
    const ws = new WebSocket(`ws://localhost:3001/${entityType}`)

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      callback(data)
    }

    return () => ws.close()
  }, [entityType, callback])
}
```

## 🧪 Testing Strategy

### Unit Tests
```tsx
// __tests__/CustomerCard.test.tsx
import { render, screen } from '@testing-library/react'
import { CustomerCard } from '../src/components/crm/CustomerCard'

describe('CustomerCard', () => {
  it('displays customer information', () => {
    const customer = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com'
    }

    render(<CustomerCard customer={customer} />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })
})
```

### Integration Tests
```tsx
// __tests__/CustomerManagement.test.tsx
describe('Customer Management Flow', () => {
  it('allows creating and editing customers', async () => {
    // Test full user flow
    render(<App />)

    // Navigate to customers
    // Click add customer
    // Fill form
    // Submit
    // Verify customer appears in list
  })
})
```

## 🚀 Deployment

### Production Build
```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

### Deployment Options

#### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

#### Docker
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
```

#### Database Setup
```sql
-- Example PostgreSQL schema
CREATE TABLE customers (
  id UUID PRIMARY KEY,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  company VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE leads (
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  status VARCHAR(50),
  value DECIMAL(10,2),
  probability INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🔍 Development Tools

### Component Tagging
```html
<!-- Development mode only -->
<button data-scalix-id="src/components/Button.tsx:15:10" data-scalix-name="button">
  Click me
</button>
```

Benefits:
- **Testing**: Precise component selection
- **Debugging**: Component identification
- **Analytics**: Component usage tracking

## 📚 Learn More

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn/ui](https://ui.shadcn.com/)
- [CRM Best Practices](https://www.salesforce.com/crm/)

## 🤝 Contributing

1. Follow the established patterns
2. Add proper TypeScript types
3. Include tests for new features
4. Update documentation
5. Ensure mobile responsiveness

---

Built with ❤️ using Scalix Scaffold
