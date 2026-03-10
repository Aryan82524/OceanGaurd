import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Waves, Shield, Users, BarChart3 } from "lucide-react";

interface AuthFormProps {
  onSignIn: (
    email: string,
    password: string,
  ) => Promise<boolean>;
  onSignUp: (
    email: string,
    password: string,
    name: string,
    role?: string,
  ) => Promise<boolean>;
}

export function AuthForm({
  onSignIn,
  onSignUp,
}: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });
  const [signUpData, setSignUpData] = useState({
    email: "",
    password: "",
    name: "",
    role: "user",
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onSignIn(signInData.email, signInData.password);
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await onSignUp(
      signUpData.email,
      signUpData.password,
      signUpData.name,
      signUpData.role,
    );
    if (success) {
      setSignUpData({
        email: "",
        password: "",
        name: "",
        role: "user",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Waves className="h-12 w-12 text-blue-600 mr-3" />
          <h1 className="text-4xl text-blue-900">OceanGuard</h1>
        </div>
        <p className="text-xl text-gray-600 mb-6">
          Protecting our oceans through community reporting and
          analytics
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <Shield className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="text-lg mb-2">Report Hazards</h3>
            <p className="text-gray-600 text-sm">
              Report oil spills, plastic waste, dangerous tides,
              and stranded animals in real-time
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <BarChart3 className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="text-lg mb-2">Analytics</h3>
            <p className="text-gray-600 text-sm">
              Track public awareness and sentiment through
              social media analytics
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <Users className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="text-lg mb-2">Community</h3>
            <p className="text-gray-600 text-sm">
              Join a global community working together to
              protect marine environments
            </p>
          </div>
        </div>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            Welcome to OceanGuard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form
                onSubmit={handleSignIn}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signInData.email}
                    onChange={(e) =>
                      setSignInData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">
                    Password
                  </Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Enter your password"
                    value={signInData.password}
                    onChange={(e) =>
                      setSignInData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 mb-2">
                  Demo Accounts:
                </p>
                <p className="text-xs text-blue-700">
                  Citizen: citizen@ocean.com / password123
                </p>
                <p className="text-xs text-blue-700">
                  Official: official@ocean.com / password123
                </p>
                <p className="text-xs text-blue-700">
                  Admin: admin@ocean.com / password123
                </p>
              </div>
            </TabsContent>

            <TabsContent value="signup">
              <form
                onSubmit={handleSignUp}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={signUpData.name}
                    onChange={(e) =>
                      setSignUpData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signUpData.email}
                    onChange={(e) =>
                      setSignUpData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">
                    Password
                  </Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    value={signUpData.password}
                    onChange={(e) =>
                      setSignUpData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-role">Role</Label>
                  <Select
                    value={signUpData.role}
                    onValueChange={(value) =>
                      setSignUpData((prev) => ({
                        ...prev,
                        role: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="citizen">
                        Citizen - Report hazards from your
                        location
                      </SelectItem>
                      <SelectItem value="official">
                        Official - Verify and manage reports
                      </SelectItem>
                      <SelectItem value="analyst">
                        Analyst - Access advanced analytics
                      </SelectItem>
                      <SelectItem value="admin">
                        Admin - Full system access
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    Role determines your access level and
                    dashboard features
                  </p>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Creating account..."
                    : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}