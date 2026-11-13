import {config} from "./config.js"

// This will have all the settings Menu button callbacks and such



export function linkSettingsMenuCallbacks() {

    let closeMenuButton = document.getElementById("closeSettingsButton");
    closeMenuButton.addEventListener("click", () => window.location.hash = "")
    
    let x_textBox = document.getElementById("_x");    
    x_textBox.addEventListener("change", (event) => {
        console.log("x:", event.target.value);
        if (x_textBox.reportValidity()) {
            config.set_x(event.target.value);
            console.log("Set x since it is valid");
        }
    })

    let distMeas_useManualEntry_Button = document.getElementById("_distMeas_useManualEntry");
    distMeas_useManualEntry_Button.addEventListener("change", (event) => {
        config.set_distMeas_useManualEntry(event.target.checked);
    })

    let distMeas_distMeas_useRadar = document.getElementById("_distMeas_useRadar");
    distMeas_distMeas_useRadar.addEventListener("change", (event) => {
        config.set_distMeas_useRadar(event.target.checked);
    })
}


