import { useState } from 'react'
import { CRMDashboard } from './components/crm/dashboard'
import { Customers } from './components/crm/customers'
import { Button } from './components/ui/button'
import { Menu, X, Home, Users, Target, DollarSign, BarChart3, Settings, MessageSquare, Calendar } from 'lucide-react'

type ViewType = 'dashboard' | 'customers' | 'leads' | 'deals' | 'contacts' | 'tasks' | 'reports' | 'settings'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentView, setCurrentView] = useState<ViewType>('dashboard')

  const navigation = [
    { name: 'Dashboard', href: 'dashboard', icon: Home, current: currentView === 'dashboard' },
    { name: 'Customers', href: 'customers', icon: Users, current: currentView === 'customers' },
    { name: 'Leads', href: 'leads', icon: Target, current: currentView === 'leads' },
    { name: 'Deals', href: 'deals', icon: DollarSign, current: currentView === 'deals' },
    { name: 'Contacts', href: 'contacts', icon: MessageSquare, current: currentView === 'contacts' },
    { name: 'Tasks', href: 'tasks', icon: Calendar, current: currentView === 'tasks' },
    { name: 'Reports', href: 'reports', icon: BarChart3, current: currentView === 'reports' },
    { name: 'Settings', href: 'settings', icon: Settings, current: currentView === 'settings' },
  ]

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <CRMDashboard />
      case 'customers':
        return <Customers />
      case 'leads':
        return <div className="p-8 text-center text-muted-foreground">Leads management coming soon...</div>
      case 'deals':
        return <div className="p-8 text-center text-muted-foreground">Deal pipeline coming soon...</div>
      case 'contacts':
        return <div className="p-8 text-center text-muted-foreground">Contact management coming soon...</div>
      case 'tasks':
        return <div className="p-8 text-center text-muted-foreground">Task management coming soon...</div>
      case 'reports':
        return <div className="p-8 text-center text-muted-foreground">Reports & analytics coming soon...</div>
      case 'settings':
        return <div className="p-8 text-center text-muted-foreground">CRM settings coming soon...</div>
      default:
        return <CRMDashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              scalix-crm
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setCurrentView(item.href as ViewType)
                    setSidebarOpen(false)
                  }}
                  className={`
                    w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors
                    ${item.current
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700 dark:bg-blue-900/50 dark:text-blue-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
                    }
                  `}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      item.current
                        ? 'text-blue-500 dark:text-blue-300'
                        : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                    }`}
                  />
                  {item.name}
                </button>
              )
            })}
          </div>
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">JD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                Sales Manager
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                john.doe@company.com
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderCurrentView()}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
