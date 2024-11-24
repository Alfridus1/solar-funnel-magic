import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { PDFDownloadButton } from "@/components/solar-showcase/components/PDFDownloadButton";
import type { LeadCalculation } from "./types/LeadCalculation";
import { CalculationCard } from "./components/CalculationCard";
import { EmptyState } from "./components/EmptyState";
import { PageHeader } from "./components/PageHeader";

export const RequestsOverview = () => {
  const [calculations, setCalculations] = useState<LeadCalculation[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadCalculations();
  }, []);

  const loadCalculations = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('leads')
      .select('id, created_at, metrics, address, deleted_at')
      .eq('user_id', user.id)
      .eq('type', 'calculation')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Fehler beim Laden der Anfragen",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    const typedData: LeadCalculation[] = (data || []).map(item => ({
      id: item.id,
      created_at: item.created_at,
      address: item.address,
      deleted_at: item.deleted_at,
      metrics: item.metrics && typeof item.metrics === 'object' && !Array.isArray(item.metrics) 
        ? {
            kWp: Number(item.metrics.kWp) || 0,
            annualSavings: Number(item.metrics.annualSavings) || 0,
            estimatedPrice: Number(item.metrics.estimatedPrice) || 0,
            roofArea: Number(item.metrics.roofArea) || 0
          }
        : null
    }));

    setCalculations(typedData);
  };

  const handleNewRequest = () => {
    navigate("/");
  };

  const handleCalculationClick = (calculation: LeadCalculation) => {
    if (calculation.metrics) {
      navigate("/solar-showcase", {
        state: {
          metrics: calculation.metrics,
          address: calculation.address,
          existingLeadId: calculation.id
        }
      });
    }
  };

  const handleDeleteCalculation = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('leads')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setCalculations(prev => prev.filter(calc => calc.id !== id));
      
      toast({
        title: "Anfrage gelöscht",
        description: "Die Anfrage wurde erfolgreich gelöscht.",
      });

      loadCalculations();
    } catch (error: any) {
      toast({
        title: "Fehler beim Löschen",
        description: error.message || "Die Anfrage konnte nicht gelöscht werden.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        onNewRequest={handleNewRequest}
      />

      <div className="grid gap-6">
        {calculations.map((calc) => (
          <CalculationCard
            key={calc.id}
            calculation={calc}
            onDelete={handleDeleteCalculation}
            onClick={handleCalculationClick}
          />
        ))}

        {calculations.length === 0 && (
          <EmptyState onNewRequest={handleNewRequest} />
        )}
      </div>
    </div>
  );
};