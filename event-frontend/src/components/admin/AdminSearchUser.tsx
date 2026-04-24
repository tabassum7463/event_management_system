import "../../styles/components/admin/AdminSearchUser.css";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AdminSearchUserProps {
  email: string;
  result: User | null;
  onEmailChange: (value: string) => void;
  onSearch: () => void;
}

export default function AdminSearchUser({ email, result, onEmailChange, onSearch }: AdminSearchUserProps) {
  return (
    <div className="admin-search-block">
      <h2>Search User</h2>

      <input
        placeholder="Search user by email address"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
      />
      <button onClick={onSearch}>Search</button>

      {result && (
        <div className="search-result">
          <p>ID: {result.id}</p>
          <p>Username: {result.username}</p>
          <p>Email: {result.email}</p>
          <p>Role: {result.role}</p>
        </div>
      )}
    </div>
  );
}
