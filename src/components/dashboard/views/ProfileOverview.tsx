import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Phone, Mail, Home, Zap } from "lucide-react";
import { Profile, ProfileFormData } from "./types/Profile";
import { ProfileForm } from "./components/ProfileForm";

interface PageHeaderProps {
  heading: string;
  text?: string;
}

const PageHeader = ({ heading, text }: PageHeaderProps) => (
  <div className="flex flex-col gap-2">
    <h1 className="text-3xl font-bold">{heading}</h1>
    {text && <p className="text-gray-600">{text}</p>}
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
    if (!user) return;

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
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Persönliche Informationen</h3>
          <Button
            variant={isEditing ? "outline" : "default"}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Abbrechen" : "Bearbeiten"}
          </Button>
        </div>

        <div className="grid gap-6">
          <div className="flex items-center gap-2 text-gray-600">
            <User className="h-4 w-4" />
            <span>Name</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Mail className="h-4 w-4" />
            <span>E-Mail</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Phone className="h-4 w-4" />
            <span>Telefon</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Zap className="h-4 w-4" />
            <span>Jährlicher Stromverbrauch (kWh)</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Home className="h-4 w-4" />
            <span>Adresse</span>
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