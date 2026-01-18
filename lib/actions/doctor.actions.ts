// lib/actions/doctor.actions.ts
"use server";

import { ID, Query, InputFile } from "node-appwrite";
import { databases, storage } from "../appwrite.config";
import { parseStringify } from "../utils";

export const createDoctor = async (formData: FormData) => {
  try {
    const name = formData.get("name") as string;
    const speciality = formData.get("speciality") as string;
    const imageFile = formData.get("image") as File;

    console.log("Starting doctor creation...");
    console.log("Doctor name:", name);
    console.log("Doctor speciality:", speciality);
    
    if (!imageFile || !name || !speciality) {
      throw new Error("Missing required fields");
    }

    // Convert File to Buffer for Appwrite
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log("File converted to buffer, size:", buffer.length);

    // 1. Upload image to Appwrite storage
    const inputFile = InputFile.fromBuffer(
      buffer,
      imageFile.name
    );

    console.log("Uploading to bucket:", process.env.NEXT_PUBLIC_BUCKET_ID);
    
    const file = await storage.createFile(
      process.env.NEXT_PUBLIC_BUCKET_ID!,
      ID.unique(),
      inputFile
    );

    console.log("File uploaded successfully, ID:", file.$id);

    // 2. Get image URL
    const imageUrl = `${process.env.NEXT_PUBLIC_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_BUCKET_ID}/files/${file.$id}/view?project=${process.env.PROJECT_ID}`;

    console.log("Image URL:", imageUrl);
    console.log("Creating document in collection:", process.env.DOCTOR_COLLECTION_ID);

    // 3. Create doctor document in database
    const newDoctor = await databases.createDocument(
      process.env.DATABASE_ID!,
      process.env.DOCTOR_COLLECTION_ID!,
      ID.unique(),
      {
        name: name,
        speciality: speciality,
        image: imageUrl,
        imageId: file.$id,
      }
    );

    console.log("Doctor created successfully:", newDoctor.$id);
    return parseStringify(newDoctor);
  } catch (error: any) {
    console.error("Detailed error creating doctor:", error);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Error type:", error.type);
    throw new Error(`Failed to create doctor: ${error.message || error}`);
  }
};

// Get all doctors from Appwrite
export const getDoctors = async () => {
  try {
    console.log("Fetching doctors from collection:", process.env.DOCTOR_COLLECTION_ID);
    
    const doctors = await databases.listDocuments(
      process.env.DATABASE_ID!,
      process.env.DOCTOR_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    );

    console.log("Doctors fetched successfully:", doctors.documents.length);
    return parseStringify(doctors.documents);
  } catch (error: any) {
    console.error("Error fetching doctors:", error);
    console.error("Error details:", error.message, error.code, error.type);
    // Return empty array instead of undefined
    return [];
  }
};

export const deleteDoctor = async (doctorId: string, imageId: string) => {
  try {
    // Delete image from storage
    await storage.deleteFile(process.env.NEXT_PUBLIC_BUCKET_ID!, imageId);

    // Delete doctor document
    await databases.deleteDocument(
      process.env.DATABASE_ID!,
      process.env.DOCTOR_COLLECTION_ID!,
      doctorId
    );

    return { success: true };
  } catch (error) {
    console.error("Error deleting doctor:", error);
    throw error;
  }
};