"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Appointment } from "@/types/appwrite.types";

interface PaymentConfirmationModalProps {
  appointment: Appointment;
}

export const PaymentConfirmationModal = ({
  appointment,
}: PaymentConfirmationModalProps) => {
  const [open, setOpen] = useState(false);

  const paymentDetails = {
    cash: {
      icon: "💵",
      label: "Cash Payment",
      color: "bg-green-500/10 border-green-500",
    },
    easypaisa: {
      icon: "📱",
      label: "EasyPaisa",
      color: "bg-blue-500/10 border-blue-500",
    },
    jazzcash: {
      icon: "📱",
      label: "JazzCash",
      color: "bg-orange-500/10 border-orange-500",
    },
    bank: {
      icon: "🏦",
      label: "Bank Transfer",
      color: "bg-purple-500/10 border-purple-500",
    },
  };

  const payment = paymentDetails[appointment.paymentMethod as keyof typeof paymentDetails] || {
    icon: "💳",
    label: "Unknown",
    color: "bg-gray-500/10 border-gray-500",
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="capitalize text-green-500 hover:text-green-600"
        >
          💰 View Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog sm:max-w-md">
        <DialogHeader className="mb-4 space-y-3">
          <DialogTitle className="capitalize">Payment Details</DialogTitle>
          <DialogDescription>
            Review payment information for this appointment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Payment Method Card */}
          <div className={`border-2 rounded-lg p-6 ${payment.color}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{payment.icon}</span>
                <div>
                  <p className="text-16-semibold">{payment.label}</p>
                  <p className="text-14-regular text-dark-600">
                    Payment Method
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-dashed border-dark-500 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-14-regular text-dark-700">Amount:</span>
                <span className="text-24-bold text-green-500">
                  Rs. {appointment.paymentAmount || 0}
                </span>
              </div>
              
              {/* Transaction ID */}
              {appointment.transactionId && appointment.paymentMethod !== "cash" && (
                <div className="pt-2 border-t border-dashed border-dark-500">
                  <p className="text-12-regular text-dark-600 mb-1">Transaction ID:</p>
                  <div className="bg-dark-400 p-2 rounded">
                    <p className="text-14-medium font-mono break-all">
                      {appointment.transactionId}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Patient Info */}
          <div className="bg-dark-300 rounded-lg p-4 space-y-3">
            <h3 className="text-14-semibold">Patient Information</h3>
            <div className="space-y-2 text-14-regular">
              <div className="flex justify-between">
                <span className="text-dark-600">Name:</span>
                <span className="text-dark-700 font-medium">
                  {appointment.patient?.name || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-600">Phone:</span>
                <span className="text-dark-700 font-medium">
                  {appointment.patient?.phone || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-600">Doctor:</span>
                <span className="text-dark-700 font-medium">
                  Dr. {appointment.primaryPhysician}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Status Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              className="shad-primary-btn flex-1"
              onClick={() => {
                alert("Payment confirmed!");
                setOpen(false);
              }}
            >
              ✓ Confirm Payment
            </Button>
            <Button
              variant="outline"
              className="shad-gray-btn flex-1"
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </div>

          {/* Payment Instructions */}
          {appointment.paymentMethod !== "cash" && (
            <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-4">
              <p className="text-12-regular text-blue-600">
                💡 <strong>Note:</strong> Verify the transaction ID before confirming the appointment.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};