// src/components/rna/PatientList.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface PatientListProps {
  patients: any[];
  selectedPatient: any;
  onSelectPatient: (patient: any) => void;
  onNewPatient: () => void;
}

const PatientList = ({ patients, selectedPatient, onSelectPatient, onNewPatient }: PatientListProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Your Patients</CardTitle>
        <Button size="sm" onClick={onNewPatient}>
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {patients.length === 0 ? (
          <p className="text-sm text-muted-foreground">No patients found</p>
        ) : (
          <div className="space-y-2">
            {patients.map((patient) => (
              <div
                key={patient.id}
                className={`p-3 rounded-md cursor-pointer ${
                  selectedPatient?.id === patient.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => onSelectPatient(patient)}
              >
                <div className="font-medium">{patient.patientDetails.fullName || "Unnamed Patient"}</div>
                <div className="text-xs">
                  {new Date(patient.timestamp).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientList;