import {config} from "./config.js"


let i = 0;
async function testButtonCallback() {
    i += 1;
    console.log("Test Button was pressed!");
    
    config.set_displayOptionalButton(!config.get_displayOptionalButton())

    config.set_distMeas_useManualEntry(!config.get_distMeas_useManualEntry())

    // let blStore_set = blStore.set("MyTestKey", i)
    // let blStore_get = blStore.get("MyTestKey").then(() => console.log("resultFromPromise.then()", blStore.result()))
    // let result = blStore.result()
    
    // These print nothign useful
    // console.log("blStore.set", blStore_set)
    // console.log("blStore.get", blStore_get)
    // console.log("result", result)
}

async function measureButtonCallback() {
    console.log("Measure Button was pressed!");

    // TODO - the rest of the measurement stuff, right now I am just testing the manual measurement option


    // Testing manual and automatic measurement config options
    if (config.get_distMeas_useRadar() === true) {
        // Take measurement with the radar!
        console.log("Pretending to take radar measurement!")
    }
    if (config.get_distMeas_useManualEntry() === true) {
        // Take manual entry
        let continuing = true;
        while (continuing) {
            let promptResponse = prompt("What is the manual distance entry in meters?", "");
            let promptResponse_num = Number(promptResponse);
            if (Number.isNaN(promptResponse_num)) {
                console.log("You did not input a number. Please try again, add nothing other than numbers and a decimal point");
            }  else {
                continuing = false;
            }
            console.log("Manual distance measurement of:", promptResponse_num)
        }
    }
}

async function optionalButtonCallback() {
    console.log("Optional Button was pressed!")

    config.set_distMeas_useRadar(!config.get_distMeas_useRadar())

    console.log("config:", config)
}

export function linkButtonCallbacks() {
    let testButton = document.getElementById("myTestButton");
    testButton.addEventListener("click", testButtonCallback);

    let measureButton = document.getElementById("myMeasureButton");
    measureButton.addEventListener("click", measureButtonCallback);

    let optionalButton = document.getElementById("optionalButton");
    optionalButton.addEventListener("click", optionalButtonCallback);
}

