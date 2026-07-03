import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  FileSearch,
  MessageSquareText,
  Briefcase,
  Map,
  User,
} from "lucide-react";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/resume", label: "Resume Analyzer", icon: FileText },
  { to: "/dashboard/resume-job-match", label: "Resume vs Job Description", icon: FileSearch },
  { to: "/dashboard/interview", label: "Mock Interview", icon: MessageSquareText },
  { to: "/dashboard/jobs", label: "Job Tracker", icon: Briefcase },
  { to: "/dashboard/roadmap", label: "Career Roadmap", icon: Map },
  { to: "/dashboard/profile", label: "Profile", icon: User },
];

const Sidebar = () => {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white px-4 py-6 lg:block">
      <nav className="flex flex-col gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
