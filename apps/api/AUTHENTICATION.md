# API Authentication Documentation

## Overview

The API supports two types of authentication for different use cases:

1. **Public API Keys** - For browser-based applications (frontend/client-side)
2. **Private API Keys** - For server-to-server applications (backend/server-side)

## Authentication Methods

### 1. Public API Keys (`pk_*`)

**Use Case**: Browser-based applications, frontend JavaScript code

**Security Features**:
- Domain validation using Origin header
- Can only be used from whitelisted domains
- Requires browser environment (Origin header must be present)
- Suitable for client-side applications

**Format**: `pk_[live|test]_[64-character-hex]`

**Example**: `pk_test_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef`

**Headers Required**:
```http
X-Public-Key: pk_test_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
Origin: https://example.com
```

**Security Notes**:
- The Origin header is automatically set by browsers and cannot be modified by JavaScript
- Only requests from domains listed in the website's `whitelistedDomains` are allowed
- Supports wildcard subdomains (e.g., `*.example.com`)
- Rejects requests from `null` origins (file://, data:// protocols)
- Only HTTP and HTTPS origins are accepted

### 2. Private API Keys (`sk_*`)

**Use Case**: Server-to-server communication, backend applications

**Security Features**:
- No domain restrictions
- Can be used from any environment
- Should be kept secret and never exposed to clients
- Suitable for server-side applications

**Format**: `sk_[live|test]_[64-character-hex]`

**Example**: `sk_test_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef`

**Headers Required**:
```http
Authorization: Bearer sk_test_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

## API Endpoint: GET /website

### Description
Returns website information associated with the provided API key.

### Authentication
Supports both public and private API keys:
- **Public Key**: Use `X-Public-Key` header + valid `Origin` header
- **Private Key**: Use `Authorization: Bearer` header

### Request Examples

#### Using Public API Key (Browser/Frontend)
```javascript
fetch('/api/website', {
  method: 'GET',
  headers: {
    'X-Public-Key': 'pk_test_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    // Origin header is automatically set by the browser
  }
})
```

#### Using Private API Key (Server/Backend)
```javascript
fetch('/api/website', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer sk_test_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
  }
})
```

### Response Format

#### Success Response (200)
```json
{
  "id": "01JG000000000000000000000",
  "name": "Example Website",
  "slug": "example-website",
  "domain": "example.com",
  "isDomainOwnershipVerified": true,
  "description": "Example website description",
  "logoUrl": "https://example.com/logo.png",
  "whitelistedDomains": ["example.com", "*.example.com", "localhost:3000"],
  "installationTarget": "nextjs",
  "organizationId": "01JG000000000000000000000",
  "status": "active",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Error Responses

**401 Unauthorized**
```json
{
  "error": "Invalid API key"
}
```

**403 Forbidden (Public Key Domain Validation)**
```json
{
  "error": "Domain example.com is not whitelisted for this API key"
}
```

**403 Forbidden (Missing Origin)**
```json
{
  "error": "Origin header is required for public key authentication. This API key can only be used from browser environments."
}
```

**404 Not Found**
```json
{
  "error": "Website not found for this API key"
}
```

## Security Best Practices

### For Public API Keys:
1. **Never use in server environments** - Public keys require Origin header validation
2. **Configure domain whitelist carefully** - Only add domains you control
3. **Use HTTPS in production** - Ensure secure transmission
4. **Rotate keys regularly** - Generate new keys periodically

### For Private API Keys:
1. **Keep secret** - Never expose in client-side code
2. **Use environment variables** - Store in secure environment variables
3. **Implement rate limiting** - Prevent abuse
4. **Monitor usage** - Track API key usage patterns

### General Security:
1. **Use test keys in development** - Never use live keys in development
2. **Implement proper error handling** - Don't expose sensitive information
3. **Log suspicious activity** - Monitor for potential attacks
4. **Use CORS properly** - Configure CORS headers appropriately

## Environment Variables

### Client-Side (Public Keys)
```bash
NEXT_PUBLIC_COSSISSTANT_KEY=pk_test_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
# OR
COSSISSTANT_PUBLIC_KEY=pk_test_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

### Server-Side (Private Keys)
```bash
COSSISSTANT_PRIVATE_KEY=sk_test_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

## Domain Validation Rules

### Exact Match
```
Whitelisted: example.com
Allowed: https://example.com
Blocked: https://sub.example.com
```

### Wildcard Subdomain
```
Whitelisted: *.example.com
Allowed: https://api.example.com, https://www.example.com
Blocked: https://example.com, https://malicious.com
```

### Development
```
Whitelisted: localhost:3000
Allowed: http://localhost:3000, https://localhost:3000
Blocked: http://localhost:3001
```

## Troubleshooting

### Common Issues

1. **"Origin header is required"**
   - Using public key in server environment
   - Solution: Use private key for server-to-server requests

2. **"Domain not whitelisted"**
   - Request coming from unauthorized domain
   - Solution: Add domain to website's whitelisted domains

3. **"Invalid API key format"**
   - Malformed API key
   - Solution: Check key format and regenerate if necessary

4. **"Invalid API key"**
   - Key doesn't exist or is inactive
   - Solution: Verify key exists and is active

### Debug Tips

1. Check browser developer tools for Origin header
2. Verify API key format matches expected pattern
3. Ensure domain is exactly as listed in whitelist
4. Test with both HTTP and HTTPS protocols
5. Check for trailing slashes in domain configuration