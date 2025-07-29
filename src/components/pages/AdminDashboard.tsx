import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthAPI } from '@/lib/auth/api';
import { EnhancedAuthAPI } from '@/lib/auth/enhanced-api';
import { useAuth } from '@/contexts/AuthContext';
import { AuditLogger } from '@/lib/admin/audit-logger';
import EnhancedUserTable from '@/components/admin/EnhancedUserTable';
import AuditLogViewer from '@/components/admin/AuditLogViewer';
import {
  LayoutDashboard, Users, FileText, User, Clock, Filter, RefreshCcw, Search, ChevronLeft, ChevronRight,
  Check, X, Trash2, UserCheck, UserX, MoreHorizontal
} from 'lucide-react';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader,
  DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';

// Types
import { AdminDashboardData, UserProfile } from '@/lib/types/auth';

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'suspended':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      case 'banned':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <Badge variant="outline" className={getStatusColor()}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const AdminDashboard: React.FC = () => {
  const navigate = useRouter();
  const { user, hasPermission } = useAuth();

  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [users, setUsers] = useState<{
    users: UserProfile[];
    pagination: { total: number; page: number; limit: number; totalPages: number };
    filters: { roles: string[]; statuses: string[] };
  } | null>(null);
  const [loading, setLoading] = useState({
    dashboard: true,
    users: true
  });
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState({
    search: '',
    role: '',
    status: '',
    page: 1,
    limit: 10
  });
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    // Check if user has admin permissions
    if (user && user.role !== 'admin' && user.role !== 'super_admin') {
      router.push('/dashboard');
    }

    // Seed demo audit logs
    AuditLogger.seedDemoLogs();

    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        setLoading(prev => ({ ...prev, dashboard: true }));
        const response = await EnhancedAuthAPI.getAdminDashboard();
        if (response.success && response.data) {
          setDashboardData(response.data);
        } else {
          setError('Failed to load dashboard data');
        }
      } catch (err) {
        setError('An error occurred while fetching dashboard data');
      } finally {
        setLoading(prev => ({ ...prev, dashboard: false }));
      }
    };

    fetchDashboardData();
    fetchUsers();
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(prev => ({ ...prev, users: true }));
      const response = await AuthAPI.getUsers({
        page: searchParams.page,
        limit: searchParams.limit,
        search: searchParams.search || undefined,
        role: searchParams.role || undefined,
        status: searchParams.status || undefined
      });

      if (response.success && response.data) {
        setUsers(response.data);
      } else {
        setError('Failed to load users');
      }
    } catch (err) {
      setError('An error occurred while fetching users');
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(prev => ({ ...prev, page: 1 }));
    fetchUsers();
  };

  const handleFilter = (type: 'role' | 'status', value: string) => {
    setSearchParams(prev => ({ ...prev, [type]: value, page: 1 }));
    fetchUsers();
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams(prev => ({ ...prev, page: newPage }));
    fetchUsers();
  };

  const handleClearFilters = () => {
    setSearchParams({
      search: '',
      role: '',
      status: '',
      page: 1,
      limit: 10
    });
    fetchUsers();
  };

  const handleUpdateUserStatus = async (userId: string, status: string) => {
    setActionInProgress(userId);
    try {
      const response = await AuthAPI.updateUserStatus(userId, status);
      if (response.success) {
        // Update the local user list with the new status
        if (users) {
          setUsers({
            ...users,
            users: users.users.map(user => 
              user.id === userId ? { ...user, status } : user
            )
          });
        }
      } else {
        setError(`Failed to update user status: ${response.message}`);
      }
    } catch (err) {
      setError('An error occurred while updating user status');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setActionInProgress(userId);
    try {
      const response = await AuthAPI.deleteUser(userId);
      if (response.success) {
        // Remove the user from the local list
        if (users) {
          setUsers({
            ...users,
            users: users.users.filter(user => user.id !== userId),
            pagination: {
              ...users.pagination,
              total: users.pagination.total - 1
            }
          });
        }
        setConfirmDelete(null);
      } else {
        setError(`Failed to delete user: ${response.message}`);
      }
    } catch (err) {
      setError('An error occurred while deleting user');
    } finally {
      setActionInProgress(null);
    }
  };

  // Function to generate colors for charts
  const getChartColors = () => [
    '#10b981', '#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b',
    '#14b8a6', '#06b6d4', '#6366f1', '#d946ef', '#f97316'
  ];

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage users and platform content</p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard')}
          className="mt-4 md:mt-0"
        >
          <LayoutDashboard className="w-4 h-4 mr-2" />
          Main Dashboard
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          {loading.dashboard ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
          ) : dashboardData ? (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Total Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-emerald-600">{dashboardData.totalUsers}</div>
                    <p className="text-gray-500 text-sm mt-1">Registered accounts</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Active Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-emerald-600">{dashboardData.activeUsers}</div>
                    <p className="text-gray-500 text-sm mt-1">
                      {Math.round((dashboardData.activeUsers / dashboardData.totalUsers) * 100)}% of total users
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">New Registrations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-emerald-600">{dashboardData.newRegistrations}</div>
                    <p className="text-gray-500 text-sm mt-1">Last 7 days</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">User Types</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold text-emerald-600">{dashboardData.usersByRole.tourist}</div>
                      <div className="text-sm text-gray-600">Tourists</div>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="text-2xl font-bold text-emerald-600">{dashboardData.usersByRole.guide}</div>
                      <div className="text-sm text-gray-600">Guides</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Login Activity</CardTitle>
                    <CardDescription>User logins over the past week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart
                        data={dashboardData.loginActivity}
                        margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                      >
                        <defs>
                          <linearGradient id="colorLogins" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="date"
                          tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip
                          labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                          formatter={(value) => [`${value} logins`, 'Logins']}
                        />
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke="#10b981"
                          fillOpacity={1}
                          fill="url(#colorLogins)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>User Distribution by Role</CardTitle>
                    <CardDescription>Breakdown of user account types</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={Object.entries(dashboardData.usersByRole).map(([key, value]) => ({
                            name: key.charAt(0).toUpperCase() + key.slice(1),
                            value
                          }))}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#10b981"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {Object.entries(dashboardData.usersByRole).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getChartColors()[index % getChartColors().length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} users`, 'Count']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Regions</CardTitle>
                    <CardDescription>Popular regions by user count</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={dashboardData.topRegions}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="region" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value} users`, 'Users']} />
                        <Bar dataKey="userCount" fill="#10b981">
                          {dashboardData.topRegions.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getChartColors()[index % getChartColors().length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 flex flex-col items-center">
                <p>No dashboard data available.</p>
                <Button
                  variant="outline"
                  onClick={() => fetchUsers()}
                  className="mt-4"
                >
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Refresh Data
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>
                View and manage all users on the platform
              </CardDescription>
            </CardHeader>

            <CardContent>
              {/* Search & Filters */}
              <div className="space-y-4 mb-6">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search by name or email..."
                      className="pl-9"
                      value={searchParams.search}
                      onChange={(e) => setSearchParams(prev => ({ ...prev, search: e.target.value }))}
                    />
                  </div>
                  <Button type="submit">Search</Button>
                </form>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Filters:</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Select
                      value={searchParams.role}
                      onValueChange={(value) => handleFilter('role', value)}
                    >
                      <SelectTrigger className="h-8 w-[150px]">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Roles</SelectItem>
                        {users?.filters.roles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={searchParams.status}
                      onValueChange={(value) => handleFilter('status', value)}
                    >
                      <SelectTrigger className="h-8 w-[150px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Statuses</SelectItem>
                        {users?.filters.statuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearFilters}
                      className="h-8"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </div>

              {/* Users Table */}
              {loading.users ? (
                <div className="flex items-center justify-center p-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                </div>
              ) : users && users.users.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[120px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                <User className="h-4 w-4 text-emerald-600" />
                              </div>
                              <div>
                                <p className="font-medium">{`${user.firstName} ${user.lastName}`}</p>
                                <p className="text-xs text-gray-500">ID: {user.id}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-800">
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={user.status} />
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  disabled={actionInProgress === user.id}
                                >
                                  {actionInProgress === user.id ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-emerald-600" />
                                  ) : (
                                    <MoreHorizontal className="h-4 w-4" />
                                  )}
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => router.push(`/dashboard/users/${user.id}`)}>
                                  <User className="h-4 w-4 mr-2" />
                                  View Profile
                                </DropdownMenuItem>

                                {user.status !== 'active' && (
                                  <DropdownMenuItem onClick={() => handleUpdateUserStatus(user.id, 'active')}>
                                    <UserCheck className="h-4 w-4 mr-2" />
                                    Activate User
                                  </DropdownMenuItem>
                                )}

                                {user.status !== 'suspended' && (
                                  <DropdownMenuItem onClick={() => handleUpdateUserStatus(user.id, 'suspended')}>
                                    <UserX className="h-4 w-4 mr-2" />
                                    Suspend User
                                  </DropdownMenuItem>
                                )}

                                <Dialog open={confirmDelete === user.id} onOpenChange={(open) => !open && setConfirmDelete(null)}>
                                  <DialogTrigger asChild>
                                    <DropdownMenuItem
                                      onSelect={(e) => {
                                        e.preventDefault();
                                        setConfirmDelete(user.id);
                                      }}
                                      className="text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete User
                                    </DropdownMenuItem>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Delete User</DialogTitle>
                                      <DialogDescription>
                                        Are you sure you want to delete the user account for {user.firstName} {user.lastName}?
                                        This action cannot be undone.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                      <Button
                                        variant="outline"
                                        onClick={() => setConfirmDelete(null)}
                                        disabled={actionInProgress === user.id}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        variant="destructive"
                                        onClick={() => handleDeleteUser(user.id)}
                                        disabled={actionInProgress === user.id}
                                      >
                                        {actionInProgress === user.id ? (
                                          <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Deleting...
                                          </>
                                        ) : (
                                          <>
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                          </>
                                        )}
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-gray-500">No users found matching your criteria.</p>
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    className="mt-4"
                  >
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Reset Filters
                  </Button>
                </div>
              )}

              {/* Pagination */}
              {users && users.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-gray-500">
                    Showing {((users.pagination.page - 1) * users.pagination.limit) + 1}-
                    {Math.min(users.pagination.page * users.pagination.limit, users.pagination.total)} of {users.pagination.total} users
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={users.pagination.page === 1}
                      onClick={() => handlePageChange(users.pagination.page - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: users.pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={page === users.pagination.page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={`${page === users.pagination.page ? 'bg-emerald-600 hover:bg-emerald-700' : ''} w-8 h-8 p-0`}
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={users.pagination.page === users.pagination.totalPages}
                      onClick={() => handlePageChange(users.pagination.page + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Track user actions and system events
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dashboardData ? (
                <div className="space-y-4">
                  {dashboardData.recentActivity.map((activity, index) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-4 border rounded-md bg-white hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <User className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{activity.user}</p>
                            <p className="text-sm text-gray-600">{activity.action}</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-gray-500">No activity data available.</p>
                  <Button
                    variant="outline"
                    onClick={() => fetchUsers()}
                    className="mt-4"
                  >
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Refresh Data
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="ml-auto">
                <FileText className="w-4 h-4 mr-2" />
                View All Activity
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;