import { useState, type FormEvent } from "react";
import { landingSupabase } from "./supabaseClient";

export type WaitlistStatus = "idle" | "submitting" | "success" | "error" | "duplicate";

export function useWaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<WaitlistStatus>("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    if (!landingSupabase) {
      setStatus("error");
      return;
    }

    setStatus("submitting");
    const { error } = await landingSupabase.from("waitlist_signups").insert({ email: email.trim().toLowerCase() });

    if (!error) {
      setStatus("success");
    } else if (error.code === "23505") {
      setStatus("duplicate");
    } else {
      setStatus("error");
    }
  }

  return { email, setEmail, status, handleSubmit };
}
