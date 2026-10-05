---
id: BC-SOLUTIONS-012
title: aaa
date: 2026-10-05
excerpt: aa
tags: []
draft: false
format: html
---

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Business Central: resourceExposurePolicy in app.json</title>
  <!-- Google Fonts: Inter -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <!-- Font Awesome Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <!-- Link file style.css -->
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <div class="container">

    <!-- Header Section -->
    <header>
      <h1>
        <i class="fa-solid fa-shield-halved"></i>
        [Business Central] Protecting Your IP and Managing Source Code with resourceExposurePolicy
      </h1>
      <p style="margin-top: 15px; margin-bottom: 0;">
        When developing extensions for <strong>Microsoft Dynamics 365 Business Central</strong>, balancing Intellectual Property (IP) protection with supportability (debugging &amp; partner integration) is always a critical design decision. The single most powerful lever to strike this balance is the <code>resourceExposurePolicy</code> block in your <code>app.json</code>.
      </p>
    </header>

    <!-- Tags -->
    <div class="tags-container">
      <span class="tag"><i class="fa-solid fa-tag"></i> MSDyn365BC</span>
      <span class="tag"><i class="fa-solid fa-tag"></i> BusinessCentral</span>
      <span class="tag"><i class="fa-solid fa-code"></i> ALProgramming</span>
      <span class="tag"><i class="fa-solid fa-gears"></i> ERPDevelopment</span>
      <span class="tag"><i class="fa-solid fa-check-double"></i> BestPractices</span>
    </div>

    <!-- Section 1: General -->
    <section>
      <h2>
        <i class="fa-solid fa-circle-info"></i>
        1. General: What is resourceExposurePolicy?
      </h2>
      <p>
        <code>resourceExposurePolicy</code> is a configuration block within <code>app.json</code> that defines how exposed your AL source code and debugging capabilities will be once your extension is packaged and deployed.
      </p>
      
      <div class="highlight-box">
        <strong>Default Lockdown Policy</strong>
        If omitted from <code>app.json</code>, Business Central defaults to the most restrictive settings. Understanding each flag is essential to delivering the right experience for your target audience.
      </div>

      <!-- Code Block: Default Configuration -->
      <div class="code-wrapper">
        <div class="code-header">
          <div class="dot red"></div>
          <div class="dot yellow"></div>
          <div class="dot green"></div>
          <span class="code-title">app.json (Default configuration)</span>
        </div>
        <pre><code>"resourceExposurePolicy": {
    "allowDebugging": false,
    "allowDownloadingSource": false,
    "includeSourceInSymbolFile": false
}</code></pre>
      </div>
    </section>

    <!-- Section 2: Core Properties -->
    <section>
      <h2>
        <i class="fa-solid fa-sliders"></i>
        2. The 3 Core Properties Explained
      </h2>

      <div class="timeline">
        <div class="timeline-item">
          <span class="timeline-title"><i class="fa-solid fa-bug"></i> allowDebugging</span>
          <p><strong>Definition:</strong> Dictates whether external developers can attach a debugger to your extension code in a Sandbox environment.</p>
          <p><strong>Impact:</strong> When set to <code>true</code>, partners and developers can step through your execution flow, set breakpoints, and inspect variables during troubleshooting. When set to <code>false</code>, the debugger steps over your code, keeping the runtime execution opaque.</p>
        </div>

        <div class="timeline-item">
          <span class="timeline-title"><i class="fa-solid fa-file-arrow-down"></i> allowDownloadingSource</span>
          <p><strong>Definition:</strong> Controls whether the raw source code archive (<code>.zip</code>) can be exported directly from the Business Central Web Client via the <em>Extension Management</em> page.</p>
          <p><strong>Impact:</strong> Useful for handing over complete ownership. If set to <code>false</code>, users and partners only receive the compiled <code>.app</code> package and cannot extract your raw AL project files.</p>
        </div>

        <div class="timeline-item">
          <span class="timeline-title"><i class="fa-solid fa-cube"></i> includeSourceInSymbolFile</span>
          <p><strong>Definition:</strong> Embeds original AL source code within the generated symbol package (<code>.app</code>).</p>
          <p><strong>Impact:</strong> When other solutions reference your extension as a dependency, this enables <strong>"Go to Definition" (F12)</strong> in Visual Studio Code. External developers can read the implementation details, signatures, and event hooks, yet they still cannot download the raw project archive.</p>
        </div>
      </div>
    </section>

    <!-- Section 3: Best Practices -->
    <section>
      <h2>
        <i class="fa-solid fa-layer-group"></i>
        3. Best Practices by Deployment Scenario
      </h2>

      <!-- Scenario 1: In-House -->
      <h3>🏢 In-House Projects &amp; Per-Tenant Extensions (PTE)</h3>
      <p>The customer owns the customization. The top priorities are <strong>seamless maintenance</strong> and <strong>easy handovers</strong>:</p>
      
      <div class="code-wrapper">
        <div class="code-header">
          <div class="dot red"></div>
          <div class="dot yellow"></div>
          <div class="dot green"></div>
          <span class="code-title">app.json (PTE / In-House)</span>
        </div>
        <pre><code>"resourceExposurePolicy": {
    "allowDebugging": true,
    "allowDownloadingSource": true,
    "includeSourceInSymbolFile": true
}</code></pre>
      </div>
      <p><em>Why:</em> Ensures internal IT teams or future implementation partners can retrieve the original source code and debug issues immediately without tracking down lost repository branches.</p>

      <!-- Scenario 2: Commercial ISV -->
      <h3>🛡️ Commercial ISV / AppSource Solutions</h3>
      <p>The primary objective is <strong>safeguarding proprietary algorithms and core business logic</strong>:</p>
      
      <div class="code-wrapper">
        <div class="code-header">
          <div class="dot red"></div>
          <div class="dot yellow"></div>
          <div class="dot green"></div>
          <span class="code-title">app.json (Commercial ISV)</span>
        </div>
        <pre><code>"resourceExposurePolicy": {
    "allowDebugging": false,
    "allowDownloadingSource": false,
    "includeSourceInSymbolFile": false
}</code></pre>
      </div>
      <p><em>Pro Tip:</em> To let partners debug through integration points while keeping sensitive logic private, keep debugging enabled and apply the <code>[NonDebuggable]</code> attribute to critical procedures or variables instead of locking the entire app.</p>

      <!-- Scenario 3: Shared Library -->
      <h3>📚 Shared Libraries &amp; Integration Frameworks</h3>
      <p>Extensions acting as base applications or connectors meant to be extended by third parties:</p>

      <div class="code-wrapper">
        <div class="code-header">
          <div class="dot red"></div>
          <div class="dot yellow"></div>
          <div class="dot green"></div>
          <span class="code-title">app.json (Shared Framework)</span>
        </div>
        <pre><code>"resourceExposurePolicy": {
    "allowDebugging": true,
    "allowDownloadingSource": false,
    "includeSourceInSymbolFile": true
}</code></pre>
      </div>
      <p><em>Why:</em> Consumers can inspect integration events and API contracts via F12, attach the debugger to trace calling errors, but cannot redistribute or export your source repository.</p>
    </section>

    <!-- Key Takeaway -->
    <div class="highlight-box" style="margin-top: 40px;">
      <strong>💡 Key Takeaway</strong>
      There is no universal "one-size-fits-all" setup. Determine whether your package represents <strong>commercial IP</strong> or an <strong>operational asset</strong>, and configure <code>resourceExposurePolicy</code> deliberately from day one!
    </div>

  </div>

</body>
</html>
