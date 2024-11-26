import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface ContentItem {
  id: string;
  section: string;
  title: string;
  description: string;
}

export const LandingPageContent = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    const { data, error } = await supabase
      .from('landing_page_content')
      .select('*')
      .order('section');

    if (error) {
      toast({
        title: "Fehler beim Laden",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setContent(data);
    setLoading(false);
  };

  const handleUpdate = async (id: string, field: 'title' | 'description', value: string) => {
    const updatedContent = content.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setContent(updatedContent);
  };

  const handleSave = async () => {
    setSaving(true);
    const promises = content.map(item =>
      supabase
        .from('landing_page_content')
        .update({ title: item.title, description: item.description })
        .eq('id', item.id)
    );

    try {
      const results = await Promise.all(promises);
      const errors = results.filter(result => result.error).map(result => result.error);

      if (errors.length > 0) {
        throw new Error(errors[0]?.message);
      }

      toast({
        title: "Erfolgreich gespeichert",
        description: "Die Änderungen wurden erfolgreich gespeichert.",
      });
    } catch (error: any) {
      toast({
        title: "Fehler beim Speichern",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Landing Page Inhalte</h2>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Wird gespeichert...
            </>
          ) : (
            "Änderungen speichern"
          )}
        </Button>
      </div>

      <div className="grid gap-6">
        {content.map((item) => (
          <Card key={item.id} className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {item.section.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Titel</label>
                    <Input
                      value={item.title}
                      onChange={(e) => handleUpdate(item.id, 'title', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Beschreibung</label>
                    <Textarea
                      value={item.description}
                      onChange={(e) => handleUpdate(item.id, 'description', e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};