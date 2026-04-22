import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Target,
  DollarSign,
  TrendingUp,
  Activity,
  Calendar,
  BarChart3,
  PieChart,
  Plus,
  Eye,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react"
import {
  mockDashboardStats,
  mockSalesPipeline,
  getRecentActivities,
  getUpcomingTasks
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
  const recentActivities = getRecentActivities(5)
  const upcomingTasks = getUpcomingTasks(5)

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
          title="Total Customers"
          value={stats.totalCustomers}
          change="+12%"
          changeType="positive"
          icon={<Users className="h-4 w-4" />}
        />
        <MetricCard
          title="Active Leads"
          value={stats.totalLeads}
          change="+8%"
          changeType="positive"
          icon={<Target className="h-4 w-4" />}
        />
        <MetricCard
          title="Pipeline Value"
          value={`$${(stats.pipelineValue / 1000).toFixed(0)}k`}
          change="+15%"
          changeType="positive"
          icon={<DollarSign className="h-4 w-4" />}
        />
        <MetricCard
          title="Conversion Rate"
          value={`${stats.conversionRate}%`}
          change="+5%"
          changeType="positive"
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Sales Pipeline */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Sales Pipeline</CardTitle>
            <CardDescription>
              Current deal distribution across pipeline stages
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
                  value={(stage.value / Math.max(...pipeline.map(p => p.value))) * 100}
                  className="h-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates from your CRM
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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

      <div className="grid gap-4 md:grid-cols-2">
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
              {upcomingTasks.slice(0, 4).map((task) => (
                <div key={task.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {task.title}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="outline"
                        className={`text-xs ${getTaskPriorityColor(task.priority)}`}
                      >
                        {task.priority}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        Due {task.dueDate?.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common CRM tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="h-16 flex-col">
                <Users className="h-5 w-5 mb-1" />
                Add Customer
              </Button>
              <Button variant="outline" className="h-16 flex-col">
                <Target className="h-5 w-5 mb-1" />
                Create Lead
              </Button>
              <Button variant="outline" className="h-16 flex-col">
                <DollarSign className="h-5 w-5 mb-1" />
                New Deal
              </Button>
              <Button variant="outline" className="h-16 flex-col">
                <Calendar className="h-5 w-5 mb-1" />
                Schedule Task
              </Button>
            </div>
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Average deal size</span>
                <span className="font-medium">${stats.avgDealSize.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-muted-foreground">Monthly growth</span>
                <span className={`font-medium ${stats.monthlyGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.monthlyGrowth > 0 ? '+' : ''}{stats.monthlyGrowth}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
