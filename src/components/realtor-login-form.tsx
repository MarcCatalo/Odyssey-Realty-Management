"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, LogIn, Mail, ShieldCheck, X } from "lucide-react";

import { sanitizeLoginEmail, sanitizeLoginPassword } from "@/lib/login-sanitizer";

type LoginState = {
  message: string;
  requiresFirstLoginCode: boolean;
};

type PendingCredentials = {
  email: string;
  password: string;
};

export function RealtorLoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingCredentials, setPendingCredentials] = useState<PendingCredentials | null>(null);
  const [firstLoginCode, setFirstLoginCode] = useState("");
  const [state, setState] = useState<LoginState>({
    message: "",
    requiresFirstLoginCode: false
  });

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const credentials = {
      email: sanitizeLoginEmail(String(formData.get("email") ?? "")),
      password: sanitizeLoginPassword(String(formData.get("password") ?? ""))
    };

    await submitLogin(credentials);
  }

  async function handleFirstCodeSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!pendingCredentials) {
      setState({
        message: "Enter your email and password again before confirming the code.",
        requiresFirstLoginCode: false
      });
      return;
    }

    await submitLogin({
      ...pendingCredentials,
      firstLoginCode
    });
  }

  async function submitLogin(payload: PendingCredentials & { firstLoginCode?: string }) {
    setIsSubmitting(true);
    setState((current) => ({ ...current, message: "" }));

    try {
      const response = await fetch("/api/realtor/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const result = (await response.json()) as {
        message?: string;
        redirectTo?: string;
        requiresFirstLoginCode?: boolean;
      };

      if (!response.ok) {
        if (result.requiresFirstLoginCode) {
          setPendingCredentials({
            email: payload.email,
            password: payload.password
          });
          setState({
            message: result.message ?? "Enter the first-time login code.",
            requiresFirstLoginCode: true
          });
          return;
        }

        setState({
          message: result.message ?? "Sign in failed.",
          requiresFirstLoginCode: false
        });
        return;
      }

      setPendingCredentials(null);
      setFirstLoginCode("");
      router.push(result.redirectTo ?? "/realtor");
      router.refresh();
    } catch {
      setState({
        message: "The realtor portal could not be reached. Please try again.",
        requiresFirstLoginCode: state.requiresFirstLoginCode
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function closeFirstCodeStep() {
    setState({
      message: "",
      requiresFirstLoginCode: false
    });
    setFirstLoginCode("");
  }

  return (
    <>
      <form className="realtor-login-form" onSubmit={handlePasswordSubmit}>
        <label>
          <span>Email address</span>
          <div>
            <Mail aria-hidden="true" className="h-4 w-4 shrink-0" />
            <input autoComplete="email" name="email" placeholder="realtor@example.com" required type="email" />
          </div>
        </label>

        <label>
          <span>Password</span>
          <div>
            <LockKeyhole aria-hidden="true" className="h-4 w-4 shrink-0" />
            <input
              autoComplete="current-password"
              name="password"
              placeholder="Enter password"
              required
              type="password"
            />
          </div>
        </label>

        {state.message && !state.requiresFirstLoginCode ? (
          <p className="realtor-login-alert" role="alert">
            {state.message}
          </p>
        ) : null}

        <button className="realtor-login-submit" disabled={isSubmitting} type="submit">
          <LogIn aria-hidden="true" className="h-4 w-4 shrink-0" />
          {isSubmitting && !state.requiresFirstLoginCode ? "Signing in" : "Sign in"}
        </button>
      </form>

      {state.requiresFirstLoginCode ? (
        <div className="realtor-login-code-overlay" role="presentation">
          <form
            aria-describedby="first-login-code-description"
            aria-labelledby="first-login-code-title"
            aria-modal="true"
            className="realtor-login-code-modal"
            onSubmit={handleFirstCodeSubmit}
            role="dialog"
          >
            <button
              aria-label="Close first-time code step"
              className="realtor-login-code-close"
              onClick={closeFirstCodeStep}
              type="button"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>

            <ShieldCheck aria-hidden="true" className="h-8 w-8" />
            <p className="realtor-login-code-eyebrow">First login verification</p>
            <h2 id="first-login-code-title">Enter your setup code</h2>
            <p id="first-login-code-description">
              This code is only required the first time this realtor account signs in.
            </p>

            <label>
              <span>First-time login code</span>
              <div>
                <ShieldCheck aria-hidden="true" className="h-4 w-4 shrink-0" />
                <input
                  autoCapitalize="characters"
                  autoComplete="one-time-code"
                  autoFocus
                  inputMode="text"
                  maxLength={6}
                  onChange={(event) => setFirstLoginCode(event.target.value.toUpperCase())}
                  pattern="[A-Za-z0-9]{6}"
                  placeholder="6-character code"
                  required
                  type="text"
                  value={firstLoginCode}
                />
              </div>
            </label>

            {state.message ? (
              <p className="realtor-login-alert" role="alert">
                {state.message}
              </p>
            ) : null}

            <button className="realtor-login-submit" disabled={isSubmitting} type="submit">
              <ShieldCheck aria-hidden="true" className="h-4 w-4 shrink-0" />
              {isSubmitting ? "Confirming" : "Confirm code"}
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
}
