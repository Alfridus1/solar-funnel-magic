import { NavLink } from "react-router-dom";
import { MenuItem } from "../types";

interface MenuLinkProps {
  item: MenuItem;
}

export const MenuLink = ({ item }: MenuLinkProps) => {
  const Icon = item.icon;
  
  return (
    <li>
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          `flex items-center p-2 rounded-lg ${
            isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50"
          }`
        }
      >
        <Icon className="w-5 h-5 mr-3" />
        {item.label}
      </NavLink>
    </li>
  );
};