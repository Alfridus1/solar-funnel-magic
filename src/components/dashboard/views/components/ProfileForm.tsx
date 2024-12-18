import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { ProfileFormData } from "../types/Profile";

interface ProfileFormProps {
  formData: ProfileFormData;
  setFormData: (data: ProfileFormData) => void;
  onSave: () => void;
  isEditing: boolean;
}

export const ProfileForm = ({ formData, setFormData, onSave, isEditing }: ProfileFormProps) => {
  if (!isEditing) return null;

  return (
    <div className="space-y-6 mt-6 border-t pt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
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
        </div>

        <div className="space-y-2">
          <Input
            type="email"
            placeholder="E-Mail"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Input
            type="tel"
            placeholder="Telefon"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Input
            type="number"
            placeholder="Jährlicher Stromverbrauch (kWh)"
            value={formData.annual_consumption}
            onChange={(e) => setFormData({ ...formData, annual_consumption: e.target.value })}
          />
        </div>
      </div>

      <div className="mt-6">
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
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={onSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Speichern
        </Button>
      </div>
    </div>
  );
};