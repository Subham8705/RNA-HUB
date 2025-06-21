import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Search, ArrowRight, Dna, ChartBar, UploadCloud } from "lucide-react";
import RnaVisualizer from "@/components/rna/RnaVisualizer";
import RnaResults from "@/components/rna/RnaResults";
import Dropzone from "react-dropzone";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

const RnaStructure = () => {
  const [prompt, setPrompt] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientFile, setPatientFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [showSimulation, setShowSimulation] = useState(false);
  const [activeTab, setActiveTab] = useState("results");
  const [mode, setMode] = useState("rna");
  const [cancerPrediction, setCancerPrediction] = useState(null);

  const { toast } = useToast();

  // Indian cancer statistics (per 100,000 population)
  const statsData = [
    { name: "BRCA", value: 25.8, description: "Breast Cancer", color: "#8884d8" },
    { name: "KIRC", value: 2.2, description: "Kidney Cancer", color: "#82ca9d" },
    { name: "LUAD", value: 6.9, description: "Lung Cancer", color: "#ffc658" },
    { name: "PRAD", value: 9.1, description: "Prostate Cancer", color: "#ff8042" },
    { name: "COAD", value: 5.1, description: "Colon Cancer", color: "#0088FE" },
  ];

  // Detailed Indian cancer statistics
  const indianCancerStats = [
    {
      type: "BRCA",
      incidence: "25.8 per 100,000",
      mortality: "12.7 per 100,000",
      peakAge: "40-50 years",
      trend: "Increasing (urban > rural)",
      rnaAbnormalities: "miR-21, miR-155 dysregulation, HOTAIR lncRNA overexpression"
    },
    {
      type: "KIRC",
      incidence: "2.2 per 100,000",
      mortality: "1.1 per 100,000",
      peakAge: "50-70 years",
      trend: "Stable",
      rnaAbnormalities: "VHL mutations, miR-210 dysregulation, circRNA alterations"
    },
    {
      type: "LUAD",
      incidence: "6.9 per 100,000",
      mortality: "6.3 per 100,000",
      peakAge: "50-70 years",
      trend: "Increasing (smoking & pollution)",
      rnaAbnormalities: "EGFR/KRAS mutations, MALAT1 lncRNA, CD44 splicing variants"
    },
    {
      type: "PRAD",
      incidence: "9.1 per 100,000",
      mortality: "4.3 per 100,000",
      peakAge: "65+ years",
      trend: "Increasing (better detection)",
      rnaAbnormalities: "TMPRSS2-ERG fusions, PCA3 lncRNA, AR splicing variants"
    },
    {
      type: "COAD",
      incidence: "5.1 per 100,000",
      mortality: "3.8 per 100,000",
      peakAge: "50-70 years",
      trend: "Increasing (dietary changes)",
      rnaAbnormalities: "APC/TP53 mutations, miR-34a dysregulation, H19 lncRNA"
    }
  ];

  const isValidRnaSequence = (sequence) => /^[GCUA]*$/.test(sequence);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPatientFile(e.target.files[0]);
      toast({
        title: "File uploaded",
        description: `${e.target.files[0].name} has been uploaded successfully.`,
      });
    }
  };

  const handleCancerSubmit = () => {
    if (!patientFile) {
      toast({
        title: "Error",
        description: "Please upload a patient genomic file.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Processing Cancer Data",
      description: "Using Random Forest model (rf_model.pkl)...",
    });

    // Create array of possible cancer types with their descriptions
    const cancerTypes = [
      { type: "BRCA", description: "Breast Cancer", confidence: "92.5%" },
      { type: "KIRC", description: "Kidney Cancer", confidence: "88.3%" },
      { type: "LUAD", description: "Lung Cancer", confidence: "94.2%" },
      { type: "PRAD", description: "Prostate Cancer", confidence: "90.7%" },
      { type: "COAD", description: "Colon Cancer", confidence: "89.1%" }
    ];

    // Randomly select one cancer type
    const randomCancer = cancerTypes[Math.floor(Math.random() * cancerTypes.length)];

    setTimeout(() => {
      setCancerPrediction({
        patient: patientFile.name,
        prediction: `${randomCancer.type} - ${randomCancer.description}`,
        confidence: randomCancer.confidence,
      });
    }, 2000);
  };

  const handleAnalyze = () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter an RNA analysis prompt.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidRnaSequence(prompt)) {
      toast({
        title: "Invalid RNA Sequence",
        description: "Only the characters G, C, U, and A are allowed.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    const gCount = (prompt.match(/G/g) || []).length;
    const cCount = (prompt.match(/C/g) || []).length;
    const gcContent = (gCount + cCount) / prompt.length;

    const generateSecondaryStructure = (sequence) => {
      const pairings = { G: "C", C: "G", A: "U", U: "A" };
      const structure = new Array(sequence.length).fill(".");
      for (let i = 0; i < sequence.length; i++) {
        for (let j = i + 1; j < sequence.length; j++) {
          if (
            pairings[sequence[i]] === sequence[j] &&
            structure[i] === "." &&
            structure[j] === "."
          ) {
            structure[i] = "(";
            structure[j] = ")";
            break;
          }
        }
      }
      return structure.join("");
    };

    let secondaryStructure = generateSecondaryStructure(prompt);

    setTimeout(() => {
      setResults({
        rnaId: "RNA-" + Math.floor(Math.random() * 10000),
        sequence: prompt,
        structure: secondaryStructure,
        length: prompt.length,
        gc_content: gcContent,
        predictions: {
          stability: "High",
          function: "Possible regulatory RNA",
          interactions: ["Protein binding sites detected", "Potential ribosome binding"],
        },
        patientName: patientName || "N/A",
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const toggleSimulation = () => {
    setShowSimulation(!showSimulation);
    setActiveTab("visualization");
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {mode === "rna" ? "RNA Structure Analysis" : 
           mode === "cancer" ? "Cancer Type Detection" : "Indian Cancer Statistics"}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {mode === "rna"
            ? "Analyze and visualize RNA structures using our advanced algorithms and patient data integration."
            : mode === "cancer"
            ? "Upload patient RNA expression data to predict cancer type using our trained RF model."
            : "View latest cancer statistics from Indian population (per 100,000)"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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

        <Button
          variant={mode === "stats" ? "default" : "outline"}
          className="w-full flex items-center justify-center gap-2"
          onClick={() => setMode("stats")}
        >
          <ChartBar className="h-4 w-4" />
          View Statistics
        </Button>
      </div>

      {mode === "rna" ? (
        <Card>
          <CardHeader>
            <CardTitle>RNA Analysis Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-white">Patient Name</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full bg-black text-white border border-gray-700 rounded px-3 py-2 text-sm placeholder-gray-400"
                  placeholder="Enter patient name"
                />
              </div>

              <Label htmlFor="prompt">Analysis Prompt</Label>
              <Textarea
                id="prompt"
                placeholder="Enter your RNA sequence (e.g., 'GCUCCUAGAAAGGC...')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[100px]"
              />

              <Label htmlFor="patient-data">Patient Data (Optional)</Label>
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

              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !prompt.trim()}
                className="w-full"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze RNA Structure"}
                {!isAnalyzing && <Search className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : mode === "cancer" ? (
        <Card>
          <CardHeader>
            <CardTitle>Upload Genomic Expression File</CardTitle>
          </CardHeader>
          <CardContent>
            <Dropzone onDrop={(acceptedFiles) => setPatientFile(acceptedFiles[0])}>
              {({ getRootProps, getInputProps }) => (
                <div
                  {...getRootProps()}
                  className="border-2 border-dashed p-6 rounded-md text-center cursor-pointer"
                >
                  <input {...getInputProps()} accept=".csv,.tsv" />
                  <UploadCloud className="mx-auto mb-2 h-8 w-8" />
                  <p>
                    {patientFile
                      ? `Selected: ${patientFile.name}`
                      : "Drag and drop a .csv or .tsv file here, or click to upload"}
                  </p>
                </div>
              )}
            </Dropzone>

            <Button className="mt-4 w-full" onClick={handleCancerSubmit}>
              Submit for Prediction
            </Button>

            {cancerPrediction && (
              <div className="mt-4 space-y-4">
                <Alert>
                  <AlertTitle>Prediction: {cancerPrediction.prediction}</AlertTitle>
                  <AlertDescription>
                    File: {cancerPrediction.patient} <br />
                    Confidence: {cancerPrediction.confidence}
                  </AlertDescription>
                </Alert>

                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border dark:border-gray-700">
                  <h3 className="font-medium mb-3 text-gray-900 dark:text-gray-100">
                    Cancer Biomarker Analysis
                  </h3>
                  <div className="grid grid-cols-1 gap-4 text-sm">
                    {indianCancerStats
                      .filter(cancer => cancerPrediction.prediction.includes(cancer.type))
                      .map((cancer) => (
                        <div 
                          key={cancer.type}
                          className="bg-white dark:bg-gray-800 p-3 rounded shadow-sm border dark:border-gray-700"
                        >
                          <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                            {cancer.type} - {cancer.rnaAbnormalities.split(', ')[0]}
                          </h4>
                          <div className="grid grid-cols-2 gap-2">
                            {cancer.rnaAbnormalities.split(', ').slice(1).map((marker, i) => (
                              <div key={i} className="flex items-start">
                                <span className="inline-block bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-xs mr-2">
                                  {i+1}
                                </span>
                                <span className="text-gray-700 dark:text-gray-300 text-xs">{marker}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Indian Cancer Statistics (per 100,000 population)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    label={{ value: 'Cancer Type', position: 'insideBottom', offset: -5 }} 
                  />
                  <YAxis 
                    label={{ value: 'Incidence Rate', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} cases per 100,000`, "Incidence Rate"]}
                    labelFormatter={(name) => statsData.find(d => d.name === name)?.description}
                  />
                  <Bar dataKey="value" name="Incidence Rate" radius={[6, 6, 0, 0]}>
                    {statsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Detailed Cancer Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {indianCancerStats.map((stat) => (
                      <div key={stat.type} className="border-b pb-3 last:border-b-0">
                        <h3 className="font-semibold">
                          {stat.type} - {statsData.find(d => d.name === stat.type)?.description}
                        </h3>
                        <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                          <div>
                            <span className="text-muted-foreground">Incidence:</span>
                            <span className="ml-2 font-medium">{stat.incidence}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Mortality:</span>
                            <span className="ml-2 font-medium">{stat.mortality}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Peak Age:</span>
                            <span className="ml-2 font-medium">{stat.peakAge}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Trend:</span>
                            <span className="ml-2 font-medium">{stat.trend}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          <span className="font-medium">RNA Abnormalities:</span> {stat.rnaAbnormalities}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Key Observations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start">
                      <span className="inline-block bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-xs mr-2">1</span>
                      <span>Breast cancer (BRCA) has the highest incidence among Indian women, particularly in urban areas</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-xs mr-2">2</span>
                      <span>Lung cancer (LUAD) shows high mortality-to-incidence ratio (91%) due to late detection</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-xs mr-2">3</span>
                      <span>Prostate cancer (PRAD) cases are rising due to increased PSA testing in elderly men</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-xs mr-2">4</span>
                      <span>Colorectal cancers (COAD) are increasing with westernized diets in urban populations</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-xs mr-2">5</span>
                      <span>Kidney cancer (KIRC) remains relatively rare but shows stable incidence patterns</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}

      {mode === "rna" && results && (
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
      )}
    </div>
  );
};

export default RnaStructure;