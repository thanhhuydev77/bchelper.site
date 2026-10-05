---
id: BC-SOLUTIONS-012
title: 'resourceExposurePolicy: Protect Your IP or Enable Debugging?'
date: 2026-10-05
excerpt: 'A practical guide to mastering resourceExposurePolicy in Business Central: protecting your IP without sacrificing debugging and integration.'
tags:
  - App.json
  - Configuration
  - Debugging
  - ISV
draft: false
format: html
---

<div class="container">
       <section>
        <h2><i class="ri-information-line"></i> Background</h2>
        <p>When developing extensions for Microsoft Dynamics 365 Business Central, developers constantly balance two priorities: <strong>protecting proprietary intellectual property (IP)</strong> versus <strong>empowering partners or clients to troubleshoot and integrate</strong>. All access boundaries are governed directly through the <strong><code>resourceExposurePolicy</code></strong> setting in your <code>app.json</code> file.</p>
        
        <div class="highlight-box">
            <strong><i class="ri-cloud-line"></i> Scope Note: Cloud vs. On-Premises</strong>
            According to official Microsoft Learn documentation, the <code>resourceExposurePolicy</code> is primarily enforced in <strong>Business Central Cloud (SaaS)</strong> environments. For On-Premises installations, server administrators with direct SQL and file system access can still inspect compiled assemblies regardless of these flags.
        </div>
    </section>

    <section>
        <h2><i class="ri-error-warning-line"></i> Default Lockdown: Zero Access</h2>
        <p>If you omit this block from your <code>app.json</code>, Business Central defaults every single property to <code>false</code>. That means no debugging, no raw source code downloads, and no F12 code inspection for external developers:</p>

        <div class="code-wrapper">
            <div class="code-header">
                <div class="dot red"></div>
                <div class="dot yellow"></div>
                <div class="dot green"></div>
            </div>
            <pre><code>"resourceExposurePolicy": {
    "allowDebugging": false,
    "allowDownloadingSource": false,
    "includeSourceInSymbolFile": false,
    "applyToDevExtension": false
}</code></pre>
        </div>
    </section>

    <section>
        <h2><i class="ri-equalizer-line"></i> Breakdown of Core Properties</h2>
        <p>Each parameter handles a specific security and access layer across deployment, debugging, and dependency referencing:</p>

        <div class="timeline">
            <div class="timeline-item">
                <span class="timeline-title">1. allowDebugging</span>
                <p>Controls whether external developers can attach a VS Code debugger or run <strong>Snapshot Debugging</strong> sessions on your extension in Sandbox environments.</p>
                <ul class="pro-list">
                    <li><i class="ri-check-line" style="color:var(--success-color)"></i> <strong>true:</strong> Developers can set breakpoints, step through procedures, and inspect runtime variable values.</li>
                    <li><i class="ri-close-fill" style="color:var(--fail-color)"></i> <strong>false:</strong> The debugger completely steps over your objects, treating your code as an opaque black box.</li>
                </ul>
            </div>

            <div class="timeline-item">
                <span class="timeline-title">2. allowDownloadingSource</span>
                <p>Determines whether administrators can download the original AL source code archive (the <code>.zip</code> file) directly from the <em>Extension Management</em> page in the Web Client.</p>
                <ul class="pro-list">
                    <li><i class="ri-check-line" style="color:var(--success-color)"></i> <strong>true:</strong> Anyone with management permissions can export the complete source code project.</li>
                    <li><i class="ri-close-fill" style="color:var(--fail-color)"></i> <strong>false:</strong> Only the compiled <code>.app</code> package remains deployed; raw source files cannot be retrieved via the client.</li>
                </ul>
            </div>

            <div class="timeline-item">
                <span class="timeline-title">3. includeSourceInSymbolFile</span>
                <p>Controls whether actual AL source code is embedded within the symbol package (<code>.app</code>) downloaded by dependent extensions.</p>
                <ul class="pro-list">
                    <li><i class="ri-check-line" style="color:var(--success-color)"></i> <strong>true:</strong> Third-party developers referencing your app can press <strong>F12 (Go to Definition)</strong> in VS Code to view full implementation details and event handlers.</li>
                    <li><i class="ri-close-fill" style="color:var(--fail-color)"></i> <strong>false:</strong> F12 only generates metadata declarations (signatures, fields, parameters); the implementation logic remains completely hidden.</li>
                </ul>
            </div>

            <div class="timeline-item">
                <span class="timeline-title">4. applyToDevExtension</span>
                <p>Controls whether the restrictions defined above apply to extensions published directly from Visual Studio Code using the development endpoint (pressing <strong>F5 / Ctrl+F5</strong>).</p>
                <ul class="pro-list">
                    <li><i class="ri-check-line" style="color:var(--success-color)"></i> <strong>false (Default &amp; Recommended):</strong> Restrictions only take effect when the package is formally published (e.g., via PowerShell or Admin Center). Direct F5 deployments to sandboxes remain fully debuggable for rapid development.</li>
                    <li><i class="ri-error-warning-line" style="color:var(--primary-color)"></i> <strong>true:</strong> Enforces all exposure policies immediately, even during local F5 deployment. Use this setting when you need to simulate exactly what third-party developers will see before releasing the app.</li>
                </ul>
            </div>
        </div>
    </section>

    <section>
        <h2><i class="ri-shield-keyhole-line"></i> Best Practices by Scenario</h2>

        <h3><code>1. In-House Apps &amp; Per-Tenant Extensions (PTE)</code></h3>
        <p>The client owns the customization. The primary goal is effortless lifecycle management, future maintenance, and seamless team handovers:</p>
        <div class="code-wrapper">
            <div class="code-header">
                <div class="dot red"></div>
                <div class="dot yellow"></div>
                <div class="dot green"></div>
            </div>
            <pre><code>"resourceExposurePolicy": {
    "allowDebugging": true,
    "allowDownloadingSource": true,
    "includeSourceInSymbolFile": true,
    "applyToDevExtension": false
}</code></pre>
        </div>

        <h3><code>2. Commercial Products &amp; AppSource (ISV Solutions)</code></h3>
        <p>Focuses on safeguarding proprietary algorithms, IP assets, and core business calculations against reverse engineering:</p>
        <div class="code-wrapper">
            <div class="code-header">
                <div class="dot red"></div>
                <div class="dot yellow"></div>
                <div class="dot green"></div>
            </div>
            <pre><code>"resourceExposurePolicy": {
    "allowDebugging": false,
    "allowDownloadingSource": false,
    "includeSourceInSymbolFile": false,
    "applyToDevExtension": false
}</code></pre>
        </div>
        <div class="highlight-box">
            <strong><i class="ri-lightbulb-flash-line"></i> Pro Tip: Granular Protection with [NonDebuggable]</strong>
            If you want external partners to debug general workflow integration without exposing sensitive credentials, tokens, or proprietary logic, leave <code>allowDebugging: true</code> and decorate those specific procedures or variables with the <code>[NonDebuggable]</code> attribute.
        </div>

        <h3><code>3. Shared Frameworks &amp; Integration Libraries</code></h3>
        <p>Enables downstream developers to consume APIs, bind to integration events, and self-troubleshoot runtime errors without distributing the raw repository:</p>
        <div class="code-wrapper">
            <div class="code-header">
                <div class="dot red"></div>
                <div class="dot yellow"></div>
                <div class="dot green"></div>
            </div>
            <pre><code>"resourceExposurePolicy": {
    "allowDebugging": true,
    "allowDownloadingSource": false,
    "includeSourceInSymbolFile": true,
    "applyToDevExtension": false
}</code></pre>
        </div>
    </section>

    <section>
        <h2><i class="ri-medal-line"></i> Summary</h2>
        <ul class="pro-list">
            <li><i class="ri-flashlight-line"></i> <strong>For PTE:</strong> Enable all three core flags (<code>true</code>) to prevent lost code repositories and streamline handovers[cite: 1, 2].</li>
            <li><i class="ri-shield-user-line"></i> <strong>For ISVs:</strong> Disable source downloads and combine debugging permissions with <code>[NonDebuggable]</code> to safeguard core algorithms.</li>
            <li><i class="ri-tools-line"></i> <strong>applyToDevExtension:</strong> Leave this set to <code>false</code> during day-to-day development so F5 sandbox deployments remain unrestricted.</li>
        </ul>
    </section>
</div>
