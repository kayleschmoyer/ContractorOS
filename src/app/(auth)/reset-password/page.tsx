
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
import { sendPasswordReset, friendlyError } from "../../../lib/auth";
import Image from "next/image";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});

type FormValues = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setMessage(null);
    setIsSuccess(false);
    try {
      await sendPasswordReset(data.email);
      setMessage("Password reset email sent successfully. Please check your inbox.");
      setIsSuccess(true);
    } catch (e: any) {
      setMessage(friendlyError(e.code));
      setIsSuccess(false);
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
                    Reset Your Password
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                    Enter your email to receive a password reset link.
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
                    {message && (
                        <div role="alert" className={`text-sm ${isSuccess ? 'text-green-400' : 'text-destructive'}`}>
                            {message}
                        </div>
                    )}
                    <div className="pt-2">
                         <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Sending..." : "Send Reset Link"}
                        </Button>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex justify-center text-sm">
                <Link href="/login" className="font-semibold text-primary/90 hover:text-primary">
                    Back to Sign In
                </Link>
            </CardFooter>
        </Card>
    </div>
  );
}
