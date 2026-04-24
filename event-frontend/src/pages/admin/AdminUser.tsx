import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../api/axios";
import "../../styles/pages/admin/AdminUser.css";
import AdminSidebar, { AdminTab } from "../../components/admin/AdminSidebar";
import AdminHero from "../../components/admin/AdminHero";
import AdminStats from "../../components/admin/AdminStats";
import AdminUsersTable from "../../components/admin/AdminUsersTable";
import AdminCreateUserForm from "../../components/admin/AdminCreateUserForm";
import AdminSearchUser from "../../components/admin/AdminSearchUser";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export default function AdminUsers() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");

  const [users, setUsers] = useState<User[]>([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const [searchEmail, setSearchEmail] = useState("");
  const [searchResult, setSearchResult] = useState<User | null>(null);

  const adminId = JSON.parse(localStorage.getItem("user")!).id;

  useEffect(() => {
    if (location.pathname === "/admin/users") setActiveTab("users");
    else setActiveTab("dashboard");
  }, [location.pathname]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get(roleFilter ? `/admin/users?role=${roleFilter}` : "/admin/users");
      setUsers(res.data);
    } catch {
      alert("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const stats = useMemo(() => {
    const total = users.length;
    const admins = users.filter((u) => u.role === "ADMIN").length;
    const organizers = users.filter((u) => u.role === "ORGANIZER").length;
    const normalUsers = users.filter((u) => u.role === "USER").length;
    return { total, admins, organizers, normalUsers };
  }, [users]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await api.delete(`/admin/users/${id}`);
      alert("User deleted successfully");
      fetchUsers();
    } catch {
      alert("Cannot delete user");
    }
  };

  const passwordGuidelines =
    "Password must be at least 8 characters and include uppercase, lowercase, number, and a special symbol.";

  const validatePassword = (password: string) => {
    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[!@#$%^&*(),.?\":{}|<>]/.test(password)
    ) {
      return [passwordGuidelines];
    }
    return [];
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newUser.username || !newUser.email || !newUser.password || !newUser.role) {
      return alert("All fields are required");
    }

    const passwordValidation = validatePassword(newUser.password);
    if (passwordValidation.length) {
      setFormErrors(passwordValidation);
      return;
    }

    try {
      setFormErrors([]);
      await api.post("/admin/users", newUser);
      alert("User created successfully!");
      setNewUser({ username: "", email: "", password: "", role: "" });
      fetchUsers();
      setActiveTab("users");
    } catch (err: any) {
      alert(err.response?.data || "Error creating user");
    }
  };

  const handleSearch = async () => {
    if (!searchEmail.trim()) return alert("Enter email to search");

    try {
      const res = await api.get("/admin/users");
      const user = res.data.find((u: User) => u.email === searchEmail.trim());
      if (!user) {
        alert("User not found");
        setSearchResult(null);
      } else {
        setSearchResult(user);
      }
    } catch {
      alert("Error searching user");
    }
  };

  const handleRoleChange = async (id: number, newRole: string) => {
    try {
      await api.put(`/admin/users/${id}/role`, { role: newRole });
      fetchUsers();
    } catch {
      alert("Cannot update role");
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="admin-content">
        {activeTab === "dashboard" && (
          <>
            <AdminHero onManageUsers={() => setActiveTab("users")} onCreateUser={() => setActiveTab("create")} />
            <AdminStats {...stats} />
          </>
        )}

        {activeTab === "users" && (
          <AdminUsersTable
            roleFilter={roleFilter}
            onRoleFilterChange={setRoleFilter}
            loading={loading}
            users={users}
            adminId={adminId}
            onRoleChange={handleRoleChange}
            onDelete={handleDelete}
          />
        )}

        {activeTab === "create" && (
          <AdminCreateUserForm newUser={newUser} formErrors={formErrors} onChange={setNewUser} onSubmit={handleCreateUser} />
        )}

        {activeTab === "search" && (
          <AdminSearchUser email={searchEmail} result={searchResult} onEmailChange={setSearchEmail} onSearch={handleSearch} />
        )}
      </div>
    </div>
  );
}
