
'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup, googlePopup, friendlyError } from "@/lib/auth";
import Image from "next/image";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setMessage(null);
    try {
      const dest = await signup(data.email, data.password);
      router.push(dest);
    } catch (e: any) {
      setMessage(friendlyError(e.code));
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const dest = await googlePopup();
      router.push(dest);
    } catch (e: any) {
      setMessage(friendlyError(e.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center p-4">
      <Image
        src="https://picsum.photos/1920/1080"
        alt="Construction site background"
        fill
        className="absolute inset-0 -z-10 object-cover brightness-50"
        data-ai-hint="construction blueprint"
      />
      <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm text-card-foreground border-white/20">
        <CardHeader className="items-center text-center">
          <Logo className="mb-4" />
          <CardTitle className="font-headline text-2xl">
            Create an Account
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Get started with ContractorOS today.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email")}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                aria-invalid={!!errors.password}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>
             {message && <div role="alert" className="text-sm text-destructive">{message}</div>}
            <div className="flex flex-col gap-4 pt-2">
                 <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating Account..." : "Sign Up"}
                </Button>
                 <Button type="button" variant="outline" className="w-full" onClick={onGoogle} disabled={loading}>
                    Sign Up with Google
                </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col items-center gap-4 text-sm">
            <p>
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-primary/90 hover:text-primary">
                    Sign In
                </Link>
            </p>
             <div className="flex gap-4 text-xs text-muted-foreground">
                <Link href="/privacy" className="hover:text-primary">Privacy</Link>
                <Link href="/terms" className="hover:text-primary">Terms</Link>
             </div>
        </CardFooter>
      </Card>
    </div>
  );
}
