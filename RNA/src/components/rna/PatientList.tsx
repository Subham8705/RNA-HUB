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
  updateDoc
} from "firebase/firestore";
import { useToast } from "@/components/ui/use-toast";

interface PatientListProps {
  selectedPatient: any;
  onSelectPatient: (patient: any) => void;
  onNewPatient: () => void;
}

const PatientList = ({
  selectedPatient,
  onSelectPatient,
  onNewPatient,
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

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        await deleteDoc(doc(db, "patients", id));
        toast({ title: "Deleted", description: "Patient record deleted." });
        fetchPatients(); // Refresh
      } catch (err) {
        console.error(err);
        toast({ title: "Error", description: "Failed to delete record", variant: "destructive" });
      }
    }
  };

  const handleEdit = async (patient: any) => {
    const newName = prompt("Edit patient name", patient.patientDetails.fullName);
    if (newName && newName.trim()) {
      try {
        const ref = doc(db, "patients", patient.id);
        await updateDoc(ref, {
          "patientDetails.fullName": newName.trim(),
        });
        toast({ title: "Updated", description: "Patient name updated." });
        fetchPatients(); // Refresh
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
                className={`p-3 rounded-md border cursor-pointer flex justify-between items-center ${
                  selectedPatient?.id === patient.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => onSelectPatient(patient)}
              >
                <div>
                  <div className="font-medium">
                    {patient.patientDetails.fullName || "Unnamed Patient"}
                  </div>
                  <div className="text-xs">
                    {new Date(patient.timestamp).toLocaleDateString()}
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
                      handleDelete(patient.id);
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
