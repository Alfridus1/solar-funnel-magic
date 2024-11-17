import { Pencil } from "lucide-react";

export const Instructions = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex items-start gap-4">
        <div className="bg-blue-50 p-3 rounded-full">
          <Pencil className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-1">So zeichnen Sie Ihr Dach ein:</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Klicken Sie auf "Dach hinzufügen" unten</li>
            <li>Klicken Sie nacheinander auf die Ecken Ihres Daches</li>
            <li>Schließen Sie die Form, indem Sie wieder auf den ersten Punkt klicken</li>
            <li>Die möglichen PV-Module werden automatisch eingezeichnet</li>
          </ol>
        </div>
      </div>
    </div>
  );
};