const mongoose = require("mongoose");

async function DbConnect() {
    try {

        const DB_URL = process.env.DB_URL;

        mongoose.connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        const db =  mongoose.connection

        console.log("database connected sucessfully");

    } catch (error) {
        console.log("error while connecting to database");
        console.log(error);
    }
}

module.exports = DbConnect;