// Created Nov 10, 2026
import {blStore} from './blStore.js'




// TODO - describe somewhere (here or a README?) the process for adding a new variable to the config
    // Add variable name with '_'
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

// TODO - look up proper docstring formatting for all of this
let configVarsToKeepInStore = ["_x", "_displayOptionalButton", "_distMeas_useRadar", "_distMeas_useManualEntry"];

/* config has variables that should persist between reloads of the page, they are stored in the indexedDB and most of them can be modified in the config menu*/
export const config = {
    _x: 1,
    _displayOptionalButton: false,
    _distMeas_useRadar: false,
    _distMeas_useManualEntry: true,
    // TODO - add what type x should be and some condition to throw error (acceptable range) (this is actually going to be in the html element, not a problem) - hmmm, but should I set it here so everything is in one place?
    get_x: function() {
        // console.log("debug config.js: getting x, ", this._x);
        return this._x;
    },
    set_x: async function(value) {
        this._x = value;
        this.storeConfigVarInStore("_x", value);
        // console.log("debug config.js: set x to ", x);
    },
    
    get_displayOptionalButton: function() {
        return this._displayOptionalButton;
    },
    set_displayOptionalButton: async function(value) {
        let confVarName = "_displayOptionalButton"
        // Set local variable
        this[confVarName] = value;
        // Set variable in indexedDB
        this.storeConfigVarInStore(confVarName, value);
        // Update the config menu box
        // TODO - implement this
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
        let confVarName = "_distMeas_useRadar"
        // Set local variable
        this[confVarName] = value;
        // Set variable in indexedDB
        this.storeConfigVarInStore(confVarName, value);
        // Update the config menu box
        // TODO - implement this
        // Do necessary logic for the value change
        // TODO - not sure if this will be neccessary  
    },

    get_distMeas_useManualEntry: function() {
        return this._distMeas_useManualEntry;
    },
    set_distMeas_useManualEntry: async function(value) {
        let confVarName = "_distMeas_useManualEntry"
        // Set local variable
        this[confVarName] = value;
        // Set variable in indexedDB
        this.storeConfigVarInStore(confVarName, value);
        // Update the config menu box
        // TODO - implement this
        // Do necessary logic for the value change
        // TODO - not sure if this will be neccessary  
    },

    /* Run at start of program after html elements are made so js code has access to them*/
    getHTMLElements: function() {
        optionalButton = document.getElementById("optionalButton");

        // TODO - probably iterate over all the elements in the config menu and store them in a dictionary sorta thing, I will implement this later
    },
    /* Run at start of program to see if non-default config values stored in indexedDB, if so it gets them and stores them in the config*/
    initConfig: async function() {
        this.getHTMLElements()
        for (let configVarName of configVarsToKeepInStore) {
            let getterFuncName = "get"+configVarName;
            let setterFuncName = "set"+configVarName;
            let configKey_str = "config"+configVarName;
            
            let storeResult;
            let valueToSetLocal;
            // TODO - what if blStore doesn't exist? Should check what error checking Jo's code does for this sort of thing and make sure this is good
            await blStore.get(configKey_str);
            storeResult = blStore.result();
            console.log("debug config.js: storeResult: ", storeResult);

            if (storeResult == undefined) {
                // This key is not in the indexedDB, we should just use the default
                valueToSetLocal = this[getterFuncName]();
                console.log("debug config.js: store does not have a value so using the default for the config value: ", configVarName)
            } else {
                // storeResult has something, we should use what is in the store
                valueToSetLocal = storeResult.v
            }  
            // This will run every setter with the proper state, making sure all setter code is run and all of program is in correct state
            this[setterFuncName](valueToSetLocal);       
        }
    },
    /* NOT USED - should be able to delete this. This runs setters with the values they already have to make sure the program is in the correct state, should not be necessary*/
    // runAllSetters: function() {
    //     for (let configVarName of configVarsToKeepInStore) {
    //         let getterFuncName = "get"+configVarName;
    //         let setterFuncName = "set"+configVarName;
    //         let value = this[getterFuncName]();
    //         this[setterFuncName](value);
    //     }
    // },
    storeConfigVarInStore: async function(varName, value) {
        // Sets a value in the store with key: config{varName}, and value: value
        // str varName: The variable name with the '_'
        // value: The 
        blStore.set("config"+varName, value); //TODO - error checking? How do we know if this succeeded?
    }
}