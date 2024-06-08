require("dotenv").config();

const {encrypt} = require("./crypto");

function start(){
    if(!process.argv.length) return console.error(`The parameter message is required.`);

    const message = process.argv[process.argv.length - 1];
    console.log(`Encrypting ${message}`);
    console.log(encrypt(message));
}

start();