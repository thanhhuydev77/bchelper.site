---
id: BC-SOLUTIONS-012
title: aaa
date: 2026-10-05
excerpt: aa
tags: []
draft: false
format: html
---

<header>
    <h1>[Business Central] Protecting Your IP and Managing Source Code with <code>resourceExposurePolicy</code> in <code>app.json</code> 🚀</h1>
    <p>
      When developing extensions for <strong>Microsoft Dynamics 365 Business Central</strong>, balancing Intellectual Property (IP) protection with supportability (debugging &amp; partner integration) is always a critical design decision.
    </p>
    <p>
      The single most powerful lever to strike this balance is the <strong><code>resourceExposurePolicy</code></strong> block in your <code>app.json</code>.
    </p>
  </header>

  <!-- Section 1 -->
  <section>
    <h2>1. General: What is <code>resourceExposurePolicy</code>?</h2>
    <p>
      <code>resourceExposurePolicy</code> is a configuration block within <code>app.json</code> that defines how exposed your AL source code and debugging capabilities will be once your extension is packaged and deployed.
    </p>
    <p>
      By default, if left unspecified in <code>app.json</code>, Business Central enforces the most restrictive settings:
    </p>
    <pre><code>"resourceExposurePolicy": {
    "allowDebugging": false,
    "allowDownloadingSource": false,
    "includeSourceInSymbolFile": false
}</code></pre>
    <p>
      Because the platform locks everything down by default, understanding each flag is essential to delivering the right experience for your target audience.
    </p>
  </section>

  <!-- Section 2 -->
  <section>
    <h2>2. The 3 Core Properties Explained</h2>
    
    <div>
      <h3>🔍 <code>allowDebugging</code></h3>
      <ul>
        <li><strong>Definition:</strong> Dictates whether external developers can attach a debugger to your extension code in a Sandbox environment.</li>
        <li><strong>Impact:</strong> When set to <code>true</code>, partners and developers can step through your execution flow, set breakpoints, and inspect variables during troubleshooting. When set to <code>false</code>, the debugger steps over your code, keeping the runtime execution opaque.</li>
      </ul>
    </div>

    <div>
      <h3>📥 <code>allowDownloadingSource</code></h3>
      <ul>
        <li><strong>Definition:</strong> Controls whether the raw source code archive (<code>.zip</code>) can be exported directly from the Business Central Web Client via the <em>Extension Management</em> page.</li>
        <li><strong>Impact:</strong> Useful for handing over complete ownership. If set to <code>false</code>, users and partners only receive the compiled <code>.app</code> package and cannot extract your raw AL project files.</li>
      </ul>
    </div>

    <div>
      <h3>📦 <code>includeSourceInSymbolFile</code></h3>
      <ul>
        <li><strong>Definition:</strong> Embeds original AL source code within the generated symbol package (<code>.app</code>).</li>
        <li><strong>Impact:</strong> When other solutions reference your extension as a dependency, this enables <strong>"Go to Definition" (F12)</strong> in Visual Studio Code. External developers can read the implementation details, signatures, and event hooks, yet they still cannot download the raw project archive.</li>
      </ul>
    </div>
  </section>

  <!-- Section 3 -->
  <section>
    <h2>3. Best Practices by Deployment Scenario</h2>

    <div>
      <h3>🏢 In-House Projects &amp; Per-Tenant Extensions (PTE)</h3>
      <p>The customer owns the customization. The top priorities are <strong>seamless maintenance</strong> and <strong>easy handovers</strong>:</p>
      <pre><code>"resourceExposurePolicy": {
    "allowDebugging": true,
    "allowDownloadingSource": true,
    "includeSourceInSymbolFile": true
}</code></pre>
      <blockquote>
        <strong>Why:</strong> Ensures internal IT teams or future implementation partners can retrieve the original source code and debug issues immediately without tracking down lost repository branches.
      </blockquote>
    </div>

    <div>
      <h3>🛡️ Commercial ISV / AppSource Solutions</h3>
      <p>The primary objective is <strong>safeguarding proprietary algorithms and core business logic</strong>:</p>
      <pre><code>"resourceExposurePolicy": {
    "allowDebugging": false,
    "allowDownloadingSource": false,
    "includeSourceInSymbolFile": false
}</code></pre>
      <blockquote>
        <strong>Pro Tip:</strong> To let partners debug through integration points while keeping sensitive logic private, keep debugging enabled and apply the <code>[NonDebuggable]</code> attribute to critical procedures or variables instead of locking the entire app.
      </blockquote>
    </div>

    <div>
      <h3>📚 Shared Libraries &amp; Integration Frameworks</h3>
      <p>Extensions acting as base applications or connectors meant to be extended by third parties:</p>
      <pre><code>"resourceExposurePolicy": {
    "allowDebugging": true,
    "allowDownloadingSource": false,
    "includeSourceInSymbolFile": true
}</code></pre>
      <blockquote>
        <strong>Why:</strong> Consumers can inspect integration events and API contracts via F12, attach the debugger to trace calling errors, but cannot redistribute or export your source repository.
      </blockquote>
    </div>
  </section>

  <footer>
    <p>
      💡 <strong>Key Takeaway:</strong> There is no universal "one-size-fits-all" setup. Determine whether your package represents <strong>commercial IP</strong> or an <strong>operational asset</strong>, and configure <code>resourceExposurePolicy</code> deliberately from day one!
    </p>
    <p>
      #MSDyn365BC #BusinessCentral #ALProgramming #ERPDevelopment #BestPractices #CleanCode
    </p>
  </footer>
