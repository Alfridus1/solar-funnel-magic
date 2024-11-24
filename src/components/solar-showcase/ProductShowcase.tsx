import { ConfigSidebar } from "./components/ConfigSidebar";
import { ShowcaseContent } from "./components/ShowcaseContent";

export const ProductShowcase = () => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <ConfigSidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <ShowcaseContent />
      </main>
    </div>
  );
};