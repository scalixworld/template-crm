import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Users,
  Bell,
  Link,
  GripVertical,
  Plus,
  Edit,
  Trash2,
  Save,
  Mail,
  Shield,
  Database,
  Webhook,
  Palette,
} from "lucide-react"

// Pipeline stage configuration
const defaultPipelineStages = [
  { id: '1', name: 'Prospecting', color: '#3b82f6', probability: 10, order: 1 },
  { id: '2', name: 'Qualification', color: '#8b5cf6', probability: 25, order: 2 },
  { id: '3', name: 'Proposal', color: '#f59e0b', probability: 50, order: 3 },
  { id: '4', name: 'Negotiation', color: '#f97316', probability: 75, order: 4 },
  { id: '5', name: 'Closed Won', color: '#22c55e', probability: 100, order: 5 },
  { id: '6', name: 'Closed Lost', color: '#ef4444', probability: 0, order: 6 },
]

// Team members
const teamMembers = [
  { id: '1', name: 'John Doe', email: 'john.doe@company.com', role: 'Sales Manager', status: 'active' },
  { id: '2', name: 'Sarah Chen', email: 'sarah.chen@company.com', role: 'Account Executive', status: 'active' },
  { id: '3', name: 'Mike Johnson', email: 'mike.j@company.com', role: 'Account Executive', status: 'active' },
  { id: '4', name: 'Emily Wilson', email: 'emily.w@company.com', role: 'SDR', status: 'active' },
  { id: '5', name: 'Alex Rivera', email: 'alex.r@company.com', role: 'SDR', status: 'inactive' },
]

// Integration configs
const integrations = [
  { id: 'email', name: 'Email (SMTP)', description: 'Send and track emails', icon: Mail, connected: true },
  { id: 'calendar', name: 'Google Calendar', description: 'Sync meetings and events', icon: Link, connected: true },
  { id: 'slack', name: 'Slack', description: 'Notifications and alerts', icon: Webhook, connected: false },
  { id: 'api', name: 'REST API', description: 'External API access', icon: Database, connected: true },
]

