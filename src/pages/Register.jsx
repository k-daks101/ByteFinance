import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import ThemeToggle from "../components/ThemeToggle";
import { UserPlus } from "lucide-react";
import ByteFinanceLogo from "../components/ByteFinanceLogo";

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser, loading, error } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });
  const [localError, setLocalError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalError("");

    if (form.password !== form.passwordConfirmation) {
      setLocalError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setLocalError("Password must be at least 8 characters.");
      return;
    }

    try {
      await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
        passwordConfirmation: form.passwordConfirmation,
      });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const message =
        err?.errors?.email?.[0] ||
        err?.message ||
        "Unable to register. Please try again.";
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
              <UserPlus className="h-5 w-5" />
              <h1 className="text-2xl font-bold">Create your account</h1>
            </div>
            <p className="mt-1 text-sm text-indigo-100">
              Build smart money habits with a safe trading simulator.
            </p>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-end">
              <ThemeToggle />
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormInput
                id="name"
                name="name"
                type="text"
                label="Name"
                value={form.name}
                onChange={handleChange}
              />
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
                label="Password (min 8 characters)"
                value={form.password}
                onChange={handleChange}
              />
              <FormInput
                id="passwordConfirmation"
                name="passwordConfirmation"
                type="password"
                label="Confirm password"
                value={form.passwordConfirmation}
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
                {loading ? "Creating account..." : "Create account"}
              </Button>
            </form>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Already have an account?</span>
              <button
                type="button"
                className="font-semibold text-indigo-600 hover:text-indigo-700"
                onClick={() => navigate("/login")}
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-500">
          ByteFinance is a simulation platform for learning.
        </p>
      </div>
    </div>
  );
}
