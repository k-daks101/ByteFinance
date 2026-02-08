import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "../../components/Table";
import { Users } from "lucide-react";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      try {
        // API: GET /api/admin/users -> array | { items: array }
        const { data } = await axios.get("/api/admin/users");
        if (isMounted) {
          setUsers(Array.isArray(data) ? data : data?.items || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Unable to load users."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleStatus = async (user) => {
    setError("");
    setUpdatingId(user.id);
    try {
      const nextStatus = user.status === "disabled" ? "enabled" : "disabled";
      // API: PUT /api/admin/users/:id/status -> updated user
      await axios.put(`/api/admin/users/${user.id}/status`, {
        status: nextStatus,
      });
      setUsers((prev) =>
        prev.map((item) =>
          item.id === user.id ? { ...item, status: nextStatus } : item
        )
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to update user status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <section className="bf-card p-6">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-indigo-600" />
          <h1 className="text-2xl font-bold text-slate-900">Manage Users</h1>
        </div>
        <p className="mt-1 text-sm text-slate-500">Enable or disable user access.</p>
      </section>

      {loading && <p className="text-sm text-slate-500">Loading users...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="bf-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">User list</h2>
            <span className="text-xs text-slate-400">{users.length} users</span>
          </div>
          <Table className="border-0 rounded-none">
            <TableHead>
              <tr>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Email</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Action</TableHeaderCell>
              </tr>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name || user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.status || "enabled"}</TableCell>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => toggleStatus(user)}
                      disabled={updatingId === user.id}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                    >
                      {user.status === "disabled" ? "Enable" : "Disable"}
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-sm text-slate-500">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
