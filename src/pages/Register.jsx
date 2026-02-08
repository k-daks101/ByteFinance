import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { register as registerRequest } from "../api/auth";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import ThemeToggle from "../components/ThemeToggle";
import { UserPlus } from "lucide-react";
import AuthContext from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      // API: POST /api/auth/register -> { token | accessToken }
      const data = await registerRequest({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      const token = data?.token || data?.accessToken;
      if (token) {
        auth?.login(token);
      }
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to register. Please try again.";
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
            <p className="text-xs uppercase tracking-widest text-indigo-100">
              ByteFinance
            </p>
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
                {submitting ? "Creating account..." : "Create account"}
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
