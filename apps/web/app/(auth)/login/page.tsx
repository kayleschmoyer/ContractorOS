"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthCard from "../../../components/AuthCard";
import styles from "../auth.module.css";
import { signin, googlePopup, friendlyError } from "../../../lib/auth";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
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
      const dest = await signin(data.email, data.password);
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
    <AuthCard
      title="Sign in"
      footer={
        <div className={styles.links}>
          <Link href="/register">Create account</Link>
          <Link href="/reset-password">Forgot password?</Link>
          <div>
            <Link href="/privacy">Privacy</Link> • <Link href="/terms">Terms</Link>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" {...register("email")} aria-invalid={!!errors.email} />
          {errors.email && <span role="alert" className={styles.error}>{errors.email.message}</span>}
        </div>
        <div className={styles.field}>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" {...register("password")} aria-invalid={!!errors.password} />
          {errors.password && <span role="alert" className={styles.error}>{errors.password.message}</span>}
        </div>
        {message && <div role="alert" className={styles.error}>{message}</div>}
        <div className={styles.actions}>
          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? "Loading..." : "Continue"}
          </button>
          <button type="button" onClick={onGoogle} className={styles.google} disabled={loading}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.54 2.18 30.1 0 24 0 14.62 0 6.41 5.17 2.45 12.74l7.98 6.19C12.23 13.4 17.58 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.1 24.5c0-1.56-.14-3.06-.4-4.5H24v9h12.3c-.53 2.7-2.1 4.96-4.47 6.5l7.18 5.58C43.64 37.9 46.1 31.7 46.1 24.5z"
              />
              <path
                fill="#FBBC05"
                d="M10.43 28.93c-.47-1.4-.73-2.9-.73-4.43s.26-3.03.73-4.43l-7.98-6.19C.83 17.1 0 20.45 0 24c0 3.55.83 6.9 2.45 9.68l7.98-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.5 0 11.95-2.17 15.93-5.92l-7.18-5.58c-2 1.35-4.56 2.15-7.75 2.15-6.42 0-11.77-3.9-13.57-9.43l-7.98 6.19C6.41 42.83 14.62 48 24 48z"
              />
              <path fill="none" d="M0 0h48v48H0z" />
            </svg>
            Continue with Google
          </button>
        </div>
      </form>
    </AuthCard>
  );
}
