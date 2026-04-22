import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Area,
  AreaChart,
} from "recharts"
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Download,
  Calendar,
  Target,
  Award,
} from "lucide-react"
import { mockDeals, mockLeads, mockSalesPipeline, mockDashboardStats, mockCustomers } from "../../data/mockData"

// Revenue over time mock data (last 12 months)
const revenueData = [
  { month: 'Jan', revenue: 42000, deals: 3 },
  { month: 'Feb', revenue: 38000, deals: 2 },
  { month: 'Mar', revenue: 55000, deals: 4 },
  { month: 'Apr', revenue: 47000, deals: 3 },
  { month: 'May', revenue: 62000, deals: 5 },
  { month: 'Jun', revenue: 58000, deals: 4 },
  { month: 'Jul', revenue: 71000, deals: 6 },
  { month: 'Aug', revenue: 65000, deals: 5 },
  { month: 'Sep', revenue: 78000, deals: 7 },
  { month: 'Oct', revenue: 82000, deals: 6 },
  { month: 'Nov', revenue: 91000, deals: 8 },
  { month: 'Dec', revenue: 95000, deals: 7 },
]

// Lead source distribution
const leadSourceData = [
  { name: 'Website', value: mockLeads.filter(l => l.source === 'website').length || 5, color: '#3b82f6' },
  { name: 'Referral', value: mockLeads.filter(l => l.source === 'referral').length || 4, color: '#10b981' },
  { name: 'Social', value: mockLeads.filter(l => l.source === 'social').length || 3, color: '#8b5cf6' },
  { name: 'Advertising', value: mockLeads.filter(l => l.source === 'advertising').length || 4, color: '#f59e0b' },
  { name: 'Cold Call', value: mockLeads.filter(l => l.source === 'cold-call').length || 2, color: '#6b7280' },
  { name: 'Other', value: mockLeads.filter(l => l.source === 'other').length || 2, color: '#ef4444' },
]

// Deals by stage for bar chart
const dealStageData = mockSalesPipeline.map(s => ({
  stage: s.stage,
  count: s.count,
  value: s.value / 1000,
}))

// Build top performers from deal assignees
const performerMap = new Map<string, { name: string; deals: number; revenue: number; wonDeals: number }>()
mockDeals.forEach(deal => {
  const name = deal.assignedTo || 'Unassigned'
  const existing = performerMap.get(name) || { name, deals: 0, revenue: 0, wonDeals: 0 }
  existing.deals++
  existing.revenue += deal.value
  if (deal.stage === 'closed-won') existing.wonDeals++
  performerMap.set(name, existing)
})
const topPerformers = Array.from(performerMap.values())
  .sort((a, b) => b.revenue - a.revenue)
  .slice(0, 5)

// Conversion funnel data
const conversionData = [
  { stage: 'Leads', count: mockLeads.length, rate: 100 },
  { stage: 'Contacted', count: mockLeads.filter(l => l.status !== 'new').length, rate: Math.round((mockLeads.filter(l => l.status !== 'new').length / mockLeads.length) * 100) },
  { stage: 'Qualified', count: mockLeads.filter(l => ['qualified', 'proposal', 'negotiation', 'closed-won'].includes(l.status)).length, rate: Math.round((mockLeads.filter(l => ['qualified', 'proposal', 'negotiation', 'closed-won'].includes(l.status)).length / mockLeads.length) * 100) },
  { stage: 'Won', count: mockLeads.filter(l => l.status === 'closed-won').length, rate: Math.round((mockLeads.filter(l => l.status === 'closed-won').length / mockLeads.length) * 100) },
]

