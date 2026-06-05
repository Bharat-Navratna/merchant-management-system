"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api/services";
import { getApiErrorMessage } from "@/lib/api/error";
import { MerchantOpsLoginVisual } from "@/components/visuals/merchantops-login-visual";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginForm) => {
    try {
      await api.login(values.email, values.password);
      toast.success("Signed in successfully.");
      router.push("/dashboard");
      router.refresh();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Unable to sign in."));
    }
  };

  return (
    <div className="merchantops-grid-bg flex min-h-screen items-center justify-center px-4 py-6 sm:px-6">
      <div className="grid w-full max-w-[980px] items-center gap-6 lg:grid-cols-[minmax(0,52%)_minmax(420px,448px)] xl:gap-8">
        <div className="hidden lg:block">
          <MerchantOpsLoginVisual />
        </div>

        <Card className="w-full overflow-hidden self-center">
          <CardHeader className="p-5 pb-3">
            <div className="mb-2 inline-flex w-fit rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Reviewer access enabled
            </div>
            <CardTitle className="text-2xl text-primary">Sign in to MerchantOps</CardTitle>
            <p className="text-sm text-muted-foreground">
              Reviewer access is enabled for portfolio evaluation.
            </p>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
              <div>
                <Input placeholder="Email address" {...register("email")} />
                <p className="mt-2 text-xs text-muted-foreground">
                  Demo email: <span className="font-medium text-primary">admin@yqnpay.com</span>
                </p>
                {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
              </div>
              <div>
                <Input type="password" placeholder="Password" {...register("password")} />
                <p className="mt-2 text-xs text-muted-foreground">
                  Demo password: <span className="font-medium text-primary">Admin123!</span>
                </p>
                {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
              </div>
              <Button type="submit" className="mt-1 w-full" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

