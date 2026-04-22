import { faker } from '@faker-js/faker'
import {
  Customer,
  Lead,
  Deal,
  Contact,
  Task,
  Activity,
  DashboardStats,
  SalesPipeline
} from '../types/crm'

// Mock Customers
export const mockCustomers: Customer[] = Array.from({ length: 25 }, (_, i) => ({
  id: faker.string.uuid(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  company: faker.company.name(),
  title: faker.person.jobTitle(),
  status: faker.helpers.arrayElement(['active', 'inactive', 'prospect']),
  source: faker.helpers.arrayElement(['website', 'referral', 'social', 'advertising', 'cold-call', 'other']),
  tags: faker.helpers.arrayElements(['enterprise', 'startup', 'retail', 'tech', 'finance'], { min: 0, max: 3 }),
  notes: faker.lorem.sentences(2),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  lastContact: faker.date.recent(),
  avatar: faker.image.avatar()
}))

// Mock Leads
export const mockLeads: Lead[] = Array.from({ length: 20 }, (_, i) => ({
  id: faker.string.uuid(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  company: faker.company.name(),
  title: faker.person.jobTitle(),
  status: faker.helpers.arrayElement(['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost']),
  source: faker.helpers.arrayElement(['website', 'referral', 'social', 'advertising', 'cold-call', 'other']),
  value: faker.number.int({ min: 1000, max: 100000 }),
  probability: faker.number.int({ min: 0, max: 100 }),
  expectedCloseDate: faker.date.future(),
  tags: faker.helpers.arrayElements(['hot', 'warm', 'cold', 'enterprise', 'urgent'], { min: 0, max: 3 }),
  notes: faker.lorem.sentences(2),
  assignedTo: faker.person.fullName(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent()
}))

// Mock Deals
export const mockDeals: Deal[] = Array.from({ length: 15 }, (_, i) => {
  const customer = mockCustomers[i % mockCustomers.length]
  const stage = faker.helpers.arrayElement(['prospecting', 'qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost'])

  return {
    id: faker.string.uuid(),
    title: `${customer.company} - ${faker.commerce.productName()} Solution`,
    customerId: customer.id,
    customer,
    value: faker.number.int({ min: 5000, max: 250000 }),
    stage,
    probability: stage === 'closed-won' ? 100 : stage === 'closed-lost' ? 0 : faker.number.int({ min: 10, max: 90 }),
    expectedCloseDate: faker.date.future(),
    actualCloseDate: stage.includes('closed') ? faker.date.recent() : undefined,
    description: faker.lorem.sentences(3),
    assignedTo: faker.person.fullName(),
    tags: faker.helpers.arrayElements(['priority', 'enterprise', 'renewal', 'upsell'], { min: 0, max: 2 }),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  }
})

// Mock Contacts
export const mockContacts: Contact[] = Array.from({ length: 50 }, (_, i) => ({
  id: faker.string.uuid(),
  type: faker.helpers.arrayElement(['call', 'email', 'meeting', 'note', 'task']),
  customerId: faker.helpers.arrayElement(mockCustomers).id,
  leadId: faker.helpers.maybe(() => faker.helpers.arrayElement(mockLeads).id),
  dealId: faker.helpers.maybe(() => faker.helpers.arrayElement(mockDeals).id),
  subject: faker.lorem.sentence(),
  content: faker.lorem.paragraphs(2),
  direction: faker.helpers.arrayElement(['inbound', 'outbound']),
  status: faker.helpers.arrayElement(['completed', 'pending', 'cancelled']),
  scheduledAt: faker.date.recent(),
  completedAt: faker.helpers.maybe(() => faker.date.recent()),
  assignedTo: faker.person.fullName(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent()
}))

// Mock Tasks
export const mockTasks: Task[] = Array.from({ length: 30 }, (_, i) => ({
  id: faker.string.uuid(),
  title: faker.lorem.sentence(),
  description: faker.lorem.sentences(2),
  type: faker.helpers.arrayElement(['call', 'email', 'meeting', 'follow-up', 'demo', 'proposal', 'other']),
  priority: faker.helpers.arrayElement(['low', 'medium', 'high', 'urgent']),
  status: faker.helpers.arrayElement(['pending', 'in-progress', 'completed', 'cancelled']),
  customerId: faker.helpers.arrayElement(mockCustomers).id,
  leadId: faker.helpers.maybe(() => faker.helpers.arrayElement(mockLeads).id),
  dealId: faker.helpers.maybe(() => faker.helpers.arrayElement(mockDeals).id),
  assignedTo: faker.person.fullName(),
  dueDate: faker.date.soon(),
  completedAt: faker.helpers.maybe(() => faker.date.recent()),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent()
}))

// Mock Activities
export const mockActivities: Activity[] = Array.from({ length: 100 }, (_, i) => ({
  id: faker.string.uuid(),
  type: faker.helpers.arrayElement(['customer_created', 'lead_created', 'deal_created', 'contact_made', 'task_completed', 'deal_closed']),
  entityId: faker.string.uuid(),
  entityType: faker.helpers.arrayElement(['customer', 'lead', 'deal', 'contact', 'task']),
  description: faker.lorem.sentence(),
  userId: faker.string.uuid(),
  userName: faker.person.fullName(),
  metadata: {
    value: faker.helpers.maybe(() => faker.number.int({ min: 1000, max: 100000 })),
    status: faker.helpers.maybe(() => faker.helpers.arrayElement(['won', 'lost', 'pending']))
  },
  createdAt: faker.date.recent()
}))

// Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalCustomers: mockCustomers.length,
  totalLeads: mockLeads.length,
  totalDeals: mockDeals.length,
  totalRevenue: mockDeals
    .filter(deal => deal.stage === 'closed-won')
    .reduce((sum, deal) => sum + deal.value, 0),
  conversionRate: Math.round((mockLeads.filter(lead => lead.status === 'closed-won').length / mockLeads.length) * 100),
  avgDealSize: Math.round(mockDeals.reduce((sum, deal) => sum + deal.value, 0) / mockDeals.length),
  pipelineValue: mockDeals
    .filter(deal => !deal.stage.includes('closed'))
    .reduce((sum, deal) => sum + deal.value, 0),
  monthlyGrowth: faker.number.int({ min: -10, max: 25 })
}

// Sales Pipeline Data
export const mockSalesPipeline: SalesPipeline[] = [
  { stage: 'Prospecting', count: 12, value: 450000, color: '#8884d8' },
  { stage: 'Qualification', count: 8, value: 320000, color: '#82ca9d' },
  { stage: 'Proposal', count: 5, value: 180000, color: '#ffc658' },
  { stage: 'Negotiation', count: 3, value: 95000, color: '#ff7300' },
  { stage: 'Closed Won', count: 7, value: 285000, color: '#00ff00' },
  { stage: 'Closed Lost', count: 2, value: 0, color: '#ff0000' }
]

// Utility functions
export function getCustomersByStatus(status: Customer['status']) {
  return mockCustomers.filter(customer => customer.status === status)
}

export function getLeadsByStatus(status: Lead['status']) {
  return mockLeads.filter(lead => lead.status === status)
}

export function getDealsByStage(stage: Deal['stage']) {
  return mockDeals.filter(deal => deal.stage === stage)
}

export function getTasksByStatus(status: Task['status']) {
  return mockTasks.filter(task => task.status === status)
}

export function getContactsByType(type: Contact['type']) {
  return mockContacts.filter(contact => contact.type === type)
}

export function getRecentActivities(limit = 10) {
  return mockActivities
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit)
}

export function getUpcomingTasks(limit = 10) {
  return mockTasks
    .filter(task => task.status !== 'completed' && task.dueDate)
    .sort((a, b) => (a.dueDate?.getTime() || 0) - (b.dueDate?.getTime() || 0))
    .slice(0, limit)
}
