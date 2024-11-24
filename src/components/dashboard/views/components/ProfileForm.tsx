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
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
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
            <p className="font-medium">{formData.first_name} {formData.last_name}</p>
          )}
        </div>

        <div className="space-y-2">
          {isEditing ? (
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          ) : (
            <p className="font-medium">{formData.email}</p>
          )}
        </div>

        <div className="space-y-2">
          {isEditing ? (
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          ) : (
            <p className="font-medium">{formData.phone || "-"}</p>
          )}
        </div>

        <div className="space-y-2">
          {isEditing ? (
            <Input
              type="number"
              value={formData.annual_consumption}
              onChange={(e) => setFormData({ ...formData, annual_consumption: e.target.value })}
            />
          ) : (
            <p className="font-medium">{formData.annual_consumption || "-"} kWh</p>
          )}
        </div>
      </div>

      <div className="mt-6">
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
            {formData.street} {formData.house_number}<br />
            {formData.postal_code} {formData.city}
          </p>
        )}
      </div>

      {isEditing && (
        <div className="mt-6 flex justify-end">
          <Button onClick={onSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Speichern
          </Button>
        </div>
      )}
    </div>
  );
};