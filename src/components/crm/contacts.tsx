import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import {
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  Mail,
  Phone,
  MessageSquare,
  Video,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react"
import { mockContacts, mockCustomers } from "../../data/mockData"
import type { Contact } from "../../types/crm"

export function Contacts() {
  const [contacts] = useState<Contact[]>(mockContacts)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch =
      contact.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.assignedTo?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || contact.type === typeFilter
    const matchesStatus = statusFilter === "all" || contact.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const getTypeBadge = (type: Contact['type']) => {
    const config: Record<Contact['type'], { icon: React.ReactNode; className: string }> = {
      'call': { icon: <Phone className="h-3 w-3 mr-1" />, className: 'bg-blue-50 text-blue-700' },
      'email': { icon: <Mail className="h-3 w-3 mr-1" />, className: 'bg-green-50 text-green-700' },
      'meeting': { icon: <Video className="h-3 w-3 mr-1" />, className: 'bg-purple-50 text-purple-700' },
      'note': { icon: <FileText className="h-3 w-3 mr-1" />, className: 'bg-yellow-50 text-yellow-700' },
      'task': { icon: <CheckCircle className="h-3 w-3 mr-1" />, className: 'bg-orange-50 text-orange-700' },
    }
    const c = config[type]
    return (
      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${c.className}`}>
        {c.icon}
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    )
  }

  const getStatusBadge = (status?: Contact['status']) => {
    if (!status) return null
    const config: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
      'completed': { variant: 'default', icon: <CheckCircle className="h-3 w-3 mr-1" /> },
      'pending': { variant: 'secondary', icon: <Clock className="h-3 w-3 mr-1" /> },
      'cancelled': { variant: 'destructive', icon: <XCircle className="h-3 w-3 mr-1" /> },
    }
    const c = config[status]
    return (
      <Badge variant={c.variant} className="text-xs">
        {c.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getDirectionIcon = (direction?: Contact['direction']) => {
    if (direction === 'inbound') return <ArrowDownLeft className="h-3.5 w-3.5 text-green-600" />
    if (direction === 'outbound') return <ArrowUpRight className="h-3.5 w-3.5 text-blue-600" />
    return null
  }

  const getCustomerName = (customerId?: string) => {
    if (!customerId) return null
    const customer = mockCustomers.find(c => c.id === customerId)
    if (!customer) return null
    return `${customer.firstName} ${customer.lastName}`
  }

  const getInitials = (name: string) => {
    const parts = name.split(' ')
    return parts.map(p => p.charAt(0)).join('').toUpperCase().slice(0, 2)
  }

  const totalCalls = contacts.filter(c => c.type === 'call').length
  const totalEmails = contacts.filter(c => c.type === 'email').length
  const totalMeetings = contacts.filter(c => c.type === 'meeting').length
  const completedContacts = contacts.filter(c => c.status === 'completed').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground">
            Track all customer interactions and communication history.
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Log Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Log New Contact</DialogTitle>
              <DialogDescription>
                Record a customer interaction or communication.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact-type" className="text-right">Type</Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="call">Call</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="note">Note</SelectItem>
                    <SelectItem value="task">Task</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact-direction" className="text-right">Direction</Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select direction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inbound">Inbound</SelectItem>
                    <SelectItem value="outbound">Outbound</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact-subject" className="text-right">Subject</Label>
                <Input id="contact-subject" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact-content" className="text-right">Details</Label>
                <Textarea id="contact-content" className="col-span-3" rows={3} />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>Log Contact</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contacts.length}</div>
            <p className="text-xs text-muted-foreground">{completedContacts} completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calls</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCalls}</div>
            <p className="text-xs text-muted-foreground">Phone interactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmails}</div>
            <p className="text-xs text-muted-foreground">Email exchanges</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meetings</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMeetings}</div>
            <p className="text-xs text-muted-foreground">Scheduled meetings</p>
          </CardContent>
        </Card>
      </div>

      {/* Contacts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Log</CardTitle>
          <CardDescription>
            All customer interactions and communications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="call">Call</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="note">Note</SelectItem>
                <SelectItem value="task">Task</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]"></TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.slice(0, 25).map((contact) => {
                  const customerName = getCustomerName(contact.customerId)
                  return (
                    <TableRow key={contact.id}>
                      <TableCell className="w-[40px]">
                        {getDirectionIcon(contact.direction)}
                      </TableCell>
                      <TableCell>{getTypeBadge(contact.type)}</TableCell>
                      <TableCell>
                        <div className="max-w-[250px]">
                          <p className="font-medium text-sm truncate">{contact.subject}</p>
                          <p className="text-xs text-muted-foreground truncate">{contact.content.slice(0, 60)}...</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {customerName ? (
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {getInitials(customerName)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{customerName}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">{contact.assignedTo}</TableCell>
                      <TableCell>{getStatusBadge(contact.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {contact.scheduledAt?.toLocaleDateString() || contact.createdAt.toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
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
                              Edit Contact
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {Math.min(filteredContacts.length, 25)} of {filteredContacts.length} contacts
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled={filteredContacts.length <= 25}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
