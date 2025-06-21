import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface RnaAnalysisFormProps {
  patientDetails: any;
  prompt: string;
  setPrompt: (prompt: string) => void;
  patientFile: File | null;
  setPatientFile: (file: File | null) => void;
  isAnalyzing: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAnalyze: () => void;
}

const RnaAnalysisForm = ({
  patientDetails,
  prompt,
  setPrompt,
  patientFile,
  setPatientFile,
  isAnalyzing,
  handleFileChange,
  handleAnalyze,
}: RnaAnalysisFormProps) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [pdbInput, setPdbInput] = useState("");
  const [metadata, setMetadata] = useState("Metadata will appear here...");

  useEffect(() => {
    // Load NGL script dynamically once
    const existingScript = document.getElementById("ngl-script");
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/ngl@latest/dist/ngl.js";
      script.id = "ngl-script";
      script.async = true;
      script.onload = () => {
        setScriptLoaded(true);
        if (viewerRef.current && (window as any).NGL) {
          const stage = new (window as any).NGL.Stage(viewerRef.current);
          (window as any).nglStage = stage;
        }
      };
      document.body.appendChild(script);
    } else {
      setScriptLoaded(true);
    }
  }, []);

  const handleLoadStructure = () => {
    const pdbId = pdbInput.trim().toLowerCase();
    if (!pdbId || !(window as any).nglStage) return;

    const stage = (window as any).nglStage;
    stage.removeAllComponents();

    stage.loadFile("rcsb://" + pdbId, { defaultRepresentation: true }).then((component: any) => {
      component.autoView();
    });

    fetch(`https://data.rcsb.org/rest/v1/core/entry/${pdbId}`)
      .then((res) => res.json())
      .then((data) => {
        const title = data.struct?.title || "N/A";
        const method = data.exptl?.[0]?.method || "N/A";
        const resolution = data.rcsb_entry_info?.resolution_combined?.[0] || "N/A";

        const metadataText = `🔬 Title: ${title}
🧪 Method: ${method}
📏 Resolution: ${resolution} Å`;

        setMetadata(metadataText);
      })
      .catch((err) => {
        console.error("Metadata fetch error:", err);
        setMetadata("❌ Error fetching metadata.");
      });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>RNA Analysis Parameters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Patient: {patientDetails.fullName || "Not specified"}
            </label>
          </div>

          {/* Upload patient file */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Input
                id="patient-data"
                type="file"
                onChange={handleFileChange}
                className="opacity-0 absolute inset-0 w-full cursor-pointer"
                accept=".vcf,.fastq,.fasta,.csv,.txt"
              />
              <div className="border rounded-md flex items-center justify-between px-3 py-2">
                <span className="text-sm truncate">
                  {patientFile ? patientFile.name : "Upload patient genomic data file"}
                </span>
                <Plus size={18} className="shrink-0 text-muted-foreground" />
              </div>
            </div>
            {patientFile && (
              <Button variant="outline" size="sm" onClick={() => setPatientFile(null)}>
                Clear
              </Button>
            )}
          </div>

          {/* 3D Viewer */}
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-2">NGL Viewer: Protein/RNA 3D View</h3>
            <div className="flex items-center gap-2 mb-4">
              <Input
                placeholder="Enter PDB ID (e.g. 8RBJ)"
                value={pdbInput}
                onChange={(e) => setPdbInput(e.target.value)}
                className="w-1/2"
              />
              <Button onClick={handleLoadStructure} disabled={!scriptLoaded}>
                Load
              </Button>
            </div>
            <div
              id="viewport"
              ref={viewerRef}
              style={{
                width: "100%",
                height: "500px",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            />
            <div
              className="mt-4 p-4 border rounded-md bg-muted text-sm"
              style={{
                whiteSpace: "pre-wrap",
                fontFamily: "monospace",
              }}
            >
              {metadata}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RnaAnalysisForm;
