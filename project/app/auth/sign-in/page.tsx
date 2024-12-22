import { AuthForm } from "@/components/auth/auth-form";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>
        
        <AuthForm mode="signin" />
        
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don&apos;t have an account? </span>
          <Link href="/auth/sign-up" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </Card>
    </div>
  );
}