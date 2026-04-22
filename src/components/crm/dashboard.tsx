import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Users,
  Target,
  DollarSign,
  TrendingUp,
  Activity,
  Calendar,
  BarChart3,
  MessageSquare,
  CheckCircle,
  Clock,
  Eye,
  ListTodo,
} from "lucide-react"
import {
  mockDashboardStats,
  mockSalesPipeline,
  mockDeals,
  mockTasks,
  getRecentActivities,
  getUpcomingTasks,
} from "../../data/mockData"

interface MetricCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: React.ReactNode
  description?: string
}

function MetricCard({ title, value, change, changeType, icon, description }: MetricCardProps) {
  const changeColor = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</div>
        {change && (
          <p className={`text-xs ${changeColor[changeType || 'neutral']}`}>
            {change} from last month
          </p>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

export function CRMDashboard() {
  const stats = mockDashboardStats
  const pipeline = mockSalesPipeline
  const recentActivities = getRecentActivities(10)
  const upcomingTasks = getUpcomingTasks(5)
  const tasksDueToday = mockTasks.filter(t => {
    if (!t.dueDate || t.status === 'completed' || t.status === 'cancelled') return false
    const today = new Date()
    return t.dueDate.toDateString() === today.toDateString()
  }).length
  const topDeals = [...mockDeals]
    .filter(d => d.stage !== 'closed-lost')
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'customer_created': return <Users className="h-4 w-4" />
      case 'lead_created': return <Target className="h-4 w-4" />
      case 'deal_created': return <DollarSign className="h-4 w-4" />
      case 'contact_made': return <MessageSquare className="h-4 w-4" />
      case 'task_completed': return <CheckCircle className="h-4 w-4" />
      case 'deal_closed': return <TrendingUp className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getTaskPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50'
      case 'high': return 'text-orange-600 bg-orange-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStageBadge = (stage: string) => {
    const colors: Record<string, string> = {
      'prospecting': 'bg-blue-100 text-blue-800',
      'qualification': 'bg-purple-100 text-purple-800',
      'proposal': 'bg-yellow-100 text-yellow-800',
      'negotiation': 'bg-orange-100 text-orange-800',
      'closed-won': 'bg-green-100 text-green-800',
      'closed-lost': 'bg-red-100 text-red-800',
    }
    const labels: Record<string, string> = {
      'prospecting': 'Prospecting',
      'qualification': 'Qualification',
      'proposal': 'Proposal',
      'negotiation': 'Negotiation',
      'closed-won': 'Closed Won',
      'closed-lost': 'Closed Lost',
    }
    return (
      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[stage] || 'bg-gray-100 text-gray-800'}`}>
        {labels[stage] || stage}
      </span>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CRM Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your customers, leads, and sales pipeline.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Last 30 days
          </Button>
          <Button size="sm">
            <BarChart3 className="mr-2 h-4 w-4" />
            View Reports
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value={`$${(stats.totalRevenue / 1000).toFixed(0)}k`}
          change="+18%"
          changeType="positive"
          icon={<DollarSign className="h-4 w-4" />}
        />
        <MetricCard
          title="Active Deals"
          value={mockDeals.filter(d => !d.stage.includes('closed')).length}
          change="+3 new"
          changeType="positive"
          icon={<Target className="h-4 w-4" />}
        />
        <MetricCard
          title="New Leads"
          value={stats.totalLeads}
          change="+8%"
          changeType="positive"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <MetricCard
          title="Tasks Due"
          value={tasksDueToday > 0 ? tasksDueToday : upcomingTasks.length}
          change={`${upcomingTasks.length} upcoming`}
          changeType="neutral"
          icon={<ListTodo className="h-4 w-4" />}
        />
      </div>

      {/* Sales Pipeline + Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Sales Pipeline */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Sales Pipeline</CardTitle>
            <CardDescription>
              Deal flow: Prospecting &rarr; Qualified &rarr; Proposal &rarr; Negotiation &rarr; Closed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pipeline.map((stage, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{stage.stage}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">{stage.count} deals</span>
                    <span className="font-medium">${(stage.value / 1000).toFixed(0)}k</span>
                  </div>
                </div>
                <Progress
                  value={(stage.value / Math.max(...pipeline.map(p => p.value), 1)) * 100}
                  className="h-2"
                />
              </div>
            ))}
            <div className="pt-2 border-t flex items-center justify-between text-sm">
              <span className="font-medium text-muted-foreground">Total Pipeline Value</span>
              <span className="font-bold text-lg">
                ${(pipeline.reduce((sum, s) => sum + s.value, 0) / 1000).toFixed(0)}k
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Feed */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Last 10 activities from your team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="mt-1 text-muted-foreground">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.description}
                    </p>
                    <div className="flex items-center space-x-2">
                      <p className="text-xs text-muted-foreground">
                        {activity.userName}
                      </p>
                      <span className="text-xs text-muted-foreground">&middot;</span>
                      <p className="text-xs text-muted-foreground">
                        {activity.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Deals Table + Upcoming Tasks */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Deals */}
        <Card>
          <CardHeader>
            <CardTitle>Top Deals</CardTitle>
            <CardDescription>
              Highest value deals in your pipeline
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Deal</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topDeals.map((deal) => (
                    <TableRow key={deal.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-sm">{deal.title}</div>
                          <div className="text-xs text-muted-foreground">{deal.assignedTo}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getStageBadge(deal.stage)}</TableCell>
                      <TableCell className="text-right font-medium">
                        ${deal.value.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>
              Tasks due in the next few days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center justify-between">
                  <div className="space-y-1 flex-1 min-w-0 mr-2">
                    <p className="text-sm font-medium leading-none truncate">
                      {task.title}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="outline"
                        className={`text-xs ${getTaskPriorityColor(task.priority)}`}
                      >
                        {task.priority}
                      </Badge>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {task.dueDate?.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-6 pt-4 border-t">
              <p className="text-sm font-medium mb-3">Quick Actions</p>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="h-10 text-xs">
                  <Users className="h-3.5 w-3.5 mr-1.5" />
                  Add Customer
                </Button>
                <Button variant="outline" size="sm" className="h-10 text-xs">
                  <Target className="h-3.5 w-3.5 mr-1.5" />
                  Create Lead
                </Button>
                <Button variant="outline" size="sm" className="h-10 text-xs">
                  <DollarSign className="h-3.5 w-3.5 mr-1.5" />
                  New Deal
                </Button>
                <Button variant="outline" size="sm" className="h-10 text-xs">
                  <Calendar className="h-3.5 w-3.5 mr-1.5" />
                  Schedule Task
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
