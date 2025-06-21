// src/components/rna/PatientList.tsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit2, Trash } from "lucide-react";
import { db, auth } from "@/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc, // ✅ Required to update patient data
} from "firebase/firestore";
import { useToast } from "@/components/ui/use-toast";

interface PatientListProps {
  selectedPatient: any;
  onSelectPatient: (patient: any) => void;
  onNewPatient: () => void;
  onDeletePatient: (id: string) => void; // ✅ New prop
}

const PatientList = ({
  selectedPatient,
  onSelectPatient,
  onNewPatient,
  onDeletePatient
}: PatientListProps) => {
  const [patients, setPatients] = useState<any[]>([]);
  const { toast } = useToast();

  const fetchPatients = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "patients"),
      where("type", "==", "patient-info"),
      where("doctorId", "==", user.uid)
    );

    const snapshot = await getDocs(q);
    const fetchedPatients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPatients(fetchedPatients);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleEdit = async (patient: any) => {
    const newName = prompt("Edit patient name", patient.patientDetails?.fullName || "");
    if (newName && newName.trim()) {
      try {
        const ref = doc(db, "patients", patient.id);
        await updateDoc(ref, {
          patientDetails: {
            ...patient.patientDetails,
            fullName: newName.trim(),
          },
        });
        toast({ title: "Updated", description: "Patient name updated." });
        fetchPatients();
      } catch (err) {
        console.error(err);
        toast({ title: "Error", description: "Failed to update record", variant: "destructive" });
      }
    }
  };

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
                className={`p-3 rounded-md border cursor-pointer flex justify-between items-start gap-4 ${
                  selectedPatient?.id === patient.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => onSelectPatient(patient)}
              >
                <div className="flex-1">
                  <div className="font-medium">
                    {patient.patientDetails?.fullName || "Unnamed Patient"}
                  </div>
                  <div className="text-xs">
                    {new Date(patient.timestamp).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {patient.patientDetails?.medicalHistory || "No medical history provided."}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(patient);
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePatient(patient.id); // ✅ Delegate to parent
                    }}
                  >
                    <Trash className="w-4 h-4 text-red-500" />
                  </Button>
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
