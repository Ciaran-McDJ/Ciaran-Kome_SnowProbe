// Created Nov 10, 2026
import {blStore} from './blStore.js'




// TODO - describe somewhere (here or a README?) the process for adding a new variable to the config
    // Add variable name with '_' and a default
    // Add getter and setter (IMPORTANT: Must have same name as variable, just with 'get' and 'set' added)
    // Add its name to configVarsToKeepInStore so it gets checked on startup of the program
    // If you want it to be changeable from the config menu, add it to the config menu and add a line here to update its state in the config menu
    // 
    // Setter parts:
        // 1. Set local variable
        // 2. Set variable in indexedDB
        // 3. Update the config menu box
        // 4. Do necessary logic for the value change


// html elements (set by config.getHTMLElements)
let optionalButton;
let settingsInputElements = {}; //Object with keys as variable names and values as the input element in the settings menu

// TODO - look up proper docstring formatting for all of this
let configVarsToKeepInStore = ["_x", "_displayOptionalButton", "_distMeas_useRadar", "_distMeas_useManualEntry"];

/* config has variables that should persist between reloads of the page, they are stored in the indexedDB and most of them can be modified in the config menu*/
export const config = {
    _x: 1, //Example to show off config, this can be deleted later
    _displayOptionalButton: false, //Example to show off config, this can be deleted later
    _distMeas_useRadar: false,
    _distMeas_useManualEntry: true,

    get_x: function() {
        // console.log("debug config.js: getting x, ", this._x);
        return this._x;
    },
    set_x: async function(value) {
        let confVarName = "_x";
        this._x = value;
        this.storeConfigVarInStore("_x", value);
        this.setConfigElement(confVarName);
        // console.log("debug config.js: set x to ", x);
    },
    
    get_displayOptionalButton: function() {
        return this._displayOptionalButton;
    },
    set_displayOptionalButton: async function(value) {
        let confVarName = "_displayOptionalButton";
        // Set local variable
        this[confVarName] = value;
        // Set variable in indexedDB
        this.storeConfigVarInStore(confVarName, value);
        // Update the config menu box
        // This is an example, it doens't have a config menu box
        // Do necessary logic for the value change
        if (this.get_displayOptionalButton() === false) {
            optionalButton.style.display = "none"; //TODO - move getElementByID to be in global scoe and have init function to set it
        } else if (this.get_displayOptionalButton() === true) {
            optionalButton.style.display = "initial";
        } else {
            throw Error("config._displayOptionalButton was not true or false, this should never happen. It was: " + this.get_displayOptionalButton()) //TODO  look at console.error vs throw Error
        }
    },

    get_distMeas_useRadar: function() {
        return this._distMeas_useRadar;
    },
    set_distMeas_useRadar: async function(value) {
        let confVarName = "_distMeas_useRadar";
        // Set local variable
        this[confVarName] = value;
        // Set variable in indexedDB
        this.storeConfigVarInStore(confVarName, value);
        // Update the config menu box
        this.setConfigElement(confVarName);
        // Do necessary logic for the value change
        // TODO - not sure if this will be neccessary  
    },

    get_distMeas_useManualEntry: function() {
        return this._distMeas_useManualEntry;
    },
    set_distMeas_useManualEntry: async function(value) {
        let confVarName = "_distMeas_useManualEntry";
        // Set local variable
        this[confVarName] = value;
        // Set variable in indexedDB
        this.storeConfigVarInStore(confVarName, value);
        // Update the config menu box
        this.setConfigElement(confVarName);
        // Do necessary logic for the value change
        // TODO - not sure if this will be neccessary  
    },

    /* Run at start of program after html elements are made so js code has access to them*/
    getHTMLElements: function() {
        // Miscellaneous Elements
        optionalButton = document.getElementById("optionalButton");

        // Settings Menu elements for updating the config - note: right now only getting the 'input' elements
        // NOTE: Only get the 
        let settingsMenu = document.getElementById('settingsMenu');
        let inputElements = settingsMenu.querySelectorAll('input');
        for (let element of inputElements) {
            settingsInputElements[element.id] = element;
        }
    },

    /* Run at start of program to see if non-default config values stored in indexedDB, if so it gets them and stores them in the config*/
    initConfig: async function() {
        this.getHTMLElements()
        for (let confVarName of configVarsToKeepInStore) {
            let getterFuncName = "get"+confVarName;
            let setterFuncName = "set"+confVarName;
            let configKey_str = "config"+confVarName;
            
            let storeResult;
            let valueToSetLocal;
            // TODO - what if blStore doesn't exist? Should check what error checking Jo's code does for this sort of thing and make sure this is good
            await blStore.get(configKey_str);
            storeResult = blStore.result();
            console.log("debug config.js: storeResult: ", storeResult);

            if (storeResult == undefined) {
                // This key is not in the indexedDB, we should just use the default
                valueToSetLocal = this[getterFuncName]();
                console.log("debug config.js: store does not have a value so using the default for the config value (this is normal if store was cleared recently): ", confVarName)
            } else {
                // storeResult has something, we should use what is in the store
                valueToSetLocal = storeResult.v
            }  
            // This will run every setter with the proper state, making sure all setter code is run and all of program is in correct state. This also stores every variable in the indexedDB if it wasn't already there
            this[setterFuncName](valueToSetLocal);       
        }
    },

    storeConfigVarInStore: async function(varName, value) {
        // Sets a value in the store with key: config{varName}, and value: value
        // str varName: The variable name with the '_'
        // value: The 
        blStore.set("config"+varName, value); //TODO - error checking? How do we know if this succeeded?
    },

    /* Run by many of the setters. Sets the menu input element to reflect what the variable actually is */
    setConfigElement: function(confVarName) {
        //Note: varName must have the '_'
        let getterFuncName = "get"+confVarName
        let element = settingsInputElements[confVarName];
        if (element === undefined) {
            console.log("WARNING: The config Variable, "+confVarName+" did not have a linked settings menu html element yet config.setConfigElement was called for it. Something is likely wrong")
        } else if (element.type === "checkbox") {
            element.checked = this[getterFuncName]()
        } else if (element.type === "text") {
            element.value = this[getterFuncName]()
        }
    }

    /* NOT USED - should be able to delete this. This runs setters with the values they already have to make sure the program is in the correct state, should not be necessary*/
    // runAllSetters: function() {
    //     for (let confVarName of configVarsToKeepInStore) {
    //         let getterFuncName = "get"+confVarName;
    //         let setterFuncName = "set"+confVarName;
    //         let value = this[getterFuncName]();
    //         this[setterFuncName](value);
    //     }
    // }
}