export function Reports() {
  const [timePeriod, setTimePeriod] = useState("12m")
  const stats = mockDashboardStats

  const getInitials = (name: string) => {
    return name.split(' ').map(p => p.charAt(0)).join('').toUpperCase().slice(0, 2)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Sales analytics and performance insights.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-[160px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(revenueData.reduce((sum, r) => sum + r.revenue, 0) / 1000).toFixed(0)}k
            </div>
            <p className="text-xs text-green-600">+18.2% vs last year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deals Closed</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {revenueData.reduce((sum, r) => sum + r.deals, 0)}
            </div>
            <p className="text-xs text-green-600">+12 from previous period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Deal Size</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.avgDealSize.toLocaleString()}</div>
            <p className="text-xs text-green-600">+5.3% vs last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">Lead to customer</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="sources">Lead Sources</TabsTrigger>
          <TabsTrigger value="performers">Team</TabsTrigger>
        </TabsList>

        {/* Revenue Over Time */}
        <TabsContent value="revenue">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Revenue Over Time</CardTitle>
                <CardDescription>Monthly revenue trend for the past 12 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis
                      className="text-xs"
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#3b82f6"
                      fill="url(#colorRevenue)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Conversion Funnel */}
            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
                <CardDescription>Lead to customer conversion</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {conversionData.map((stage, index) => (
                    <div key={stage.stage} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{stage.stage}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-muted-foreground">{stage.count}</span>
                          <Badge variant="outline" className="text-xs">{stage.rate}%</Badge>
                        </div>
                      </div>
                      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-500 transition-all"
                          style={{
                            width: `${stage.rate}%`,
                            opacity: 1 - (index * 0.15),
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Deals Closed Per Month */}
                <div className="mt-8 pt-4 border-t">
                  <h4 className="text-sm font-medium mb-4">Monthly Deal Volume</h4>
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={revenueData}>
                      <XAxis dataKey="month" className="text-xs" tick={{ fontSize: 10 }} />
                      <YAxis className="text-xs" tick={{ fontSize: 10 }} />
                      <Tooltip
                        formatter={(value: number) => [value, 'Deals']}
                        contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                      />
                      <Bar dataKey="deals" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pipeline Analysis */}
        <TabsContent value="pipeline">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Deals by Stage</CardTitle>
                <CardDescription>Distribution of deals across pipeline stages</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={dealStageData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      type="number"
                      className="text-xs"
                      tickFormatter={(value) => `$${value}k`}
                    />
                    <YAxis dataKey="stage" type="category" className="text-xs" width={100} />
                    <Tooltip
                      formatter={(value: number) => [`$${value}k`, 'Value']}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {dealStageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={mockSalesPipeline[index]?.color || '#8884d8'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Deal Count by Stage</CardTitle>
                <CardDescription>Number of deals in each pipeline stage</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={dealStageData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="stage" className="text-xs" tick={{ fontSize: 10 }} />
                    <YAxis className="text-xs" />
                    <Tooltip
                      formatter={(value: number) => [value, 'Deals']}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {dealStageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={mockSalesPipeline[index]?.color || '#8884d8'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Lead Sources */}
        <TabsContent value="sources">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Lead Sources</CardTitle>
                <CardDescription>Where your leads are coming from</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={leadSourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {leadSourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number, name: string) => [value, name]}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Source Performance</CardTitle>
                <CardDescription>Lead quality and conversion by source</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {leadSourceData.map(source => {
                    const sourceLeads = mockLeads.filter(l =>
                      l.source === source.name.toLowerCase().replace(' ', '-')
                    )
                    const avgValue = sourceLeads.length > 0
                      ? Math.round(sourceLeads.reduce((sum, l) => sum + l.value, 0) / sourceLeads.length)
                      : 0
                    const avgProb = sourceLeads.length > 0
                      ? Math.round(sourceLeads.reduce((sum, l) => sum + l.probability, 0) / sourceLeads.length)
                      : 0

                    return (
                      <div key={source.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: source.color }}
                            />
                            <span className="text-sm font-medium">{source.name}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {source.value} leads
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground pl-5">
                          <span>Avg. Value: ${avgValue.toLocaleString()}</span>
                          <span>Avg. Score: {avgProb}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden ml-5">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(source.value / Math.max(...leadSourceData.map(s => s.value))) * 100}%`,
                              backgroundColor: source.color,
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Top Performers */}
        <TabsContent value="performers">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>Sales team performance rankings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rank</TableHead>
                        <TableHead>Team Member</TableHead>
                        <TableHead className="text-center">Deals</TableHead>
                        <TableHead className="text-center">Won</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                        <TableHead className="text-right">Win Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topPerformers.map((performer, index) => (
                        <TableRow key={performer.name}>
                          <TableCell>
                            {index === 0 ? (
                              <Award className="h-5 w-5 text-yellow-500" />
                            ) : index === 1 ? (
                              <Award className="h-5 w-5 text-gray-400" />
                            ) : index === 2 ? (
                              <Award className="h-5 w-5 text-amber-700" />
                            ) : (
                              <span className="text-sm text-muted-foreground pl-1">#{index + 1}</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">
                                  {getInitials(performer.name)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{performer.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">{performer.deals}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              {performer.wonDeals}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ${performer.revenue.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={`font-medium ${
                              performer.deals > 0 && (performer.wonDeals / performer.deals) >= 0.5
                                ? 'text-green-600' : 'text-muted-foreground'
                            }`}>
                              {performer.deals > 0
                                ? Math.round((performer.wonDeals / performer.deals) * 100)
                                : 0}%
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Team Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Team Summary</CardTitle>
                <CardDescription>Overall team statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Team Members</span>
                    <span className="font-medium">{topPerformers.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Deals</span>
                    <span className="font-medium">{mockDeals.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Revenue</span>
                    <span className="font-medium">
                      ${topPerformers.reduce((sum, p) => sum + p.revenue, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Avg. Revenue/Member</span>
                    <span className="font-medium">
                      ${Math.round(
                        topPerformers.reduce((sum, p) => sum + p.revenue, 0) / topPerformers.length
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Customers</span>
                    <span className="font-medium">{mockCustomers.length}</span>
                  </div>
                </div>

                {/* Revenue by Rep Chart */}
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-3">Revenue by Rep</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={topPerformers.map(p => ({
                      name: p.name.split(' ')[0],
                      revenue: p.revenue / 1000,
                    }))}>
                      <XAxis dataKey="name" className="text-xs" tick={{ fontSize: 10 }} />
                      <YAxis className="text-xs" tickFormatter={(v) => `$${v}k`} tick={{ fontSize: 10 }} />
                      <Tooltip
                        formatter={(value: number) => [`$${value}k`, 'Revenue']}
                        contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                      />
                      <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
