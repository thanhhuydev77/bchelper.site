---
id: BC-SOLUTIONS-014
title: How to Create a Virtual Printer for DEV/TEST Reports in Business Central
date: 2026-10-20
excerpt: Testing reports in a Business Central Sandbox without a physical printer? Learn how to build a Virtual Printer in AL to test custom paper sizes and download PDFs.
tags:
  - Report
  - Printer
  - Customization
draft: false
format: html
---

<div class="container">
    <section>
        <h2><i class="ri-information-line"></i> Background</h2>
        <p>As a developer, testing direct print execution or validating document outputs across specific paper dimensions in a Sandbox environment can be challenging without physical hardware connected. Standard report previewing does not always replicate direct-to-printer pipelines or custom label/receipt dimensions.</p>
        
        <div class="highlight-box">
            <strong><i class="ri-printer-line"></i> The Solution Overview</strong>
            Build a lightweight AL customization simulating a Virtual Printer. Business Central registers the simulated device via standard platform events, constructs the print payload with custom width and height parameters (in mm), intercepts the document stream upon printing, and immediately serves it as a downloadable PDF.
        </div>
    </section>

    <section>
        <h2><i class="ri-checkbox-circle-line"></i> Key Benefits</h2>
        <ul class="pro-list">
            <li><i class="ri-check-line" style="color:var(--success-color)"></i> <strong>Zero Hardware Dependency:</strong> Test direct-to-printer pipelines entirely inside Sandboxes or Docker containers.</li>
            <li><i class="ri-check-line" style="color:var(--success-color)"></i> <strong>Custom Paper Geometries:</strong> Flexibly validate A4, A5, Landscape, label, or receipt rolls by defining exact width and height values in millimeters.</li>
            <li><i class="ri-check-line" style="color:var(--success-color)"></i> <strong>Immediate Output Inspection:</strong> Intercepts the generated spool stream and triggers an instant client-side PDF download.</li>
        </ul>
    </section>

    <section>
        <h2><i class="ri-code-s-slash-line"></i> Technical Implementation</h2>
        <div class="tags-container">
            <span class="tag"><i class="ri-hashtag"></i> Report</span>
            <span class="tag"><i class="ri-hashtag"></i> Printer</span>
            <span class="tag"><i class="ri-hashtag"></i> Customization</span>
            <span class="tag"><i class="ri-hashtag"></i> Business Central</span>
            <span class="tag"><i class="ri-hashtag"></i> AL Programming</span>
        </div>

        <h3>Step 1: Create the Virtual Printer Table</h3>
        <p>Define table <code>70000 "ALE Virtual Printer"</code> to persist custom printer definitions. The helper procedure <code>GetPrinterPayload()</code> packages the printer configuration into the JSON schema expected by Business Central's printing subsystem.</p>
        
        <div class="code-wrapper">
            <div class="code-header">
                <div class="dot red"></div><div class="dot yellow"></div><div class="dot green"></div>
                <div class="code-title">ALEVirtualPrinter.Table.al</div>
            </div>
<pre><code>namespace BC014;

