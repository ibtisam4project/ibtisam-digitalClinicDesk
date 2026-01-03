export const GenderOptions = ["Male", "Female", "Other"];

export const PatientFormDefaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  birthDate: new Date(Date.now()),
  gender: "Male" as Gender,
  address: "",
  occupation: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  primaryPhysician: "",
  insuranceProvider: "",
  insurancePolicyNumber: "",
  allergies: "",
  currentMedication: "",
  familyMedicalHistory: "",
  pastMedicalHistory: "",
  identificationType: "Birth Certificate",
  identificationNumber: "",
  identificationDocument: [],
  treatmentConsent: false,
  disclosureConsent: false,
  privacyConsent: false,
};

export const IdentificationTypes = [
  "Birth Certificate",
  "Driver's License",
  "Medical Insurance Card/Policy",
  "Military ID Card",
  "National Identity Card",
  "Passport",
  "Resident Alien Card (Green Card)",
  "Social Security Card",
  "State ID Card",
  "Student ID Card",
  "Voter ID Card",
];

export const Doctors = [
  {
    image: "/assets/images/r.png",
    name: "Dr Rizwan - ENT Specialist",
  },
  {
    image: "/assets/images/m.png",
    name: "Dr Mubeen - Cardiologist",
  },
  {
    image: "/assets/images/s.png",
    name: "Dr Shahzeb - Dermatologist",
  },
  {
    image: "/assets/images/a.png",
    name: "Dr Arsalan - Orthopedic Surgeon",
  },
  {
    image: "/assets/images/f.png",
    name: "Dr Faraz - Pediatrician",
  },
  {
    image: "/assets/images/w.png",
    name: "Dr Riaz - General Physician",
  },
  {
    image: "/assets/images/n.png",
    name: "Dr johny - Neurologist",
  },
  {
    image: "/assets/images/q.png",
    name: "Dr Qadeer - Ophthalmologist",
  },
  {
    image: "/assets/images/dr-peter.png",
    name: "Dr Naveed - Oncologist",
  },
];

export const StatusIcon = {
  scheduled: "/assets/icons/check.svg",
  pending: "/assets/icons/pending.svg",
  cancelled: "/assets/icons/cancelled.svg",
};