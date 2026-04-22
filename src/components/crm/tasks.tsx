import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  Calendar,
  Clock,
  User,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Timer,
  ListTodo,
  Phone,
  Mail,
  Video,
  ArrowRight,
  FileText,
  Presentation,
} from "lucide-react"
import { mockTasks } from "../../data/mockData"
import type { Task } from "../../types/crm"

export function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const filteredTasks = tasks.filter(task => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignedTo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleToggleComplete = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: t.status === 'completed' ? 'pending' : 'completed',
          completedAt: t.status === 'completed' ? undefined : new Date(),
        } as Task
      }
      return t
    }))
  }

  const getPriorityBadge = (priority: Task['priority']) => {
    const config: Record<Task['priority'], { className: string; icon: React.ReactNode }> = {
      'low': { className: 'bg-green-50 text-green-700 border-green-200', icon: <Circle className="h-3 w-3 mr-1" /> },
      'medium': { className: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: <Timer className="h-3 w-3 mr-1" /> },
      'high': { className: 'bg-orange-50 text-orange-700 border-orange-200', icon: <AlertTriangle className="h-3 w-3 mr-1" /> },
      'urgent': { className: 'bg-red-50 text-red-700 border-red-200', icon: <AlertTriangle className="h-3 w-3 mr-1 fill-current" /> },
    }
    const c = config[priority]
    return (
      <Badge variant="outline" className={`text-xs ${c.className}`}>
        {c.icon}
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    )
  }

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'in-progress': return <Timer className="h-4 w-4 text-blue-600" />
      case 'pending': return <Circle className="h-4 w-4 text-gray-400" />
      case 'cancelled': return <Circle className="h-4 w-4 text-red-400 line-through" />
    }
  }

  const getTypeIcon = (type: Task['type']) => {
    const icons: Record<Task['type'], React.ReactNode> = {
      'call': <Phone className="h-3.5 w-3.5" />,
      'email': <Mail className="h-3.5 w-3.5" />,
      'meeting': <Video className="h-3.5 w-3.5" />,
      'follow-up': <ArrowRight className="h-3.5 w-3.5" />,
      'demo': <Presentation className="h-3.5 w-3.5" />,
      'proposal': <FileText className="h-3.5 w-3.5" />,
      'other': <ListTodo className="h-3.5 w-3.5" />,
    }
    return icons[type] || icons.other
  }

  const isOverdue = (task: Task) => {
    if (task.status === 'completed' || task.status === 'cancelled' || !task.dueDate) return false
    return task.dueDate < new Date()
  }

  const pendingTasks = tasks.filter(t => t.status === 'pending').length
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length
  const completedTasks = tasks.filter(t => t.status === 'completed').length
  const overdueTasks = tasks.filter(t => isOverdue(t)).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            Manage your tasks, follow-ups, and action items.
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>
                Add a new task to track an action item.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="task-title" className="text-right">Title</Label>
                <Input id="task-title" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="task-desc" className="text-right">Description</Label>
                <Textarea id="task-desc" className="col-span-3" rows={2} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="task-type" className="text-right">Type</Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="call">Call</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                    <SelectItem value="demo">Demo</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="task-priority" className="text-right">Priority</Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="task-due" className="text-right">Due Date</Label>
                <Input id="task-due" type="date" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="task-assignee" className="text-right">Assignee</Label>
                <Input id="task-assignee" className="col-span-3" placeholder="Assignee name" />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>Create Task</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Circle className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasks}</div>
            <p className="text-xs text-muted-foreground">Awaiting action</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Timer className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressTasks}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((completedTasks / tasks.length) * 100)}% completion rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueTasks}</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Task Filters */}
      <Tabs defaultValue="all" value={statusFilter} onValueChange={setStatusFilter}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <div className="flex items-center space-x-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Task List - shared across all tabs */}
        <TabsContent value={statusFilter} className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-1">
                {filteredTasks.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No tasks match your current filters.
                  </div>
                ) : (
                  filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`flex items-center space-x-4 rounded-lg border p-4 transition-colors hover:bg-gray-50 ${
                        isOverdue(task) ? 'border-red-200 bg-red-50/50' : ''
                      } ${task.status === 'completed' ? 'opacity-60' : ''}`}
                    >
                      {/* Checkbox */}
                      <Checkbox
                        checked={task.status === 'completed'}
                        onCheckedChange={() => handleToggleComplete(task.id)}
                      />

                      {/* Type Icon */}
                      <div className="text-muted-foreground">
                        {getTypeIcon(task.type)}
                      </div>

                      {/* Task Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                            {task.title}
                          </p>
                          {isOverdue(task) && (
                            <span className="text-xs text-red-600 font-medium">OVERDUE</span>
                          )}
                        </div>
                        {task.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-md">
                            {task.description}
                          </p>
                        )}
                      </div>

                      {/* Assignee */}
                      {task.assignedTo && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <User className="h-3.5 w-3.5 mr-1" />
                          <span className="truncate max-w-[100px]">{task.assignedTo}</span>
                        </div>
                      )}

                      {/* Priority */}
                      {getPriorityBadge(task.priority)}

                      {/* Due Date */}
                      {task.dueDate && (
                        <div className={`flex items-center text-xs ${isOverdue(task) ? 'text-red-600' : 'text-muted-foreground'}`}>
                          <Calendar className="h-3 w-3 mr-1" />
                          {task.dueDate.toLocaleDateString()}
                        </div>
                      )}

                      {/* Actions */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Task
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleComplete(task.id)}>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            {task.status === 'completed' ? 'Mark Pending' : 'Mark Complete'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Task
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))
                )}
              </div>

              {/* Summary */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredTasks.length} of {tasks.length} tasks
                </div>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span className="flex items-center"><Circle className="h-3 w-3 mr-1 text-gray-400" /> {pendingTasks} pending</span>
                  <span className="flex items-center"><Timer className="h-3 w-3 mr-1 text-blue-500" /> {inProgressTasks} active</span>
                  <span className="flex items-center"><CheckCircle2 className="h-3 w-3 mr-1 text-green-500" /> {completedTasks} done</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
