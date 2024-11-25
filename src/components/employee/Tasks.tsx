import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const Tasks = () => {
  const [taskType, setTaskType] = useState<string>("all");
  const [dueDate, setDueDate] = useState<Date>();

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