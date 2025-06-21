// src/components/rna/CancerDetectionForm.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Dropzone from "react-dropzone";
import { UploadCloud } from "lucide-react";

interface CancerDetectionFormProps {
  patientFile: File | null;
  setPatientFile: (file: File | null) => void;
  cancerPrediction: any;
  handleCancerSubmit: () => void;
}

const CancerDetectionForm = ({
  patientFile,
  setPatientFile,
  cancerPrediction,
  handleCancerSubmit
}: CancerDetectionFormProps) => {
  return (
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
  );
};

export default CancerDetectionForm;