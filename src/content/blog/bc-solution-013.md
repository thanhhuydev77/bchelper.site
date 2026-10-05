---
id: BC-SOLUTION-013
title: Protecting Your IP and Managing Source Code with resourceExposurePolicy
date: 2026-10-05
excerpt: 'A practical guide to mastering resourceExposurePolicy in Business Central: protecting your IP without sacrificing debugging and integration.'
tags:
  - app.json
  - debugging
  - source code
  - configuration
draft: false
---

# 1. What is **resourceExposurePolicy**?

resourceExposurePolicy is a configuration block within app.json that defines how exposed your AL source code and debugging capabilities will be once your extension is packaged and deployed.

By default, if left unspecified in app.json, Business Central enforces the most restrictive settings:

`"resourceExposurePolicy": {`
`    "allowDebugging": false,`
`    "allowDownloadingSource": false,`
`    "includeSourceInSymbolFile": false`
`}`
