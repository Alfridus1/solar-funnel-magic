import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeadManagement } from "@/components/admin/LeadManagement";
import { ProductManagement } from "@/components/admin/ProductManagement";
import { SystemSettings } from "@/components/admin/SystemSettings";
import { PremiumProductsManagement } from "@/components/admin/PremiumProductsManagement";

export const AdminDashboard = () => {
  return (
    <Container className="py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <Tabs defaultValue="leads" className="space-y-6">
        <TabsList>
          <TabsTrigger value="leads">Anfragen</TabsTrigger>
          <TabsTrigger value="products">Produkte</TabsTrigger>
          <TabsTrigger value="premium">Premium Produkte</TabsTrigger>
          <TabsTrigger value="settings">Einstellungen</TabsTrigger>
        </TabsList>

        <TabsContent value="leads">
          <LeadManagement />
        </TabsContent>

        <TabsContent value="products">
          <ProductManagement />
        </TabsContent>

        <TabsContent value="premium">
          <PremiumProductsManagement />
        </TabsContent>

        <TabsContent value="settings">
          <SystemSettings />
        </TabsContent>
      </Tabs>
    </Container>
  );
};