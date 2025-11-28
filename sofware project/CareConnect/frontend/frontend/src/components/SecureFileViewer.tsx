"use client";

import React, { useState } from "react";
import { X, Download, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import axiosInstance from "@/lib/api/axios";

interface SecureFileViewerProps {
  fileId: string;
  fileName?: string;
  onClose?: () => void;
}

export function SecureFileViewer({ fileId, fileName, onClose }: SecureFileViewerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  React.useEffect(() => {
    const loadFile = async () => {
      try {
        setLoading(true);
        // Fetch encrypted file from backend
        const response = await axiosInstance.get(`/files/${fileId}`, {
          responseType: "blob",
        });

        // Create object URL for viewing
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setFileUrl(url);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to load file");
      } finally {
        setLoading(false);
      }
    };

    if (fileId) {
      loadFile();
    }

    return () => {
      // Cleanup object URL
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [fileId]);

  const handleDownload = async () => {
    if (!fileUrl) return;

    try {
      const response = await axiosInstance.get(`/files/${fileId}/download`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || `file-${fileId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download file");
    }
  };

  if (loading) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center space-x-2">
            <Lock className="w-5 h-5 animate-spin" />
            <span>Loading secure file...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          {onClose && (
            <Button variant="secondary" onClick={onClose} className="mt-4">
              Close
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="max-w-6xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-primary-600" />
            <h3 className="font-semibold">{fileName || "Secure Document"}</h3>
          </div>
          <div className="flex space-x-2">
            <Button variant="secondary" size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          {fileUrl && (
            <iframe
              src={fileUrl}
              className="w-full h-full border-0"
              title="Secure Document Viewer"
            />
          )}
        </div>
      </Card>
    </div>
  );
}

