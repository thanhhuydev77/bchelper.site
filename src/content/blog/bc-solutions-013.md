---
id: BC-SOLUTIONS-013
title: Using Conditional Directives to Adopt New AL Features Early Without Breaking Production
date: 2026-10-18
excerpt: Using Conditional Directives, you can safely write modern code using new methods like Record.IsDirty() today, build cleanly for Production now, and activate the new capabilities with a single configuration update when the time comes.
tags:
  - Conditional Directives
  - CLEAN28
  - app.json
  - preprocessorSymbols
draft: false
format: html
---


<div class="container">
    <section>
        <h2><i class="ri-information-line"></i> Background</h2>
        <p>When developing for Microsoft Dynamics 365 Business Central Cloud, managing different platform versions across tenants is a constant reality:</p>
        <ul>
            <li><strong>Production Environment:</strong> Version 28 (Runtime <code>17.0</code>)</li>
            <li><strong>Sandbox Environment:</strong> Version 29 (Runtime <code>18.0</code>)</li>
        </ul>
        <p>Microsoft frequently introduces modern AL language enhancements in major waves. A notable addition in version 29 (runtime <code>18.0</code>) is the <code>Record.IsDirty()</code> method, which verifies if an in-memory record has been modified prior to executing costly database write transactions.</p>
        
        <div class="highlight-box">
            <strong><i class="ri-alert-line"></i> The Problem: Compilation Failure AL0666</strong>
            <p>While testing new methods in a sandbox works seamlessly, deploying that same codebase to production fails immediately during build time:</p>
            <code>error AL0666: 'IsDirty' is not available in runtime version '17.0'. The supported runtime versions are: '18.0' or greater.</code>
            <p>Developers often resort to temporary workarounds (such as writing manual field-by-field comparisons) just to get production packages compiled. Once deployed, these workarounds are easily forgotten, accumulating technical debt and preventing teams from adopting clean platform features even after production catches up to version 29.</p>
        </div>
    </section>

    <section>
        <h2><i class="ri-lightbulb-flash-line"></i> Solution: Conditional Directives (Preprocessor Symbols)</h2>
        <p>Instead of maintaining parallel Git branches or leaving messy temporary code behind, <strong>Conditional Directives</strong> provide a single source of truth:</p>
        <ul>
            <li><strong>Production Builds (v28 / Runtime 17.0):</strong> The preprocessor symbol is omitted. The compiler skips the new syntax entirely, allowing the app package to build without errors.</li>
            <li><strong>Sandbox Builds (v29 / Runtime 18.0):</strong> The symbol is activated in <code>app.json</code>, enabling <code>Record.IsDirty()</code> for early testing.</li>
            <li><strong>Seamless Future Upgrades:</strong> When production upgrades to version 29, no AL logic needs refactoring—simply toggle the symbol in <code>app.json</code>.</li>
        </ul>
    </section>

    <section>
        <h2><i class="ri-code-s-slash-line"></i> Technical Implementation</h2>
        <div class="tags-container">
            <span class="tag"><i class="ri-hashtag"></i> AL Directives</span>
            <span class="tag"><i class="ri-hashtag"></i> Preprocessor</span>
            <span class="tag"><i class="ri-hashtag"></i> IsDirty</span>
            <span class="tag"><i class="ri-hashtag"></i> Runtime Management</span>
            <span class="tag"><i class="ri-hashtag"></i> Multi-Version</span>
        </div>

        <h3>Step 1: Code Before Changes</h3>
        <p>The standard baseline procedure validates profit and writes directly to SQL regardless of whether values changed:</p>
        <div class="code-wrapper">
            <div class="code-header">
                <div class="dot red"></div><div class="dot yellow"></div><div class="dot green"></div>
                <div class="code-title">CustomerListExt.al</div>
            </div>
<pre><code>local procedure UpdateProfit()
var
    NewProfit: Decimal;
begin
    NewProfit := GetProfitFromAPI();
    Rec.Validate("Profit (LCY)", NewProfit);
    Rec.Modify(true);
