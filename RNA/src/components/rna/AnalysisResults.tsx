import React, { useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import RnaResults from "@/components/rna/RnaResults";

interface AnalysisResultsProps {
  results: any;
  showSimulation: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  toggleSimulation: () => void;
  prompt: string;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  results,
  showSimulation,
  activeTab,
  setActiveTab,
  toggleSimulation,
  prompt,
}) => {
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showSimulation && activeTab === "visualization" && prompt) {
      const loadViewer = async () => {
        // dynamically import if not yet loaded
        if (!(window as any).$3Dmol) {
          await import("3dmol/build/3Dmol-min.js");
        }
        const viewerDiv = viewerRef.current;
        if (!viewerDiv) return;
        viewerDiv.innerHTML = "";

        const viewer = (window as any).$3Dmol.createViewer(viewerDiv, {
          backgroundColor: "white",
        });
        viewer.addModelFromDatabase(prompt.toLowerCase(), "pdb");
        viewer.setStyle({}, { cartoon: { color: "spectrum" } });
        viewer.zoomTo();
        viewer.render();
      };

      loadViewer().catch(console.error);
    }
  }, [prompt, showSimulation, activeTab]);

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-6">
          <TabsTrigger value="results">Analysis Results</TabsTrigger>
          {showSimulation && <TabsTrigger value="visualization">3D Visualization</TabsTrigger>}
        </TabsList>

        <TabsContent value="results">
          <RnaResults results={results} />
          <div className="mt-8 flex justify-center">
            <Button onClick={toggleSimulation}>
              {showSimulation ? "Hide 3D Simulation" : "Show 3D Simulation"}
            </Button>
          </div>
        </TabsContent>

        {showSimulation && (
          <TabsContent value="visualization">
            <div ref={viewerRef} style={{ width: "100%", height: "600px" }} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default AnalysisResults;
