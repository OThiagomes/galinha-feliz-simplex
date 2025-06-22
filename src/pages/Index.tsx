
import { SidebarProvider } from "@/components/ui/sidebar";
import MainLayout from "@/components/MainLayout";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <MainLayout />
      </div>
    </SidebarProvider>
  );
};

export default Index;
