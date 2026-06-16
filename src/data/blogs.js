export const blogPosts = [
  {
    id: 'BC-SOLUTIONS-001',
    title: 'View Attachment File Related to Sales Order on Archived Sales Order',
    date: 'January 18, 2026',
    excerpt: 'Create a Dynamics Link Factbox to view Attachment File base on complex condition.',
    tags: ['Factboxes', 'SetTableView', 'Page.Update'],
    contentFile: '/blog/bc001.html'
  },
  {
    id: 'BC-SOLUTIONS-002',
    title: 'Handling Slow API Calls with Page Background Tasks',
    date: 'January 19, 2026',
    excerpt: 'Using Background Process to call parallel API and update result to Sales Order Realtime.',
    tags: ['CurrPage.EnqueueBackgroundTask', 'OnPageBackgroundTaskCompleted', 'OnPageBackgroundTaskError'],
    contentFile: '/blog/bc002.html'
  },
  {
    id: 'BC-SOLUTIONS-003',
    title: 'Printing Attachment File(PDF) by Batch',
    date: 'January 22, 2026',
    excerpt: 'Print Multiple Sales Order Attachment File at the same time with specified Printer.',
    tags: ['Report.Print', 'OnAfterDocumentReady', 'RecRef'],
    contentFile: '/blog/bc003.html'
  },
  {
    id: 'BC-SOLUTIONS-004',
    title: 'Delete History Data by Batch',
    date: 'January 29, 2026',
    excerpt: 'Delete Change Log Entry with specified number record',
    tags: ['Job Queue Entry', 'Record.Next', 'Record.Truncate', 'ProcessingOnly'],
    contentFile: '/blog/bc004.html'
  },
  {
    id: 'BC-SOLUTIONS-005',
    title: 'Performance vs. Maintainability: Why Dictionary of [JsonObject] is the Superior Choice in AL',
    date: 'March 18, 2026',
    excerpt: 'Learn when to use Dictionary of [Text, Text] vs JsonObject for optimal performance and scalability.',
    tags: ['Data Structures', 'Performance', 'JsonObject', 'Dictionary'],
    contentFile: '/blog/bc005.html'
  },
  {
    id: 'BC-SOLUTIONS-006',
    title: 'Dynamic Report Sorting: Synchronizing Page Views with Reports',
    date: 'March 30, 2026',
    excerpt: 'Copy customer sorting, filter from page to report.',
    tags: ['#Record.GetView', '#Record.SetView', '#Report.SetTableView'],
    contentFile: '/blog/bc006.html'
  },
  {
    id: 'BC-SOLUTIONS-007',
    title: 'Mastering RDLC: Creating a Smart 2-Column Report for Warehouse Labels',
    date: 'April 7, 2026',
    excerpt: 'Implement a dynamic 2-column RDLC layout for warehouse labels using AL Dictionary indexing and SSRS filtering to maximize 4x6 label space.',
    tags: ['RDLC', 'SSRS', 'AL Dictionary', 'Warehouse Logistics'],
    contentFile: '/blog/bc007.html'
  },
  {
    id: 'BC-SOLUTIONS-008',
    title: 'Visual Branding: Adding Logos to Shipping Agents & Exporting to Excel',
    date: 'April 17, 2026',
    excerpt: 'Add logo support to Shipping Agents using the Media type, display them via a FactBox, and stream images into Excel/PDF SSRS reports.',
    tags: ['Media', 'InStream', 'FactBox', 'SSRS'],
    contentFile: '/blog/bc008.html'
  },
  {
    id: 'BC-SOLUTIONS-009',
    title: 'Multi-Localization Setup: Installing US and W1 Versions on the Same Server',
    date: 'May 10, 2026',
    excerpt: 'Install Multiple Business Central Instance in same Server.',
    tags: ['BC On-Prem', 'PowerShell', 'SQL Server', 'IIS'],
    contentFile: '/blog/bc009.html'
  }
]

export const blogDataMap = blogPosts.reduce((acc, post) => {
  acc[post.id] = post
  return acc
}, {})
