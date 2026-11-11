import {config} from "./config.js"


let i = 0;
async function testButtonCallback() {
    i += 1;
    console.log("Test Button was pressed!");
    
    config.set_displayOptionalButton(!config.get_displayOptionalButton())

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

    let theXInQuestion = config.get_x()
    console.log("in index.html we got that x is: ", theXInQuestion)

    // Not doing anything for right now
}

async function optionalButtonCallback() {
    console.log("Optional Button was pressed!")
}

export function linkButtonCallbacks() {
    let testButton = document.getElementById("myTestButton");
    testButton.addEventListener("click", testButtonCallback);

    let measureButton = document.getElementById("myMeasureButton");
    measureButton.addEventListener("click", measureButtonCallback);

    let optionalButton = document.getElementById("optionalButton");
    optionalButton.addEventListener("click", optionalButtonCallback);
}

