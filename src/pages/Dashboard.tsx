import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Heart,
  Users,
  Shield,
  LogOut,
  Calendar,
  Activity,
  TrendingUp,
  UserPlus,
  MapPin,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isLoading, isLoggedIn, isAdmin, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate("/login");
    }
  }, [isLoading, isLoggedIn, navigate]);

  const { data: connectionsList } = trpc.connections.list.useQuery(undefined, {
    enabled: isLoggedIn,
  });

  const { data: activityFeed } = trpc.activity.feed.useQuery(undefined, {
    enabled: isLoggedIn,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F9F6]">
        <div className="animate-spin w-8 h-8 border-3 border-[#2D9C4C] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return null;

  const totalFriends = connectionsList?.length ?? 0;
  const healthyConnections =
    connectionsList?.filter((c) => c.status === "active").length ?? 0;

  return (
    <div className="min-h-screen bg-[#F5F9F6]">
      {/* Header */}
      <header className="bg-white border-b border-[#D4E5D7] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#2D9C4C] rounded-full flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="text-lg font-bold text-[#2D9C4C]">friendster</span>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                className="border-[#2D9C4C] text-[#2D9C4C] hover:bg-[#E8F5E9]"
                onClick={() => navigate("/admin")}
              >
                <Shield className="w-4 h-4 mr-1" />
                Admin
              </Button>
            )}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#E8F5E9] rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-[#2D9C4C]">
                  {user.name?.[0]?.toUpperCase() ?? "U"}
                </span>
              </div>
              <span className="text-sm text-[#1A1A1A] hidden sm:inline">
                {user.name}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#5A6B5E]"
              onClick={logout}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#2D9C4C] to-[#1A7A38] rounded-2xl p-6 mb-6 text-white">
          <h1 className="text-2xl font-bold mb-1">
            Welcome back, {user.name ?? "Friend"}!
          </h1>
          <p className="text-white/80 text-sm">
            Here&apos;s what&apos;s happening in your circle today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-[#D4E5D7]">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-[#2D9C4C]" />
                <span className="text-xs text-[#5A6B5E]">Total Friends</span>
              </div>
              <p className="text-2xl font-bold text-[#1A1A1A]">
                {totalFriends}
              </p>
            </CardContent>
          </Card>
          <Card className="border-[#D4E5D7]">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-[#2D9C4C]" />
                <span className="text-xs text-[#5A6B5E]">Healthy Bonds</span>
              </div>
              <p className="text-2xl font-bold text-[#1A1A1A]">
                {healthyConnections}
              </p>
            </CardContent>
          </Card>
          <Card className="border-[#D4E5D7]">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-[#2D9C4C]" />
                <span className="text-xs text-[#5A6B5E]">Meetups</span>
              </div>
              <p className="text-2xl font-bold text-[#1A1A1A]">0</p>
            </CardContent>
          </Card>
          <Card className="border-[#D4E5D7]">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-[#2D9C4C]" />
                <span className="text-xs text-[#5A6B5E]">Avg Strength</span>
              </div>
              <p className="text-2xl font-bold text-[#1A1A1A]">
                {totalFriends > 0
                  ? Math.round(
                      (connectionsList?.reduce(
                        (acc, c) => acc + c.connectionStrength,
                        0,
                      ) ?? 0) / totalFriends,
                    )
                  : 0}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* My Circle */}
          <Card className="border-[#D4E5D7]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#2D9C4C]" />
                  My Circle
                </CardTitle>
                <Button
                  size="sm"
                  className="bg-[#2D9C4C] hover:bg-[#1A7A38] text-white"
                >
                  <UserPlus className="w-3 h-3 mr-1" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {connectionsList && connectionsList.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {connectionsList.map((conn) => (
                    <div
                      key={conn.id}
                      className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#D4E5D7]"
                    >
                      <div className="w-10 h-10 bg-[#E8F5E9] rounded-full flex items-center justify-center shrink-0">
                        <span className="font-bold text-[#2D9C4C]">
                          {conn.friendName?.[0]?.toUpperCase() ?? "?"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-[#1A1A1A] truncate">
                          {conn.friendName}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress
                            value={conn.connectionStrength}
                            className="h-2 w-20"
                          />
                          <span className="text-xs text-[#5A6B5E]">
                            {conn.connectionStrength}%
                          </span>
                        </div>
                      </div>
                      <div
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          conn.status === "active"
                            ? "bg-[#2D9C4C]"
                            : conn.status === "fading"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-[#5A6B5E]">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No friends yet</p>
                  <p className="text-xs mt-1">
                    Meet people in person to add them!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="border-[#D4E5D7]">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#2D9C4C]" />
                Activity Feed
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activityFeed && activityFeed.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {activityFeed.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start gap-3 p-3 bg-white rounded-xl border border-[#D4E5D7]"
                    >
                      <div className="w-8 h-8 bg-[#E8F5E9] rounded-full flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-[#2D9C4C]">
                          {log.user?.name?.[0]?.toUpperCase() ?? "?"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#1A1A1A]">
                          <span className="font-semibold">
                            {log.user?.name ?? "Unknown"}
                          </span>{" "}
                          <span className="text-[#5A6B5E]">
                            {log.action
                              .toLowerCase()
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </span>
                        </p>
                        <p className="text-xs text-[#5A6B5E] mt-1">
                          {new Date(log.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-[#5A6B5E]">
                  <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No activity yet</p>
                  <p className="text-xs mt-1">
                    Activities will appear here as you use the app.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Meetup Scheduler */}
        <Card className="border-[#D4E5D7] mt-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#2D9C4C]" />
              Schedule a Meetup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="text-xs text-[#5A6B5E] mb-1 block">
                  Friend
                </label>
                <select className="w-full h-10 px-3 rounded-md border border-[#D4E5D7] bg-white text-sm">
                  <option>Select a friend...</option>
                  {connectionsList?.map((conn) => (
                    <option key={conn.friendId} value={conn.id}>
                      {conn.friendName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-[#5A6B5E] mb-1 block">
                  Date
                </label>
                <Input type="date" className="w-auto" />
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="text-xs text-[#5A6B5E] mb-1 block">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5A6B5E]" />
                  <Input
                    placeholder="Where to meet?"
                    className="pl-9"
                  />
                </div>
              </div>
              <Button className="bg-[#2D9C4C] hover:bg-[#1A7A38] text-white">
                <Calendar className="w-4 h-4 mr-1" />
                Schedule
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
