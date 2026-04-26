import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { Card } from "../components/ui/card";
import { ArrowLeft, ClipboardList } from "lucide-react";

export default function PatientHistory() {
  const navigate = useNavigate();
  const { setPatientHistory } = useApp();

  const [formData, setFormData] = useState({
    patientName: "",
    age: "",
    contact: "",
    bodyTemperature: "",
    bloodPressureSystolic: "",
    bloodPressureDiastolic: "",
    heartRate: "",
    height: "",
    weight: "",
    bmi: "",
    chiefComplaint: "",
    allergiesDrug: false,
    allergiesFood: false,
    allergiesEnvironmental: false,
    allergyDetails: "",
    onsetDuration: "",
    severity: "",
    pastMedicalHistory: "",
    pastSurgicalHistory: "",
    familyMedicalHistory: "",
    smoking: "",
    alcohol: "",
    diet: "",
  });

  const calculateBMI = () => {
    const heightM = parseFloat(formData.height) / 100;
    const weightKg = parseFloat(formData.weight);
    if (heightM > 0 && weightKg > 0) {
      const bmi = (weightKg / (heightM * heightM)).toFixed(2);
      setFormData({ ...formData, bmi });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPatientHistory(formData);
    navigate("/dashboard/model-selection");
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-4">
        <Button onClick={() => navigate("/dashboard")} variant="outline" className="rounded-lg">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-semibold text-slate-800">Patient History Assessment</h1>
      </div>

      <Card className="p-8 bg-white border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-teal-100 rounded-xl flex items-center justify-center">
            <ClipboardList className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Pre-Diagnosis Assessment</h2>
            <p className="text-sm text-slate-600">Complete patient information before prediction</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Patient Information */}
          <div className="space-y-4">
            <h3 className="text-md font-semibold text-slate-800 border-b pb-2">Basic Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="patientName">Patient Name *</Label>
                <Input
                  id="patientName"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  className="rounded-lg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Age *</Label>
                <Select value={formData.age} onValueChange={(value) => setFormData({ ...formData, age: value })} required>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select age range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="18-25">18-25</SelectItem>
                    <SelectItem value="26-35">26-35</SelectItem>
                    <SelectItem value="36-45">36-45</SelectItem>
                    <SelectItem value="46-55">46-55</SelectItem>
                    <SelectItem value="56-65">56-65</SelectItem>
                    <SelectItem value="66-75">66-75</SelectItem>
                    <SelectItem value="76+">76+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number *</Label>
                <Input
                  id="contact"
                  type="tel"
                  placeholder="e.g., +1234567890"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="rounded-lg"
                  required
                />
              </div>
            </div>
          </div>

          {/* Vital Signs */}
          <div className="space-y-4">
            <h3 className="text-md font-semibold text-slate-800 border-b pb-2">Vital Signs</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Body Temperature (°F) *</Label>
                <Select
                  value={formData.bodyTemperature}
                  onValueChange={(value) => setFormData({ ...formData, bodyTemperature: value })}
                  required
                >
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select temperature" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="97-98">97-98°F (Normal)</SelectItem>
                    <SelectItem value="98-99">98-99°F (Normal)</SelectItem>
                    <SelectItem value="99-100">99-100°F (Slight fever)</SelectItem>
                    <SelectItem value="100-101">100-101°F (Fever)</SelectItem>
                    <SelectItem value="101+">101°F+ (High fever)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloodPressureSystolic">Blood Pressure (Systolic) *</Label>
                <Input
                  id="bloodPressureSystolic"
                  type="number"
                  placeholder="e.g., 120"
                  value={formData.bloodPressureSystolic}
                  onChange={(e) => setFormData({ ...formData, bloodPressureSystolic: e.target.value })}
                  className="rounded-lg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloodPressureDiastolic">Blood Pressure (Diastolic) *</Label>
                <Input
                  id="bloodPressureDiastolic"
                  type="number"
                  placeholder="e.g., 80"
                  value={formData.bloodPressureDiastolic}
                  onChange={(e) => setFormData({ ...formData, bloodPressureDiastolic: e.target.value })}
                  className="rounded-lg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Heart Rate (BPM) *</Label>
                <Select
                  value={formData.heartRate}
                  onValueChange={(value) => setFormData({ ...formData, heartRate: value })}
                  required
                >
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select heart rate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="40-60">40-60 (Low)</SelectItem>
                    <SelectItem value="60-80">60-80 (Normal)</SelectItem>
                    <SelectItem value="80-100">80-100 (Normal)</SelectItem>
                    <SelectItem value="100-120">100-120 (Elevated)</SelectItem>
                    <SelectItem value="120+">120+ (High)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">Height (cm) *</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="e.g., 165"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  onBlur={calculateBMI}
                  className="rounded-lg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg) *</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="e.g., 65"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  onBlur={calculateBMI}
                  className="rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="bmi">Body Mass Index (BMI)</Label>
                <Input
                  id="bmi"
                  value={formData.bmi}
                  placeholder="Auto-calculated"
                  className="rounded-lg bg-slate-50"
                  readOnly
                />
                {formData.bmi && (
                  <p className="text-xs text-slate-600">
                    {parseFloat(formData.bmi) < 18.5
                      ? "Underweight"
                      : parseFloat(formData.bmi) < 25
                      ? "Normal weight"
                      : parseFloat(formData.bmi) < 30
                      ? "Overweight"
                      : "Obese"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Chief Complaint */}
          <div className="space-y-4">
            <h3 className="text-md font-semibold text-slate-800 border-b pb-2">Chief Complaint</h3>
            <div className="space-y-2">
              <Label>Primary Symptom *</Label>
              <Select
                value={formData.chiefComplaint}
                onValueChange={(value) => setFormData({ ...formData, chiefComplaint: value })}
                required
              >
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Select primary symptom" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breast-lump">Breast Lump</SelectItem>
                  <SelectItem value="breast-pain">Breast Pain</SelectItem>
                  <SelectItem value="nipple-discharge">Nipple Discharge</SelectItem>
                  <SelectItem value="skin-changes">Skin Changes</SelectItem>
                  <SelectItem value="swelling">Swelling</SelectItem>
                  <SelectItem value="routine-screening">Routine Screening</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Allergies */}
          <div className="space-y-4">
            <h3 className="text-md font-semibold text-slate-800 border-b pb-2">Allergies</h3>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="allergiesDrug"
                    checked={formData.allergiesDrug}
                    onCheckedChange={(checked) => setFormData({ ...formData, allergiesDrug: checked as boolean })}
                  />
                  <Label htmlFor="allergiesDrug" className="cursor-pointer">
                    Drug Allergies
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="allergiesFood"
                    checked={formData.allergiesFood}
                    onCheckedChange={(checked) => setFormData({ ...formData, allergiesFood: checked as boolean })}
                  />
                  <Label htmlFor="allergiesFood" className="cursor-pointer">
                    Food Allergies
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="allergiesEnvironmental"
                    checked={formData.allergiesEnvironmental}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, allergiesEnvironmental: checked as boolean })
                    }
                  />
                  <Label htmlFor="allergiesEnvironmental" className="cursor-pointer">
                    Environmental Allergies
                  </Label>
                </div>
              </div>

              {(formData.allergiesDrug || formData.allergiesFood || formData.allergiesEnvironmental) && (
                <div className="space-y-2">
                  <Label htmlFor="allergyDetails">Allergy Details</Label>
                  <Input
                    id="allergyDetails"
                    placeholder="Please specify allergens"
                    value={formData.allergyDetails}
                    onChange={(e) => setFormData({ ...formData, allergyDetails: e.target.value })}
                    className="rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          {/* History of Present Illness */}
          <div className="space-y-4">
            <h3 className="text-md font-semibold text-slate-800 border-b pb-2">History of Present Illness</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Onset & Duration *</Label>
                <Select
                  value={formData.onsetDuration}
                  onValueChange={(value) => setFormData({ ...formData, onsetDuration: value })}
                  required
                >
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="less-1-week">Less than 1 week</SelectItem>
                    <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                    <SelectItem value="2-4-weeks">2-4 weeks</SelectItem>
                    <SelectItem value="1-3-months">1-3 months</SelectItem>
                    <SelectItem value="3-6-months">3-6 months</SelectItem>
                    <SelectItem value="6-months+">6+ months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Severity *</Label>
                <Select
                  value={formData.severity}
                  onValueChange={(value) => setFormData({ ...formData, severity: value })}
                  required
                >
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mild">Mild</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="severe">Severe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Medical History */}
          <div className="space-y-4">
            <h3 className="text-md font-semibold text-slate-800 border-b pb-2">Medical History</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Past Medical History *</Label>
                <Select
                  value={formData.pastMedicalHistory}
                  onValueChange={(value) => setFormData({ ...formData, pastMedicalHistory: value })}
                  required
                >
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="diabetes">Diabetes</SelectItem>
                    <SelectItem value="hypertension">Hypertension</SelectItem>
                    <SelectItem value="heart-disease">Heart Disease</SelectItem>
                    <SelectItem value="cancer-history">Previous Cancer</SelectItem>
                    <SelectItem value="multiple">Multiple Conditions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Past Surgical History *</Label>
                <Select
                  value={formData.pastSurgicalHistory}
                  onValueChange={(value) => setFormData({ ...formData, pastSurgicalHistory: value })}
                  required
                >
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="breast-surgery">Previous Breast Surgery</SelectItem>
                    <SelectItem value="biopsy">Biopsy</SelectItem>
                    <SelectItem value="other-surgery">Other Surgery</SelectItem>
                    <SelectItem value="multiple">Multiple Surgeries</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Family Medical History *</Label>
                <Select
                  value={formData.familyMedicalHistory}
                  onValueChange={(value) => setFormData({ ...formData, familyMedicalHistory: value })}
                  required
                >
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No family history</SelectItem>
                    <SelectItem value="breast-cancer">Breast Cancer</SelectItem>
                    <SelectItem value="ovarian-cancer">Ovarian Cancer</SelectItem>
                    <SelectItem value="other-cancer">Other Cancer Types</SelectItem>
                    <SelectItem value="multiple">Multiple Cancer History</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Social History */}
          <div className="space-y-4">
            <h3 className="text-md font-semibold text-slate-800 border-b pb-2">Social History</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Smoking Status *</Label>
                <Select
                  value={formData.smoking}
                  onValueChange={(value) => setFormData({ ...formData, smoking: value })}
                  required
                >
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never</SelectItem>
                    <SelectItem value="former">Former Smoker</SelectItem>
                    <SelectItem value="current-light">Current (Light)</SelectItem>
                    <SelectItem value="current-moderate">Current (Moderate)</SelectItem>
                    <SelectItem value="current-heavy">Current (Heavy)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Alcohol Consumption *</Label>
                <Select
                  value={formData.alcohol}
                  onValueChange={(value) => setFormData({ ...formData, alcohol: value })}
                  required
                >
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never</SelectItem>
                    <SelectItem value="occasional">Occasional</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="frequent">Frequent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Diet *</Label>
                <Select value={formData.diet} onValueChange={(value) => setFormData({ ...formData, diet: value })} required>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="balanced">Balanced Diet</SelectItem>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="high-fat">High Fat</SelectItem>
                    <SelectItem value="low-fat">Low Fat</SelectItem>
                    <SelectItem value="irregular">Irregular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 rounded-lg"
            >
              Continue to Model Selection
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
