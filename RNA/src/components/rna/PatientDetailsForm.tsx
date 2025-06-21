// src/components/rna/PatientDetailsForm.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { User, Phone, MapPin, HeartPulse, ClipboardList, Pill, AlertCircle, Syringe, Users } from "lucide-react";

interface PatientDetailsFormProps {
  patientDetails: any;
  handlePatientDetailChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmitPatientData: () => void;
  setMode: (mode: string) => void;
}

const PatientDetailsForm = ({
  patientDetails,
  handlePatientDetailChange,
  handleSubmitPatientData,
  setMode
}: PatientDetailsFormProps) => {
  return (
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
  );
};

export default PatientDetailsForm;