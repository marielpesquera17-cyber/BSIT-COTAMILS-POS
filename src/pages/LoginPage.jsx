import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth.js";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Coffee, Lock, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      toast.success("Login successful!");
      navigate("/");
    } else {
      toast.error(result.message || "Invalid email or password");
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    // NOTE: these must match real seeded accounts in your database (see
    // server/src/sql/users.sql). Update the emails/passwords below to match
    // whatever demo accounts you actually seed on the backend.
    const demoCredentials = {
      Manager: { email: "maria.santos@cotamila.com", password: "admin123" },
      Cashier: {
        email: "juan.delacruz@cotamila.com",
        password: "cashier123",
      },
    };

    const creds = demoCredentials[role];
    setEmail(creds.email);
    setPassword(creds.password);

    setIsLoading(true);
    const result = await login(creds.email, creds.password);
    if (result.success) {
      toast.success(`Logged in as ${role}!`);
      navigate("/");
    } else {
      toast.error(result.message || "Demo login failed");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted via-background to-muted flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-foreground rounded-2xl shadow-lg mb-4">
            <Coffee className="w-10 h-10 text-background" />
          </div>
          <h1 className="text-4xl font-bold text-foreground tracking-tight font-display">
            COTAMILA
          </h1>
          <p className="text-muted-foreground">Point of Sale System</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Sign in to access the POS system</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@cotamila.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Demo Accounts */}
            <div className="mt-6 space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Demo Accounts
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDemoLogin("Manager")}
                  disabled={isLoading}
                  className="w-full"
                >
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Manager Demo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDemoLogin("Cashier")}
                  disabled={isLoading}
                  className="w-full"
                >
                  <Coffee className="w-4 h-4 mr-2" />
                  Cashier Demo
                </Button>
              </div>

              <div className="text-xs text-muted-foreground text-center space-y-1 mt-4 p-3 bg-muted/50 rounded-lg">
                <p className="font-semibold">Demo Credentials:</p>
                <p>Manager: maria.santos@cotamila.com / admin123</p>
                <p>Cashier: juan.delacruz@cotamila.com / cashier123</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          © 2026 Cotamila Coffee. All rights reserved.
        </p>
      </div>
    </div>
  );
}
