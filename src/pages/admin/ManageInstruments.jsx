import React, { useState } from "react";
import axios from "axios";
import Button from "../../components/Button";
import FormInput from "../../components/FormInput";
import { Boxes } from "lucide-react";

export default function ManageInstruments() {
  const [form, setForm] = useState({
    symbol: "",
    name: "",
    category: "",
    active: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      // API: POST /api/admin/instruments -> created instrument
      await axios.post("/api/admin/instruments", {
        symbol: form.symbol,
        name: form.name,
        category: form.category,
        active: form.active,
      });
      setSuccess("Instrument created.");
      setForm({ symbol: "", name: "", category: "", active: true });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to create instrument."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      // API: PUT /api/admin/instruments/:id -> updated instrument
      await axios.put("/api/admin/instruments/:id", {
        symbol: form.symbol,
        name: form.name,
        category: form.category,
        active: form.active,
      });
      setSuccess("Instrument updated.");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to update instrument."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      // API: DELETE /api/admin/instruments/:id -> deleted instrument
      await axios.delete("/api/admin/instruments/:id");
      setSuccess("Instrument deleted.");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to delete instrument."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="bf-card p-6">
        <div className="flex items-center gap-2">
          <Boxes className="h-5 w-5 text-indigo-600" />
          <h1 className="text-2xl font-bold text-slate-900">Manage Instruments</h1>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Create, update, or remove tradable instruments.
        </p>
      </section>

      <form
        onSubmit={handleCreate}
        className="bf-card p-6 space-y-4"
      >
        <FormInput
          id="symbol"
          name="symbol"
          type="text"
          label="Symbol"
          value={form.symbol}
          onChange={handleChange}
        />
        <FormInput
          id="name"
          name="name"
          type="text"
          label="Name"
          value={form.name}
          onChange={handleChange}
        />
        <FormInput
          id="category"
          name="category"
          type="text"
          label="Category"
          value={form.category}
          onChange={handleChange}
        />
        <div className="flex items-center gap-2">
          <input
            id="active"
            name="active"
            type="checkbox"
            checked={form.active}
            onChange={handleChange}
          />
          <label htmlFor="active" className="text-sm text-slate-600">
            Active
          </label>
        </div>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create Instrument"}
        </Button>
      </form>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          onClick={handleUpdate}
          disabled={submitting}
          variant="outline"
        >
          Update Selected
        </Button>
        <Button
          type="button"
          onClick={handleDelete}
          disabled={submitting}
          variant="outline"
        >
          Delete Selected
        </Button>
      </div>

      {submitting && <p className="text-sm text-slate-500">Working...</p>}
      {success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {success}
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}
    </div>
  );
}
