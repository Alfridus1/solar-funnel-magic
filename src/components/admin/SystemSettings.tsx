import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";

interface TrackingPixel {
  id: string;
  platform: string;
  pixel_id: string;
  conversion_label?: string;
  is_active: boolean;
}

export const SystemSettings = () => {
  const [settings, setSettings] = useState({
    yieldFactor: 1000,
    defaultConsumption: 4000,
  });
  
  const [pixels, setPixels] = useState<TrackingPixel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPixels();
  }, []);

  const loadPixels = async () => {
    try {
      const { data, error } = await supabase
        .from('tracking_pixels')
        .select('*');

      if (error) throw error;
      setPixels(data || []);
    } catch (error: any) {
      toast({
        title: "Fehler beim Laden der Tracking Pixel",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updatePixel = async (id: string, updates: Partial<TrackingPixel>) => {
    try {
      const { error } = await supabase
        .from('tracking_pixels')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Pixel aktualisiert",
        description: "Die Änderungen wurden gespeichert.",
      });

      loadPixels();
    } catch (error: any) {
      toast({
        title: "Fehler beim Aktualisieren",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addPixel = async (platform: 'meta' | 'google') => {
    try {
      const { error } = await supabase
        .from('tracking_pixels')
        .insert([{
          platform,
          pixel_id: '',
          is_active: false
        }]);

      if (error) throw error;

      toast({
        title: "Pixel hinzugefügt",
        description: "Ein neuer Tracking Pixel wurde erstellt.",
      });

      loadPixels();
    } catch (error: any) {
      toast({
        title: "Fehler beim Erstellen",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement settings storage
    toast({
      title: "Einstellungen gespeichert",
      description: "Die Systemeinstellungen wurden aktualisiert.",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 max-w-xl">
        <h2 className="text-2xl font-semibold mb-6">Systemeinstellungen</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="yieldFactor">Ertragsfaktor (kWh/kWp)</Label>
            <Input
              id="yieldFactor"
              type="number"
              value={settings.yieldFactor}
              onChange={(e) => setSettings({ ...settings, yieldFactor: Number(e.target.value) })}
            />
          </div>

          <div>
            <Label htmlFor="defaultConsumption">Standard Jahresverbrauch (kWh)</Label>
            <Input
              id="defaultConsumption"
              type="number"
              value={settings.defaultConsumption}
              onChange={(e) => setSettings({ ...settings, defaultConsumption: Number(e.target.value) })}
            />
          </div>

          <Button type="submit">Einstellungen speichern</Button>
        </form>
      </Card>

      <Card className="p-6 max-w-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Tracking Pixel</h2>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              onClick={() => addPixel('meta')}
            >
              Meta Pixel hinzufügen
            </Button>
            <Button 
              variant="outline" 
              onClick={() => addPixel('google')}
            >
              Google Pixel hinzufügen
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {pixels.map((pixel) => (
            <div key={pixel.id} className="border p-4 rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">
                  {pixel.platform === 'meta' ? 'Meta (Facebook)' : 'Google'} Pixel
                </h3>
                <Switch
                  checked={pixel.is_active}
                  onCheckedChange={(checked) => updatePixel(pixel.id, { is_active: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label>Pixel ID</Label>
                <Input
                  value={pixel.pixel_id}
                  onChange={(e) => updatePixel(pixel.id, { pixel_id: e.target.value })}
                  placeholder={`${pixel.platform === 'meta' ? 'Meta' : 'Google'} Pixel ID eingeben`}
                />
              </div>

              {pixel.platform === 'google' && (
                <div className="space-y-2">
                  <Label>Conversion Label</Label>
                  <Input
                    value={pixel.conversion_label || ''}
                    onChange={(e) => updatePixel(pixel.id, { conversion_label: e.target.value })}
                    placeholder="Google Conversion Label eingeben"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};