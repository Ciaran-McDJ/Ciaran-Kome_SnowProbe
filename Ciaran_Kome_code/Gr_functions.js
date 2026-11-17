import { blx } from '../js/blx.js';
import { blStore } from '../js/blStore.js';

function sleep(ms = 1) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let latestMeasurement = {
    snowHeight: null,
    temperature: null
};

export function blxEvent(m, v, xinfo) {
    if (m === 'MEAS_V') {
        const value = parseFloat(xinfo);

        if (Number.isNaN(value)) return;

        if (Number(v) === 0) {
            latestMeasurement.snowHeight = value;
        }

        if (Number(v) === 1) {
            latestMeasurement.temperature = value;
        }
    }
}

export async function saveme() {
    try {
        if (typeof blStore === "undefined") {
            blx.terminalPrint("ERROR(Store): blStore not available");
            return;
        }

        await blx.userSendCmd('c3MC 5MC');

        const samples = 5;       // How many measurements
        const interval = 2000;    // Time between measurements in ms

        blx.frq_ping(261, .04, .02);
        await sleep(200);

        blx.frq_ping(329, .04, .02);
        await sleep(200);

        blx.frq_ping(392, .04, .02);
        await sleep(200);

        blx.frq_ping(523, .04, .02);
        await sleep(200);

        blx.terminalPrint(
            `Save to blStore: ${samples} consecutive samples every ${interval / 1000}s\n`
        );

        function getPositionPromise(
    options = {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0
    }
) {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            return reject(new Error("Geolocation not supported"));
        }

        navigator.geolocation.getCurrentPosition(
            p => {
                try {
                    console.log("Geolocation response:", p);

                    if (!p || !p.coords) {
                        return reject(
                            new Error("Geolocation returned no coordinates")
                        );
                    }

                    const coords = p.coords;

                    resolve({
                        latitude: coords.latitude,
                        longitude: coords.longitude,
                        accuracy: coords.accuracy,
                        altitude: coords.altitude,
                        altitudeAccuracy: coords.altitudeAccuracy,
                        heading: coords.heading,
                        speed: coords.speed,
                        timestamp: p.timestamp
                    });

                } catch (err) {
                    reject(err);
                }
            },
            err => reject(err),
            options
        );
    });
}

        for (let si = 0; si < samples; si++) {
            blx.frq_ping(440, .04, .02);

            // get GPS first (may prompt)
            let location;

            try {
                location = await getPositionPromise();
            } catch (err) {
                location = {
                    error: err && err.message ? err.message : String(err)
                };
            }

            // snapshot device info
            const deviceSnapshot = {};

            try {
                const device = blx.getDevice();

                deviceSnapshot.deviceMAC = device.deviceMAC;
                deviceSnapshot.deviceType = device.deviceType;
                deviceSnapshot.firmwareVersion = device.firmwareVersion;

            } catch (e) {
                /* ignore */
            }

            const key =
                (deviceSnapshot.deviceMAC || "unknown") +
                "_measurement_" +
                Date.now() +
                "_" +
                si;

            latestMeasurement = {
                snowHeight: null,
                temperature: null
            };

            await blx.userSendCmd('e');

            const snowHeight = latestMeasurement.snowHeight;
            const temperature = latestMeasurement.temperature;

            const payload = {
                ts: new Date(),
                sampleIndex: si,
                samplesTotal: samples,
                deviceSnapshot,
                location,
                snowHeight,
                temperature
            };

            try {
                await blStore.set(key, payload);

                blx.terminalPrint(
                    "Stored measurement: " + key +
                    "\nTime: " + JSON.stringify(payload.ts) +
                    "\nSnow Height: " + (snowHeight ?? "") + " m" +
                    "\nTemperature: " + (temperature ?? "") + " dB\n"
                );

            } catch (err) {
                blx.terminalPrint("ERROR(savemeStore): " + err);
            }

            await sleep(interval); // wait 2 s
        }

        blx.terminalPrint("*Data saved to blStore*");

        blx.frq_ping(523, .04, .02);
        await sleep(200);

        blx.frq_ping(392, .04, .02);
        await sleep(200);

        blx.frq_ping(329, .04, .02);
        await sleep(200);

        blx.frq_ping(261, .04, .02);

    } catch (err) {
        blx.terminalPrint("ERROR(saveme): " + err);
        console.error("saveme error:", err);
    }
}

