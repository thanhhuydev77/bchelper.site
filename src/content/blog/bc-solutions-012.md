---
id: BC-SOLUTIONS-012
title: "Use Page CMS to optimize posting flow "
date: 2026-09-23
excerpt: posting easier with page CMS
tags:
  - posting
  - automation
  - UX
draft: false
---
## Background

Recently, the database storage in our Microsoft Dynamics 365 Business Central environment was increasing rapidly due to user attachment files (invoices, receipts, PDF reports, etc.). To reduce storage footprint and optimize operational costs, I built a background synchronization service to automatically offload and store attachment files from Business Central directly into Google Drive.

**The Issue: Too Many Access Token Requests** In the initial design, each file upload triggered a fresh Google OAuth 2.0 API call requesting an Access Token using the Client ID, Client Secret, and Refresh Token. During historical migration with 6 parallel background threads syncing months of data simultaneously, the system sent thousands of token requests in minutes. This triggered Google's rate limiter, causing requests to fail with random *"Cannot get token"* and *"Too Many Requests (HTTP 429)"* exceptions.

## Evaluation of Solutions

A Google OAuth access token remains valid for **1 hour (3,600 seconds)**. Instead of requesting a new token for every file upload, we should cache the active token alongside its expiration timestamp and reuse it across sessions.

| Approach | Technical Consideration | Verdict |
| --- | --- | --- |
| Option 1: New Custom Table | Adds a schema object for a single value, requires permission set setup, and consumes a licensed Table ID on-prem. | Overkill |
| Option 2: SingleInstance Codeunit | Global variables are isolated to the active session. Six background threads would still fetch 6 separate tokens without cross-session caching. | Session-Isolated |
| Option 3: Setup Table Fields | Mixes a short-lived secret into a business setup record that users can open and edit, and every token refresh modifies that shared record. | Poor Fit |
| Option 4: IsolatedStorage | Lightweight key-value store persisted by the platform, shared across background sessions via `DataScope::Company`, scoped to the extension, and no custom table or permission set required. | Selected Choice |

## Technical Implementation

To avoid token expiration mid-transfer on large payloads, a **10-minute safety buffer** is applied, setting the cache window to 50 minutes instead of the full 60 minutes.

**TokenCacheManagement.al**

```al
/// <summary>
/// Retrieves the cached Access Token from IsolatedStorage or requests a new one if expired.
/// </summary>
procedure GetAccessToken() ReturnAccessToken: Text
var
    CachedToken: Text;
    NewExpireTime: DateTime;
begin
    // Check if a valid token already exists in cache
    if TryGetTokenFromIsolatedStorage(CachedToken) then
        exit(CachedToken);

    // If not found or expired, request a new token directly from Google API
    ReturnAccessToken := GetAccessTokenDirect();

    // Cache the token with a 50-minute lifetime (10-minute safety gap)
    NewExpireTime := CurrentDateTime() + (50 * 60 * 1000);
    SetTokenToIsolatedStorage(ReturnAccessToken, NewExpireTime);
end;

[TryFunction]
local procedure TryGetTokenFromIsolatedStorage(var RetrievedToken: Text)
var
    ExpiryText: Text;
    ExpireTime: DateTime;
    TokenScope: DataScope;
begin
    TokenScope := DataScope::Company;

    // Verify both keys exist
    if not IsolatedStorage.Contains('GG_DRIVE_TOKEN', TokenScope) or
       not IsolatedStorage.Contains('GG_DRIVE_TOKEN_EXP', TokenScope)
    then
        Error('No cached token found.');

    IsolatedStorage.Get('GG_DRIVE_TOKEN', TokenScope, RetrievedToken);
    IsolatedStorage.Get('GG_DRIVE_TOKEN_EXP', TokenScope, ExpiryText);

    // Format 9 ensures ISO-8601 round-trip string parsing
    Evaluate(ExpireTime, ExpiryText, 9);

    if ExpireTime <= CurrentDateTime() then
        Error('Token has expired.');

    if RetrievedToken = '' then
        Error('Token is empty.');
end;

local procedure SetTokenToIsolatedStorage(NewToken: Text; ExpireTime: DateTime)
var
    TokenScope: DataScope;
begin
    TokenScope := DataScope::Company;

    // Set overwrites existing values, so no Delete is needed first
    IsolatedStorage.Set('GG_DRIVE_TOKEN', NewToken, TokenScope);
    IsolatedStorage.Set('GG_DRIVE_TOKEN_EXP', Format(ExpireTime, 0, 9), TokenScope);
end;
```

When the cached token expires, each thread that misses the cache fetches a new token, so up to 6 requests can go out at once. That small burst every 50 minutes is well within Google's limits.

## Testing & Verification

1\. Before Optimization

Errors when requesting the access token

![Token request errors from 6 background threads running concurrently](/blogAsset/bc011/bc011-1.webp)

2\. After Optimization

Access token retrieved successfully, with no errors

![Background threads reusing the cached access token without errors](/blogAsset/bc011/bc011-2.webp)

## Key Takeaways

- **Minimal Contention:** The token is written once per 50-minute window, so concurrent workers mostly just read it.
- **Cross-Session Sharing:** `DataScope::Company` allows multiple background workers to share the same cached token.
- **No Extra Objects:** No custom table, permission set, or setup field is needed, and values are isolated to the extension. For encryption, use `SetEncrypted`, but note its value length limit.
