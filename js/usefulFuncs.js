
// You can stick miscellaneous functions in here that you want in many places. This can be imported by basically any file

export async function delay(t = 1) {
    //This is in miliseconds - TODO - look up typical docscring syntax for js
    // ex. await delay(1000);
    return new Promise(e => setTimeout(e, t));
}