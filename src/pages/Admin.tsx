import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Shield,
  Users,
  Activity,
  Settings,
  ArrowLeft,
  Search,
  UserCheck,
  UserX,
  BarChart3,
  LogOut,
  Heart,
} from "lucide-react";

export default function Admin() {
  const navigate = useNavigate();
  const { user, isLoading, isLoggedIn, isAdmin, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [newPin, setNewPin] = useState("");
  const [fadeDays, setFadeDays] = useState("30");
  const [pinMessage, setPinMessage] = useState("");

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate("/login");
    }
    if (!isLoading && isLoggedIn && !isAdmin) {
      navigate("/dashboard");
    }
  }, [isLoading, isLoggedIn, isAdmin, navigate]);

  const { data: stats } = trpc.admin.stats.useQuery(undefined, {
    enabled: isAdmin,
  });

  const { data: usersData } = trpc.admin.users.useQuery(
    { page: 1, limit: 50, search: searchQuery || undefined },
    { enabled: isAdmin },
  );

  const { data: logsData } = trpc.admin.activityLogs.useQuery(
    { page: 1, limit: 50, action: actionFilter || undefined },
    { enabled: isAdmin },
  );

  const { data: settings } = trpc.admin.settings.useQuery(undefined, {
    enabled: isAdmin,
  });

  const utils = trpc.useUtils();

  const updateRoleMutation = trpc.admin.updateUserRole.useMutation({
    onSuccess: () => {
      utils.admin.users.invalidate();
    },
  });

  const updatePinMutation = trpc.admin.updatePin.useMutation({
    onSuccess: () => {
      setPinMessage("PIN updated successfully!");
      setNewPin("");
    },
    onError: (err) => setPinMessage(err.message),
  });

  const updateSettingsMutation = trpc.admin.updateSettings.useMutation({
    onSuccess: () => {
      utils.admin.settings.invalidate();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F9F6]">
        <div className="animate-spin w-8 h-8 border-3 border-[#2D9C4C] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const actionTypes = [
    "ALL",
    "USER_REGISTERED",
    "USER_LOGGED_IN",
    "USER_LOGGED_OUT",
    "ADMIN_LOGIN",
    "ADMIN_LOGIN_FAILED",
    "ADMIN_ROLE_CHANGED",
    "FRIEND_ADDED",
    "MEETUP_SCHEDULED",
  ];

  return (
    <div className="min-h-screen bg-[#F5F9F6]">
      {/* Header */}
      <header className="bg-[#1A1A1A] text-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Dashboard
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#2D9C4C]" />
              <span className="font-bold">Admin Panel</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Heart className="w-4 h-4 text-[#2D9C4C]" />
              <span>{user?.name}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10"
              onClick={logout}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="border-[#D4E5D7]">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-[#2D9C4C]" />
                <span className="text-xs text-[#5A6B5E]">Total Users</span>
              </div>
              <p className="text-2xl font-bold text-[#1A1A1A]">
                {stats?.totalUsers ?? 0}
              </p>
            </CardContent>
          </Card>
          <Card className="border-[#D4E5D7]">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-[#2D9C4C]" />
                <span className="text-xs text-[#5A6B5E]">Connections</span>
              </div>
              <p className="text-2xl font-bold text-[#1A1A1A]">
                {stats?.totalConnections ?? 0}
              </p>
            </CardContent>
          </Card>
          <Card className="border-[#D4E5D7]">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-[#2D9C4C]" />
                <span className="text-xs text-[#5A6B5E]">Activities</span>
              </div>
              <p className="text-2xl font-bold text-[#1A1A1A]">
                {stats?.totalActivities ?? 0}
              </p>
            </CardContent>
          </Card>
          <Card className="border-[#D4E5D7]">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <UserCheck className="w-4 h-4 text-[#2D9C4C]" />
                <span className="text-xs text-[#5A6B5E]">Active Today</span>
              </div>
              <p className="text-2xl font-bold text-[#1A1A1A]">
                {stats?.activeToday ?? 0}
              </p>
            </CardContent>
          </Card>
          <Card className="border-[#D4E5D7]">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-[#2D9C4C]" />
                <span className="text-xs text-[#5A6B5E]">New (7d)</span>
              </div>
              <p className="text-2xl font-bold text-[#1A1A1A]">
                {stats?.recentRegistrations ?? 0}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="users">
          <TabsList className="mb-4">
            <TabsTrigger value="users" className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              Users
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-1">
              <Activity className="w-3 h-3" />
              Activity Logs
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1">
              <Settings className="w-3 h-3" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="border-[#D4E5D7]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <CardTitle className="text-lg">User Management</CardTitle>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5A6B5E]" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Auth Method</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usersData?.users.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell className="font-mono text-xs">
                            {u.id}
                          </TableCell>
                          <TableCell className="font-medium">
                            {u.name ?? "N/A"}
                          </TableCell>
                          <TableCell className="text-sm text-[#5A6B5E]">
                            {u.email ?? "N/A"}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                u.authMethod === "oauth"
                                  ? "bg-blue-100 text-blue-700"
                                  : u.authMethod === "password"
                                    ? "bg-green-100 text-green-700"
                                    : u.authMethod === "magic_link"
                                      ? "bg-purple-100 text-purple-700"
                                      : "bg-orange-100 text-orange-700"
                              }`}
                            >
                              {u.authMethod}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                u.role === "admin"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {u.role}
                            </span>
                          </TableCell>
                          <TableCell className="text-xs text-[#5A6B5E]">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={u.role}
                              onValueChange={(value: "user" | "admin") => {
                                updateRoleMutation.mutate({
                                  userId: u.id,
                                  role: value,
                                });
                              }}
                            >
                              <SelectTrigger className="w-28 h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                      {(!usersData?.users || usersData.users.length === 0) && (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-center text-[#5A6B5E] py-8"
                          >
                            No users found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                {usersData && usersData.total > 0 && (
                  <div className="mt-4 text-sm text-[#5A6B5E]">
                    Showing {usersData.users.length} of {usersData.total} users
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Logs Tab */}
          <TabsContent value="activity">
            <Card className="border-[#D4E5D7]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <CardTitle className="text-lg">Activity Logs</CardTitle>
                  <Select
                    value={actionFilter}
                    onValueChange={setActionFilter}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by action" />
                    </SelectTrigger>
                    <SelectContent>
                      {actionTypes.map((action) => (
                        <SelectItem key={action} value={action === "ALL" ? "" : action}>
                          {action === "ALL" ? "All Actions" : action}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>User ID</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>IP Address</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logsData?.logs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="text-xs text-[#5A6B5E] whitespace-nowrap">
                            {new Date(log.createdAt).toLocaleString()}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {log.userId ?? "N/A"}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                log.action.includes("ADMIN")
                                  ? "bg-red-100 text-red-700"
                                  : log.action.includes("LOGIN")
                                    ? "bg-green-100 text-green-700"
                                    : log.action.includes("FAILED")
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {log.action}
                            </span>
                          </TableCell>
                          <TableCell className="text-xs text-[#5A6B5E] max-w-xs truncate">
                            {log.details
                              ? JSON.stringify(log.details)
                              : "N/A"}
                          </TableCell>
                          <TableCell className="text-xs text-[#5A6B5E] font-mono">
                            {log.ipAddress ?? "N/A"}
                          </TableCell>
                        </TableRow>
                      ))}
                      {(!logsData?.logs || logsData.logs.length === 0) && (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center text-[#5A6B5E] py-8"
                          >
                            No activity logs found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                {logsData && logsData.total > 0 && (
                  <div className="mt-4 text-sm text-[#5A6B5E]">
                    Showing {logsData.logs.length} of {logsData.total} logs
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="grid md:grid-cols-2 gap-6">
              {/* PIN Management */}
              <Card className="border-[#D4E5D7]">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#2D9C4C]" />
                    Admin PIN
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-[#5A6B5E] mb-1 block">
                      Current PIN Status
                    </label>
                    <div className="flex items-center gap-2 text-sm">
                      <UserCheck className="w-4 h-4 text-[#2D9C4C]" />
                      <span>Active (Default: 888967)</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-[#5A6B5E] mb-1 block">
                      New PIN (6 digits)
                    </label>
                    <Input
                      type="password"
                      inputMode="numeric"
                      maxLength={6}
                      value={newPin}
                      onChange={(e) =>
                        setNewPin(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="Enter new 6-digit PIN"
                    />
                  </div>
                  {pinMessage && (
                    <div
                      className={`text-sm p-2 rounded ${
                        pinMessage.includes("success")
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {pinMessage}
                    </div>
                  )}
                  <Button
                    className="bg-[#2D9C4C] hover:bg-[#1A7A38] text-white"
                    onClick={() => {
                      if (newPin.length !== 6) {
                        setPinMessage("PIN must be exactly 6 digits");
                        return;
                      }
                      updatePinMutation.mutate({ newPin });
                    }}
                    disabled={updatePinMutation.isPending}
                  >
                    {updatePinMutation.isPending
                      ? "Updating..."
                      : "Update PIN"}
                  </Button>
                </CardContent>
              </Card>

              {/* System Settings */}
              <Card className="border-[#D4E5D7]">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="w-5 h-5 text-[#2D9C4C]" />
                    System Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-[#5A6B5E] mb-1 block">
                      Connection Fade Days
                    </label>
                    <div className="flex gap-3 items-center">
                      <Input
                        type="number"
                        min={1}
                        max={365}
                        value={fadeDays}
                        onChange={(e) => setFadeDays(e.target.value)}
                        className="w-24"
                      />
                      <span className="text-sm text-[#5A6B5E]">
                        days before connection fades
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-[#5A6B5E] mb-1 block">
                      Maintenance Mode
                    </label>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className={
                          settings?.maintenanceMode === "true"
                            ? "bg-red-100 text-red-700 border-red-300"
                            : "bg-green-100 text-green-700 border-green-300"
                        }
                        onClick={() => {
                          updateSettingsMutation.mutate({
                            maintenanceMode:
                              settings?.maintenanceMode === "true"
                                ? "false"
                                : "true",
                          });
                        }}
                      >
                        {settings?.maintenanceMode === "true" ? (
                          <>
                            <UserX className="w-4 h-4 mr-1" />
                            Enabled
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-4 h-4 mr-1" />
                            Disabled
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button
                    className="bg-[#2D9C4C] hover:bg-[#1A7A38] text-white"
                    onClick={() => {
                      updateSettingsMutation.mutate({
                        connectionFadeDays: parseInt(fadeDays),
                      });
                    }}
                    disabled={updateSettingsMutation.isPending}
                  >
                    {updateSettingsMutation.isPending
                      ? "Saving..."
                      : "Save Settings"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