export function Settings() {
  const [stages, setStages] = useState(defaultPipelineStages)
  const [isAddStageOpen, setIsAddStageOpen] = useState(false)
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)

  // Notification preferences
  const [notifications, setNotifications] = useState({
    dealCreated: true,
    dealClosed: true,
    leadAssigned: true,
    taskDue: true,
    taskOverdue: true,
    dailyDigest: false,
    weeklyReport: true,
    emailNotifications: true,
    browserNotifications: true,
    mobileNotifications: false,
  })

  const getInitials = (name: string) => {
    return name.split(' ').map(p => p.charAt(0)).join('').toUpperCase().slice(0, 2)
  }

  const handleToggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleRemoveStage = (stageId: string) => {
    setStages(prev => prev.filter(s => s.id !== stageId))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure your CRM pipeline, team, and preferences.
        </p>
      </div>

      <Tabs defaultValue="pipeline">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pipeline" className="flex items-center space-x-2">
            <Palette className="h-4 w-4" />
            <span>Pipeline</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Team</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center space-x-2">
            <Link className="h-4 w-4" />
            <span>Integrations</span>
          </TabsTrigger>
        </TabsList>

        {/* Pipeline Configuration */}
        <TabsContent value="pipeline">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pipeline Stages</CardTitle>
                  <CardDescription>
                    Configure the stages of your sales pipeline. Drag to reorder.
                  </CardDescription>
                </div>
                <Dialog open={isAddStageOpen} onOpenChange={setIsAddStageOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Stage
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add Pipeline Stage</DialogTitle>
                      <DialogDescription>
                        Create a new stage in your sales pipeline.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="stage-name" className="text-right">Name</Label>
                        <Input id="stage-name" className="col-span-3" placeholder="Stage name" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="stage-color" className="text-right">Color</Label>
                        <Input id="stage-color" type="color" className="col-span-3 h-10" defaultValue="#3b82f6" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="stage-prob" className="text-right">Win %</Label>
                        <Input id="stage-prob" type="number" min="0" max="100" className="col-span-3" placeholder="Default probability" />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsAddStageOpen(false)}>Cancel</Button>
                      <Button onClick={() => setIsAddStageOpen(false)}>Add Stage</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stages.map((stage) => (
                  <div
                    key={stage.id}
                    className="flex items-center space-x-4 rounded-lg border p-4 hover:bg-gray-50 transition-colors"
                  >
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: stage.color }}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{stage.name}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-muted-foreground">
                        {stage.probability}% win rate
                      </span>
                      <Badge variant="outline" className="text-xs">
                        Order: {stage.order}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleRemoveStage(stage.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              {/* Pipeline Settings */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Pipeline Settings</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="default-currency">Default Currency</Label>
                    <Select defaultValue="usd">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD ($)</SelectItem>
                        <SelectItem value="eur">EUR (&#8364;)</SelectItem>
                        <SelectItem value="gbp">GBP (&#163;)</SelectItem>
                        <SelectItem value="inr">INR (&#8377;)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fiscal-year">Fiscal Year Start</Label>
                    <Select defaultValue="jan">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jan">January</SelectItem>
                        <SelectItem value="apr">April</SelectItem>
                        <SelectItem value="jul">July</SelectItem>
                        <SelectItem value="oct">October</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-0.5">
                    <Label>Auto-close stale deals</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically mark deals as lost after 90 days of inactivity
                    </p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require close reason</Label>
                    <p className="text-xs text-muted-foreground">
                      Require a reason when marking deals as lost
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Pipeline Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Management */}
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>
                    Manage your sales team and their access levels.
                  </CardDescription>
                </div>
                <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add Team Member</DialogTitle>
                      <DialogDescription>
                        Invite a new member to your CRM team.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="member-name" className="text-right">Name</Label>
                        <Input id="member-name" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="member-email" className="text-right">Email</Label>
                        <Input id="member-email" type="email" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="member-role" className="text-right">Role</Label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="manager">Sales Manager</SelectItem>
                            <SelectItem value="ae">Account Executive</SelectItem>
                            <SelectItem value="sdr">SDR</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>Cancel</Button>
                      <Button onClick={() => setIsAddMemberOpen(false)}>Send Invite</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">
                                {getInitials(member.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{member.name}</p>
                              <p className="text-xs text-muted-foreground">{member.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{member.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={member.status === 'active' ? 'default' : 'secondary'}
                            className={member.status === 'active' ? 'bg-green-500' : ''}
                          >
                            {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Separator className="my-6" />

              {/* Role Permissions */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Role Permissions
                </h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Permission</TableHead>
                        <TableHead className="text-center">Admin</TableHead>
                        <TableHead className="text-center">Manager</TableHead>
                        <TableHead className="text-center">AE</TableHead>
                        <TableHead className="text-center">SDR</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { perm: 'View all deals', admin: true, manager: true, ae: false, sdr: false },
                        { perm: 'Create deals', admin: true, manager: true, ae: true, sdr: false },
                        { perm: 'Delete deals', admin: true, manager: false, ae: false, sdr: false },
                        { perm: 'Manage team', admin: true, manager: true, ae: false, sdr: false },
                        { perm: 'View reports', admin: true, manager: true, ae: true, sdr: false },
                        { perm: 'Export data', admin: true, manager: true, ae: false, sdr: false },
                        { perm: 'CRM settings', admin: true, manager: false, ae: false, sdr: false },
                      ].map((row) => (
                        <TableRow key={row.perm}>
                          <TableCell className="text-sm">{row.perm}</TableCell>
                          <TableCell className="text-center">
                            <Switch checked={row.admin} />
                          </TableCell>
                          <TableCell className="text-center">
                            <Switch checked={row.manager} />
                          </TableCell>
                          <TableCell className="text-center">
                            <Switch checked={row.ae} />
                          </TableCell>
                          <TableCell className="text-center">
                            <Switch checked={row.sdr} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Preferences */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose which events trigger notifications and how you receive them.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Delivery Channels */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Delivery Channels</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-xs text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={() => handleToggleNotification('emailNotifications')}
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label>Browser Notifications</Label>
                      <p className="text-xs text-muted-foreground">Desktop push notifications</p>
                    </div>
                    <Switch
                      checked={notifications.browserNotifications}
                      onCheckedChange={() => handleToggleNotification('browserNotifications')}
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label>Mobile Notifications</Label>
                      <p className="text-xs text-muted-foreground">Push notifications on mobile app</p>
                    </div>
                    <Switch
                      checked={notifications.mobileNotifications}
                      onCheckedChange={() => handleToggleNotification('mobileNotifications')}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Event Triggers */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Event Triggers</h3>
                <div className="space-y-3">
                  {[
                    { key: 'dealCreated' as const, label: 'Deal Created', desc: 'When a new deal is added to the pipeline' },
                    { key: 'dealClosed' as const, label: 'Deal Closed', desc: 'When a deal is won or lost' },
                    { key: 'leadAssigned' as const, label: 'Lead Assigned', desc: 'When a lead is assigned to you' },
                    { key: 'taskDue' as const, label: 'Task Due Soon', desc: 'Reminder 1 hour before a task is due' },
                    { key: 'taskOverdue' as const, label: 'Task Overdue', desc: 'When a task passes its due date' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <Label>{item.label}</Label>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch
                        checked={notifications[item.key]}
                        onCheckedChange={() => handleToggleNotification(item.key)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Digest Reports */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Scheduled Reports</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label>Daily Digest</Label>
                      <p className="text-xs text-muted-foreground">Summary of daily activities at 8:00 AM</p>
                    </div>
                    <Switch
                      checked={notifications.dailyDigest}
                      onCheckedChange={() => handleToggleNotification('dailyDigest')}
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label>Weekly Report</Label>
                      <p className="text-xs text-muted-foreground">Pipeline and performance report every Monday</p>
                    </div>
                    <Switch
                      checked={notifications.weeklyReport}
                      onCheckedChange={() => handleToggleNotification('weeklyReport')}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>
                Connect your CRM with external services and tools.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {integrations.map((integration) => {
                const Icon = integration.icon
                return (
                  <div
                    key={integration.id}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-lg bg-gray-100">
                        <Icon className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{integration.name}</p>
                        <p className="text-xs text-muted-foreground">{integration.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge
                        variant={integration.connected ? 'default' : 'outline'}
                        className={integration.connected ? 'bg-green-500' : ''}
                      >
                        {integration.connected ? 'Connected' : 'Not Connected'}
                      </Badge>
                      <Button variant="outline" size="sm">
                        {integration.connected ? 'Configure' : 'Connect'}
                      </Button>
                    </div>
                  </div>
                )
              })}

              <Separator className="my-6" />

              {/* API Settings */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium flex items-center">
                  <Database className="h-4 w-4 mr-2" />
                  API Configuration
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="api-key"
                        type="password"
                        value="sk-crm-xxxxxxxxxxxxxxxxxxxx"
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button variant="outline" size="sm">Copy</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Use this key to authenticate API requests
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="webhook-url">Webhook URL</Label>
                    <Input
                      id="webhook-url"
                      placeholder="https://your-app.com/webhooks/crm"
                    />
                    <p className="text-xs text-muted-foreground">
                      Receive real-time event notifications
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-0.5">
                    <Label>Enable API Access</Label>
                    <p className="text-xs text-muted-foreground">
                      Allow external applications to access CRM data
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Webhook Events</Label>
                    <p className="text-xs text-muted-foreground">
                      Send events to your webhook endpoint
                    </p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Integration Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
