/**
 * Client-side AES-256-GCM decryption utility using WebCrypto API
 * 
 * Security Notes:
 * - Keys are never stored on disk
 * - Decrypted data exists only in memory
 * - Supports encrypted medical records and PDFs
 */

interface DecryptOptions {
  key?: CryptoKey;
  keyString?: string; // Base64-encoded key string (for testing/demo)
  algorithm?: "AES-GCM" | "AES-CBC";
}

interface EncryptionMetadata {
  iv: Uint8Array;
  ciphertext: Uint8Array;
  tag?: Uint8Array; // For GCM mode
  algorithm: "AES-GCM" | "AES-CBC";
  keyId?: string;
}

export class DecryptionError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = "DecryptionError";
  }
}

/**
 * Import a key from a base64 string (for demonstration/testing)
 * In production, keys should come from secure storage or key management service
 */
export async function importKeyFromString(
  keyString: string
): Promise<CryptoKey> {
  try {
    // Decode base64 key string
    const keyData = Uint8Array.from(atob(keyString), (c) => c.charCodeAt(0));

    // Import the key for AES-GCM
    return await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "AES-GCM", length: 256 },
      false, // Not extractable
      ["decrypt"]
    );
  } catch (error) {
    throw new DecryptionError(
      "Failed to import decryption key",
      "KEY_IMPORT_ERROR"
    );
  }
}

/**
 * Derive key from password using PBKDF2
 * This can be used if keys are derived from user passwords
 */
export async function deriveKeyFromPassword(
  password: string,
  salt: Uint8Array,
  iterations: number = 100000
): Promise<CryptoKey> {
  try {
    // Convert password to ArrayBuffer
    const passwordKey = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      "PBKDF2",
      false,
      ["deriveBits", "deriveKey"]
    );

    // Derive key using PBKDF2
    return await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: iterations,
        hash: "SHA-256",
      },
      passwordKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );
  } catch (error) {
    throw new DecryptionError(
      "Failed to derive decryption key from password",
      "KEY_DERIVATION_ERROR"
    );
  }
}

/**
 * Parse encrypted data format
 * Expected format: base64 encoded JSON with iv, ciphertext, tag, algorithm
 */
function parseEncryptedData(encryptedData: string): EncryptionMetadata {
  try {
    const decoded = JSON.parse(atob(encryptedData));
    
    return {
      iv: Uint8Array.from(atob(decoded.iv), (c) => c.charCodeAt(0)),
      ciphertext: Uint8Array.from(atob(decoded.ciphertext), (c) => c.charCodeAt(0)),
      tag: decoded.tag
        ? Uint8Array.from(atob(decoded.tag), (c) => c.charCodeAt(0))
        : undefined,
      algorithm: decoded.algorithm || "AES-GCM",
      keyId: decoded.keyId,
    };
  } catch (error) {
    throw new DecryptionError(
      "Invalid encrypted data format",
      "INVALID_FORMAT"
    );
  }
}

/**
 * Decrypt data using AES-256-GCM
 */
export async function decryptData(
  encryptedData: string | ArrayBuffer,
  options: DecryptOptions
): Promise<ArrayBuffer> {
  try {
    // Get or import key
    let key: CryptoKey;
    if (options.key) {
      key = options.key;
    } else if (options.keyString) {
      key = await importKeyFromString(options.keyString);
    } else {
      throw new DecryptionError("Decryption key is required", "MISSING_KEY");
    }

    // Parse encrypted data if it's a string
    let metadata: EncryptionMetadata;
    if (typeof encryptedData === "string") {
      metadata = parseEncryptedData(encryptedData);
    } else {
      throw new DecryptionError(
        "Encrypted data must be a base64-encoded string",
        "INVALID_INPUT"
      );
    }

    const algorithm = metadata.algorithm || options.algorithm || "AES-GCM";

    // Prepare decryption parameters
    let decryptParams: any;
    let ciphertextWithTag: Uint8Array;

    if (algorithm === "AES-GCM") {
      // For GCM, append tag to ciphertext
      if (metadata.tag) {
        ciphertextWithTag = new Uint8Array(
          metadata.ciphertext.length + metadata.tag.length
        );
        ciphertextWithTag.set(metadata.ciphertext);
        ciphertextWithTag.set(metadata.tag, metadata.ciphertext.length);
      } else {
        ciphertextWithTag = metadata.ciphertext;
      }

      decryptParams = {
        name: "AES-GCM",
        iv: metadata.iv,
        tagLength: 128, // 128-bit tag for GCM
      };
    } else {
      // AES-CBC mode
      ciphertextWithTag = metadata.ciphertext;
      decryptParams = {
        name: "AES-CBC",
        iv: metadata.iv,
      };
    }

    // Perform decryption
    const decrypted = await crypto.subtle.decrypt(
      decryptParams,
      key,
      ciphertextWithTag
    );

    return decrypted;
  } catch (error) {
    if (error instanceof DecryptionError) {
      throw error;
    }

    // Check for specific WebCrypto errors
    if (error instanceof DOMException) {
      if (error.name === "OperationError") {
        throw new DecryptionError(
          "Decryption failed: Data may be corrupted or key is incorrect",
          "DECRYPTION_FAILED"
        );
      }
      if (error.name === "InvalidAccessError") {
        throw new DecryptionError(
          "Invalid key or algorithm",
          "INVALID_KEY"
        );
      }
    }

    throw new DecryptionError(
      `Decryption error: ${error instanceof Error ? error.message : "Unknown error"}`,
      "UNKNOWN_ERROR"
    );
  }
}

/**
 * Decrypt text data (UTF-8 encoded)
 */
export async function decryptText(
  encryptedData: string,
  options: DecryptOptions
): Promise<string> {
  try {
    const decrypted = await decryptData(encryptedData, options);
    const decoder = new TextDecoder("utf-8");
    return decoder.decode(decrypted);
  } catch (error) {
    if (error instanceof DecryptionError) {
      throw error;
    }
    throw new DecryptionError(
      `Failed to decode decrypted text: ${error instanceof Error ? error.message : "Unknown error"}`,
      "DECODE_ERROR"
    );
  }
}

/**
 * Decrypt binary data (for PDFs, images, etc.)
 */
export async function decryptBinary(
  encryptedData: string,
  options: DecryptOptions
): Promise<Blob> {
  try {
    const decrypted = await decryptData(encryptedData, options);
    return new Blob([decrypted]);
  } catch (error) {
    if (error instanceof DecryptionError) {
      throw error;
    }
    throw new DecryptionError(
      `Failed to create blob from decrypted data: ${error instanceof Error ? error.message : "Unknown error"}`,
      "BLOB_ERROR"
    );
  }
}

/**
 * Generate a data URL from decrypted binary data
 * Useful for displaying images or PDFs in the browser
 */
export async function decryptToDataURL(
  encryptedData: string,
  options: DecryptOptions,
  mimeType: string = "application/pdf"
): Promise<string> {
  try {
    const blob = await decryptBinary(encryptedData, options);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () =>
        reject(
          new DecryptionError("Failed to read decrypted blob", "READ_ERROR")
        );
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    if (error instanceof DecryptionError) {
      throw error;
    }
    throw new DecryptionError(
      `Failed to create data URL: ${error instanceof Error ? error.message : "Unknown error"}`,
      "DATA_URL_ERROR"
    );
  }
}