table 70000 "ALE Virtual Printer"
{
    Caption = 'Virtual Printer';
    DataClassification = SystemMetadata;
    DataPerCompany = false;
    LookupPageId = "ALE Virtual Printers";
    DrillDownPageId = "ALE Virtual Printers";

    fields
    {
        field(1; "Printer Name"; Text[250])
        {
            Caption = 'Printer Name';
            NotBlank = true;
        }
        field(2; Description; Text[250])
        {
            Caption = 'Description';
        }
        field(5; Width; Decimal)
        {
            Caption = 'Width(mm)';
            DecimalPlaces = 0 : 3;
            MinValue = 0;
        }
        field(6; Height; Decimal)
        {
            Caption = 'Height(mm)';
            DecimalPlaces = 0 : 3;
            MinValue = 0;
        }
        field(12; Enabled; Boolean)
        {
            Caption = 'Enabled';
            InitValue = true;
        }
    }

    keys
    {
        key(PK; "Printer Name")
        {
            Clustered = true;
        }
    }

    procedure GetPrinterPayload() Payload: JsonObject
    var
        PaperTray: JsonObject;
        PaperTrays: JsonArray;
    begin
        Payload.Add('version', 1);
        Payload.Add('description', Description);
        Payload.Add('duplex', false);
        Payload.Add('defaultcopies', 1);
        Payload.Add('papertrays', PaperTrays);

        PaperTrays.Add(PaperTray);
        PaperTray.Add('papersourcekind', 'custom');
        PaperTray.Add('paperkind', 'custom');
        PaperTray.Add('units', 'mm');
        PaperTray.Add('height', Rec.Height);
        PaperTray.Add('width', Rec.Width);
    end;
}</code></pre>
        </div>

        <h3>Step 2: Create the Virtual Printers List Page</h3>
        <p>Create page <code>70010 "ALE Virtual Printers"</code> to manage printer records, featuring actions to generate standard presets or navigate directly to standard Printer Management.</p>

        <div class="code-wrapper">
            <div class="code-header">
                <div class="dot red"></div><div class="dot yellow"></div><div class="dot green"></div>
                <div class="code-title">ALEVirtualPrinters.Page.al</div>
            </div>
<pre><code>namespace BC014;
using System.Device;

page 70010 "ALE Virtual Printers"
{
    ApplicationArea = All;
    Caption = 'Virtual Printers';
    PageType = List;
    SourceTable = "ALE Virtual Printer";
    UsageCategory = Administration;
    DelayedInsert = true;

    layout
    {
        area(content)
        {
            repeater(General)
            {
                field("Printer Name"; Rec."Printer Name")
                {
                    ToolTip = 'Specifies the name of the virtual printer, as shown in the printer list.';
                }
                field(Description; Rec.Description)
                {
                    ToolTip = 'Specifies the description of the virtual printer.';
                }
                field(Width; Rec.Width)
                {
                    ToolTip = 'Specifies the paper width in the selected paper unit.';
                }
                field(Height; Rec.Height)
                {
                    ToolTip = 'Specifies the paper height in the selected paper unit.';
                }
                field(Enabled; Rec.Enabled)
                {
                    ToolTip = 'Specifies if the virtual printer is available in the printer list.';
                }
            }
        }
    }

    actions
    {
        area(processing)
        {
            action(CreateSamplePrinters)
            {
                Caption = 'Create Sample Printers';
                Image = Setup;
                ToolTip = 'Create virtual printers for common paper sizes (A4, A5, Letter, labels, receipt).';
                trigger OnAction()
                var
                    VirtualPrinterMgt: Codeunit "ALE Virtual Printer Mgt.";
                begin
                    VirtualPrinterMgt.InsertSamplePrinters();
                    CurrPage.Update(false);
                end;
            }
        }
        area(navigation)
        {
            action(PrinterManagement)
            {
                Caption = 'Printer Management';
                Image = Print;
                RunObject = page "Printer Management";
                ToolTip = 'Open the Printer Management page.';
            }
        }
        area(Promoted)
        {
            actionref(CreateSamplePrinters_Promoted; CreateSamplePrinters) { }
            actionref(PrinterManagement_Promoted; PrinterManagement) { }
        }
    }
}</code></pre>
        </div>

        <h3>Step 3: Management Codeunit & Event Subscriptions</h3>
        <p>Implement <code>"ALE Virtual Printer Mgt."</code> to handle preset seeding, system registration, and PDF stream interception.</p>

        <h4>3.1 Sample Printer Initialization</h4>
        <div class="code-wrapper">
<pre><code>procedure InsertSamplePrinters()
begin
    InsertVirtualPrinter('VP A4', 'A4 210x297 mm', 210, 297);
    InsertVirtualPrinter('VP A4 Landscape', 'A4 297x210 mm', 297, 210);
    InsertVirtualPrinter('VP A5', 'A5 148x210 mm', 148, 210);
