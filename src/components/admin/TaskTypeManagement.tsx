import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Edit2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TaskType {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
}

export const TaskTypeManagement = () => {
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTaskType, setSelectedTaskType] = useState<TaskType | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#000000",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTaskTypes();
  }, []);

  const fetchTaskTypes = async () => {
    try {
      const { data, error } = await supabase
        .from("task_types")
        .select("*")
        .order("name");

      if (error) throw error;
      setTaskTypes(data);
    } catch (error: any) {
      toast({
        title: "Fehler beim Laden der Aufgabentypen",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const operation = selectedTaskType
        ? supabase
            .from("task_types")
            .update(formData)
            .eq("id", selectedTaskType.id)
        : supabase.from("task_types").insert(formData);

      const { error } = await operation;
      if (error) throw error;

      toast({
        title: `Aufgabentyp ${selectedTaskType ? "aktualisiert" : "erstellt"}`,
        description: `Der Aufgabentyp wurde erfolgreich ${
          selectedTaskType ? "aktualisiert" : "erstellt"
        }.`,
      });

      setIsDialogOpen(false);
      fetchTaskTypes();
      resetForm();
    } catch (error: any) {
      toast({
        title: "Fehler beim Speichern",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Möchten Sie diesen Aufgabentyp wirklich löschen?")) return;

    try {
      const { error } = await supabase.from("task_types").delete().eq("id", id);
      if (error) throw error;

      toast({
        title: "Aufgabentyp gelöscht",
        description: "Der Aufgabentyp wurde erfolgreich gelöscht.",
      });

      fetchTaskTypes();
    } catch (error: any) {
      toast({
        title: "Fehler beim Löschen",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (taskType: TaskType) => {
    setSelectedTaskType(taskType);
    setFormData({
      name: taskType.name,
      description: taskType.description || "",
      color: taskType.color || "#000000",
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setSelectedTaskType(null);
    setFormData({
      name: "",
      description: "",
      color: "#000000",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Aufgabentypen</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm();
                setIsDialogOpen(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Aufgabentyp hinzufügen
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedTaskType
                  ? "Aufgabentyp bearbeiten"
                  : "Neuer Aufgabentyp"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
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
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="color" className="text-sm font-medium">
                  Farbe
                </label>
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                />
              </div>
              <Button type="submit" className="w-full">
                {selectedTaskType ? "Aktualisieren" : "Erstellen"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Beschreibung</TableHead>
            <TableHead>Farbe</TableHead>
            <TableHead className="w-[100px]">Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {taskTypes.map((taskType) => (
            <TableRow key={taskType.id}>
              <TableCell>{taskType.name}</TableCell>
              <TableCell>{taskType.description}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: taskType.color || "#000000" }}
                  />
                  {taskType.color}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(taskType)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(taskType.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};