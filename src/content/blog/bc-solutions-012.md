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
        <header>
            <h1>How IsolatedStorage Saved Me from Spamming APIs for Access Tokens</h1>
        </header>

        <section>
            <h2><i class="ri-information-line"></i> Background</h2>
            <p>Recently, the database storage in our Microsoft Dynamics 365 Business Central environment was increasing
                rapidly due to user attachment files (invoices, receipts, PDF reports, etc.). To reduce storage
                footprint and optimize operational costs, I built a background synchronization service to automatically
                offload and store attachment files from Business Central directly into Google Drive.</p>

            <div class="highlight-box">
                <strong><i class="ri-alert-line"></i> The Issue: Too Many Requests Call API AccessToken</strong>
                In the initial design, each file upload triggered a fresh Google OAuth 2.0 API call requesting an Access
                Token using the Client ID, Client Secret, and Refresh Token. During historical migration with 6
                parallel background threads syncing months of data simultaneously, the system blasted
                thousands of token requests in minutes. This triggered Google's rate limiter, causing requests to fail
                with random <em>"Cannot get token"</em> and <em>"Too Many Requests (HTTP 429)"</em> exceptions.
            </div>
        </section>

        <section>
            <h2><i class="ri-scales-3-line"></i> Evaluation of Solutions</h2>
            <p>A Google OAuth access token remains valid for <strong>1 hour (3,600 seconds)</strong>. Instead of
                requesting a new token for every file upload, we should cache the active token alongside its expiration
                timestamp and reuse it across sessions.</p>

            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <thead>
                    <tr style="background: var(--tag-bg); text-align: left;">
                        <th style="padding: 12px; border: 1px solid var(--border-color);">Approach</th>
                        <th style="padding: 12px; border: 1px solid var(--border-color);">Technical Consideration</th>
                        <th style="padding: 12px; border: 1px solid var(--border-color);">Verdict</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 10px; border: 1px solid var(--border-color);"><strong>Option 1: New Custom
                                Table</strong></td>
                        <td style="padding: 10px; border: 1px solid var(--border-color);">Consumes a licensed Table ID, requires
                            permission set setup, and adds database I/O overhead.</td>
                        <td style="padding: 10px; border: 1px solid var(--border-color); color: var(--fail-color);">Too Expensive</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid var(--border-color);"><strong>Option 2: SingleInstance
                                Codeunit</strong></td>
                        <td style="padding: 10px; border: 1px solid var(--border-color);">Global variables are isolated to the
                            active session. Six background threads would still fetch 6 separate tokens without
                            cross-session caching.</td>
                        <td style="padding: 10px; border: 1px solid var(--border-color); color: var(--fail-color);">Session-Isolated</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid var(--border-color);"><strong>Option 3: Setup Table
                                Fields</strong></td>
                        <td style="padding: 10px; border: 1px solid var(--border-color);">Writing token state across multiple
                            high-concurrency threads causes severe database record locks (Table Locking).</td>
                        <td style="padding: 10px; border: 1px solid var(--border-color); color: var(--fail-color);">Locking Risk</td>
                    </tr>
                    <tr style="background: rgba(76, 175, 80, 0.12);">
                        <td style="padding: 10px; border: 1px solid var(--border-color);"><strong>Option 4: IsolatedStorage</strong>
                        </td>
                        <td style="padding: 10px; border: 1px solid var(--border-color);">Fast in-memory key-value store, accessible
                            across background sessions via <code>DataScope::Company</code>, encrypted by default, zero
                            table locks, and zero licensed table IDs consumed.</td>
                        <td style="padding: 10px; border: 1px solid var(--border-color); color: var(--success-color);"><strong>Selected
                                Choice</strong></td>
                    </tr>
                </tbody>
            </table>
        </section>

        <section>
            <h2><i class="ri-code-s-slash-line"></i> Technical Implementation</h2>
            <div class="tags-container">
                <span class="tag"><i class="ri-hashtag"></i> API</span>
                <span class="tag"><i class="ri-hashtag"></i> IsolatedStorage</span>
                <span class="tag"><i class="ri-hashtag"></i> Token Cache</span>
                <span class="tag"><i class="ri-hashtag"></i> OAuth 2.0</span>
                <span class="tag"><i class="ri-hashtag"></i> AL Programming</span>
            </div>

            <p>To avoid token expiration mid-transfer on large payloads, a <strong>10-minute safety buffer</strong> is
                applied, setting the cache window to 50 minutes instead of the full 60 minutes.</p>

            <div class="code-wrapper">
                <div class="code-header">
                    <div class="dot red"></div>
                    <div class="dot yellow"></div>
                    <div class="dot green"></div>
                    <div class="code-title">TokenCacheManagement.al</div>
                </div>
                <pre><code>/// &lt;summary&gt;
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

    // Clean up old values before setting new ones
    if IsolatedStorage.Contains('GG_DRIVE_TOKEN', TokenScope) then
        IsolatedStorage.Delete('GG_DRIVE_TOKEN', TokenScope);

    if IsolatedStorage.Contains('GG_DRIVE_TOKEN_EXP', TokenScope) then
        IsolatedStorage.Delete('GG_DRIVE_TOKEN_EXP', TokenScope);

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

end;</code></pre>
            </div>
        </section>

        <section>
            <h2><i class="ri-flask-line"></i> Testing & Verification</h2>
            <div class="timeline">
                <div class="timeline-item">
                    <span class="timeline-title">1. Before Optimization</span>
                    <p>Error when get AccessToken</p>
                    <div class="img-container">
                        <img src="/blogAsset/bc011/bc011-1.webp" alt="6 background threads running concurrently"
                            style="width:100%; border-radius:8px; border:1px solid #e2e8f0;" />
                    </div>
                </div>

                <div class="timeline-item">
                    <span class="timeline-title">2. After Optimization</span>
                    <p>Successfully get AccessToken without any Error</p>
                    <div class="img-container">
                        <img src="/blogAsset/bc011/bc011-2.webp"
                            style="width:100%; border-radius:8px; border:1px solid #e2e8f0;" />
                    </div>
                </div>
            </div>
        </section>

        <section>
            <h2><i class="ri-thumb-up-line"></i> Key Takeaways</h2>
            <ul class="pro-list">
                <li><i class="ri-check-line" style="color:var(--success-color)"></i> <strong>Zero Database
                        Locking:</strong> Reading and writing to <code>IsolatedStorage</code> does not lock SQL tables.
                </li>
                <li><i class="ri-check-line" style="color:var(--success-color)"></i> <strong>Cross-Session
                        Sharing:</strong> DataScope::Company allows multiple background workers
                    to share the same cached token.</li>
                <li><i class="ri-check-line" style="color:var(--success-color)"></i> <strong>Built-in
                        Encryption:</strong> Secure storage without having to manually manage encryption keys or custom
                    license objects.</li>
            </ul>
        </section>