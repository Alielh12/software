# Medical Record Decryption Implementation

## Overview

This implementation provides client-side AES-256 decryption of medical records using the WebCrypto API. All decryption happens in memory, and decrypted data is never written to disk.

## Architecture

### Security Model
- **Encryption**: AES-256-GCM (Galois/Counter Mode)
- **Key Management**: Keys stored securely, never exposed in client code
- **Memory-Only**: Decrypted data exists only in browser memory
- **No Disk Storage**: Decrypted files are never saved to disk

### Components

1. **Decryption Utility** (`src/lib/crypto/decrypt.ts`)
   - AES-256-GCM decryption functions
   - Key import/derivation
   - Error handling

2. **Medical Record Detail Page** (`src/app/[locale]/records/[id]/page.tsx`)
   - Fetches encrypted record
   - Retrieves decryption key
   - Decrypts and displays record data

3. **Secure PDF Viewer** (`src/components/SecurePDFViewer.tsx`)
   - In-memory PDF decryption
   - Secure display
   - Memory-safe download

4. **Error Handling** (`src/components/errors/DecryptionErrorDisplay.tsx`)
   - User-friendly error messages
   - Error-specific solutions
   - Support contact options

## Decryption Flow

```
1. User requests medical record
   ↓
2. Verify user has access
   ↓
3. Fetch encrypted record from API
   ↓
4. Fetch decryption key (separate endpoint)
   ↓
5. Decrypt record data (JSON) in memory
   ↓
6. Parse decrypted JSON
   ↓
7. Decrypt attached files if any
   ↓
8. Display decrypted data
```

## API Endpoints

### Get Encrypted Record
```
GET /api/records/:id/encrypted

Response:
{
  "id": "record_123",
  "userId": "user_456",
  "encryptedData": "base64-encoded-encrypted-json",
  "encryptedFiles": [
    {
      "id": "file_123",
      "name": "scan.pdf",
      "encryptedData": "base64-encoded-encrypted-pdf",
      "mimeType": "application/pdf",
      "size": 1024000,
      "keyId": "key_123"
    }
  ],
  "keyId": "key_123",
  "createdAt": "2024-01-15T10:00:00Z"
}
```

### Get Decryption Key
```
GET /api/records/:id/key?keyId=key_123

Response:
{
  "key": "base64-encoded-32-byte-key",
  "keyId": "key_123"
}
```

### Verify Access
```
GET /api/records/:id/verify-access

Response (200 OK):
{ "hasAccess": true }

Response (403 Forbidden):
{ "hasAccess": false, "reason": "Access denied" }
```

## Encryption Format

### Encrypted Data Structure

The encrypted data is base64-encoded JSON with the following structure:

```json
{
  "iv": "base64-initialization-vector",
  "ciphertext": "base64-encrypted-data",
  "tag": "base64-authentication-tag",
  "algorithm": "AES-GCM",
  "keyId": "key_123"
}
```

### Encryption Process (Backend)

```javascript
// Pseudocode for backend encryption
const key = generateAES256Key();
const iv = generateRandomIV();
const encrypted = await crypto.encrypt({
  name: "AES-GCM",
  iv: iv,
  tagLength: 128
}, key, plaintextData);

const encryptedData = {
  iv: base64(iv),
  ciphertext: base64(encrypted.ciphertext),
  tag: base64(encrypted.tag),
  algorithm: "AES-GCM",
  keyId: keyId
};

return base64(JSON.stringify(encryptedData));
```

## Error Handling

### Error Types

1. **MISSING_KEY**
   - Key not provided or not found
   - Solution: Request key from server or key management service

2. **DECRYPTION_FAILED**
   - Corrupted data or incorrect key
   - Solution: Verify data integrity and key validity

3. **INVALID_FORMAT**
   - Malformed encrypted data
   - Solution: Check data format and encoding

4. **UNAUTHORIZED**
   - User doesn't have access
   - Solution: Verify permissions and authentication

