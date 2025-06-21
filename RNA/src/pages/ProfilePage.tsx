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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Pencil, X, Check } from "lucide-react";

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
          setFormData(data);
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

  const getInitials = (name: string) => {
    if (!name) return "DR";
    return name.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  if (loading) return <ProfileSkeleton />;

  if (!profileData) return <div className="p-10 text-center text-xl">Profile not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-32 relative">
          <div className="absolute -bottom-16 left-6">
            <Avatar className="h-32 w-32 border-4 border-white bg-white">
              <AvatarImage src={profileData.photoURL} />
              <AvatarFallback className="text-3xl font-bold bg-white text-blue-600">
                {getInitials(profileData.name)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        
        <CardHeader className="pt-20">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl flex items-center gap-2">
                {profileData.name}
                {profileData.specialization && (
                  <Badge variant="secondary" className="text-sm">
                    {profileData.specialization}
                  </Badge>
                )}
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                {profileData.hospital && `${profileData.hospital}, `}
                {profileData.city}
              </p>
            </div>
            {!editing && (
              <Button 
                onClick={() => setEditing(true)}
                variant="outline"
                className="gap-2"
              >
                <Pencil size={16} />
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {editing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <Input 
                    name="name" 
                    value={formData.name || ""} 
                    onChange={handleChange} 
                    placeholder="Dr. John Doe" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input 
                    name="email" 
                    value={formData.email || ""} 
                    onChange={handleChange} 
                    placeholder="doctor@example.com" 
                    type="email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <Input 
                    name="phone" 
                    value={formData.phone || ""} 
                    onChange={handleChange} 
                    placeholder="+91 12345 67890" 
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Specialization</label>
                  <Input 
                    name="specialization" 
                    value={formData.specialization || ""} 
                    onChange={handleChange} 
                    placeholder="Cardiology" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Experience (years)</label>
                  <Input 
                    name="experience" 
                    value={formData.experience || ""} 
                    onChange={handleChange} 
                    placeholder="10" 
                    type="number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hospital/Clinic</label>
                  <Input 
                    name="hospital" 
                    value={formData.hospital || ""} 
                    onChange={handleChange} 
                    placeholder="General Hospital" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <Input 
                    name="city" 
                    value={formData.city || ""} 
                    onChange={handleChange} 
                    placeholder="Hyderabad" 
                  />
                </div>
              </div>
              
              <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t">
                <Button 
                  onClick={handleSave}
                  className="gap-2"
                >
                  <Check size={16} />
                  Save Changes
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setEditing(false)}
                  className="gap-2"
                >
                  <X size={16} />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <ProfileField label="Email" value={profileData.email} />
                <ProfileField label="Phone" value={profileData.phone || "Not provided"} />
                <ProfileField label="Experience" value={profileData.experience ? `${profileData.experience} years` : "Not provided"} />
              </div>
              <div className="space-y-4">
                <ProfileField label="Hospital/Clinic" value={profileData.hospital || "Not provided"} />
                <ProfileField label="Location" value={profileData.city || "Not provided"} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const ProfileField = ({ label, value }: { label: string; value: string }) => (
  <div>
    <h4 className="text-sm font-medium text-muted-foreground">{label}</h4>
    <p className="mt-1 text-lg">{value}</p>
  </div>
);

const ProfileSkeleton = () => (
  <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
    <div className="flex items-center gap-4">
      <Skeleton className="h-32 w-32 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-6 w-48" />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-full" />
          </div>
        ))}
      </div>
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-full" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ProfilePage;