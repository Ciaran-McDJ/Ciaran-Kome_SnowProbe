// Created Nov 10, 2026
import {blStore} from './blStore.js'



export function myTest(a) {
    return a+1
}



// TODO - describe somewhere (here or a README?) the process for adding a new variable to the config
    // Add variable name with _
    // Add getter and setter (IMPORTANT: Must have same name as variable, just with 'get' and 'set' added)
    // Add its name to initConfig function for loop so it gets checked on startup of the program
    // 
    // 

// TODO - look up proper docstring formatting for all of this
export const myTestConfig = {
    _x: 1,
    get_x: function() {
        console.log("debug config.js: getting x, ", this._x);
        return this._x;
    },
    set_x: async function(x) {
        this._x = x;
        blStore.set("config_x", x); //TODO - error checking? How do we know if this succeeded?
        console.log("debug config.js: set x to ", x);
    },
    a: 0,
    myTestFunc: function() {
        this.a += 1;
    },


    initConfig: async function() {
        // Run at start of program to see if non-default config values stored in indexedDB, if so it gets them and stores them in the config

        for (let configName in ["_x"]) {
            
            let storeResult;
            await blStore.get("config_x");
            storeResult = blStore.result();
            console.log("debug config.js: storeResult: ", storeResult);

            if (storeResult == undefined) {
                // I believe this is the only option for how this could fail
                // TODO - what if blStore doesn't exist? Should check what error checking Jo's code does for this sort of thing and make sure this is good
                console.log("ERROR in config.js -> initConfig(). The storeResult was undefined. Should check what case this is and do proper error checking");
            } else {
                if (storeResult.v != this.get_x()) {
                    // storeResult has something other than the default, we should use what is in the store
                    this.set_x(storeResult.v);
                }
            }            
        }
    }


}