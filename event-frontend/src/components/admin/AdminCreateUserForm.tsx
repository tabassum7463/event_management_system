import "../../styles/components/admin/AdminCreateUserForm.css";

interface NewUser {
  username: string;
  email: string;
  password: string;
  role: string;
}

interface AdminCreateUserFormProps {
  newUser: NewUser;
  formErrors: string[];
  onChange: (next: NewUser) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function AdminCreateUserForm({ newUser, formErrors, onChange, onSubmit }: AdminCreateUserFormProps) {
  return (
    <div className="create-user-wrapper">
      <div className="create-user-card">
        <h2>Create New User</h2>
        {formErrors.length > 0 && (
          <div className="form-errors">
            {formErrors.map((error, index) => (
              <p key={`${error}-${index}`}>{error}</p>
            ))}
          </div>
        )}

        <form onSubmit={onSubmit} autoComplete="off">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={newUser.username}
              onChange={(e) => onChange({ ...newUser, username: e.target.value })}
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={newUser.email}
              onChange={(e) => onChange({ ...newUser, email: e.target.value })}
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={newUser.password}
              onChange={(e) => onChange({ ...newUser, password: e.target.value })}
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select value={newUser.role} onChange={(e) => onChange({ ...newUser, role: e.target.value })}>
              <option value="">Select Role</option>
              <option value="USER">USER</option>
              <option value="ORGANIZER">ORGANIZER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <button type="submit" className="create-btn">
            Create User
          </button>
        </form>
      </div>
    </div>
  );
}
