


async function delay(t = 1) {
    //This is in miliseconds - TODO - look up typical docscring syntax for js
    // ex. await delay(1000);
    return new Promise(e => setTimeout(e, t));
}