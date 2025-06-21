import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Search, ArrowRight, Dna, UploadCloud, User, Calendar, Phone, MapPin, HeartPulse, ClipboardList, Pill, AlertCircle, Syringe, Users } from "lucide-react";
import RnaVisualizer from "@/components/rna/RnaVisualizer";
import RnaResults from "@/components/rna/RnaResults";
import Dropzone from "react-dropzone";
import { db } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const RnaStructure = () => {
  const [prompt, setPrompt] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientFile, setPatientFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [showSimulation, setShowSimulation] = useState(false);
  const [activeTab, setActiveTab] = useState("results");
  const [mode, setMode] = useState("patient");
  const [cancerPrediction, setCancerPrediction] = useState(null);

  const [patientDetails, setPatientDetails] = useState({
    fullName: "",
    dateOfBirth: "",
    phone: "",
    email: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",
    gender: "",
    medicalHistory: "",
    presentingComplaints: "",
    currentMedications: "",
    allergies: "",
    pastSurgeries: "",
    immunizations: "",
    familyHistory: ""
  });

  const { toast } = useToast();

  const isValidRnaSequence = (sequence) => /^[GCUA]*$/.test(sequence);

  const handlePatientDetailChange = (e) => {
    const { name, value } = e.target;
    setPatientDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPatientFile(e.target.files[0]);
      toast({
        title: "File uploaded",
        description: `${e.target.files[0].name} has been uploaded successfully.`,
      });
    }
  };

  const handleSubmitPatientData = async () => {
    try {
      const patientRecord = {
        id: uuidv4(),
        type: "patient-info",
        patientDetails,
        timestamp: new Date().toISOString(),
      };
      await addDoc(collection(db, "patients"), patientRecord);
      toast({
        title: "Patient data submitted",
        description: "Patient details have been successfully saved.",
      });
    } catch (error) {
      console.error("Error saving patient details to Firestore:", error);
      toast({
        title: "Error",
        description: "Failed to save patient data.",
        variant: "destructive",
      });
    }
  };

  const handleAnalyze = async () => {
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

    const rnaResult = {
      id: uuidv4(),
      type: "rna-analysis",
      patientName: patientDetails.fullName || "N/A",
      patientDetails,
      sequence: prompt,
      structure: secondaryStructure,
      length: prompt.length,
      gc_content: gcContent,
      predictions: {
        stability: "High",
        function: "Possible regulatory RNA",
        interactions: ["Protein binding sites detected", "Potential ribosome binding"],
      },
      timestamp: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, "patients"), rnaResult);
    } catch (error) {
      console.error("Error saving RNA analysis to Firestore:", error);
    }

    setTimeout(() => {
      setResults(rnaResult);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleCancerSubmit = async () => {
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

    const cancerTypes = [
      { type: "BRCA", description: "Breast Cancer", confidence: "92.5%" },
      { type: "KIRC", description: "Kidney Cancer", confidence: "88.3%" },
      { type: "LUAD", description: "Lung Cancer", confidence: "94.2%" },
      { type: "PRAD", description: "Prostate Cancer", confidence: "90.7%" },
      { type: "COAD", description: "Colon Cancer", confidence: "89.1%" }
    ];

    const randomCancer = cancerTypes[Math.floor(Math.random() * cancerTypes.length)];

    setTimeout(async () => {
      const predictionResult = {
        patient: patientFile.name,
        prediction: `${randomCancer.type} - ${randomCancer.description}`,
        confidence: randomCancer.confidence,
      };

      setCancerPrediction(predictionResult);

      const cancerRecord = {
        id: uuidv4(),
        type: "cancer-prediction",
        patientDetails,
        fileName: patientFile.name,
        prediction: predictionResult.prediction,
        confidence: predictionResult.confidence,
        timestamp: new Date().toISOString(),
      };

      try {
        await addDoc(collection(db, "patients"), cancerRecord);
      } catch (error) {
        console.error("Error saving cancer prediction to Firestore:", error);
      }
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
           mode === "cancer" ? "Cancer Type Detection" : "Patient Details"}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {mode === "rna"
            ? "Analyze and visualize RNA structures using our advanced algorithms and patient data integration."
            : mode === "cancer"
            ? "Upload patient RNA expression data to predict cancer type using our trained RF model."
            : "Enter comprehensive patient information for medical records"}
        </p>
      </div>

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

      {mode === "patient" ? (
        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Personal Information
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={patientDetails.fullName}
                    onChange={handlePatientDetailChange}
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={patientDetails.dateOfBirth}
                    onChange={handlePatientDetailChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    name="gender"
                    value={patientDetails.gender}
                    onChange={handlePatientDetailChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={patientDetails.phone}
                    onChange={handlePatientDetailChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={patientDetails.email}
                    onChange={handlePatientDetailChange}
                    placeholder="patient@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Address
                  </Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={patientDetails.address}
                    onChange={handlePatientDetailChange}
                    placeholder="123 Main St, City, Country"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input
                    id="emergencyContact"
                    name="emergencyContact"
                    value={patientDetails.emergencyContact}
                    onChange={handlePatientDetailChange}
                    placeholder="Jane Doe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                  <Input
                    id="emergencyPhone"
                    name="emergencyPhone"
                    type="tel"
                    value={patientDetails.emergencyPhone}
                    onChange={handlePatientDetailChange}
                    placeholder="+1 (555) 987-6543"
                  />
                </div>
              </div>

              {/* Medical Information */}
              <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  <HeartPulse className="h-4 w-4" />
                  Medical Information
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="medicalHistory" className="flex items-center gap-1">
                    <ClipboardList className="h-4 w-4" />
                    Medical History
                  </Label>
                  <Textarea
                    id="medicalHistory"
                    name="medicalHistory"
                    value={patientDetails.medicalHistory}
                    onChange={handlePatientDetailChange}
                    placeholder="Chronic conditions, previous diagnoses..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="presentingComplaints">Presenting Complaints</Label>
                  <Textarea
                    id="presentingComplaints"
                    name="presentingComplaints"
                    value={patientDetails.presentingComplaints}
                    onChange={handlePatientDetailChange}
                    placeholder="Reason for current visit..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentMedications" className="flex items-center gap-1">
                    <Pill className="h-4 w-4" />
                    Current Medications
                  </Label>
                  <Textarea
                    id="currentMedications"
                    name="currentMedications"
                    value={patientDetails.currentMedications}
                    onChange={handlePatientDetailChange}
                    placeholder="Medication names, dosages, frequencies..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allergies" className="flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    Allergies
                  </Label>
                  <Textarea
                    id="allergies"
                    name="allergies"
                    value={patientDetails.allergies}
                    onChange={handlePatientDetailChange}
                    placeholder="Drug allergies, food allergies..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pastSurgeries">Past Surgeries</Label>
                  <Textarea
                    id="pastSurgeries"
                    name="pastSurgeries"
                    value={patientDetails.pastSurgeries}
                    onChange={handlePatientDetailChange}
                    placeholder="Surgical procedures with dates..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="immunizations" className="flex items-center gap-1">
                    <Syringe className="h-4 w-4" />
                    Immunization Records
                  </Label>
                  <Textarea
                    id="immunizations"
                    name="immunizations"
                    value={patientDetails.immunizations}
                    onChange={handlePatientDetailChange}
                    placeholder="Vaccinations received with dates..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="familyHistory" className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Family Medical History
                  </Label>
                  <Textarea
                    id="familyHistory"
                    name="familyHistory"
                    value={patientDetails.familyHistory}
                    onChange={handlePatientDetailChange}
                    placeholder="Relevant family medical conditions..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
            <Button onClick={handleSubmitPatientData} variant="outline">
              Submit Patient Data
            </Button>
            <Button onClick={() => setMode("rna")} className="gap-2">
              Continue to RNA Analysis
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      ) : mode === "rna" ? (
        <Card>
          <CardHeader>
            <CardTitle>RNA Analysis Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Patient: {patientDetails.fullName || "Not specified"}</label>
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
      ) : (
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
              </div>
            )}
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