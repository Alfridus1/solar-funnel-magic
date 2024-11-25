import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Calendar as CalendarIcon, Plus, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const Tasks = () => {
  const [taskType, setTaskType] = useState<string>("all");
  const [dueDate, setDueDate] = useState<Date>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type_id: "",
    document: null as File | null,
  });
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, document: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let documentUrl = null;
      let documentName = null;

      if (formData.document) {
        const fileExt = formData.document.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('task_documents')
          .upload(fileName, formData.document);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('task_documents')
          .getPublicUrl(fileName);

        documentUrl = publicUrl;
        documentName = formData.document.name;
      }

      const { error } = await supabase.from('tasks').insert({
        title: formData.title,
        description: formData.description,
        type_id: formData.type_id || null,
        document_url: documentUrl,
        document_name: documentName,
        due_date: dueDate?.toISOString(),
      });

      if (error) throw error;

      toast({
        title: "Aufgabe erstellt",
        description: "Die Aufgabe wurde erfolgreich erstellt.",
      });

      setIsDialogOpen(false);
      setFormData({
        title: "",
        description: "",
        type_id: "",
        document: null,
      });
      setDueDate(undefined);
    } catch (error: any) {
      toast({
        title: "Fehler beim Erstellen der Aufgabe",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Aufgaben</h1>
      
      <div className="flex gap-4 mb-6">
        <Select value={taskType} onValueChange={setTaskType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Aufgabentyp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Typen</SelectItem>
            <SelectItem value="installation">Installation</SelectItem>
            <SelectItem value="maintenance">Wartung</SelectItem>
            <SelectItem value="repair">Reparatur</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !dueDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? format(dueDate, "PPP", { locale: de }) : "Fälligkeitsdatum"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={setDueDate}
              initialFocus
              locale={de}
            />
          </PopoverContent>
        </Popover>

        {(taskType !== "all" || dueDate) && (
          <Button
            variant="ghost"
            onClick={() => {
              setTaskType("all");
              setDueDate(undefined);
            }}
          >
            Filter zurücksetzen
          </Button>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ml-auto">
              <Plus className="h-4 w-4 mr-2" />
              Aufgabe hinzufügen
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Neue Aufgabe</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Titel
                </label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Beschreibung
                </label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="type" className="text-sm font-medium">
                  Aufgabentyp
                </label>
                <Select value={formData.type_id} onValueChange={(value) => setFormData({ ...formData, type_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Aufgabentyp auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="installation">Installation</SelectItem>
                    <SelectItem value="maintenance">Wartung</SelectItem>
                    <SelectItem value="repair">Reparatur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="document" className="text-sm font-medium">
                  Dokument
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    id="document"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('document')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Dokument auswählen
                  </Button>
                  {formData.document && (
                    <span className="text-sm text-muted-foreground">
                      {formData.document.name}
                    </span>
                  )}
                </div>
              </div>
              <Button type="submit" className="w-full">
                Aufgabe erstellen
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="open" className="w-full">
        <TabsList>
          <TabsTrigger value="open">Offene Aufgaben</TabsTrigger>
          <TabsTrigger value="due">Fällige Aufgaben</TabsTrigger>
        </TabsList>

        <TabsContent value="open">
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Keine offenen Aufgaben</h3>
            <p className="text-muted-foreground">
              Aktuell sind keine offenen Aufgaben zugewiesen.
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="due">
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Keine fälligen Aufgaben</h3>
            <p className="text-muted-foreground">
              Aktuell sind keine fälligen Aufgaben vorhanden.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};