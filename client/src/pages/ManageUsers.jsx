import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import toast from "react-hot-toast";
import { Edit, Trash2, Download } from "lucide-react";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", location: "" });
  const [confirmDeleteUser, setConfirmDeleteUser] = useState(null); // NEW STATE

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to fetch users");
    }
  };

  const confirmDelete = (user) => {
    setConfirmDeleteUser(user);
  };

  const handleDeleteConfirmed = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/users/${confirmDeleteUser._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User deleted");
      setConfirmDeleteUser(null);
      fetchUsers();
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  const openEditModal = (user) => {
    setEditUser(user);
    setEditForm({ name: user.name, location: user.location || "" });
  };

  const saveEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${process.env.REACT_APP_API_URL}/api/admin/users/${editUser._id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User updated");
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update user");
    }
  };

  const exportCSV = () => {
    const header = ["Name", "Email", "Location"];
    const rows = users.map(u => [u.name, u.email, u.location || ""]);
    const csvContent = [header, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "users.csv";
    link.click();
  };

  const filteredUsers = users.filter(u =>
  u.name.toLowerCase().includes(search.toLowerCase()) ||
  u.email.toLowerCase().includes(search.toLowerCase()) ||
  (u.location && u.location.toLowerCase().includes(search.toLowerCase()))
);

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
      <Navbar />

      <main className="px-4 py-20 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-primary">Manage Users</h1>
          <button
            onClick={exportCSV}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email or location"
          className="w-full mb-6 px-4 py-2 rounded-md border dark:border-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-white"
        />

        {/* Table */}
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full text-sm text-left border dark:border-gray-700 text-gray-700 dark:text-gray-200">
            <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-800 dark:text-gray-300">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="bg-gray-50 dark:bg-gray-800">
                  <td className="px-6 py-4 font-medium">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.location || "N/A"}</td>
                  <td className="px-6 py-4 flex items-center gap-4">
                    <button
                      onClick={() => openEditModal(user)}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => confirmDelete(user)}
                      className="text-red-600 dark:text-red-400 hover:underline"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Modal */}
        {editUser && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4">Edit User</h2>

              <label className="block mb-2 text-sm font-medium">Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-4 py-2 rounded-md border dark:border-gray-600 bg-gray-100 dark:bg-gray-700"
              />

              <label className="block mt-4 mb-2 text-sm font-medium">Location</label>
              <input
                type="text"
                value={editForm.location}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                className="w-full px-4 py-2 rounded-md border dark:border-gray-600 bg-gray-100 dark:bg-gray-700"
              />

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setEditUser(null)}
                  className="px-4 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {confirmDeleteUser && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-sm">
              <h2 className="text-lg font-semibold mb-4 text-red-600 dark:text-red-400">
                Confirm Deletion
              </h2>
              <p className="mb-6">
                Are you sure you want to delete <strong>{confirmDeleteUser.name}</strong>?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmDeleteUser(null)}
                  className="px-4 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirmed}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ManageUsers;
