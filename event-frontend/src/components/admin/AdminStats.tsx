import "../../styles/components/admin/AdminStats.css";

interface AdminStatsProps {
  total: number;
  admins: number;
  organizers: number;
  normalUsers: number;
}

export default function AdminStats({ total, admins, organizers, normalUsers }: AdminStatsProps) {
  return (
    <div className="admin-stats-grid">
      <div className="admin-stat-card">
        <p>Total Users</p>
        <h3>{total}</h3>
      </div>
      <div className="admin-stat-card">
        <p>Admins</p>
        <h3>{admins}</h3>
      </div>
      <div className="admin-stat-card">
        <p>Organizers</p>
        <h3>{organizers}</h3>
      </div>
      <div className="admin-stat-card">
        <p>Users</p>
        <h3>{normalUsers}</h3>
      </div>
    </div>
  );
}