end;</code></pre>
        </div>

        <h3>Step 2: Wrap New Methods with Preprocessor Directives</h3>
        <p>Encapsulate the call to <code>Rec.IsDirty()</code> using the <code>#if CLEAN28 ... #endif</code> conditional directive:</p>
        <div class="code-wrapper">
            <div class="code-header">
                <div class="dot red"></div><div class="dot yellow"></div><div class="dot green"></div>
                <div class="code-title">CustomerListExt.al</div>
            </div>
<pre><code>local procedure UpdateProfit()
var
    NewProfit: Decimal;
begin
    NewProfit := GetProfitFromAPI();
    Rec.Validate("Profit (LCY)", NewProfit);
#if CLEAN28
    if Rec.IsDirty() then
#endif
    Rec.Modify(true);
end;</code></pre>
        </div>

        <h3>Step 3: Configuration for Production Target (BC 28 / Runtime 17.0)</h3>
        <p>Configure <code>app.json</code> targeting runtime <code>17.0</code> and omit <code>CLEAN28</code> from <code>preprocessorSymbols</code>:</p>
        <div class="code-wrapper">
            <div class="code-header">
                <div class="dot red"></div><div class="dot yellow"></div><div class="dot green"></div>
                <div class="code-title">app.json (Production Target)</div>
            </div>
<pre><code>{
  "version": "28.0.0.2",
  "runtime": "17.0",
  "application": "28.0.0.0",
  "platform": "28.0.0.0",
  "preprocessorSymbols": [
    // "CLEAN28"
  ]
}</code></pre>
        </div>
        <p><strong>Result:</strong> The compiler evaluates the block to false and ignores <code>if Rec.IsDirty() then</code>, generating a production-ready package with no AL0666 compilation errors.</p>

        <h3>Step 4: Configuration for Sandbox & Upgrades (BC 29 / Runtime 18.0)</h3>
        <p>When compiling for modern sandboxes or executing the permanent production cutover, set runtime to <code>18.0</code> and activate <code>CLEAN28</code>:</p>
        <div class="code-wrapper">
            <div class="code-header">
                <div class="dot red"></div><div class="dot yellow"></div><div class="dot green"></div>
                <div class="code-title">app.json (Sandbox Target)</div>
            </div>
<pre><code>{
  "version": "29.0.0.0",
  "runtime": "18.0",
  "application": "29.0.0.0",
  "platform": "29.0.0.0",
  "preprocessorSymbols": [
    "CLEAN28"
  ]
}</code></pre>
        </div>
        <p><strong>Result:</strong> The AL compiler includes <code>Rec.IsDirty()</code>, allowing direct testing and zero-downtime feature activation without modifying AL business logic.</p>
    </section>

    <section>
        <h2><i class="ri-thumb-up-line"></i> Pros and Cons</h2>
        <ul  class="pro-list">
            <li><i class="ri-check-line" style="color:var(--success-color)"></i> <strong>Early Feature Adoption:</strong> Test cutting-edge platform methods in Sandbox without blocking Production deployments.</li>
            <li><i class="ri-check-line" style="color:var(--success-color)"></i> <strong>Zero Code Debt:</strong> Eliminates manual comparison workarounds that often remain permanently in codebases.</li>
            <li><i class="ri-check-line" style="color:var(--success-color)"></i> <strong>Single Unified Branch:</strong> Prevents Git branch fragmentation across development and release pipelines.</li>
            <li><i class="ri-check-line" style="color:var(--success-color)"></i> <strong>Frictionless Cutover:</strong> Flip the symbol in <code>app.json</code> when Production upgrades to activate new capabilities.</li>
            <li><i class="ri-check-line" style="color:var(--fail-color)"></i> <strong>Code Clutter:</strong> Excessive nested <code>#if ... #endif</code> blocks can reduce inline readability if overused.</li>
            <li><i class="ri-check-line" style="color:var(--fail-color)"></i> <strong>Build Vigilance:</strong> CI/CD workflows must ensure the correct preprocessor symbols are mapped to the intended deployment environment.</li>
        </ul>
    </section>

    <section>
        <h2><i class="ri-checkbox-circle-line"></i> Summary</h2>
        <p>Version disparity across Business Central Cloud environments is standard practice. Rather than creating temporary workarounds, conditional directives let you write modern code today, produce clean production builds immediately, and switch on new platform capabilities with a single configuration flag when ready.</p>
    </section>
</div>
