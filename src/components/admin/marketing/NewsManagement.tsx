import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { NewsTable } from "./components/NewsTable";
import { NewsDialog } from "./components/NewsDialog";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";

export const NewsManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const { toast } = useToast();

  const { data: news, refetch } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*, profiles(first_name, last_name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const handleEdit = (newsItem: any) => {
    setSelectedNews(newsItem);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Fehler",
        description: "Nachricht konnte nicht gelöscht werden.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Erfolg",
      description: "Nachricht wurde gelöscht.",
    });
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">News Verwaltung</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Neue Nachricht
        </Button>
      </div>

      <NewsTable
        news={news || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <NewsDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        news={selectedNews}
        onSuccess={() => {
          refetch();
          setIsDialogOpen(false);
          setSelectedNews(null);
        }}
      />
    </div>
  );
};