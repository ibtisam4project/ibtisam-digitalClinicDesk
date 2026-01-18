"use client";
import { AppointmentModalWrapper } from "../AppointmentModalWrapper";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

import { formatDateTime } from "@/lib/utils";
import { Appointment } from "@/types/appwrite.types";

import { AppointmentModal } from "../AppointmentModal";
import { PaymentConfirmationModal } from "../PaymentConfirmationModal";
import { StatusBadge } from "../StatusBadge";

export const columns: ColumnDef<Appointment>[] = [
  {
    header: "#",
    cell: ({ row }) => {
      return <p className="text-14-medium ">{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <p className="text-14-medium">
          {appointment.patient?.name ?? "N/A"}
        </p>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <div className="min-w-[115px]">
          <StatusBadge status={appointment.status} />
        </div>
      );
    },
  },
  {
    accessorKey: "schedule",
    header: "Appointment",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <p className="text-14-regular min-w-[100px]">
          {formatDateTime(appointment.schedule).dateTime}
        </p>
      );
    },
  },
  {
    accessorKey: "primaryPhysician",
    header: "Doctor",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <div className="flex items-center gap-3">
          <p className="whitespace-nowrap">Dr. {appointment.primaryPhysician}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment",
    cell: ({ row }) => {
      const appointment = row.original;
      
      const paymentIcons: any = {
        cash: "💵",
        easypaisa: "📱",
        jazzcash: "📱",
        bank: "🏦",
      };

      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span>{paymentIcons[appointment.paymentMethod] || "💳"}</span>
            <p className="text-14-medium capitalize">
              {appointment.paymentMethod || "N/A"}
            </p>
          </div>
          {appointment.paymentAmount && (
            <p className="text-12-regular text-dark-600">
              Rs. {appointment.paymentAmount}
            </p>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row }) => {
      const appointment = row.original;
      if (!appointment.patient) return null;

      return (
        <div className="flex gap-1">
          <AppointmentModalWrapper
              patientId={appointment.patient.$id}
              userId={appointment.userId}
              appointment={appointment}
              type="schedule"
              title="Schedule Appointment"
              description="Please confirm the following details to schedule."
            />
            <AppointmentModalWrapper
              patientId={appointment.patient.$id}
              userId={appointment.userId}
              appointment={appointment}
              type="cancel"
              title="Cancel Appointment"
              description="Are you sure you want to cancel your appointment?"
            />
          {appointment.paymentMethod && (
            <PaymentConfirmationModal appointment={appointment} />
          )}
        </div>
      );
    },
  },
];