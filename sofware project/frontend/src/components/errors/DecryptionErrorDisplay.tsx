"use client";

import React from "react";
import { AlertCircle, Lock, Key, FileX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DecryptionError } from "@/lib/crypto/decrypt";

interface DecryptionErrorDisplayProps {
  error: DecryptionError;
  onRetry?: () => void;
  onContactSupport?: () => void;
}

export function DecryptionErrorDisplay({
  error,
  onRetry,
  onContactSupport,
}: DecryptionErrorDisplayProps) {
  const getErrorDetails = () => {
    switch (error.code) {
      case "MISSING_KEY":
        return {
          icon: Key,
          title: "Decryption Key Missing",
          description:
            "The decryption key required to access this record is not available.",
          solution:
            "Please contact the health center administrator to obtain access to this record.",
          action: "Contact Support",
        };

      case "DECRYPTION_FAILED":
        return {
          icon: Lock,
          title: "Decryption Failed",
          description:
            "Unable to decrypt the medical record. The data may be corrupted or the key is incorrect.",
          solution:
            "Please verify your access permissions and try again. If the problem persists, contact support.",
          action: "Try Again",
        };

      case "INVALID_FORMAT":
        return {
          icon: FileX,
          title: "Invalid Data Format",
          description:
            "The encrypted data format is invalid or corrupted.",
          solution:
            "The medical record data appears to be corrupted. Please contact support.",
          action: "Contact Support",
        };

      case "UNAUTHORIZED":
        return {
          icon: AlertCircle,
          title: "Access Denied",
          description:
            "You do not have permission to access this medical record.",
          solution:
            "Please ensure you are logged in with the correct account and have been granted access to this record.",
          action: "Check Access",
        };

      default:
        return {
          icon: AlertCircle,
          title: "Decryption Error",
          description: error.message || "An unknown error occurred during decryption.",
          solution:
            "Please try again or contact support if the problem persists.",
          action: "Try Again",
        };
    }
  };

  const details = getErrorDetails();
  const Icon = details.icon;

  return (
    <Card className="max-w-2xl mx-auto border-red-200 dark:border-red-800">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <Icon className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-300 mb-2">
              {details.title}
            </h3>
            <p className="text-sm text-red-700 dark:text-red-400 mb-3">
              {details.description}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
              <strong>Solution:</strong> {details.solution}
            </p>
            <div className="flex space-x-3">
              {error.code === "DECRYPTION_FAILED" && onRetry && (
                <Button variant="primary" size="sm" onClick={onRetry}>
                  {details.action}
                </Button>
              )}
              {onContactSupport && (
                <Button variant="secondary" size="sm" onClick={onContactSupport}>
                  Contact Support
                </Button>
              )}
            </div>
            {process.env.NODE_ENV === "development" && (
              <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                <p className="font-mono text-gray-600 dark:text-gray-400">
                  Error Code: {error.code}
                </p>
                <p className="font-mono text-gray-600 dark:text-gray-400">
                  {error.message}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