end;

procedure InsertVirtualPrinter(PrinterName: Text[250]; Description: Text[250]; Width: Decimal; Height: Decimal)
var
    VirtualPrinter: Record "ALE Virtual Printer";
begin
    if not VirtualPrinter.Get(PrinterName) then begin
        VirtualPrinter.Init();
        VirtualPrinter."Printer Name" := PrinterName;
        VirtualPrinter.Insert();
    end;
    VirtualPrinter.Description := Description;
    VirtualPrinter.Width := Width;
    VirtualPrinter.Height := Height;
    VirtualPrinter.Enabled := true;
    VirtualPrinter.Modify(true);
end;</code></pre>
        </div>

        <h4>3.2 Register Virtual Printers (OnAfterSetupPrinters)</h4>
        <p>Subscribe to <code>ReportManagement.OnAfterSetupPrinters</code> to inject active virtual printers into the global printer dictionary.</p>
        <div class="code-wrapper">
<pre><code>[EventSubscriber(ObjectType::Codeunit, Codeunit::ReportManagement, OnAfterSetupPrinters, '', false, false)]
local procedure ReportManagementOnAfterSetupPrinters(var Printers: Dictionary of [Text[250], JsonObject])
var
    VirtualPrinter: Record "ALE Virtual Printer";
begin
    VirtualPrinter.SetRange(Enabled, true);
    if VirtualPrinter.FindSet() then
        repeat
            if not Printers.ContainsKey(VirtualPrinter."Printer Name") then
                Printers.Add(VirtualPrinter."Printer Name", VirtualPrinter.GetPrinterPayload());
        until VirtualPrinter.Next() = 0;
end;</code></pre>
        </div>

        <h4>3.3 Capture Output & Download as PDF (OnAfterDocumentPrintReady)</h4>
        <p>Subscribe to <code>ReportManagement.OnAfterDocumentPrintReady</code> to catch spooled output, sanitize file names, and execute <code>DownloadFromStream</code>.</p>
        <div class="code-wrapper">
<pre><code>[EventSubscriber(ObjectType::Codeunit, Codeunit::ReportManagement, OnAfterDocumentPrintReady, '', false, false)]
local procedure ReportManagementOnAfterDocumentPrintReady(ObjectType: Option "Report","Page"; ObjectID: Integer; ObjectPayload: JsonObject; DocumentStream: InStream; var Success: Boolean)
var
    PrinterName: Text;
    FileName: Text;
    FileNameTok: Label '%1 - %2.pdf', Locked = true;
begin
    if Success then exit;
    PrinterName := ObjectPayload.GetText('printername');
    if not IsVirtualPrinter(PrinterName) then exit;

    FileName := DelChr(StrSubstNo(FileNameTok, ObjectPayload.GetText('objectname'), PrinterName), '=', '\/:*?"&lt;&gt;|');
    DownloadFromStream(DocumentStream, '', '', '', FileName);
    Success := true;
end;

local procedure IsVirtualPrinter(PrinterName: Text): Boolean
var
    VirtualPrinter: Record "ALE Virtual Printer";
begin
    if PrinterName = '' then exit(false);
    VirtualPrinter.SetRange("Printer Name", PrinterName);
    VirtualPrinter.SetRange(Enabled, true);
    exit(not VirtualPrinter.IsEmpty());
end;</code></pre>
        </div>
    </section>

    <section>
        <h2><i class="ri-video-line"></i> Demonstration & Testing</h2>
        <div class="timeline">
            <div class="timeline-item">
                <span class="timeline-title">Live Execution Walkthrough</span>
                <p>Observe the creation of sample printers, setting up printer selections, executing a direct report print, and automatically downloading the resulting PDF:</p>
                <div class="video-container" style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden; border-radius:8px; margin-top:15px;">
                   <iframe width="560" height="315" src="https://www.youtube.com/embed/4zJjTXd0cns?si=HjmSAwnifpO1HrDP" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </div>
            </div>
        </div>
    </section>
</div>
