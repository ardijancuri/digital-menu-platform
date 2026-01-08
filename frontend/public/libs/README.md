# Tremol Fiscal Printer SDK

This directory should contain the Tremol/DAVID fiscal printer SDK files:

## Required Files

1. **fp_core.js** - Core communication layer for ZFPLab Server
2. **fp.js** - Main API wrapper with printer commands

## How to Obtain

These files are provided by Tremol. Contact:
- Email: zfplab@tremol.bg
- Website: https://tremol.bg

## Installation

1. Download the SDK files from Tremol
2. Place `fp_core.js` and `fp.js` in this directory
3. The files will be automatically loaded by the application

## Prerequisites

- **ZFPLab Server** must be installed and running on `localhost:4444`
- Fiscal printer must be connected (COM/USB/LAN)

## Testing Connection

After installing the libraries, you can test the connection by opening the browser console and running:

```javascript
const fp = new Tremol.FP();
fp.ServerSetSettings("http://localhost", 4444);
const device = fp.ServerFindDevice();
console.log('Device:', device);
```
