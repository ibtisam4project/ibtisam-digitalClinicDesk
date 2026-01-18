// lib/validation.ts
import { z } from "zod";

// Name validation - only letters and spaces
const nameValidation = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be less than 50 characters")
  .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces");

// Pakistani phone number validation - accepts multiple formats
const phoneValidation = z
  .string()
  .refine(
    (phone) => {
      // Remove all spaces, dashes, and parentheses
      const cleaned = phone.replace(/[\s\-\(\)]/g, "");
      
      // Accept formats:
      // +923001234567 (with +92)
      // 923001234567 (without +)
      // 03001234567 (without country code)
      return (
        /^\+92\d{10}$/.test(cleaned) || // +92 followed by 10 digits
        /^92\d{10}$/.test(cleaned) ||   // 92 followed by 10 digits
        /^03\d{9}$/.test(cleaned)        // 03 followed by 9 digits
      );
    },
    {
      message: "Invalid phone number. Use: +92 3XX XXXXXXX or 03XX XXXXXXX",
    }
  );

export const UserFormValidation = z.object({
  name: nameValidation,
  email: z.string().email("Invalid email address"),
  phone: phoneValidation,
});

export const PatientFormValidation = z.object({
  name: nameValidation,
  email: z.string().email("Invalid email address"),
  phone: phoneValidation,
  birthDate: z.coerce.date(),
  gender: z.enum(["Male", "Female"]),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address must be less than 500 characters"),
  occupation: z
    .string()
    .min(2, "Occupation must be at least 2 characters")
    .max(500, "Occupation must be less than 500 characters"),
  emergencyContactName: nameValidation,
  emergencyContactNumber: phoneValidation,
  primaryPhysician: z.string().min(2, "Select at least one doctor"),
  insuranceProvider: z
    .string()
    .min(2, "Insurance provider name must be at least 2 characters")
    .max(50, "Insurance provider name must be less than 50 characters"),
  insurancePolicyNumber: z
    .string()
    .min(2, "Policy number must be at least 2 characters")
    .max(50, "Policy number must be less than 50 characters"),
  allergies: z.string().optional(),
  currentMedication: z.string().optional(),
  familyMedicalHistory: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
  identificationType: z.string().optional(),
  identificationNumber: z.string().optional(),
  identificationDocument: z.custom<File[]>().optional(),
  treatmentConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to treatment in order to proceed",
    }),
  disclosureConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to disclosure in order to proceed",
    }),
  privacyConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to privacy in order to proceed",
    }),
});

export const CreateAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Select at least one doctor"),
  schedule: z.coerce.date(),
  reason: z
    .string()
    .min(2, "Reason must be at least 2 characters")
    .max(500, "Reason must be less than 500 characters"),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
  paymentMethod: z.enum(["cash", "easypaisa", "jazzcash", "bank"], {
    required_error: "Please select a payment method",
  }),
  paymentAmount: z.number().min(100, "Minimum payment amount is Rs. 100"),
  transactionId: z.string().optional(),
});

export const ScheduleAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Select at least one doctor"),
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const CancelAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Select at least one doctor"),
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z
    .string()
    .min(2, "Reason must be at least 2 characters")
    .max(500, "Reason must be less than 500 characters"),
});

export function getAppointmentSchema(type: string) {
  switch (type) {
    case "create":
      return CreateAppointmentSchema;
    case "cancel":
      return CancelAppointmentSchema;
    default:
      return ScheduleAppointmentSchema;
  }
}