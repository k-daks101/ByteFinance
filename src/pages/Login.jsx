import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import ThemeToggle from "../components/ThemeToggle";
import { LogIn } from "lucide-react";
import ByteFinanceLogo from "../components/ByteFinanceLogo";

export default function Login() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [localError, setLocalError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalError("");

    if (!form.email || !form.password) {
      setLocalError("Please enter email and password.");
      return;
    }

    try {
      await login(form.email, form.password, false);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const message =
        err?.errors?.email?.[0] ||
        err?.message ||
        "Unable to login. Please try again.";
      setLocalError(message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="bf-card shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-6 text-white">
            <ByteFinanceLogo className="text-white" />
            <div className="mt-2 flex items-center gap-2">
              <LogIn className="h-5 w-5" />
              <h1 className="text-2xl font-bold">Welcome back</h1>
            </div>
            <p className="mt-1 text-sm text-indigo-100">
              Sign in to continue your learning journey.
            </p>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-end">
              <ThemeToggle />
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormInput
                id="email"
                name="email"
                type="email"
                label="Email"
                value={form.email}
                onChange={handleChange}
              />
              <FormInput
                id="password"
                name="password"
                type="password"
                label="Password"
                value={form.password}
                onChange={handleChange}
              />
              {(error || localError) && (
                <p className="text-sm text-red-600">{error || localError}</p>
              )}
              <Button
                type="submit"
                disabled={loading}
                variant="secondary"
                className="w-full"
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Need an account?</span>
              <button
                type="button"
                className="font-semibold text-indigo-600 hover:text-indigo-700"
                onClick={() => navigate("/register")}
              >
                Create one
              </button>
            </div>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-500">
          Practice with virtual currency. No real money involved.
        </p>
      </div>
    </div>
  );
}
