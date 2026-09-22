Purpose: This is a PWA (Progressive Web App) to communicate with the 'snow probe' to be used out in the field for measuring the temperature of the ground beneath snow.
This repo is a fork from BlxMinimal (https://github.com/joembedded/BlxMinimal)

Authors:
Ciaran McDonald-Jensen (ciaranmcdj@gmail.com)
Kome Akugha (alexakugha@gmail.com)
Supervisor: Stephan Gruber (stephangruber@cunet.carleton.ca)

Date forked from BlxMinimal: Sep 22, 2026

How to use:
For now, testing is done on a computer using the "Live Server" VSCode extension, just run index.html in a browser with bluetooth enabled





Notes for documentation we need to make:
- Explain how to enable bluetooth on most browsers, or list what browsers are supported



Things to do for code:
Software Phase 2.1 (base building blocks to ensure all technical tasks can be done):
- Add Grace's code into this github (lots of other tasks will involve just re-factoring her code)
- Add frame of menu screen to select options (probably need a config file that everything uses, that the menu is able to change... check that this is the js way to do this)
- Add html button to connect to nrf button via bluetooth. Then print to console whenever button is pushed
- Add html button to connect to sensors automatically (lots of error catching needed for this... make frame of it for now)
- Add function to store one entry of our sensor data in nice indexedDB format (takes in sensor values)
- Add html button to take measurements 5 times and store in indexedDB
- Add html button to retreive indexedDB data in nice format (.csv file?)

Software Phase 2.2:
Put all the parts of Software Phase 2.1 together, should then have a functional minimum viable product