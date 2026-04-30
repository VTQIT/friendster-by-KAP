import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/providers/trpc";
import { Heart, Shield, ArrowLeft, Mail, User, Lock, KeyRound } from "lucide-react";

function getOAuthUrl() {
  const kimiAuthUrl = import.meta.env.VITE_KIMI_AUTH_URL;
  const appID = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${kimiAuthUrl}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);

  return url.toString();
}

export default function Login() {
  const navigate = useNavigate();
  const [loginTab, setLoginTab] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [magicEmail, setMagicEmail] = useState("");
  const [pinDigits, setPinDigits] = useState(["", "", "", "", "", ""]);
  const [showPinModal, setShowPinModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loginMutation = trpc.localAuth.login.useMutation({
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
        window.location.href = "/dashboard";
      }
    },
    onError: (err) => setError(err.message),
  });

  const registerMutation = trpc.localAuth.register.useMutation({
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
        window.location.href = "/dashboard";
      }
    },
    onError: (err) => setError(err.message),
  });

  const magicLinkMutation = trpc.localAuth.sendMagicLink.useMutation({
    onSuccess: () => {
      setSuccess("Magic link sent! Check your console for the link.");
      setError("");
    },
    onError: (err) => setError(err.message),
  });

  const adminPinMutation = trpc.localAuth.adminPinLogin.useMutation({
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
        window.location.href = "/admin";
      }
    },
    onError: (err) => {
      setError(err.message);
      setPinDigits(["", "", "", "", "", ""]);
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }
    loginMutation.mutate({ username, password });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    registerMutation.mutate({ username, email, password });
  };

  const handleMagicLink = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!magicEmail) {
      setError("Please enter your email");
      return;
    }
    magicLinkMutation.mutate({ email: magicEmail });
  };

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newPin = [...pinDigits];
    newPin[index] = value;
    setPinDigits(newPin);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }

    // Auto-submit when all digits filled
    if (index === 5 && value) {
      const pin = [...newPin.slice(0, 5), value].join("");
      if (pin.length === 6) {
        setTimeout(() => {
          adminPinMutation.mutate({ pin });
        }, 200);
      }
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !pinDigits[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F5E9] to-white flex flex-col">
      {/* Header */}
      <div className="p-4">
        <Button
          variant="ghost"
          className="text-[#5A6B5E] hover:text-[#1A1A1A]"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 bg-[#2D9C4C] rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="text-2xl font-bold text-[#2D9C4C]">friendster</span>
          </div>

          <Card className="border-[#D4E5D7] shadow-lg">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl text-[#1A1A1A]">
                Welcome to Friendster
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* OAuth Login */}
              <Button
                className="w-full bg-[#2D9C4C] hover:bg-[#1A7A38] text-white mb-4"
                size="lg"
                onClick={() => {
                  window.location.href = getOAuthUrl();
                }}
              >
                <Shield className="w-4 h-4 mr-2" />
                Login with Kimi
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#D4E5D7]" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-3 text-[#5A6B5E]">or</span>
                </div>
              </div>

              {/* Tabs for Login/Register/Magic Link */}
              <Tabs value={loginTab} onValueChange={setLoginTab}>
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                  <TabsTrigger value="magic">Magic Link</TabsTrigger>
                </TabsList>

                {/* Login Tab */}
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="login-user" className="text-[#5A6B5E]">
                        <User className="w-3 h-3 inline mr-1" />
                        Username
                      </Label>
                      <Input
                        id="login-user"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="login-pass" className="text-[#5A6B5E]">
                        <Lock className="w-3 h-3 inline mr-1" />
                        Password
                      </Label>
                      <Input
                        id="login-pass"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="mt-1"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-[#1A1A1A] hover:bg-[#333] text-white"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Logging in..." : "Log in"}
                    </Button>
                  </form>
                </TabsContent>

                {/* Register Tab */}
                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <Label htmlFor="reg-user" className="text-[#5A6B5E]">
                        <User className="w-3 h-3 inline mr-1" />
                        Username
                      </Label>
                      <Input
                        id="reg-user"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="3-20 chars, letters/numbers/_"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="reg-email" className="text-[#5A6B5E]">
                        <Mail className="w-3 h-3 inline mr-1" />
                        Email
                      </Label>
                      <Input
                        id="reg-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="reg-pass" className="text-[#5A6B5E]">
                        <Lock className="w-3 h-3 inline mr-1" />
                        Password
                      </Label>
                      <Input
                        id="reg-pass"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 8 chars, upper+lower+number"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="reg-confirm" className="text-[#5A6B5E]">
                        <Lock className="w-3 h-3 inline mr-1" />
                        Confirm Password
                      </Label>
                      <Input
                        id="reg-confirm"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat password"
                        className="mt-1"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-[#1A1A1A] hover:bg-[#333] text-white"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending
                        ? "Creating account..."
                        : "Create account"}
                    </Button>
                  </form>
                </TabsContent>

                {/* Magic Link Tab */}
                <TabsContent value="magic">
                  <form onSubmit={handleMagicLink} className="space-y-4">
                    <div>
                      <Label htmlFor="magic-email" className="text-[#5A6B5E]">
                        <Mail className="w-3 h-3 inline mr-1" />
                        Email Address
                      </Label>
                      <Input
                        id="magic-email"
                        type="email"
                        value={magicEmail}
                        onChange={(e) => setMagicEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="mt-1"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-[#1A1A1A] hover:bg-[#333] text-white"
                      disabled={magicLinkMutation.isPending}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      {magicLinkMutation.isPending
                        ? "Sending..."
                        : "Send Magic Link"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              {/* Messages */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="mt-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm">
                  {success}
                </div>
              )}

              {/* Admin PIN Login */}
              <div className="mt-6 pt-4 border-t border-[#D4E5D7]">
                <button
                  onClick={() => setShowPinModal(true)}
                  className="w-full text-center text-sm text-[#5A6B5E] hover:text-[#2D9C4C] flex items-center justify-center gap-2 transition-colors"
                >
                  <KeyRound className="w-4 h-4" />
                  Login as Administrator
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <Card className="w-full max-w-sm border-[#D4E5D7]">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-[#2D9C4C]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-[#2D9C4C]" />
              </div>
              <CardTitle className="text-lg">Admin Access</CardTitle>
              <p className="text-sm text-[#5A6B5E]">
                Enter your 6-digit administrator PIN
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center gap-2 mb-4">
                {pinDigits.map((digit, i) => (
                  <Input
                    key={i}
                    id={`pin-${i}`}
                    type="password"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinChange(i, e.target.value)}
                    onKeyDown={(e) => handlePinKeyDown(i, e)}
                    className="w-12 h-12 text-center text-2xl font-bold border-2 border-[#D4E5D7] focus:border-[#2D9C4C]"
                    autoFocus={i === 0}
                  />
                ))}
              </div>
              {error && (
                <div className="mb-3 p-2 bg-red-50 text-red-600 rounded-lg text-sm text-center">
                  {error}
                </div>
              )}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowPinModal(false);
                    setPinDigits(["", "", "", "", "", ""]);
                    setError("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-[#2D9C4C] hover:bg-[#1A7A38] text-white"
                  onClick={() => {
                    const pin = pinDigits.join("");
                    if (pin.length === 6) {
                      adminPinMutation.mutate({ pin });
                    }
                  }}
                  disabled={adminPinMutation.isPending}
                >
                  {adminPinMutation.isPending ? "Verifying..." : "Login"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
