'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/components/auth/AuthProvider';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();

  // Mock data - in production, this would come from an API
  const stats = {
    totalEntries: 15847,
    entriesThisMonth: 2341,
    pendingApprovals: 42,
    recentImports: 8,
    completionRate: 94.2,
    errorRate: 2.1,
  };

  const recentActivity = [
    {
      id: 1,
      action: 'Data Import',
      description: 'Imported 500 customer records from Excel',
      user: 'John Smith',
      timestamp: '2 minutes ago',
      status: 'completed',
    },
    {
      id: 2,
      action: 'Data Entry',
      description: 'Added 25 new product entries',
      user: 'Sarah Johnson',
      timestamp: '15 minutes ago',
      status: 'completed',
    },
    {
      id: 3,
      action: 'Data Validation',
      description: 'Validated inventory data batch #127',
      user: 'Mike Davis',
      timestamp: '1 hour ago',
      status: 'pending',
    },
    {
      id: 4,
      action: 'Report Generation',
      description: 'Monthly summary report created',
      user: 'Admin',
      timestamp: '2 hours ago',
      status: 'completed',
    },
  ];

  const quickActions = [
    {
      title: 'New Data Entry',
      description: 'Create new data entries manually',
      href: '/data-entry',
      icon: '📝',
      color: 'bg-blue-500',
    },
    {
      title: 'Import Data',
      description: 'Upload and import from files',
      href: '/import',
      icon: '📥',
      color: 'bg-green-500',
    },
    {
      title: 'View Reports',
      description: 'Generate and view reports',
      href: '/reports',
      icon: '📊',
      color: 'bg-purple-500',
    },
    {
      title: 'Manage Users',
      description: 'User and role management',
      href: '/users',
      icon: '👥',
      color: 'bg-orange-500',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const welcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {welcomeMessage()}, {user?.name}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your data today.
            </p>
          </div>
          <div className="flex space-x-3">
            <Button>
              <span className="mr-2">📊</span>
              Generate Report
            </Button>
            <Button variant="outline">
              <span className="mr-2">📤</span>
              Export Data
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
              <span className="text-2xl">📊</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEntries.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <span className="text-2xl">📈</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.entriesThisMonth.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <span className="text-2xl">⏳</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
              <p className="text-xs text-muted-foreground">
                -3 from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Imports</CardTitle>
              <span className="text-2xl">📥</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recentImports}</div>
              <p className="text-xs text-muted-foreground">
                Last 24 hours
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Quality</CardTitle>
              <CardDescription>
                Overall data completion and accuracy rates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Completion Rate</span>
                  <span>{stats.completionRate}%</span>
                </div>
                <Progress value={stats.completionRate} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Error Rate</span>
                  <span>{stats.errorRate}%</span>
                </div>
                <Progress value={stats.errorRate} className="h-2 bg-red-100" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    href={action.href}
                    className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent transition-colors"
                  >
                    <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center text-white text-sm`}>
                      {action.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{action.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions and updates in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                      {activity.action === 'Data Import' && '📥'}
                      {activity.action === 'Data Entry' && '📝'}
                      {activity.action === 'Data Validation' && '✅'}
                      {activity.action === 'Report Generation' && '📊'}
                    </div>
                    <div>
                      <h4 className="font-medium">{activity.action}</h4>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        by {activity.user} • {activity.timestamp}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(activity.status)} variant="secondary">
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Button variant="outline">View All Activity</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}