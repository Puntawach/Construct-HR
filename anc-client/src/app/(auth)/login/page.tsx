import LoginForm from "@/components/feature/auth/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden bg-black">
      {/* Background blobs — same as homepage */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-600/20 rounded-full blur-[120px] animate-blob mix-blend-screen" />
        <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-purple-600/20 rounded-full blur-[120px] animate-blob animation-delay-2000 mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[20%] w-[45vw] h-[45vw] bg-indigo-600/20 rounded-full blur-[120px] animate-blob animation-delay-4000 mix-blend-screen" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-lg">
        <Card className="w-full backdrop-blur-md bg-white/5 border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]">
          <CardHeader className="space-y-2 pb-6 pt-8 px-8">
            <CardTitle className="text-3xl font-bold text-white">
              ANC Engineering<span className="text-blue-400">.</span>
            </CardTitle>
            <CardDescription className="text-white/60 text-base">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <LoginForm />
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-6">
        <p className="text-sm text-white/40 text-center">
          © {new Date().getFullYear()} ANC Engineering. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
