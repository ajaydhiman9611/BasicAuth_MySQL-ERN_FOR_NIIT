require("dotenv").config({ path: "./config.env" })
const express = require("express");
const bodyParser = require('body-parser')
const cors = require("cors");
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());

const mysql = require('mysql2');
const routes = require("./routes/index")

app.use(express.json());

app.use("/api/v1", routes);

app.listen(process.env.PORT, () => {
    console.log(`Server is listening @ http://localhost:${process.env.PORT}`)
})