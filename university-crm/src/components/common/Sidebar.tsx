import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Home,
  BookOpen,
  Users,
  FileText,
  Settings,
  Brain,
  GraduationCap,
  UserCheck,
} from "lucide-react";

const navigationItems = {
  student: [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "My Courses", href: "/courses", icon: BookOpen },
    { name: "Assignments", href: "/assignments", icon: FileText },
    { name: "AI Assistant", href: "/ai-assistant", icon: Brain },
  ],
  lecturer: [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "My Courses", href: "/courses", icon: BookOpen },
    { name: "Students", href: "/students", icon: Users },
    { name: "Assignments", href: "/assignments", icon: FileText },
    { name: "AI Assistant", href: "/ai-assistant", icon: Brain },
  ],
  admin: [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "All Courses", href: "/courses", icon: BookOpen },
    { name: "Users", href: "/users", icon: Users },
    { name: "Enrollments", href: "/enrollments", icon: UserCheck },
    { name: "Reports", href: "/reports", icon: FileText },
    { name: "AI Assistant", href: "/ai-assistant", icon: Brain },
    { name: "Settings", href: "/settings", icon: Settings },
  ],
};

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const navItems = navigationItems[user.role] || [];

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white shadow-sm border-r border-gray-200 overflow-y-auto">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-50 text-primary-700 border-r-2 border-primary-700"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
