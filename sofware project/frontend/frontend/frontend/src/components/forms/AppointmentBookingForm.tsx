"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useRouter, useLocale } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAppointment, type CreateAppointmentData } from "@/lib/api/appointments";
import { getDoctors, getServices, getAvailableSlots, type Doctor, type Service } from "@/lib/api/doctors";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Checkbox } from "@/components/ui/Checkbox";
import { FileUpload } from "./FileUpload";
import { DateTimePicker } from "./DateTimePicker";
import { Modal } from "@/components/ui/Modal";
import { Calendar, Clock, User, FileText, CheckCircle2 } from "lucide-react";
import { format, addDays } from "date-fns";
import axiosInstance from "@/lib/api/axios";

// Zod validation schema
const appointmentBookingSchema = z
  .object({
    serviceId: z.string().min(1, "Service type is required"),
    doctorId: z.string().min(1, "Doctor is required"),
    date: z.date({ required_error: "Date is required" }),
    time: z.string().min(1, "Time is required"),
    reason: z.string().optional(),
    files: z.array(z.instanceof(File)).optional(),
    gdprConsent: z.boolean().refine((val) => val === true, {
      message: "You must consent to GDPR data processing",
    }),
  })
  .refine(
    (data) => {
      // Ensure date is not in the past
      const selectedDateTime = new Date(
        `${format(data.date, "yyyy-MM-dd")}T${data.time}`
      );
      return selectedDateTime > new Date();
    },
    {
      message: "Appointment date and time must be in the future",
      path: ["date"],
    }
  );

type AppointmentBookingFormData = z.infer<typeof appointmentBookingSchema>;

