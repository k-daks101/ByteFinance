import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { login as loginRequest } from "../api/auth";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import ThemeToggle from "../components/ThemeToggle";
import { LogIn } from "lucide-react";
import ByteFinanceLogo from "../components/ByteFinanceLogo";
import AuthContext from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Display success message from registration
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message from location state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      // API: POST /api/auth/login -> { token | accessToken }
      const data = await loginRequest({
        email: form.email,
        password: form.password,
      });
      const token = data?.token || data?.accessToken;
      if (!token) {
        throw new Error("Missing token in response.");
      }
      auth?.login(token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to login. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
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
              {successMessage && (
                <div className="p-3 rounded-md border-l-4 border-green-600">
                  <p className="text-sm text-green-700 dark:text-green-400 font-medium">{successMessage}</p>
                </div>
              )}
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
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button
                type="submit"
                disabled={submitting}
                variant="secondary"
                className="w-full"
              >
                {submitting ? "Signing in..." : "Sign in"}
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
