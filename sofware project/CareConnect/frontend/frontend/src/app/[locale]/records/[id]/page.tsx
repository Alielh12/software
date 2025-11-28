"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter, useLocale } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import {
  getEncryptedRecord,
  getDecryptionKey,
  verifyRecordAccess,
  type EncryptedRecord,
  type DecryptedRecordData,
} from "@/lib/api/records";
import {
  decryptText,
  decryptBinary,
  importKeyFromString,
  DecryptionError,
} from "@/lib/crypto/decrypt";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SecurePDFViewer } from "@/components/SecurePDFViewer";
import { DecryptionErrorDisplay } from "@/components/errors/DecryptionErrorDisplay";
import {
  Calendar,
  User,
  FileText,
  Pill,
  ClipboardList,
  Download,
  AlertCircle,
  Lock,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";

export default function MedicalRecordDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("records");
  const recordId = params.id as string;

  const [decryptedData, setDecryptedData] =
    useState<DecryptedRecordData | null>(null);
  const [decryptionKey, setDecryptionKey] = useState<string | null>(null);
  const [decryptionError, setDecryptionError] =
    useState<DecryptionError | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [accessGranted, setAccessGranted] = useState<boolean | null>(null);

  // Verify access first
  const { data: accessData, isLoading: accessLoading } = useQuery({
    queryKey: ["recordAccess", recordId],
    queryFn: () => verifyRecordAccess(recordId),
    retry: false,
  });

  // Fetch encrypted record
  const {
    data: encryptedRecord,
    isLoading: recordLoading,
    error: recordError,
  } = useQuery<EncryptedRecord>({
    queryKey: ["encryptedRecord", recordId],
    queryFn: () => getEncryptedRecord(recordId),
    enabled: accessGranted === true,
    retry: false,
  });

  // Fetch decryption key
  const { data: keyData, isLoading: keyLoading } = useQuery({
    queryKey: ["decryptionKey", recordId],
    queryFn: () =>
      getDecryptionKey(recordId, encryptedRecord?.keyId),
    enabled: !!encryptedRecord && accessGranted === true,
    retry: false,
  });

  // Update access status
  useEffect(() => {
    if (accessData) {
      setAccessGranted(accessData.hasAccess);
      if (!accessData.hasAccess) {
        setDecryptionError(
          new DecryptionError(
            accessData.reason || "Access denied",
            "UNAUTHORIZED"
          )
        );
      }
    }
  }, [accessData]);

  // Store decryption key when available
  useEffect(() => {
    if (keyData?.key) {
      setDecryptionKey(keyData.key);
    }
  }, [keyData]);

  // Decrypt record data when both record and key are available
  useEffect(() => {
    if (
      encryptedRecord &&
      decryptionKey &&
      !decryptedData &&
      !decryptionError &&
      !isDecrypting
    ) {
      decryptRecord();
    }
  }, [encryptedRecord, decryptionKey]);

  const decryptRecord = async () => {
    if (!encryptedRecord || !decryptionKey) return;

    try {
      setIsDecrypting(true);
      setDecryptionError(null);

      // Decrypt the main record data (JSON)
      const decryptedText = await decryptText(encryptedRecord.encryptedData, {
        keyString: decryptionKey,
      });

      // Parse decrypted JSON
      const parsed: DecryptedRecordData = JSON.parse(decryptedText);
      setDecryptedData(parsed);

      // Decrypt any attached files if needed
      if (parsed.attachments && encryptedRecord.encryptedFiles) {
        const decryptedAttachments = await Promise.all(
          encryptedRecord.encryptedFiles.map(async (encryptedFile, index) => {
            try {
              const decryptedBlob = await decryptBinary(
                encryptedFile.encryptedData,
                { keyString: decryptionKey }
              );
              return {
                name: encryptedFile.name,
                type: encryptedFile.mimeType,
                data: decryptedBlob,
              };
            } catch (err) {
              console.error(`Failed to decrypt file ${index}:`, err);
              return null;
            }
          })
        );

        parsed.attachments = decryptedAttachments.filter(
          (a) => a !== null
        ) as typeof parsed.attachments;
        setDecryptedData({ ...parsed });
      }
    } catch (error) {
      console.error("Decryption error:", error);
      const decryptionError =
        error instanceof DecryptionError
          ? error
          : new DecryptionError(
              "Failed to decrypt medical record",
              "DECRYPTION_FAILED"
            );
      setDecryptionError(decryptionError);
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!decryptedData || !decryptionKey) return;

    try {
      // Create a structured PDF document (simplified - in production, use a PDF library)
      // For now, we'll create a text-based representation
      const pdfContent = `
Medical Record Summary
======================

Date: ${format(new Date(encryptedRecord!.createdAt), "PPP")}
Doctor: ${encryptedRecord!.doctorId || "N/A"}

${decryptedData.diagnosis ? `Diagnosis:\n${decryptedData.diagnosis}\n` : ""}

${decryptedData.doctorNotes ? `Doctor Notes:\n${decryptedData.doctorNotes}\n` : ""}

${decryptedData.prescriptions && decryptedData.prescriptions.length > 0
  ? `Prescriptions:\n${decryptedData.prescriptions
      .map(
        (p) =>
          `- ${p.medication} (${p.dosage}) - ${p.frequency} for ${p.duration}`
      )
      .join("\n")}\n`
  : ""}
      `.trim();

      // Create blob and download
      const blob = new Blob([pdfContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `medical-record-${recordId}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download record");
    }
  };

  if (accessLoading || recordLoading || keyLoading || isDecrypting) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-12 text-center">
            <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary-600 animate-spin" />
            <p className="text-gray-600 dark:text-gray-400">
              {accessLoading
                ? "Verifying access..."
                : recordLoading
                ? "Loading medical record..."
                : keyLoading
                ? "Loading decryption key..."
                : "Decrypting record..."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (decryptionError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Button variant="secondary" onClick={() => router.back()}>
            ← Back to Records
          </Button>
        </div>
        <DecryptionErrorDisplay
          error={decryptionError}
          onRetry={() => {
            setDecryptionError(null);
            setDecryptedData(null);
            decryptRecord();
          }}
          onContactSupport={() => {
            window.location.href = `mailto:support@careconnect.example.com?subject=Medical Record Access Issue&body=Record ID: ${recordId}`;
          }}
        />
      </div>
    );
  }

  if (!decryptedData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-12 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400">
              Unable to load medical record
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="secondary" onClick={() => router.back()}>
          ← Back to Records
        </Button>
        <Button
          variant="primary"
          onClick={handleDownloadPDF}
          className="flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Download Decrypted PDF</span>
        </Button>
      </div>

      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span>Medical Record</span>
              </CardTitle>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {format(new Date(encryptedRecord!.createdAt), "PPP")}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(encryptedRecord!.createdAt), "PPP 'at' p")}</span>
              </div>
              {encryptedRecord!.doctorId && (
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>Doctor ID: {encryptedRecord!.doctorId}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Diagnosis */}
        {decryptedData.diagnosis && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ClipboardList className="w-5 h-5" />
                <span>{t("diagnosis")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {decryptedData.diagnosis}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Prescriptions */}
        {decryptedData.prescriptions &&
          decryptedData.prescriptions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Pill className="w-5 h-5" />
                  <span>{t("prescription")}s</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {decryptedData.prescriptions.map((prescription, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {prescription.medication}
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">
                            Dosage:
                          </span>{" "}
                          <span className="font-medium">
                            {prescription.dosage}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">
                            Frequency:
                          </span>{" "}
                          <span className="font-medium">
                            {prescription.frequency}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-600 dark:text-gray-400">
                            Duration:
                          </span>{" "}
                          <span className="font-medium">
                            {prescription.duration}
                          </span>
                        </div>
                        {prescription.instructions && (
                          <div className="col-span-2 mt-2">
                            <span className="text-gray-600 dark:text-gray-400">
                              Instructions:
                            </span>
                            <p className="mt-1 text-gray-700 dark:text-gray-300">
                              {prescription.instructions}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

        {/* Doctor Notes */}
        {decryptedData.doctorNotes && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Doctor Notes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {decryptedData.doctorNotes}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Lab Results */}
        {decryptedData.labResults && decryptedData.labResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Lab Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Test</th>
                      <th className="text-left p-2">Value</th>
                      <th className="text-left p-2">Reference Range</th>
                      <th className="text-left p-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {decryptedData.labResults.map((result, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{result.testName}</td>
                        <td className="p-2 font-medium">
                          {result.value} {result.unit}
                        </td>
                        <td className="p-2">{result.referenceRange || "N/A"}</td>
                        <td className="p-2">{result.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Attached Scans/PDFs */}
        {encryptedRecord!.encryptedFiles &&
          encryptedRecord!.encryptedFiles.length > 0 &&
          decryptionKey && (
            <Card>
              <CardHeader>
                <CardTitle>Attached Scans & Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {encryptedRecord!.encryptedFiles.map((encryptedFile) => {
                    // Check if it's a PDF
                    if (
                      encryptedFile.mimeType === "application/pdf" ||
                      encryptedFile.name.endsWith(".pdf")
                    ) {
                      return (
                        <div key={encryptedFile.id} className="space-y-2">
                          <h4 className="font-medium">{encryptedFile.name}</h4>
                          <SecurePDFViewer
                            encryptedData={encryptedFile.encryptedData}
                            decryptionKey={decryptionKey}
                            fileName={encryptedFile.name}
                            mimeType={encryptedFile.mimeType}
                            onError={(error) => {
                              console.error("PDF decryption error:", error);
                              setDecryptionError(error);
                            }}
                          />
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </CardContent>
            </Card>
          )}
      </div>
    </div>
  );
}