export async function exportCSV(fname = "blstore_export.csv") {
    try {
        if (typeof blStore === "undefined") {
            blx.terminalPrint("ERROR(ExportCSV): blStore not available");
            return;
        }

        let items = [];

        await blStore.iterate(it => items.push(it));

        if (items.length === 0) {
            blx.terminalPrint("No items found in blStore to export");
            return;
        }

        const esc = s =>
            `"${String(s === undefined ? "" : s).replace(/"/g, '""')}"`;

        // header: Key, Device, Time, Snow Height, Temperature, Latitude, Longitude, Altitude
        const header = [
            'Key',
            'Device',
            'Time',
            'Snow Height',
            'Temperature',
            'Latitude',
            'Longitude',
            'Altitude'
        ].join(',');

        const rows = [header];

        for (const it of items) {
            try {
                // blStore.iterate may return entries as {k, v} or raw values
                const keyFromIter = it && it.k ? it.k : undefined;
                const v = (it && it.v)
                    ? it.v
                    : (it && !it.k ? it : {});

                // Try multiple payload shapes (new flat payload, legacy nested payload)
                const key = v.key || keyFromIter || "";

                // Device
                let device = "";

                if (v.device) {
                    device = v.device;
                } else if (v.deviceSnapshot && v.deviceSnapshot.deviceMAC) {
                    device = v.deviceSnapshot.deviceMAC;
                } else if (keyFromIter) {
                    device = String(keyFromIter).split("_")[0] || "";
                }

                // Time
                let time = "";

                if (v.time) {
                    time = v.time;
                } else if (v.ts) {
                    time = (v.ts instanceof Date)
                        ? v.ts.toISOString()
                        : new Date(v.ts).toISOString();
                } else if (v.location && v.location.timestamp) {
                    time = new Date(v.location.timestamp).toISOString();
                }

                // Measurements: Snow Height and Temperature
                let snowHeight = "";
                let temperature = "";

                if (v.snowHeight !== undefined && v.snowHeight !== null) {
                    snowHeight = v.snowHeight;
                }

                if (v.temperature !== undefined && v.temperature !== null) {
                    temperature = v.temperature;
                }

                // legacy: flat aliases used before the dedicated fields existed
                if (
                    snowHeight === "" &&
                    v.measurement0 !== undefined &&
                    v.measurement0 !== null
                ) {
                    snowHeight = v.measurement0;
                }

                if (
                    temperature === "" &&
                    v.measurement1 !== undefined &&
                    v.measurement1 !== null
                ) {
                    temperature = v.measurement1;
                }

                // legacy: measurement object with channelValues
                if (
                    (snowHeight === "" || temperature === "") &&
                    v.measurement &&
                    Array.isArray(v.measurement.channelValues)
                ) {
                    if (
                        snowHeight === "" &&
                        v.measurement.channelValues.length > 0
                    ) {
                        snowHeight = v.measurement.channelValues[0];
                    }

                    if (
                        temperature === "" &&
                        v.measurement.channelValues.length > 1
                    ) {
                        temperature = v.measurement.channelValues[1];
                    }
                }

                // legacy tempVariable fallback (e.g. "Det:2 1.242m/10.07dB 2.519m/-6.22dB")
                if (
                    (snowHeight === "" || temperature === "") &&
                    v.tempVariable !== undefined
                ) {
                    const rawTemp = String(v.tempVariable);

                    const m = rawTemp.match(
                        /([-+]?\d+(?:\.\d+)?)m\/([-+]?\d+(?:\.\d+)?)dB/i //string splitting line
                    );

                    if (m) {
                        if (snowHeight === "") snowHeight = m[1];
                        if (temperature === "") temperature = m[2];

                    } else if (snowHeight === "") {
                        snowHeight = rawTemp;
                    }
                }

                // Location
                let latitude = "";
                let longitude = "";
                let altitude = "";

                if (v.latitude !== undefined) latitude = v.latitude;
                if (v.longitude !== undefined) longitude = v.longitude;
                if (v.altitude !== undefined) altitude = v.altitude;

                if (
                    (latitude === "" || longitude === "" || altitude === "") &&
                    v.location
                ) {
                    if (
                        latitude === "" &&
                        v.location.latitude !== undefined
                    ) {
                        latitude = v.location.latitude;
                    }

                    if (
                        longitude === "" &&
                        v.location.longitude !== undefined
                    ) {
                        longitude = v.location.longitude;
                    }

                    if (
                        altitude === "" &&
                        v.location.altitude !== undefined
                    ) {
                        altitude = v.location.altitude;
                    }
                }

                rows.push([
                    esc(key),
                    esc(device),
                    esc(time),
                    esc(snowHeight),
                    esc(temperature),
                    esc(latitude),
                    esc(longitude),
                    esc(altitude)
                ].join(','));

            } catch (e) {
                console.error("excsv: error processing item:", e, it);
            }
        }

        const blob = new Blob(
            [rows.join("\n")],
            { type: "text/csv;charset=utf-8" }
        );

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = fname;

        document.body.appendChild(a);
        a.click();
        a.remove();

        URL.revokeObjectURL(url);

        blx.terminalPrint(
            "Exported CSV: " +
            (rows.length - 1) +
            " items to '" + fname + "'"
        );

    } catch (err) {
        blx.terminalPrint("ERROR(ExportCSV): " + err);
        console.error("exportCSV error:", err);
    }
}