import { connectBLE, disconnectBLE } from "./ble_button.js";

function sendComd() {

    console.log("BLE Button was pressed");

    const bleVar = blx.userSendCmd("e");

    console.log(bleVar);

}

const bleStatusElement = document.getElementById("ble-status");
const bleEventsElement = document.getElementById("ble-events");

function handleButtonPress() {
    bleEventsElement.textContent = "Button PRESSED";
    sendComd();
}

function handleButtonRelease() {
    bleEventsElement.textContent = "Button RELEASED";
}

function handleBLEStatus(message) {
    bleStatusElement.textContent = message;
}

function handleConnectClick() {
    connectBLE(
        handleButtonPress,
        handleButtonRelease,
        handleBLEStatus
    );
}

function handleDisconnectClick() {
    disconnectBLE();

    bleStatusElement.textContent = "Not connected";
    bleEventsElement.textContent = "Waiting for button press...";
}

document.getElementById("ble-connect").addEventListener(
    "click",
    handleConnectClick
);

document.getElementById("ble-disconnect").addEventListener(
    "click",
    handleDisconnectClick
);