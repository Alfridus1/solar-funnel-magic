import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface MeetingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MeetingsDialog = ({ open, onOpenChange }: MeetingsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-0">
        <div 
          className="meetings-iframe-container" 
          data-src="https://kunden.coppen.de/meetings/tkub/postkartentermin?embed=true"
        />
      </DialogContent>
    </Dialog>
  );
};