// src/components/rna/ModeSelector.tsx
import { Button } from "@/components/ui/button";
import { User, Dna, FolderOpen } from "lucide-react";

interface ModeSelectorProps {
  mode: string;
  setMode: (mode: string) => void;
}

const ModeSelector = ({ mode, setMode }: ModeSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Button
        variant={mode === "patient" ? "default" : "outline"}
        className="w-full flex items-center justify-center gap-2"
        onClick={() => setMode("patient")}
      >
        <User className="h-4 w-4" />
        Patient Details
      </Button>
      <Button
        variant={mode === "rna" ? "default" : "outline"}
        className="w-full flex items-center justify-center gap-2"
        onClick={() => setMode("rna")}
      >
        <Dna className="h-4 w-4" />
        Generate RNA Structure
      </Button>
      <Button
        variant={mode === "cancer" ? "default" : "outline"}
        className="w-full flex items-center justify-center gap-2"
        onClick={() => setMode("cancer")}
      >
        <Dna className="h-4 w-4" />
        Detect Cancer Types
      </Button>
    </div>
  );
};

export default ModeSelector;
