import React, { useEffect, useState } from "react";
import {
  auth,
  db,
  doc,
  getDoc,
  updateDoc
} from "@/firebase";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate("/auth");
        return;
      }

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfileData(data);
          setFormData(data); // pre-fill edit form
        }
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      await updateDoc(doc(db, "users", user.uid), formData);
      setProfileData(formData);
      setEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  if (loading) return <div className="p-10 text-center text-xl">Loading...</div>;

  if (!profileData) return <div className="p-10 text-center text-xl">Profile not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Doctor Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {editing ? (
            <>
              <Input name="name" value={formData.name || ""} onChange={handleChange} placeholder="Name" />
              <Input name="email" value={formData.email || ""} onChange={handleChange} placeholder="Email" />
              <Input name="phone" value={formData.phone || ""} onChange={handleChange} placeholder="Phone" />
              <Input name="specialization" value={formData.specialization || ""} onChange={handleChange} placeholder="Specialization" />
              <Input name="experience" value={formData.experience || ""} onChange={handleChange} placeholder="Experience (years)" />
              <Input name="hospital" value={formData.hospital || ""} onChange={handleChange} placeholder="Hospital/Clinic" />
              <Input name="city" value={formData.city || ""} onChange={handleChange} placeholder="City" />

              <div className="flex gap-3">
                <Button onClick={handleSave}>Save</Button>
                <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            </>
          ) : (
            <>
              <p><strong>Name:</strong> {profileData.name}</p>
              <p><strong>Email:</strong> {profileData.email}</p>
              <p><strong>Phone:</strong> {profileData.phone || "N/A"}</p>
              <p><strong>Specialization:</strong> {profileData.specialization || "N/A"}</p>
              <p><strong>Experience:</strong> {profileData.experience || "N/A"} years</p>
              <p><strong>Hospital:</strong> {profileData.hospital || "N/A"}</p>
              <p><strong>City:</strong> {profileData.city || "N/A"}</p>

              <Button onClick={() => setEditing(true)} className="mt-4">Edit Profile</Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
