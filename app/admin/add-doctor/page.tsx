// app/admin/add-doctor/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createDoctor } from "@/lib/actions/doctor.actions";

const AddDoctorPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    speciality: "",
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.image) {
        alert("Please select an image");
        setIsLoading(false);
        return;
      }

      // Convert File to FormData to pass to server action
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("speciality", formData.speciality);
      formDataToSend.append("image", formData.image);

      await createDoctor(formDataToSend);

      alert("Doctor added successfully!");
      router.push("/admin");
    } catch (error: any) {
      console.error("Error adding doctor:", error);
      alert(`Failed to add doctor: ${error.message || "Please try again"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14 px-4 py-10">
      <header className="admin-header">
        <Link href="/admin" className="cursor-pointer">
          <Image
            src="/assets/icons/logo-full.png"
            height={32}
            width={162}
            alt="logo"
            className="h-8 w-fit"
          />
        </Link>
        <p className="text-16-semibold">Add New Doctor</p>
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Doctor Registration</h1>
          <p className="text-dark-700">
            Fill in the details to add a new doctor to the system
          </p>
        </section>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-14-medium text-dark-700">
              Doctor Image *
            </label>
            <div className="flex items-center gap-6">
              <div className="relative h-32 w-32 rounded-full overflow-hidden border-2 border-dark-500 bg-dark-400">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Doctor preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Image
                      src="/assets/icons/upload.svg"
                      width={40}
                      height={40}
                      alt="upload"
                      className="opacity-50"
                    />
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor="image-upload"
                  className="shad-primary-btn cursor-pointer inline-block"
                >
                  {imagePreview ? "Change Image" : "Upload Image"}
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  required
                />
                <p className="text-12-regular text-dark-600 mt-2">
                  JPG, PNG or JPEG (max 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Doctor Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-14-medium text-dark-700">
              Doctor Name *
            </label>
            <input
              id="name"
              type="text"
              placeholder="Dr. John Doe"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="shad-input"
              required
            />
          </div>

          {/* Speciality */}
          <div className="space-y-2">
            <label
              htmlFor="speciality"
              className="text-14-medium text-dark-700"
            >
              Speciality *
            </label>
            <select
              id="speciality"
              value={formData.speciality}
              onChange={(e) =>
                setFormData({ ...formData, speciality: e.target.value })
              }
              className="shad-select"
              required
            >
              <option value="">Select a speciality</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Neurology">Neurology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Psychiatry">Psychiatry</option>
              <option value="Radiology">Radiology</option>
              <option value="Surgery">Surgery</option>
              <option value="General Practice">General Practice</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="shad-primary-btn flex-1"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Adding Doctor...
                </div>
              ) : (
                "Add Doctor"
              )}
            </button>
            <Link
              href="/admin"
              className="shad-gray-btn flex-1 text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddDoctorPage;