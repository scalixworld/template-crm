import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
  DollarSign,
  Calendar,
  User,
  ArrowRight,
  TrendingUp,
  Target,
  BarChart3,
} from "lucide-react"
import { mockDeals } from "../../data/mockData"
import type { Deal } from "../../types/crm"

type DealStage = Deal['stage']

const STAGE_CONFIG: Record<DealStage, { label: string; color: string; bgColor: string; borderColor: string }> = {
  'prospecting': { label: 'Prospecting', color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  'qualification': { label: 'Qualification', color: 'text-purple-700', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
  'proposal': { label: 'Proposal', color: 'text-yellow-700', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
  'negotiation': { label: 'Negotiation', color: 'text-orange-700', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
  'closed-won': { label: 'Closed Won', color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
  'closed-lost': { label: 'Closed Lost', color: 'text-red-700', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
}

const PIPELINE_STAGES: DealStage[] = ['prospecting', 'qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost']

export function Deals() {
  const [deals] = useState<Deal[]>(mockDeals)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const filteredDeals = deals.filter(deal =>
    deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deal.customer?.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deal.assignedTo?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const dealsByStage = PIPELINE_STAGES.reduce((acc, stage) => {
    acc[stage] = filteredDeals.filter(d => d.stage === stage)
    return acc
  }, {} as Record<DealStage, Deal[]>)

  const getStageBadge = (stage: DealStage) => {
    const config = STAGE_CONFIG[stage]
    return (
      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${config.bgColor} ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const totalPipeline = deals.filter(d => !d.stage.includes('closed')).reduce((sum, d) => sum + d.value, 0)
  const wonDeals = deals.filter(d => d.stage === 'closed-won')
  const wonValue = wonDeals.reduce((sum, d) => sum + d.value, 0)
  const activeDeals = deals.filter(d => !d.stage.includes('closed'))
  const avgProbability = activeDeals.length > 0
    ? Math.round(activeDeals.reduce((sum, d) => sum + d.probability, 0) / activeDeals.length)
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Deal Pipeline</h1>
          <p className="text-muted-foreground">
            Manage your sales deals from prospecting to close.
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Deal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Deal</DialogTitle>
              <DialogDescription>
                Add a new deal to your sales pipeline.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="deal-title" className="text-right">Title</Label>
                <Input id="deal-title" className="col-span-3" placeholder="Deal title" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="deal-value" className="text-right">Value ($)</Label>
                <Input id="deal-value" type="number" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="deal-stage" className="text-right">Stage</Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {PIPELINE_STAGES.map(stage => (
                      <SelectItem key={stage} value={stage}>
                        {STAGE_CONFIG[stage].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="deal-probability" className="text-right">Probability</Label>
                <Input id="deal-probability" type="number" min="0" max="100" className="col-span-3" placeholder="0-100" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="deal-close" className="text-right">Close Date</Label>
                <Input id="deal-close" type="date" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="deal-desc" className="text-right">Notes</Label>
                <Textarea id="deal-desc" className="col-span-3" />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>Create Deal</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalPipeline / 1000).toFixed(0)}k</div>
            <p className="text-xs text-muted-foreground">{activeDeals.length} active deals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Won Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(wonValue / 1000).toFixed(0)}k</div>
            <p className="text-xs text-muted-foreground">{wonDeals.length} deals closed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {deals.filter(d => d.stage.includes('closed')).length > 0
                ? Math.round((wonDeals.length / deals.filter(d => d.stage.includes('closed')).length) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Of closed deals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Probability</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgProbability}%</div>
            <p className="text-xs text-muted-foreground">Active deals weighted</p>
          </CardContent>
        </Card>
      </div>

      {/* View Toggle */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'kanban' | 'table')}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
            <TabsTrigger value="table">Table</TabsTrigger>
          </TabsList>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search deals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {/* Kanban View */}
        <TabsContent value="kanban">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {PIPELINE_STAGES.map(stage => {
              const config = STAGE_CONFIG[stage]
              const stageDeals = dealsByStage[stage]
              const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0)

              return (
                <div key={stage} className="space-y-3">
                  {/* Column Header */}
                  <div className={`rounded-lg p-3 ${config.bgColor} border ${config.borderColor}`}>
                    <div className="flex items-center justify-between">
                      <h3 className={`text-sm font-semibold ${config.color}`}>
                        {config.label}
                      </h3>
                      <span className={`text-xs font-medium ${config.color} rounded-full px-1.5`}>
                        {stageDeals.length}
                      </span>
                    </div>
                    <p className={`text-xs mt-1 ${config.color} opacity-75`}>
                      ${(stageValue / 1000).toFixed(0)}k
                    </p>
                  </div>

                  {/* Deal Cards */}
                  <div className="space-y-2 min-h-[100px]">
                    {stageDeals.map(deal => (
                      <Card key={deal.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-3 space-y-2">
                          <p className="text-sm font-medium leading-tight">{deal.title}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <DollarSign className="h-3 w-3 mr-1" />
                            ${deal.value.toLocaleString()}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-xs text-muted-foreground">
                              <User className="h-3 w-3 mr-1" />
                              <span className="truncate max-w-[80px]">{deal.assignedTo}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{deal.probability}%</span>
                          </div>
                          {deal.expectedCloseDate && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3 mr-1" />
                              {deal.expectedCloseDate.toLocaleDateString()}
                            </div>
                          )}
                          {deal.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {deal.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </TabsContent>

        {/* Table View */}
        <TabsContent value="table">
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Deal</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Probability</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                      <TableHead>Close Date</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDeals.map((deal) => (
                      <TableRow key={deal.id}>
                        <TableCell>
                          <div className="font-medium">{deal.title}</div>
                          {deal.tags.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {deal.tags.map(tag => (
                                <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">{deal.customer?.company}</TableCell>
                        <TableCell>{getStageBadge(deal.stage)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  deal.probability >= 70 ? 'bg-green-500' :
                                  deal.probability >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${deal.probability}%` }}
                              />
                            </div>
                            <span className="text-sm">{deal.probability}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${deal.value.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {deal.expectedCloseDate?.toLocaleDateString() || '-'}
                        </TableCell>
                        <TableCell className="text-sm">{deal.assignedTo}</TableCell>
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
                                Edit Deal
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <ArrowRight className="mr-2 h-4 w-4" />
                                Move Stage
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Deal
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredDeals.length} of {deals.length} deals
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>Previous</Button>
                  <Button variant="outline" size="sm" disabled>Next</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
