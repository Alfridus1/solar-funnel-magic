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
    try {
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

      if (data) {
        setProfile(data as Profile);
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
      }
    } catch (error: any) {
      toast({
        title: "Fehler beim Laden des Profils",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    try {
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
    } catch (error: any) {
      toast({
        title: "Fehler beim Speichern",
        description: error.message,
        variant: "destructive",
      });
    }
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-gray-500" />
            <div className="flex flex-col">
              <span className="text-sm text-gray-600">Name</span>
              <span className="font-medium">{formData.first_name} {formData.last_name}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-gray-500" />
            <div className="flex flex-col">
              <span className="text-sm text-gray-600">E-Mail</span>
              <span className="font-medium">{formData.email}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-gray-500" />
            <div className="flex flex-col">
              <span className="text-sm text-gray-600">Telefon</span>
              <span className="font-medium">{formData.phone || "-"}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-gray-500" />
            <div className="flex flex-col">
              <span className="text-sm text-gray-600">Jährlicher Stromverbrauch</span>
              <span className="font-medium">{formData.annual_consumption || "-"} kWh</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:col-span-2">
            <Home className="h-5 w-5 text-gray-500" />
            <div className="flex flex-col">
              <span className="text-sm text-gray-600">Adresse</span>
              <span className="font-medium">
                {formData.street} {formData.house_number}, {formData.postal_code} {formData.city}
              </span>
            </div>
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