import "../../styles/components/admin/AdminUsersTable.css";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AdminUsersTableProps {
  roleFilter: string;
  onRoleFilterChange: (value: string) => void;
  loading: boolean;
  users: User[];
  adminId: number;
  onRoleChange: (id: number, role: string) => void;
  onDelete: (id: number) => void;
}

export default function AdminUsersTable({
  roleFilter,
  onRoleFilterChange,
  loading,
  users,
  adminId,
  onRoleChange,
  onDelete,
}: AdminUsersTableProps) {
  return (
    <div className="admin-users-block">
      <h2>User Management</h2>

      <label>Filter by Role: </label>
      <select value={roleFilter} onChange={(e) => onRoleFilterChange(e.target.value)}>
        <option value="">All</option>
        <option value="USER">USER</option>
        <option value="ORGANIZER">ORGANIZER</option>
        <option value="ADMIN">ADMIN</option>
      </select>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => onRoleChange(user.id, e.target.value)}
                    disabled={user.id === adminId}
                  >
                    <option value="USER">USER</option>
                    <option value="ORGANIZER">ORGANIZER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td>
                  {user.id !== adminId && <button onClick={() => onDelete(user.id)}>Delete</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
