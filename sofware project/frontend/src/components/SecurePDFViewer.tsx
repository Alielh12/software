"use client";

import React, { useState, useEffect, useRef } from "react";
import { Download, Lock, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { decryptToDataURL, DecryptionError } from "@/lib/crypto/decrypt";
import type { CryptoKey } from "@/lib/crypto/decrypt";

interface SecurePDFViewerProps {
  encryptedData: string;
  decryptionKey: CryptoKey | string;
  fileName?: string;
  mimeType?: string;
  onError?: (error: DecryptionError) => void;
}

export function SecurePDFViewer({
  encryptedData,
  decryptionKey,
  fileName = "document.pdf",
  mimeType = "application/pdf",
  onError,
}: SecurePDFViewerProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<DecryptionError | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let isMounted = true;

    const loadPDF = async () => {
      try {
        setLoading(true);
        setError(null);

        // Decrypt and create data URL
        const key = typeof decryptionKey === "string"
          ? decryptionKey
          : undefined;

        const url = await decryptToDataURL(
          encryptedData,
          {
            keyString: key,
            key: typeof decryptionKey === "object" ? decryptionKey : undefined,
          },
          mimeType
        );

        if (isMounted) {
          setDataUrl(url);
        }
      } catch (err) {
        if (isMounted) {
          const decryptionError =
            err instanceof DecryptionError
              ? err
              : new DecryptionError(
                  "Failed to decrypt PDF",
                  "DECRYPTION_FAILED"
                );
          setError(decryptionError);
          if (onError) {
            onError(decryptionError);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadPDF();

    return () => {
      isMounted = false;
      // Cleanup: Revoke data URL to free memory
      if (dataUrl) {
        URL.revokeObjectURL(dataUrl);
      }
    };
  }, [encryptedData, decryptionKey, mimeType, onError]);

  const handleDownload = () => {
    if (!dataUrl) return;

    try {
      // Create a temporary anchor element for download
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = fileName;
      link.style.display = "none";
      
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        // Note: We don't revoke the dataUrl here as it might be used in the viewer
      }, 100);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download file");
    }
  };

  const handleFullscreen = () => {
    setIsFullscreen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="text-center">
          <Lock className="w-8 h-8 mx-auto mb-2 text-gray-400 animate-pulse" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Decrypting secure document...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
              Decryption Error
            </h3>
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {error.message}
            </p>
            {error.code === "MISSING_KEY" && (
              <p className="mt-2 text-xs text-red-500">
                The decryption key is missing. Please contact support.
              </p>
            )}
            {error.code === "DECRYPTION_FAILED" && (
              <p className="mt-2 text-xs text-red-500">
                The file may be corrupted or the key is incorrect.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!dataUrl) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          No document to display
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {fileName}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-500">
              (Decrypted in memory only)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDownload}
              className="flex items-center space-x-1"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFullscreen}
            >
              Fullscreen
            </Button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="relative" style={{ height: "600px" }}>
          <iframe
            ref={iframeRef}
            src={dataUrl}
            className="w-full h-full border-0"
            title="Secure PDF Viewer"
            style={{ minHeight: "600px" }}
          />
        </div>
      </div>

      {/* Fullscreen Modal */}
      <Modal
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        title={fileName}
        size="xl"
        showCloseButton={true}
      >
        <div className="relative" style={{ height: "80vh" }}>
          <iframe
            src={dataUrl}
            className="w-full h-full border-0 rounded"
            title="Secure PDF Viewer - Fullscreen"
          />
        </div>
      </Modal>
    </>
  );
}

