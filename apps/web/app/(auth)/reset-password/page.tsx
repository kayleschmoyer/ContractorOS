"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Link from "next/link";
import AuthCard from "../../../components/AuthCard";
import styles from "../auth.module.css";
import { sendPasswordReset, friendlyError } from "../../../lib/auth";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});

type FormValues = z.infer<typeof schema>;

export default function ResetPasswordPage() {
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
      await sendPasswordReset(data.email);
      setMessage("Password reset email sent");
    } catch (e: any) {
      setMessage(friendlyError(e.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Reset password"
      footer={
        <div className={styles.links}>
          <Link href="/login">Back to login</Link>
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
        {message && (
          <div role="alert" className={message.includes("sent") ? styles.success : styles.error}>
            {message}
          </div>
        )}
        <div className={styles.actions}>
          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? "Loading..." : "Send reset email"}
          </button>
        </div>
      </form>
    </AuthCard>
  );
}
