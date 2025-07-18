"use client";

import { MockDashboardLayout } from "@/components/mock-dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader } from "lucide-react";

import { useUnlockStore } from "@/lib/store";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import React, { useState } from "react";

export function SitewideUnlockOverlay() {
  const { unlocked, setUnlocked, hydrated } = useUnlockStore();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Wait for hydration before rendering anything
  if (!hydrated) return null;
  if (unlocked) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: otp }),
      });
      const data = await res.json();
      if (data.success) {
        setUnlocked(true);
        setError("");
      } else {
        setError(data.error || "Incorrect code. Try again.");
      }
    } catch (err) {
      console.error("OTP verification failed:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Mock dashboard background with blur overlay */}
      <div className="absolute inset-0 -z-10">
        <MockDashboardLayout />
        <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" />
      </div>
      {/* Glassmorphism modal */}
      <div className="relative w-full max-w-sm p-8 rounded-2xl shadow-2xl bg-white/90 border border-slate-200/50 backdrop-blur-md">
        <h2 className="text-2xl font-bold text-slate-900 mb-3 text-center tracking-tight">
          Enter Sitewide Code
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
            value={otp}
            onChange={setOtp}
            containerClassName="justify-center gap-4"
            className="text-2xl"
            autoFocus
          >
            <InputOTPGroup className="gap-2">
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup className="gap-2">
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup className="gap-2">
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <Button
            type="submit"
            className="w-full text-base font-semibold flex items-center justify-center"
            disabled={otp.length !== 6 || loading}
            variant="default"
            size="lg"
          >
            {loading ? (
              <span className="flex items-center gap-2 justify-center">
                <Loader
                  className="animate-spin text-white w-5 h-5 mr-1"
                  aria-hidden="true"
                />
                Unlocking...
              </span>
            ) : (
              "Unlock"
            )}
          </Button>
          {error && (
            <div className="text-red-600 text-sm text-center mt-2">{error}</div>
          )}
        </form>
        <div className="absolute inset-0 pointer-events-none rounded-2xl border border-white/40 shadow-[0_4px_32px_rgba(0,0,0,0.15)]" />
      </div>
    </div>
  );
}
