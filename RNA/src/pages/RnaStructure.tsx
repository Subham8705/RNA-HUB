// src/components/rna/RnaStructure.tsx
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { db } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import PatientDetailsForm from "@/components/rna/PatientDetailsForm";
import RnaAnalysisForm from "@/components/rna/RnaAnalysisForm";
import CancerDetectionForm from "@/components/rna/CancerDetectionForm";
import AnalysisResults from "@/components/rna/AnalysisResults";
import ModeSelector from "@/components/rna/ModeSelector";

const RnaStructure = () => {
  const [prompt, setPrompt] = useState("");
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
    setPatientDetails(prev => ({ ...prev, [name]: value }));
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

  const formData = new FormData();
  formData.append("file", patientFile);

  try {
    toast({
      title: "Analyzing...",
      description: "Sending data to backend for cancer prediction...",
    });

    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || "Server responded with an error");
    }

    const result = await response.json();

    const predictionResult = {
      patient: result.sample_id,
      prediction: result.prediction,
      confidence: `${(result.confidence * 100).toFixed(2)}%`,
    };

    setCancerPrediction(predictionResult);

    // Save to Firestore
    const cancerRecord = {
      id: uuidv4(),
      type: "cancer-prediction",
      patientDetails,
      fileName: patientFile.name,
      prediction: predictionResult.prediction,
      confidence: predictionResult.confidence,
      timestamp: new Date().toISOString(),
    };

    await addDoc(collection(db, "patients"), cancerRecord);

    toast({
      title: "Prediction Complete",
      description: `Prediction: ${predictionResult.prediction}`,
    });
  } catch (error) {
    console.error("Prediction error:", error);
    toast({
      title: "Error",
      description: error.message || "Prediction failed. Try again.",
      variant: "destructive",
    });
  }
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

      <ModeSelector mode={mode} setMode={setMode} />

      {mode === "patient" ? (
        <PatientDetailsForm 
          patientDetails={patientDetails}
          handlePatientDetailChange={handlePatientDetailChange}
          handleSubmitPatientData={handleSubmitPatientData}
          setMode={setMode}
        />
      ) : mode === "rna" ? (
        <RnaAnalysisForm 
          patientDetails={patientDetails}
          prompt={prompt}
          setPrompt={setPrompt}
          patientFile={patientFile}
          setPatientFile={setPatientFile}
          isAnalyzing={isAnalyzing}
          handleFileChange={handleFileChange}
          handleAnalyze={handleAnalyze}
        />
      ) : (
        <CancerDetectionForm 
          patientFile={patientFile}
          setPatientFile={setPatientFile}
          cancerPrediction={cancerPrediction}
          handleCancerSubmit={handleCancerSubmit}
        />
      )}

      {mode === "rna" && results && (
        <AnalysisResults 
          results={results}
          showSimulation={showSimulation}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          toggleSimulation={toggleSimulation}
          prompt={prompt}
        />
      )}
    </div>
  );
};

export default RnaStructure;