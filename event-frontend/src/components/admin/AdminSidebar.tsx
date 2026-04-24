import "../../styles/components/admin/AdminSidebar.css";

export type AdminTab = "dashboard" | "users" | "create" | "search";

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
}

export default function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const tabClass = (tab: AdminTab) => `admin-tab-btn${activeTab === tab ? " active-tab-btn" : ""}`;

  return (
    <div className="sidebar admin-sidebar">
      <h2>Admin Panel</h2>

      <button className={tabClass("dashboard")} onClick={() => onTabChange("dashboard")}>
        Dashboard
      </button>

      <button className={tabClass("users")} onClick={() => onTabChange("users")}>
        Manage Users
      </button>

      <button className={tabClass("create")} onClick={() => onTabChange("create")}>
        Create User
      </button>

      <button className={tabClass("search")} onClick={() => onTabChange("search")}>
        Search User
      </button>
    </div>
  );
}