5. **KEY_IMPORT_ERROR**
   - Key format invalid
   - Solution: Verify key encoding and format

### Error Display

The `DecryptionErrorDisplay` component shows:
- Error-specific icon and title
- Clear description
- Suggested solution
- Action buttons (Retry/Contact Support)

## Usage Examples

### Basic Decryption

```typescript
import { decryptText, importKeyFromString } from "@/lib/crypto/decrypt";

// Get key from API or secure storage
const keyString = await fetchDecryptionKey(recordId);

// Import key
const key = await importKeyFromString(keyString);

// Decrypt data
const decryptedText = await decryptText(encryptedData, {
  keyString: keyString
});

// Parse JSON
const recordData = JSON.parse(decryptedText);
```

### PDF Decryption

```typescript
import { decryptToDataURL } from "@/lib/crypto/decrypt";
import { SecurePDFViewer } from "@/components/SecurePDFViewer";

// Decrypt PDF and display
<SecurePDFViewer
  encryptedData={encryptedPdfData}
  decryptionKey={decryptionKey}
  fileName="medical-scan.pdf"
  mimeType="application/pdf"
/>
```

## Security Considerations

### Key Management

1. **Never store keys in code**
   - Keys should come from secure API endpoints
   - Use key management services in production
   - Rotate keys periodically

2. **Key Transmission**
   - Use HTTPS for all API calls
   - Consider encrypting key with user-specific key
   - Implement key expiration

3. **Key Storage**
   - Store keys in memory only
   - Clear keys from memory when done
   - Never log keys

### Memory Safety

1. **Data URLs**
   - Revoke data URLs after use
   - Limit concurrent decrypted files
   - Clear memory when component unmounts

2. **Blob Cleanup**
   - Dispose of blobs after download
   - Use WeakMap for temporary storage
   - Monitor memory usage

3. **Sensitive Data**
   - Don't store in React state unnecessarily
   - Clear state on unmount
   - Use refs for temporary data

## Best Practices

1. **Always verify access before decryption**
   - Check permissions server-side
   - Validate user identity
   - Log access attempts

2. **Handle errors gracefully**
   - Don't expose sensitive error details
   - Provide helpful user messages
   - Log errors server-side

3. **Implement rate limiting**
   - Limit decryption attempts
   - Prevent brute force attacks
   - Monitor suspicious activity

4. **Audit logging**
   - Log all access attempts
   - Track key requests
   - Monitor decryption failures

## Testing

### Test Cases

1. **Successful Decryption**
   - Valid encrypted data
   - Correct key
   - Proper format

2. **Error Scenarios**
   - Missing key
   - Invalid key
   - Corrupted data
   - Wrong format

3. **Access Control**
   - Authorized user
   - Unauthorized user
   - Expired access

4. **PDF Display**
   - Valid PDF decryption
   - Display in iframe
   - Download functionality

## Production Checklist

- [ ] Use production key management service
- [ ] Implement proper key rotation
- [ ] Add rate limiting
- [ ] Set up audit logging
- [ ] Configure HTTPS only
- [ ] Add monitoring and alerts
- [ ] Implement key expiration
- [ ] Test error scenarios
- [ ] Security audit
- [ ] Performance optimization

## Performance Optimization

1. **Lazy Loading**
   - Only decrypt when needed
   - Decrypt files on demand

2. **Caching**
   - Cache decrypted data in memory (temporary)
   - Invalidate on page navigation

3. **Streaming**
   - For large files, consider streaming decryption
   - Use Web Streams API for large PDFs

## Limitations

1. **Browser Support**
   - Requires WebCrypto API
   - Modern browsers only (IE11 not supported)

2. **Memory Constraints**
   - Large files may cause memory issues
   - Limit concurrent decryption

3. **Client-Side Only**
   - Keys must be transmitted to client
   - Not suitable for all security models

