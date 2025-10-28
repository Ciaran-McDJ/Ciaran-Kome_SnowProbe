# BlxMinimal

![BlxMinimal Interface](Docu/intro.png)

**Live Demo:** [https://joembedded.github.io/BlxMinimal/](https://joembedded.github.io/BlxMinimal/)

## Description

This program is a minimal usage example of `blx.js` and `blstore.js`. For the easiest possible use, the compacted versions of the scripts are utilized. The current versions can be obtained from `blxdash/dist/...`. Upon request, the scripts are also available in source code form.

This demo contains the 'essentials' of the [BlxDashboard](https://github.com/joembedded/ltx_ble_demo).

> It is recommended to use/develop with this software under VS Code with the "Live Server" extension (Ritwick Dey).

## Usage

Using the command line interface, you can connect to LTX devices or OSX nodes via BLE (provided the browser supports Bluetooth Web API). 

> All BLX commands are listed in Docu/blx_commands.txt (but the device or sensor has a bunch of additionals comands too).

### Connecting to a Device

The simplest command to establish a connection is:
```
.c
```
or
```
.connect
```

### PIN Authentication

Some devices require a PIN. This must be entered once using:
```
.i PIN
```

The PIN will then be automatically saved in the browser's IndexDB (by `blstore.js`) for future connections.

## Requirements

- A browser with Bluetooth Web API support or (e.g. for iOS a 'Sandbox' with BLE Web API wrapper)
- HTTPS connection (required for Web Bluetooth API)

## Files

- `blx.js` - BLE communication library
- `blstore.js` - IndexedDB storage library
- `index.html` - Main application interface

## API Overview

### blstore.js API

- `result()` - Get the result from the last operation
- `get(key)` - Get a value from the store
- `set(key, value)` - Set a value in the store
- `count()` - Get the number of items in the store
- `iterate(callback, keyRange)` - Iterate over all items in the store
- `clearStore()` - Clear all items from the store
- `remove(key)` - Remove a specific item from the store
- `quotaget()` - Get storage quota information (usedMB, usedPerc)

### blx.js API

#### Callback Messages

The `blxUserCB` callback provides status updates with message types and parameters:

- **CON 0** - Disconnected, not reconnectable
- **CON 1** - Disconnected, but reconnectable
- **CON 2** - Connecting, reading IDs (ONLY advertisingName available via `blx.getDevice()`)
- **CON 3** - Connected
- **CON 4** - Fully connected (also called after reconnecting, `blx.getDevice()` complete)
- **PROG** `perc` - Progress in %
- **UPLOAD** `total` - Full/incremental upload data bytes
- **GET** `len, fname` - Upload from file
- **GET_OK** `speed` - Upload OK, bytes/sec
- **RSSI** `signal` - Signal strength in dBm (< -199 = invalid)
- **VSENS** `data` - Sensor data (e.g., acceleration: x, y, z)
- **INFO** `x` - Informational message (x:0 = transfer OK, translatable)
- **MSG** `type` - Message (0: more info, 1: BLX.JS)
- **WARN** `type` - Warning (1: Disconnect, 2: Low speed, 3: No file, 4: File error, 5: Retry)
- **ERR** `type` - Error message
- **MEAS_CH** `chans` - Measurement channels
- **MEAS_T** `time` - Time in milliseconds
- **MEAS_V** `chan` - Measurement value
- **BZY** `code, param` - Busy code (see 'Z' command)
- **PPMETA** `text` - Metadata for following PP blocks
- **RADARPP** `datablock` - ArrayBuffer with raw radar data
- **RECON** `times` - Reconnection status: `{wait:h reconnect:h2}`

#### Main Functions

- `setTerminal()` - Set terminal element
- `userSendCmd(inpcmd, cmdtimeout)` - Send command to device
- `terminalPrint()` - Print to terminal
- `terminalGetInput()` - Get terminal input
- `getDevice()` - Get device IDs
- `getMemory()` - Get memory information
- `getPinOK()` - Check if PIN is valid
- `frq_ping()` - Play frequency sound
- `chordsound()` - Play chord sound
- `getCrc32()` - Calculate CRC32
- `IparamAddChannel()` - Add channel to parameters
- `CompactIparam()` - Compact parameter array
- `IparamValidate()` - Validate input parameters
- `SysParamValidate()` - Validate system parameters
- `getTry2Connect()` - Check if trying to connect
- `stopTry2Connect()` - Stop connection attempt
- `getBrowserName()` - Get browser name

  ***
