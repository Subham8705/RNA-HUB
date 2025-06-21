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
              </AlertDescription>
            </Alert>
            <div className="mt-4 p-4 bg-muted rounded-lg border text-sm leading-relaxed">
  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Cancer Type Descriptions:</h4>
  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
    <li><strong>BRCA</strong> - Breast Cancer</li>
    <li><strong>KIRC</strong> - Renal Cancer (Kidney Renal Clear Cell Carcinoma)</li>
    <li><strong>LUAD</strong> - Lung Cancer (Lung Adenocarcinoma)</li>
    <li><strong>PRAD</strong> - Prostate Cancer (Prostate Adenocarcinoma)</li>
    <li><strong>COAD</strong> - Colon Adenocarcinoma</li>
  </ul>
</div>

          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CancerDetectionForm;