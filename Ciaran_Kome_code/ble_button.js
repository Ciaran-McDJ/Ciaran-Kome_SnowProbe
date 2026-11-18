const SERVICE_UUID = "12220312-0125-0125-0125-1222031222fb";
const CHARACTERISTIC_UUID = "fb220312-0125-0125-0125-fb2203122212";

let device;
let characteristic;


export async function connectBLE(onPress, onRelease, onStatus) {

    try {

        if (onStatus) {
            onStatus("Selecting device...");
        }

        device = await navigator.bluetooth.requestDevice({
            filters: [{ namePrefix: "XIAO-BLE-" }],
            optionalServices: [SERVICE_UUID]
        });


        if (onStatus) {
            onStatus("Connecting...");
        }

        const server = await device.gatt.connect();

        const service = await server.getPrimaryService(SERVICE_UUID);

        characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);

        function handleCharacteristicChange(event) {

            const value = event.target.value.getUint8(0);

            if (value === 0 && onPress) {
                onPress();
            }

            if (value === 1 && onRelease) {
                onRelease();
            }
        }

        characteristic.addEventListener(
            "characteristicvaluechanged",
            handleCharacteristicChange
        );


        await characteristic.startNotifications();

        function handleDisconnect() {

            characteristic = null;

            if (onStatus) {
                onStatus("Disconnected");
            }
        }

        device.addEventListener(
            "gattserverdisconnected",
            handleDisconnect
        );


        if (onStatus) {
            onStatus("Connected!");
        }


    } 
    catch (error) {

        if (onStatus) {
            onStatus("Error: " + error.message);
        }

        console.error(error);
    }
}


export function disconnectBLE() {

    if (device && device.gatt && device.gatt.connected) {

        device.gatt.disconnect();

    }
}
