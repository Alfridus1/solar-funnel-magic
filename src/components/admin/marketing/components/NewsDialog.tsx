import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  title: z.string().min(1, "Titel wird benötigt"),
  content: z.string().min(1, "Inhalt wird benötigt"),
  status: z.enum(["draft", "published"]),
});

interface NewsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  news?: any;
  onSuccess: () => void;
}

export const NewsDialog = ({ open, onOpenChange, news, onSuccess }: NewsDialogProps) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: news || {
      title: "",
      content: "",
      status: "draft",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (news?.id) {
        const { error } = await supabase
          .from("news")
          .update({
            title: values.title,
            content: values.content,
            status: values.status,
            published_at: values.status === "published" ? new Date().toISOString() : null,
          })
          .eq("id", news.id);

        if (error) throw error;

        toast({
          title: "Erfolg",
          description: "Nachricht wurde aktualisiert.",
        });
      } else {
        const { error } = await supabase.from("news").insert({
          title: values.title,
          content: values.content,
          status: values.status,
          published_at: values.status === "published" ? new Date().toISOString() : null,
        });

        if (error) throw error;

        toast({
          title: "Erfolg",
          description: "Nachricht wurde erstellt.",
        });
      }

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {news ? "Nachricht bearbeiten" : "Neue Nachricht"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titel</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inhalt</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={5} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                    >
                      <option value="draft">Entwurf</option>
                      <option value="published">Veröffentlicht</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Abbrechen
              </Button>
              <Button type="submit">
                {news ? "Aktualisieren" : "Erstellen"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};