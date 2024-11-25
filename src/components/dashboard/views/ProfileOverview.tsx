import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Phone, Mail, Home, Zap, Pencil } from "lucide-react";
import { Profile, ProfileFormData } from "./types/Profile";
import { ProfileForm } from "./components/ProfileForm";

interface PageHeaderProps {
  heading: string;
  text?: string;
}

const PageHeader = ({ heading, text }: PageHeaderProps) => (
  <div className="flex flex-col gap-2">
    <h1 className="text-3xl font-bold tracking-tight">{heading}</h1>
    {text && <p className="text-muted-foreground">{text}</p>}
  </div>
);

export const ProfileOverview = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    street: "",
    house_number: "",
    postal_code: "",
    city: "",
    annual_consumption: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      toast({
        title: "Fehler beim Laden des Profils",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setProfile(data);
    setFormData({
      first_name: data.first_name || "",
      last_name: data.last_name || "",
      email: data.email || "",
      phone: data.phone || "",
      street: data.street || "",
      house_number: data.house_number || "",
      postal_code: data.postal_code || "",
      city: data.city || "",
      annual_consumption: data.annual_consumption?.toString() || "",
    });
  };

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Fehler",
        description: "Benutzer nicht eingeloggt",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        ...formData,
        annual_consumption: formData.annual_consumption ? parseInt(formData.annual_consumption) : null,
      })
      .eq('id', user.id);

    if (error) {
      toast({
        title: "Fehler beim Speichern",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Erfolgreich gespeichert",
      description: "Ihre Profildaten wurden aktualisiert.",
    });
    setIsEditing(false);
    fetchProfile();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Mein Profil"
        text="Verwalten Sie hier Ihre persönlichen Daten"
      />

      <Card className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-lg font-semibold">Persönliche Informationen</h3>
          <Button
            variant={isEditing ? "outline" : "default"}
            onClick={() => setIsEditing(!isEditing)}
            className="gap-2"
          >
            <Pencil className="h-4 w-4" />
            {isEditing ? "Abbrechen" : "Bearbeiten"}
          </Button>
        </div>

        <div className="grid gap-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">Name</span>
              </div>
              <p className="text-lg">
                {formData.first_name} {formData.last_name}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="text-sm font-medium">E-Mail</span>
              </div>
              <p className="text-lg">{formData.email}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span className="text-sm font-medium">Telefon</span>
              </div>
              <p className="text-lg">{formData.phone || "-"}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Zap className="h-4 w-4" />
                <span className="text-sm font-medium">Jährlicher Stromverbrauch</span>
              </div>
              <p className="text-lg">{formData.annual_consumption ? `${formData.annual_consumption} kWh` : "-"}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Home className="h-4 w-4" />
              <span className="text-sm font-medium">Adresse</span>
            </div>
            <p className="text-lg">
              {formData.street} {formData.house_number}<br />
              {formData.postal_code} {formData.city}
            </p>
          </div>
        </div>

        <ProfileForm
          formData={formData}
          setFormData={setFormData}
          onSave={handleSave}
          isEditing={isEditing}
        />
      </Card>
    </div>
  );
};