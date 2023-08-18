const express = require("express");
const {accessChat , fetchChat} = require("../controllers/chatControler");
const protect = require("../middleware/auth");

const chatRoutes = express.Router();


chatRoutes.post("/" , protect , accessChat);
chatRoutes.get("/" , protect , fetchChat);





module.exports = chatRoutes;

