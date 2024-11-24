import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Phone, Mail, Home, Zap, Save } from "lucide-react";
import { PageHeader } from "./components/PageHeader";

export const ProfileOverview = () => {
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
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
        title="Mein Profil"
        description="Verwalten Sie hier Ihre persönlichen Daten"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600">
              <User className="h-4 w-4" />
              <span>Name</span>
            </div>
            {isEditing ? (
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Vorname"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                />
                <Input
                  placeholder="Nachname"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                />
              </div>
            ) : (
              <p className="font-medium">{profile?.first_name} {profile?.last_name}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="h-4 w-4" />
              <span>E-Mail</span>
            </div>
            {isEditing ? (
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            ) : (
              <p className="font-medium">{profile?.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="h-4 w-4" />
              <span>Telefon</span>
            </div>
            {isEditing ? (
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            ) : (
              <p className="font-medium">{profile?.phone || "-"}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600">
              <Zap className="h-4 w-4" />
              <span>Jährlicher Stromverbrauch (kWh)</span>
            </div>
            {isEditing ? (
              <Input
                type="number"
                value={formData.annual_consumption}
                onChange={(e) => setFormData({ ...formData, annual_consumption: e.target.value })}
              />
            ) : (
              <p className="font-medium">{profile?.annual_consumption || "-"} kWh</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Home className="h-4 w-4" />
            <span>Adresse</span>
          </div>
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <Input
                    placeholder="Straße"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  />
                </div>
                <Input
                  placeholder="Nr."
                  value={formData.house_number}
                  onChange={(e) => setFormData({ ...formData, house_number: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="PLZ"
                  value={formData.postal_code}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                />
                <div className="col-span-2">
                  <Input
                    placeholder="Ort"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
              </div>
            </div>
          ) : (
            <p className="font-medium">
              {profile?.street} {profile?.house_number}<br />
              {profile?.postal_code} {profile?.city}
            </p>
          )}
        </div>

        {isEditing && (
          <div className="mt-6 flex justify-end">
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Speichern
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};