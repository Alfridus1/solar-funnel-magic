import { Input } from "@/components/ui/input";

interface RegistrationFieldsProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  };
  onChange: (field: string, value: string) => void;
}

export const RegistrationFields = ({ formData, onChange }: RegistrationFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="Vorname"
          value={formData.firstName}
          onChange={(e) => onChange('firstName', e.target.value)}
          required
        />
        <Input
          placeholder="Nachname"
          value={formData.lastName}
          onChange={(e) => onChange('lastName', e.target.value)}
          required
        />
      </div>
      <Input
        type="email"
        placeholder="E-Mail"
        value={formData.email}
        onChange={(e) => onChange('email', e.target.value)}
        required
      />
      <Input
        type="tel"
        placeholder="Handynummer"
        value={formData.phone}
        onChange={(e) => onChange('phone', e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Passwort"
        value={formData.password}
        onChange={(e) => onChange('password', e.target.value)}
        required
      />
    </>
  );
};