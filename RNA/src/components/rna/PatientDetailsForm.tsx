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
        <CardTitle className="text-xl font-bold text-primary">Patient Clinical Intake Form</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Information */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-muted-foreground">
              <User className="h-5 w-5" />
              Personal Details
            </h3>

            <div className="grid gap-3">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                value={patientDetails.fullName}
                onChange={handlePatientDetailChange}
                placeholder="Dr. John Doe"
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={patientDetails.dateOfBirth}
                onChange={handlePatientDetailChange}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                name="gender"
                value={patientDetails.gender}
                onChange={handlePatientDetailChange}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:ring-2 focus-visible:ring-primary"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={patientDetails.phone}
                onChange={handlePatientDetailChange}
                placeholder="+91 9876543210"
              />
            </div>

            <div className="grid gap-3">
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

            <div className="grid gap-3">
              <Label htmlFor="address">Residential Address</Label>
              <Textarea
                id="address"
                name="address"
                value={patientDetails.address}
                onChange={handlePatientDetailChange}
                placeholder="Street, City, State, Country"
                rows={2}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
              <Input
                id="emergencyContact"
                name="emergencyContact"
                value={patientDetails.emergencyContact}
                onChange={handlePatientDetailChange}
                placeholder="Jane Doe"
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
              <Input
                id="emergencyPhone"
                name="emergencyPhone"
                type="tel"
                value={patientDetails.emergencyPhone}
                onChange={handlePatientDetailChange}
                placeholder="+91 1234567890"
              />
            </div>
          </section>

          {/* Medical Information */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-muted-foreground">
              <HeartPulse className="h-5 w-5" />
              Clinical History
            </h3>

            <div className="grid gap-3">
              <Label htmlFor="medicalHistory">Medical History</Label>
              <Textarea
                id="medicalHistory"
                name="medicalHistory"
                value={patientDetails.medicalHistory}
                onChange={handlePatientDetailChange}
                placeholder="E.g. Hypertension, Diabetes..."
                rows={3}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="presentingComplaints">Presenting Complaints</Label>
              <Textarea
                id="presentingComplaints"
                name="presentingComplaints"
                value={patientDetails.presentingComplaints}
                onChange={handlePatientDetailChange}
                placeholder="Symptoms or reasons for visit..."
                rows={2}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="currentMedications">Current Medications</Label>
              <Textarea
                id="currentMedications"
                name="currentMedications"
                value={patientDetails.currentMedications}
                onChange={handlePatientDetailChange}
                placeholder="Name, dose, frequency..."
                rows={2}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="allergies">Allergies</Label>
              <Textarea
                id="allergies"
                name="allergies"
                value={patientDetails.allergies}
                onChange={handlePatientDetailChange}
                placeholder="E.g. Penicillin, peanuts..."
                rows={2}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="pastSurgeries">Past Surgeries</Label>
              <Textarea
                id="pastSurgeries"
                name="pastSurgeries"
                value={patientDetails.pastSurgeries}
                onChange={handlePatientDetailChange}
                placeholder="Surgery name, date..."
                rows={2}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="immunizations">Immunization Records</Label>
              <Textarea
                id="immunizations"
                name="immunizations"
                value={patientDetails.immunizations}
                onChange={handlePatientDetailChange}
                placeholder="Vaccines with dates..."
                rows={2}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="familyHistory">Family Medical History</Label>
              <Textarea
                id="familyHistory"
                name="familyHistory"
                value={patientDetails.familyHistory}
                onChange={handlePatientDetailChange}
                placeholder="Hereditary conditions if any..."
                rows={3}
              />
            </div>
          </section>
        </div>

        <div className="pt-6 flex justify-end gap-4">
          <Button onClick={handleSubmitPatientData} variant="secondary">
            Save Patient Info
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