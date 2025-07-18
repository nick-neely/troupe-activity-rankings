"use client";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { useUnlockStore } from "@/lib/store";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import React, { useState } from "react";

export function SitewideUnlockOverlay() {
  const { unlocked, setUnlocked, hydrated } = useUnlockStore();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  // Wait for hydration before rendering anything
  if (!hydrated) return null;
  if (unlocked) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
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
        document.cookie = "sitewide_unlocked=true; path=/; max-age=86400";
      } else {
        setError(data.error || "Incorrect code. Try again.");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Server error. Please try again.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background gradient + SVG pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="w-full h-full bg-gradient-to-br from-slate-100 via-blue-100 to-slate-200 opacity-90" />
        <svg
          className="absolute inset-0 w-full h-full opacity-30"
          aria-hidden="true"
          focusable="false"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 800 600"
          preserveAspectRatio="none"
        >
          <defs>
            <radialGradient id="bgblob" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#64748b" stopOpacity="0.08" />
            </radialGradient>
          </defs>
          <ellipse cx="400" cy="300" rx="340" ry="180" fill="url(#bgblob)" />
          <ellipse
            cx="650"
            cy="100"
            rx="120"
            ry="60"
            fill="#60a5fa"
            opacity="0.07"
          />
          <ellipse
            cx="150"
            cy="500"
            rx="100"
            ry="40"
            fill="#64748b"
            opacity="0.06"
          />
        </svg>
      </div>
      {/* Glassmorphism modal */}
      <div className="relative w-full max-w-sm p-8 rounded-2xl shadow-2xl bg-white/80 border border-slate-200 backdrop-blur-md">
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
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup className="gap-2">
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <Button
            type="submit"
            className="w-full text-base font-semibold"
            disabled={otp.length !== 6}
            variant="default"
            size="lg"
          >
            Unlock
          </Button>
          {error && (
            <div className="text-red-600 text-sm text-center mt-2">{error}</div>
          )}
        </form>
        <div className="absolute inset-0 pointer-events-none rounded-2xl border border-white/30 shadow-[0_4px_32px_rgba(0,0,0,0.12)]" />
      </div>
    </div>
  );
}
