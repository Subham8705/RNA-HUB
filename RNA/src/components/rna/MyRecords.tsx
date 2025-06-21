import { useEffect, useState } from "react";
import { db, auth } from "@/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const MyRecords = () => {
  const [records, setRecords] = useState<any[]>([]);
  const { toast } = useToast();

  const fetchRecords = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "patients"),
      where("type", "==", "patient-info"),
      where("doctorId", "==", user.uid)
    );
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setRecords(data);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Are you sure you want to delete this record?");
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "patients", id));
      toast({ title: "Deleted", description: "Patient record deleted." });
      fetchRecords();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete patient record.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async (record: any) => {
    const newName = prompt("Edit full name:", record.patientDetails.fullName);
    if (!newName) return;

    try {
      const ref = doc(db, "patients", record.id);
      await updateDoc(ref, {
        "patientDetails.fullName": newName,
      });
      toast({ title: "Updated", description: "Patient name updated." });
      fetchRecords();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update patient name.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Patient Records</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {records.length === 0 ? (
          <p className="text-muted-foreground text-sm">No patient records found.</p>
        ) : (
          records.map((record) => (
            <div
              key={record.id}
              className="border rounded-lg p-3 space-y-1 bg-muted hover:bg-background transition relative"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">{record.patientDetails.fullName || "Unnamed"}</div>
                  <div className="text-sm text-muted-foreground">
                    {record.patientDetails.email || "No email"} |{" "}
                    {new Date(record.timestamp).toLocaleDateString()}
                  </div>
                  <div className="text-sm">
                    {record.patientDetails.medicalHistory || "No history added."}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEdit(record)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(record.id)}
                  >
                    <Trash className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default MyRecords;
