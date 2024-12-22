import { AuthForm } from "@/components/auth/auth-form";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Create an Account</h1>
          <p className="text-muted-foreground">Sign up to get started</p>
        </div>
        
        <AuthForm mode="signup" />
        
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link href="/auth/sign-in" className="text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
}