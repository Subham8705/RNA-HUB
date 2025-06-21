// src/components/rna/AnalysisResults.tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import RnaVisualizer from "@/components/rna/RnaVisualizer";
import RnaResults from "@/components/rna/RnaResults";

interface AnalysisResultsProps {
  results: any;
  showSimulation: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  toggleSimulation: () => void;
  prompt: string;
}

const AnalysisResults = ({
  results,
  showSimulation,
  activeTab,
  setActiveTab,
  toggleSimulation,
  prompt
}: AnalysisResultsProps) => {
  return (
    <div className="space-y-6">
      <Alert>
        <AlertTitle>Analysis Complete</AlertTitle>
        <AlertDescription>
          RNA analysis has been completed successfully. View the results below.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-6">
          <TabsTrigger value="results" className="flex-1">
            Analysis Results
          </TabsTrigger>
          {showSimulation && (
            <TabsTrigger value="visualization" className="flex-1">
              3D Visualization
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="results" className="mt-0">
          <Card>
            <CardContent className="pt-6">
              <RnaResults results={results} />
              <div className="mt-8 flex justify-center">
                <Button onClick={toggleSimulation} className="flex items-center gap-2">
                  {showSimulation ? "Hide 3D Simulation" : "Show 3D Simulation"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {showSimulation && (
          <TabsContent value="visualization" className="mt-0">
            <Card>
              <CardContent className="pt-6">
                <RnaVisualizer sequence={prompt} />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default AnalysisResults;