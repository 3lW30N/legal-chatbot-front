import type React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4",
        className,
      )}
      {...props}
    >
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-blue-100">Welcome back</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email" className="text-blue-200">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    className="bg-slate-700/50 border-slate-600 text-blue-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password" className="text-blue-200">
                      Password
                    </Label>
                    <a
                      href="#"
                      className="ml-auto text-sm text-blue-400 underline-offset-4 hover:underline hover:text-blue-300 transition-colors"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    className="bg-slate-700/50 border-slate-600 text-blue-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0 transition-colors"
                >
                  Login
                </Button>
              </div>
              <div className="text-center text-sm text-slate-300">
                Don&apos;t have an account?{" "}
                <a
                  href="#"
                  className="text-blue-400 underline underline-offset-4 hover:text-blue-300 transition-colors"
                >
                  Sign up
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="absolute bottom-4 text-slate-400 text-center text-xs text-balance max-w-md">
        By clicking continue, you agree to our{" "}
        <a href="#" className="text-blue-400 underline underline-offset-4 hover:text-blue-300 transition-colors">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="text-blue-400 underline underline-offset-4 hover:text-blue-300 transition-colors">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  )
}
