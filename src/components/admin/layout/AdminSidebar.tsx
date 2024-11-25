import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  UserCog, 
  Package, 
  Settings, 
  ListTodo,
  Crown,
  Shield,
  UserPlus,
  Bug
} from "lucide-react";

export const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-white border-r h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/dashboard#overview"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg ${
                  isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <LayoutDashboard className="w-5 h-5 mr-3" />
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard#users"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg ${
                  isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <Users className="w-5 h-5 mr-3" />
              Benutzer
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard#leads"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg ${
                  isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <UserPlus className="w-5 h-5 mr-3" />
              Leads
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard#roles"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg ${
                  isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <Shield className="w-5 h-5 mr-3" />
              Rollen
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard#api-debug"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg ${
                  isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <Bug className="w-5 h-5 mr-3" />
              API Debug
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard#affiliates"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg ${
                  isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <Crown className="w-5 h-5 mr-3" />
              Partner
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard#employees"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg ${
                  isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <UserCog className="w-5 h-5 mr-3" />
              Mitarbeiter
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard#products"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg ${
                  isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <Package className="w-5 h-5 mr-3" />
              Produkte
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard#settings"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg ${
                  isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <Settings className="w-5 h-5 mr-3" />
              Einstellungen
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};