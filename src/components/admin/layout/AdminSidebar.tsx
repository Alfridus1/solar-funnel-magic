import { adminMenuItems } from "./config/menuItems";
import { MenuLink } from "./components/MenuLink";

export const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-white border-r h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          {adminMenuItems.map((item) => (
            <MenuLink key={item.path} item={item} />
          ))}
        </ul>
      </nav>
    </aside>
  );
};