---
id: BC-SOLUTIONS-012
title: 'resourceExposurePolicy: Hide Source Code or Allow Debugging?'
date: 2026-10-05
excerpt: 'A practical guide to mastering resourceExposurePolicy in Business Central: protecting your IP without sacrificing debugging and integration.'
tags:
  - App.json
  - Debugging
  - Configuration
draft: false
format: html
---

<div class="container">
    <section>
        <h2><i class="ri-information-line"></i> Background</h2>
        <p>When building apps in Business Central, developers often face a dilemma: <strong>protecting proprietary code/logic</strong> versus <strong>opening it up for partners and clients to debug and integrate</strong>. All of these permissions are controlled directly via the <strong><code>resourceExposurePolicy</code></strong> setting in the <code>app.json</code> file.</p>
    </section>

    <section>
        <h2><i class="ri-error-warning-line"></i> Heads Up: BC Locks Everything by Default</h2>
        <p>If you forget to declare this block in your <code>app.json</code>, Business Central defaults every single property to <code>false</code>. That means no debugging, no source downloading, and no F12 code inspection:</p>

        <div class="code-wrapper">
            <div class="code-header">
                <div class="dot red"></div>
                <div class="dot yellow"></div>
                <div class="dot green"></div>
            </div>
            <pre><code>"resourceExposurePolicy": {
    "allowDebugging": false,
    "allowDownloadingSource": false,
    "includeSourceInSymbolFile": false
}</code></pre>
        </div>
    </section>

    <section>
        <h2><i class="ri-equalizer-line"></i> Quick Breakdown of the 3 Key Flags</h2>
        <p>Each flag handles a specific access permission when other developers work with your app:</p>

        <div class="timeline">
            <div class="timeline-item">
                <span class="timeline-title">1. allowDebugging</span>
                <p>Determines whether developers can attach the VS Code debugger to your app in Sandbox environments.</p>
                <ul class="pro-list">
                    <li><i class="ri-check-line" style="color:var(--success-color)"></i> <strong>true:</strong> Other devs can set breakpoints, inspect variable values, and step through code line by line to track down bugs.</li>
                    <li><i class="ri-close-fill" style="color:var(--fail-color)"></i> <strong>false:</strong> The debugger skips over your app entirely, keeping everything inside hidden.</li>
                </ul>
            </div>

            <div class="timeline-item">
                <span class="timeline-title">2. allowDownloadingSource</span>
                <p>Controls whether users can export the raw source code (the <code>.zip</code> file) directly from the <em>Extension Management</em> page in the Web Client.</p>
                <ul class="pro-list">
                    <li><i class="ri-check-line" style="color:var(--success-color)"></i> <strong>true:</strong> Anyone with admin permissions can download the original source code locally.</li>
                    <li><i class="ri-close-fill" style="color:var(--fail-color)"></i> <strong>false:</strong> Only the compiled <code>.app</code> package is deployed; no one can extract the original AL source files back out.</li>
                </ul>
            </div>

            <div class="timeline-item">
                <span class="timeline-title">3. includeSourceInSymbolFile</span>
                <p>Embeds AL code into the symbol package (<code>.app</code>) so other extensions can reference it as a dependency.</p>
                <ul class="pro-list">
                    <li><i class="ri-check-line" style="color:var(--success-color)"></i> <strong>true:</strong> When external developers call your events or APIs, hitting <strong>F12 (Go to Definition)</strong> lets them see the actual logic inside.</li>
                    <li><i class="ri-close-fill" style="color:var(--fail-color)"></i> <strong>false:</strong> Hitting F12 only displays method signatures and parameters; the implementation details stay hidden.</li>
                </ul>
            </div>
        </div>
    </section>

    <section>
        <h2><i class="ri-shield-keyhole-line"></i> Best Practices for Real-World Scenarios</h2>

        <h3><code>1. In-House Apps / Per-Tenant Extensions (PTE)</code></h3>
        <p>The client pays for the custom app and owns the code. Set everything to true to make future maintenance, handovers, or bug fixing with external partners as frictionless as possible:</p>
        <div class="code-wrapper">
            <div class="code-header">
                <div class="dot red"></div>
                <div class="dot yellow"></div>
                <div class="dot green"></div>
            </div>
            <pre><code>"resourceExposurePolicy": {
    "allowDebugging": true,
    "allowDownloadingSource": true,
    "includeSourceInSymbolFile": true
}</code></pre>
        </div>

        <h3><code>2. Commercial Products / AppSource (ISV Apps)</code></h3>
        <p>You need to protect your core business logic and algorithms from being copied or extracted:</p>
        <div class="code-wrapper">
            <div class="code-header">
                <div class="dot red"></div>
                <div class="dot yellow"></div>
                <div class="dot green"></div>
            </div>
            <pre><code>"resourceExposurePolicy": {
    "allowDebugging": false,
    "allowDownloadingSource": false,
    "includeSourceInSymbolFile": false
}</code></pre>
        </div>
        <div class="highlight-box">
            <strong>Pro Tip for Devs:</strong>
            If you want to let partners debug general execution flows while hiding passwords, API keys, or sensitive calculation logic, keep <code>allowDebugging: true</code> and add the <code>[NonDebuggable]</code> attribute directly onto those specific procedures or variables.
        </div>

        <h3><code>3. Base Apps / Shared Libraries for Integrations</code></h3>
        <p>Other developers need to consume your APIs, subscribe to your events, and troubleshoot integration errors on their own—without you distributing the entire raw repository:</p>
        <div class="code-wrapper">
            <div class="code-header">
                <div class="dot red"></div>
                <div class="dot yellow"></div>
                <div class="dot green"></div>
            </div>
            <pre><code>"resourceExposurePolicy": {
    "allowDebugging": true,
    "allowDownloadingSource": false,
    "includeSourceInSymbolFile": true
}</code></pre>
        </div>
    </section>

    <section>
        <h2><i class="ri-medal-line"></i> Takeaways</h2>
        <p>Set your flags right from day one depending on your app type:</p>
        <ul class="pro-list">
            <li><i class="ri-flashlight-line"></i> <strong>For PTE:</strong> Set all three to <code>true</code> to avoid the hassle of emailing zip files back and forth during handovers.</li>
            <li><i class="ri-shield-check-line"></i> <strong>For ISV:</strong> Disable source downloading, and consider using <code>[NonDebuggable]</code> instead of locking down the entire app.</li>
            <li><i class="ri-git-repository-line"></i> <strong>For Base/Core Apps:</strong> Allow F12 code navigation and debugging so third-party developers can self-diagnose integration issues easily.</li>
        </ul>
    </section>
</div>
