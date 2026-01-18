"use client";

import { useEffect, useState } from "react";
import { AppointmentModal } from "./AppointmentModal";
import { getDoctors } from "@/lib/actions/doctor.actions";

export const AppointmentModalWrapper = (props: any) => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      const fetchedDoctors = await getDoctors();
      setDoctors(fetchedDoctors || []);
    };
    fetchDoctors();
  }, []);

  return <AppointmentModal {...props} doctors={doctors} />;
};