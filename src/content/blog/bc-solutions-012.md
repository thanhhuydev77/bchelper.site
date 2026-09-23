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
<h2>Background</h2><p>Recently, the database storage in our Microsoft Dynamics 365 Business Central environment was increasing rapidly due to user attachment files (invoices, receipts, PDF reports, etc.). To reduce storage footprint and optimize operational costs, I built a background synchronization service to automatically offload and store attachment files from Business Central directly into Google Drive.</p><p><strong> The Issue: Too Many Requests Call API AccessToken</strong> In the initial design, each file upload triggered a fresh Google OAuth 2.0 API call requesting an Access Token using the Client ID, Client Secret, and Refresh Token. During historical migration with 6 parallel background threads syncing months of data simultaneously, the system blasted thousands of token requests in minutes. This triggered Google's rate limiter, causing requests to fail with random <em>"Cannot get token"</em> and <em>"Too Many Requests (HTTP 429)"</em> exceptions.</p><h2>Evaluation of Solutions</h2><p>A Google OAuth access token remains valid for <strong>1 hour (3,600 seconds)</strong>. Instead of requesting a new token for every file upload, we should cache the active token alongside its expiration timestamp and reuse it across sessions.</p><table style="min-width: 75px;"><colgroup><col style="min-width: 25px;"><col style="min-width: 25px;"><col style="min-width: 25px;"></colgroup><tbody><tr><th colspan="1" rowspan="1"><p>Approach</p></th><th colspan="1" rowspan="1"><p>Technical Consideration</p></th><th colspan="1" rowspan="1"><p>Verdict</p></th></tr><tr><td colspan="1" rowspan="1"><p><strong>Option 1: New Custom Table</strong></p></td><td colspan="1" rowspan="1"><p>Consumes a licensed Table ID, requires permission set setup, and adds database I/O overhead.</p></td><td colspan="1" rowspan="1"><p>Too Expensive</p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>Option 2: SingleInstance Codeunit</strong></p></td><td colspan="1" rowspan="1"><p>Global variables are isolated to the active session. Six background threads would still fetch 6 separate tokens without cross-session caching.</p></td><td colspan="1" rowspan="1"><p>Session-Isolated</p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>Option 3: Setup Table Fields</strong></p></td><td colspan="1" rowspan="1"><p>Writing token state across multiple high-concurrency threads causes severe database record locks (Table Locking).</p></td><td colspan="1" rowspan="1"><p>Locking Risk</p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>Option 4: IsolatedStorage</strong></p></td><td colspan="1" rowspan="1"><p>Fast in-memory key-value store, accessible across background sessions via <code>DataScope::Company</code>, encrypted by default, zero table locks, and zero licensed table IDs consumed.</p></td><td colspan="1" rowspan="1"><p><strong>Selected Choice</strong></p></td></tr></tbody></table><h2>Technical Implementation</h2><p> API IsolatedStorage Token Cache OAuth 2.0 AL Programming</p><p>To avoid token expiration mid-transfer on large payloads, a <strong>10-minute safety buffer</strong> is applied, setting the cache window to 50 minutes instead of the full 60 minutes.</p><p>TokenCacheManagement.al</p><pre><code>/// &lt;summary&gt;
```

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

```
// If not found or expired, request a new token directly from Google API
ReturnAccessToken := GetAccessTokenDirect();

// Cache the token with a 50-minute lifetime (10-minute safety gap)
NewExpireTime := CurrentDateTime() + (50 * 60 * 1000);
SetTokenToIsolatedStorage(ReturnAccessToken, NewExpireTime);
```

end;

[TryFunction]
local procedure TryGetTokenFromIsolatedStorage(var RetrievedToken: Text)
var
    ExpiryText: Text;
    ExpireTime: DateTime;
    TokenScope: DataScope;
begin
    TokenScope := DataScope::Company;

```
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
```

end;

local procedure SetTokenToIsolatedStorage(NewToken: Text; ExpireTime: DateTime)
var
    TokenScope: DataScope;
begin
    TokenScope := DataScope::Company;

```
// Clean up old values before setting new ones
if IsolatedStorage.Contains('GG_DRIVE_TOKEN', TokenScope) then
    IsolatedStorage.Delete('GG_DRIVE_TOKEN', TokenScope);

if IsolatedStorage.Contains('GG_DRIVE_TOKEN_EXP', TokenScope) then
    IsolatedStorage.Delete('GG_DRIVE_TOKEN_EXP', TokenScope);

IsolatedStorage.Set('GG_DRIVE_TOKEN', NewToken, TokenScope);
IsolatedStorage.Set('GG_DRIVE_TOKEN_EXP', Format(ExpireTime, 0, 9), TokenScope);
            
        
    </code></pre><h2><code> Testing &amp; Verification</code></h2><p><code>1. Before Optimization<br>                </code></p><p><code>Error when get AccessToken</code></p><img src="/blogAsset/bc011/bc011-1.webp" alt="6 background threads running concurrently"><p><code>2. After Optimization<br>                </code></p><p><code>Successfully get AccessToken without any Error</code></p><img src="/blogAsset/bc011/bc011-2.webp"><h2><code> Key Takeaways</code></h2><ul><li><p><code>Zero Database<br>                    Locking: Reading and writing to IsolatedStorage does not lock SQL tables.<br>            </code></p></li><li><p><code>Cross-Session<br>                    Sharing: DataScope::Company allows multiple background workers<br>                to share the same cached token.</code></p></li><li><p><code>Built-in<br>                    Encryption: Secure storage without having to manually manage encryption keys or custom<br>                license objects.</code></p></li></ul><p></p>