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
<h2>Background</h2><p>Recently, the database storage in our Microsoft Dynamics 365 Business Central environment was increasing rapidly due to user attachment files (invoices, receipts, PDF reports, etc.). To reduce storage footprint and optimize operational costs, I built a background synchronization service to automatically offload and store attachment files from Business Central directly into Google Drive.</p><p><strong>The Issue: Too Many Access Token Requests</strong> In the initial design, each file upload triggered a fresh Google OAuth 2.0 API call requesting an Access Token using the Client ID, Client Secret, and Refresh Token. During historical migration with 6 parallel background threads syncing months of data simultaneously, the system sent thousands of token requests in minutes. This triggered Google's rate limiter, causing requests to fail with random <em>"Cannot get token"</em> and <em>"Too Many Requests (HTTP 429)"</em> exceptions.</p><h2>Evaluation of Solutions</h2><p>A Google OAuth access token remains valid for <strong>1 hour (3,600 seconds)</strong>. Instead of requesting a new token for every file upload, we should cache the active token alongside its expiration timestamp and reuse it across sessions.</p><table style="min-width: 75px;"><colgroup><col style="min-width: 25px;"><col style="min-width: 25px;"><col style="min-width: 25px;"></colgroup><tbody><tr><th colspan="1" rowspan="1"><p>Approach</p></th><th colspan="1" rowspan="1"><p>Technical Consideration</p></th><th colspan="1" rowspan="1"><p>Verdict</p></th></tr><tr><td colspan="1" rowspan="1"><p>Option 1: New Custom Table</p></td><td colspan="1" rowspan="1"><p>Adds a schema object for a single value, requires permission set setup, and consumes a licensed Table ID on-prem.</p></td><td colspan="1" rowspan="1"><p>Overkill</p></td></tr><tr><td colspan="1" rowspan="1"><p>Option 2: SingleInstance Codeunit</p></td><td colspan="1" rowspan="1"><p>Global variables are isolated to the active session. Six background threads would still fetch 6 separate tokens without cross-session caching.</p></td><td colspan="1" rowspan="1"><p>Session-Isolated</p></td></tr><tr><td colspan="1" rowspan="1"><p>Option 3: Setup Table Fields</p></td><td colspan="1" rowspan="1"><p>Mixes a short-lived secret into a business setup record that users can open and edit, and every token refresh modifies that shared record.</p></td><td colspan="1" rowspan="1"><p>Poor Fit</p></td></tr><tr><td colspan="1" rowspan="1"><p>Option 4: IsolatedStorage</p></td><td colspan="1" rowspan="1"><p>Lightweight key-value store persisted by the platform, shared across background sessions via <code>DataScope::Company</code>, scoped to the extension, and no custom table or permission set required.</p></td><td colspan="1" rowspan="1"><p>Selected Choice</p></td></tr></tbody></table><h2>Technical Implementation</h2><p>To avoid token expiration mid-transfer on large payloads, a <strong>10-minute safety buffer</strong> is applied, setting the cache window to 50 minutes instead of the full 60 minutes.</p><p><strong>TokenCacheManagement.al</strong></p><pre><code>/// &lt;summary&gt;
/// Retrieves the cached Access Token from IsolatedStorage or requests a new one if expired.
/// &lt;/summary&gt;
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

    if ExpireTime &lt;= CurrentDateTime() then
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
end;</code></pre><p>When the cached token expires, each thread that misses the cache fetches a new token, so up to 6 requests can go out at once. That small burst every 50 minutes is well within Google's limits.</p><h2>Testing &amp; Verification</h2><p>1. Before Optimization</p><p>Errors when requesting the access token</p><img src="/blogAsset/bc011/bc011-1.webp" alt="Token request errors from 6 background threads running concurrently"><p>2. After Optimization</p><p>Access token retrieved successfully, with no errors</p><img src="/blogAsset/bc011/bc011-2.webp" alt="Background threads reusing the cached access token without errors"><h2>Key Takeaways</h2><ul><li><p><strong>Minimal Contention:</strong> The token is written once per 50-minute window, so concurrent workers mostly just read it.</p></li><li><p><strong>Cross-Session Sharing:</strong> <code>DataScope::Company</code> allows multiple background workers to share the same cached token.</p></li><li><p><strong>No Extra Objects:</strong> No custom table, permission set, or setup field is needed, and values are isolated to the extension. For encryption, use <code>SetEncrypted</code>, but note its value length limit.</p></li></ul>
