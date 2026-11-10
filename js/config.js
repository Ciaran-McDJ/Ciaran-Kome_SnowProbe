// Created Nov 10, 2026
import {blStore} from './blStore.js'



export function myTest(a) {
    return a+1
}


// TODO - describe somewhere (here or a README?) the process for adding a new variable to the config
    // Add variable name with _
    // Add getter and setter (IMPORTANT: Must have same name as variable, just with 'get' and 'set' added)
    // Add its name to configVarsToKeepInStore so it gets checked on startup of the program
    // 
    // 

// TODO - look up proper docstring formatting for all of this
let configVarsToKeepInStore = ["_x", "_displayOptionalButton"];
export const myTestConfig = {
    _x: 1,
    _displayOptionalButton: false,
    // TODO - add what type x should be and some condition to throw error (acceptable range)
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
        this._displayOptionalButton = value;
        this.storeConfigVarInStore("_displayOptionalButton", value);
        if (this.get_displayOptionalButton() == false) {
            document.getElementById("optionalButton").style.display = "none";
        } else if (this.get_displayOptionalButton() == true) {
            document.getElementById("optionalButton").style.display = "inline-block";
        } else {
            throw console.error("config._displayOptionalButton was not true or false, this should never happen. It was: ",this.get_displayOptionalButton());
        }
        
    },
    a: 0,
    myTestFunc: function() {
        this.a += 1;
    },


    initConfig: async function() {
        // Run at start of program to see if non-default config values stored in indexedDB, if so it gets them and stores them in the config

        for (let configVarName of configVarsToKeepInStore) {
            let getterFuncName = "get"+configVarName;
            let setterFuncName = "set"+configVarName;
            let configKey_str = "config"+configVarName;
            
            let storeResult;
            await blStore.get(configKey_str);
            storeResult = blStore.result();
            console.log("debug config.js: storeResult: ", storeResult);

            if (storeResult == undefined) {
                // I believe this is the only option for how this could fail
                // TODO - what if blStore doesn't exist? Should check what error checking Jo's code does for this sort of thing and make sure this is good
                console.log("WARNING in config.js -> initConfig(). The storeResult was undefined, so the config is using its default. This is probably fine and intended, I need to add better error checking. This is for the configVarName:", configVarName);
            } else {
                if (storeResult.v != this[getterFuncName]()) {
                    // storeResult has something other than the default, we should use what is in the store
                    this[setterFuncName](storeResult.v);
                }
            }         
        }
        this.runAllSetters();
    },
    runAllSetters: function() {
        for (let configVarName of configVarsToKeepInStore) {
            let getterFuncName = "get"+configVarName;
            let setterFuncName = "set"+configVarName;
            let value = this[getterFuncName]();
            this[setterFuncName](value);
        }
    },
    storeConfigVarInStore: async function(varName, value) {
        // Sets a value in the store with key: config{varName}, and value: value
        // str varName: The variable name with the '_'
        // value: The 
        blStore.set("config"+varName, value); //TODO - error checking? How do we know if this succeeded?
    }


}