export function AppointmentBookingForm() {
  const t = useTranslations("appointments");
  const router = useRouter();
  const locale = useLocale();
  const queryClient = useQueryClient();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState<AppointmentBookingFormData | null>(null);

  // Fetch doctors and services
  const { data: doctors = [], isLoading: doctorsLoading } = useQuery<Doctor[]>({
    queryKey: ["doctors"],
    queryFn: getDoctors,
  });

  const { data: services = [], isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: getServices,
  });

  // Form state
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<AppointmentBookingFormData>({
    resolver: zodResolver(appointmentBookingSchema),
    mode: "onChange",
    defaultValues: {
      files: [],
      gdprConsent: false,
    },
  });

  const selectedServiceId = watch("serviceId");
  const selectedDoctorId = watch("doctorId");
  const selectedDate = watch("date");
  const selectedTime = watch("time");
  const selectedFiles = watch("files") || [];

  // Get selected service to find duration
  const selectedService = services.find((s) => s.id === selectedServiceId);

  // Fetch available slots when doctor and date are selected
  const { data: availableSlots = [] } = useQuery({
    queryKey: ["availableSlots", selectedDoctorId, selectedDate, selectedService?.duration],
    queryFn: () =>
      selectedDoctorId && selectedDate
        ? getAvailableSlots(
            selectedDoctorId,
            format(selectedDate, "yyyy-MM-dd"),
            selectedService?.duration
          )
        : Promise.resolve([]),
    enabled: !!selectedDoctorId && !!selectedDate,
  });

  // Create appointment mutation with optimistic update
  const mutation = useMutation({
    mutationFn: async (data: AppointmentBookingFormData) => {
      // Prepare appointment data
      const appointmentDate = new Date(
        `${format(data.date, "yyyy-MM-dd")}T${data.time}`
      );

      const appointmentData: CreateAppointmentData = {
        date: appointmentDate.toISOString(),
        reason: data.reason,
        doctorId: data.doctorId,
        serviceId: data.serviceId,
      };

      // Create appointment
      const appointmentResponse = await createAppointment(appointmentData);
      const appointmentId = appointmentResponse.id;

      // Upload files if any
      if (data.files && data.files.length > 0) {
        const formData = new FormData();
        data.files.forEach((file, index) => {
          formData.append(`files`, file);
        });

        await axiosInstance.post(`/appointments/${appointmentId}/files`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      return appointmentResponse;
    },
    onMutate: async (newAppointment) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["appointments"] });

      // Snapshot previous value
      const previousAppointments = queryClient.getQueryData(["appointments"]);

      // Optimistically update
      queryClient.setQueryData(["appointments"], (old: any[]) => {
        const optimisticAppointment = {
          id: `temp-${Date.now()}`,
          ...newAppointment,
          status: "PENDING",
          createdAt: new Date().toISOString(),
        };
        return old ? [...old, optimisticAppointment] : [optimisticAppointment];
      });

      return { previousAppointments };
    },
    onError: (err, newAppointment, context) => {
      // Rollback on error
      if (context?.previousAppointments) {
        queryClient.setQueryData(["appointments"], context.previousAppointments);
      }
      console.error("Appointment creation error:", err);
      alert("Failed to create appointment. Please try again.");
    },
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["availableSlots"] });
      setShowConfirmation(true);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  const onSubmit = (data: AppointmentBookingFormData) => {
    setFormData(data);
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    if (formData) {
      mutation.mutate(formData);
      setShowConfirmation(false);
    }
  };

  // Prepare options for selects
  const doctorOptions = doctors.map((doctor) => ({
    value: doctor.id,
    label: `Dr. ${doctor.firstName} ${doctor.lastName}${doctor.specialty ? ` - ${doctor.specialty}` : ""}`,
  }));

  const serviceOptions = services.map((service) => ({
    value: service.id,
    label: `${service.name} (${service.duration} min)`,
  }));

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);
  const selectedServiceName = services.find((s) => s.id === selectedServiceId)?.name;

  return (
    <>
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Schedule Appointment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Service Type */}
            <Select
              label="Service Type"
              placeholder="Select a service"
              options={serviceOptions}
              {...register("serviceId")}
              error={errors.serviceId?.message}
              disabled={servicesLoading}
            />

            {/* Doctor Selection */}
            <Select
              label="Doctor"
              placeholder="Select a doctor"
              options={doctorOptions}
              {...register("doctorId")}
              error={errors.doctorId?.message}
              disabled={doctorsLoading || !selectedServiceId}
            />

            {/* Date & Time Picker */}
            <div>
              <DateTimePicker
                label="Date & Time"
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                availableSlots={availableSlots}
                minDate={new Date()}
                maxDate={addDays(new Date(), 90)}
                onDateChange={(date) => {
                  setValue("date", date, { shouldValidate: true });
                }}
                onTimeChange={(time) => {
                  setValue("time", time, { shouldValidate: true });
                }}
                error={errors.date?.message || errors.time?.message}
                disabled={!selectedDoctorId}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.date.message}
                </p>
              )}
              {errors.time && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.time.message}
                </p>
              )}
            </div>

            {/* Reason */}
            <Textarea
              label="Reason for Visit (Optional)"
              placeholder="Please describe the reason for your appointment..."
              rows={4}
              {...register("reason")}
              error={errors.reason?.message}
            />

            {/* File Upload */}
            <FileUpload
              label="Medical Notes/Exams (Optional)"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              maxSize={10}
              maxFiles={5}
              value={selectedFiles}
              onChange={(files) => setValue("files", files, { shouldValidate: true })}
              error={errors.files?.message}
            />

            {/* GDPR Consent */}
            <Checkbox
              label="I consent to the processing of my personal data in accordance with GDPR regulations."
              {...register("gdprConsent")}
              error={errors.gdprConsent?.message}
            />

            {/* Submit Buttons */}
            <div className="flex space-x-4 pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={!isValid || mutation.isPending}
                isLoading={mutation.isPending}
                className="flex-1"
              >
                Schedule Appointment
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmation && !!formData}
        onClose={() => setShowConfirmation(false)}
        title="Confirm Appointment"
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>

          <div className="space-y-3">
            <div className="flex items-start">
              <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Date & Time</p>
                <p className="font-medium">
                  {formData?.date && format(formData.date, "PPP")} at {formData?.time}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <User className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Doctor</p>
                <p className="font-medium">
                  {selectedDoctor
                    ? `Dr. ${selectedDoctor.firstName} ${selectedDoctor.lastName}`
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <FileText className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Service</p>
                <p className="font-medium">{selectedServiceName || "N/A"}</p>
              </div>
            </div>

            {formData?.reason && (
              <div className="flex items-start">
                <FileText className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Reason</p>
                  <p className="font-medium">{formData.reason}</p>
                </div>
              </div>
            )}

            {formData?.files && formData.files.length > 0 && (
              <div className="flex items-start">
                <FileText className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Files</p>
                  <p className="font-medium">{formData.files.length} file(s) attached</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-3 pt-4 border-t">
            <Button
              variant="primary"
              onClick={handleConfirm}
              isLoading={mutation.isPending}
              className="flex-1"
            >
              Confirm Appointment
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowConfirmation(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

