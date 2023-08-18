const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();



const connectDatebase = async() =>{

    try{
        const connection = await mongoose.connect(process.env.URI , {
            useNewUrlParser : true,
            useUnifiedTopology : true,
        });
        console.log("Connection Established");

    }
    catch(err){
        console.log("Access Denied" , err);
        process.exit();
    }
};

module.exports = connectDatebase;