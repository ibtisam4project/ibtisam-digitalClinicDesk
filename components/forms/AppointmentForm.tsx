"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  createAppointment,
  updateAppointment,
} from "@/lib/actions/appointment.actions";
import { getAppointmentSchema } from "@/lib/validation";
import { Appointment } from "@/types/appwrite.types";

import "react-datepicker/dist/react-datepicker.css";

import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { Form, FormControl } from "../ui/form";

interface AppointmentFormProps {
  userId: string;
  patientId: string;
  type: "create" | "schedule" | "cancel";
  appointment?: Appointment;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  doctors: any[];
}

const PaymentMethods = [
  { value: "cash", label: "Cash", icon: "💵" },
  { value: "easypaisa", label: "EasyPaisa", icon: "📱" },
  { value: "jazzcash", label: "JazzCash", icon: "📱" },
  { value: "bank", label: "Bank Transfer", icon: "🏦" },
];

export const AppointmentForm = ({
  userId,
  patientId,
  type = "create",
  appointment,
  setOpen,
  doctors,
}: AppointmentFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("cash");

  const AppointmentFormValidation = getAppointmentSchema(type);

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment ? appointment?.primaryPhysician : "",
      schedule: appointment
        ? new Date(appointment?.schedule!)
        : new Date(Date.now()),
      reason: appointment ? appointment.reason : "",
      note: appointment?.note || "",
      cancellationReason: appointment?.cancellationReason || "",
      ...(type === "create" && {
        paymentMethod: "cash",
        paymentAmount: 500,
        transactionId: "",
      }),
    },
  });

  const onSubmit = async (
    values: z.infer<typeof AppointmentFormValidation>
  ) => {
    setIsLoading(true);

    let status;
    switch (type) {
      case "schedule":
        status = "scheduled";
        break;
      case "cancel":
        status = "cancelled";
        break;
      default:
        status = "pending";
    }

    try {
      if (type === "create" && patientId) {
        const selectedDoctor = doctors.find(
          (doc) => doc.name === values.primaryPhysician
        );

        if (!selectedDoctor) {
          throw new Error("Selected doctor not found");
        }

        const scheduleDate = new Date(values.schedule);
        const hours = scheduleDate.getHours();
        const minutes = scheduleDate.getMinutes();
        const timeSlot = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

        const appointmentData = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          doctorId: selectedDoctor.$id,
          schedule: new Date(values.schedule),
          appointmentDate: new Date(values.schedule),
          timeSlot: timeSlot,
          reason: values.reason!,
          status: status as Status,
          note: values.note,
          fees: (values as any).paymentAmount || 500,
          paymentMethod: (values as any).paymentMethod,
          paymentAmount: (values as any).paymentAmount,
          transactionId: (values as any).transactionId || null,
        };

        const newAppointment = await createAppointment(appointmentData);

        if (newAppointment) {
          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${newAppointment.$id}`
          );
        }
      } else {
        const selectedDoctor = doctors.find(
          (doc) => doc.name === values.primaryPhysician
        );

        const appointmentToUpdate = {
          userId,
          appointmentId: appointment?.$id!,
          appointment: {
            primaryPhysician: values.primaryPhysician,
            ...(selectedDoctor && { doctorId: selectedDoctor.$id }),
            schedule: new Date(values.schedule),
            appointmentDate: new Date(values.schedule),
            status: status as Status,
            cancellationReason: values.cancellationReason,
          },
          type,
        };

        const updatedAppointment = await updateAppointment(appointmentToUpdate);

        if (updatedAppointment) {
          setOpen && setOpen(false);
          form.reset();
        }
      }
    } catch (error) {
      console.log(error);
      alert("Failed to create appointment. Please try again.");
    }
    setIsLoading(false);
  };

  let buttonLabel;
  switch (type) {
    case "cancel":
      buttonLabel = "Cancel Appointment";
      break;
    case "schedule":
      buttonLabel = "Schedule Appointment";
      break;
    default:
      buttonLabel = "Submit Appointment";
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        {type === "create" && (
          <section className="mb-12 space-y-4">
            <h1 className="header">New Appointment</h1>
            <p className="text-dark-700">
              Request a new appointment in 10 seconds.
            </p>
          </section>
        )}

        {type !== "cancel" && (
          <>
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="primaryPhysician"
              label="Doctor"
              placeholder="Select a doctor"
            >
              {doctors && doctors.length > 0 ? (
                doctors.map((doctor) => (
                  <SelectItem key={doctor.$id} value={doctor.name}>
                    <div className="flex cursor-pointer items-center gap-2">
                      <Image
                        src={doctor.image}
                        width={32}
                        height={32}
                        alt={doctor.name}
                        className="rounded-full border border-dark-500"
                      />
                      <p>Dr. {doctor.name}</p>
                    </div>
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-doctors" disabled>
                  <p className="text-dark-600">No doctors available. Please add doctors first.</p>
                </SelectItem>
              )}
            </CustomFormField>

            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Expected appointment date"
              showTimeSelect
              dateFormat="MM/dd/yyyy  -  h:mm aa"
            />

            <div
              className={`flex flex-col gap-6  ${type === "create" && "xl:flex-row"}`}
            >
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Appointment reason"
                placeholder="Annual monthly check-up"
                disabled={type === "schedule"}
              />

              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Comments/notes"
                placeholder="Prefer afternoon appointments, if possible"
                disabled={type === "schedule"}
              />
            </div>

            {type === "create" && (
              <>
                <div className="space-y-4 border-t border-dark-500 pt-6">
                  <h2 className="sub-header">Payment Information</h2>
                  
                  <div className="space-y-2">
                    <label className="text-14-medium text-dark-700">
                      Consultation Fee (PKR) *
                    </label>
                    <input
                      type="number"
                      min="100"
                      {...form.register("paymentAmount", { 
                        valueAsNumber: true 
                      })}
                      className="shad-input"
                      placeholder="500"
                    />
                    {form.formState.errors.paymentAmount && (
                      <p className="shad-error">
                        {form.formState.errors.paymentAmount.message}
                      </p>
                    )}
                  </div>

                  <CustomFormField
                    fieldType={FormFieldType.SKELETON}
                    control={form.control}
                    name="paymentMethod"
                    label="Payment Method *"
                    renderSkeleton={(field) => (
                      <FormControl>
                        <RadioGroup
                          className="flex flex-col gap-4"
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedPayment(value);
                          }}
                          defaultValue={field.value}
                        >
                          {PaymentMethods.map((method) => (
                            <div
                              key={method.value}
                              className="flex items-center space-x-3 border border-dark-500 rounded-md p-4 hover:border-dark-700 transition-colors cursor-pointer"
                            >
                              <RadioGroupItem
                                value={method.value}
                                id={method.value}
                              />
                              <Label
                                htmlFor={method.value}
                                className="flex items-center gap-3 cursor-pointer flex-1"
                              >
                                <span className="text-24">{method.icon}</span>
                                <span className="text-14-medium">{method.label}</span>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                    )}
                  />

                  {/* Transaction ID for Digital Payments */}
                  {selectedPayment !== "cash" && (
                    <div className="space-y-2">
                      <label className="text-14-medium text-dark-700">
                        Transaction ID *
                      </label>
                      <input
                        type="text"
                        {...form.register("transactionId")}
                        className="shad-input"
                        placeholder="Enter transaction ID"
                        required={selectedPayment !== "cash"}
                      />
                      <p className="text-12-regular text-dark-600">
                        Please enter the transaction ID from {selectedPayment === "easypaisa" ? "EasyPaisa" : selectedPayment === "jazzcash" ? "JazzCash" : "your bank transfer"}
                      </p>
                      {form.formState.errors.transactionId && (
                        <p className="shad-error">
                          {form.formState.errors.transactionId.message}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="bg-dark-400 p-4 rounded-md">
                    <p className="text-14-regular text-dark-700">
                      💡 <strong>Note:</strong> {selectedPayment === "cash" ? "Pay at the clinic on appointment day" : "Payment will be verified before your appointment is confirmed"}
                    </p>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {type === "cancel" && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="Urgent meeting came up"
          />
        )}

        <SubmitButton
          isLoading={isLoading}
          className={`${type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"} w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};