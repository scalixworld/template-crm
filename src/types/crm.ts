export interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  title?: string
  status: 'active' | 'inactive' | 'prospect'
  source: 'website' | 'referral' | 'social' | 'advertising' | 'cold-call' | 'other'
  tags: string[]
  notes?: string
  createdAt: Date
  updatedAt: Date
  lastContact?: Date
  avatar?: string
}

export interface Lead {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  title?: string
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost'
  source: 'website' | 'referral' | 'social' | 'advertising' | 'cold-call' | 'other'
  value: number
  probability: number // 0-100
  expectedCloseDate?: Date
  tags: string[]
  notes?: string
  assignedTo?: string
  createdAt: Date
  updatedAt: Date
}

export interface Deal {
  id: string
  title: string
  customerId: string
  customer?: Customer
  value: number
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost'
  probability: number // 0-100
  expectedCloseDate?: Date
  actualCloseDate?: Date
  description?: string
  assignedTo?: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Contact {
  id: string
  type: 'call' | 'email' | 'meeting' | 'note' | 'task'
  customerId?: string
  leadId?: string
  dealId?: string
  subject: string
  content: string
  direction?: 'inbound' | 'outbound'
  status?: 'completed' | 'pending' | 'cancelled'
  scheduledAt?: Date
  completedAt?: Date
  assignedTo?: string
  createdAt: Date
  updatedAt: Date
}

export interface Task {
  id: string
  title: string
  description?: string
  type: 'call' | 'email' | 'meeting' | 'follow-up' | 'demo' | 'proposal' | 'other'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  customerId?: string
  leadId?: string
  dealId?: string
  assignedTo?: string
  dueDate?: Date
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Activity {
  id: string
  type: 'customer_created' | 'lead_created' | 'deal_created' | 'contact_made' | 'task_completed' | 'deal_closed'
  entityId: string
  entityType: 'customer' | 'lead' | 'deal' | 'contact' | 'task'
  description: string
  userId?: string
  userName?: string
  metadata?: Record<string, any>
  createdAt: Date
}

export interface DashboardStats {
  totalCustomers: number
  totalLeads: number
  totalDeals: number
  totalRevenue: number
  conversionRate: number
  avgDealSize: number
  pipelineValue: number
  monthlyGrowth: number
}

export interface SalesPipeline {
  stage: string
  count: number
  value: number
  color: string
}

export type LeadStatus = Lead['status']
export type DealStage = Deal['stage']
export type ContactType = Contact['type']
export type TaskPriority = Task['priority']
export type TaskStatus = Task['status']
export type CustomerStatus = Customer['status']
