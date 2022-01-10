const apiv1 = require("express").Router();
const mysql = require("mysql2")
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "admin@12345",
    database: "loginsystem",

    // ------ tried hosting the db -----
    // host: "sql6.freemysqlhosting.net",
    // user: "sql6464753",
    // password: "jr2meisquB",
    // port: 3306,
    // database: "sql6464753"
});

const {
    createToken,
    hashPassword,
    verifyPassword,
} = require("../utils/utils");


//// we could have defined separate routes in this file like:
//// app.use("/user", users);
//// app.use("/anyOtherROute",anyOtherROute);
//// But for the sake of simplicity, I'm doing the '/users' part in here.

apiv1.post("/user/signup", async (req, res) => {
    console.log("---- In signup ---- ");
    let { username, email, password } = req.body;
    const hashedPassword = await hashPassword(password);
    console.log("Hashed Password: ", hashedPassword);
    db.execute(
        "INSERT INTO user(email, password, username) VALUES(?,?,?)",
        [email.trim(), hashedPassword, username.trim()],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Some error occured while adding!" });
            }
            else if (result) {
                console.log("Added data to db!", result, result.insertId, result.affectedRows);
                var token = jwt.sign({ id: result.insertId }, "SecretKey", {
                    expiresIn: 32400, // 24 hours
                });
                console.log("Token :", token)

                let dataToSend = {
                    userInfo: {
                        user_id: result.insertId,
                        username: username,
                        email: email,
                    },
                    token: token,
                    message: "Authentication successful!",
                }

                console.log(dataToSend);
                return res.status(200).send(dataToSend);
            }
        }
    );
});

apiv1.post("/user/login", async (req, res) => {
    console.log("---- In login ---- ");
    console.log("req.body.email : ", req.body.email);
    console.log("req.body.password : ", req.body.password);
    let { email, password } = req.body;

    const hashedPassword = await hashPassword(password);
    console.log("Hashed Password: ", hashedPassword);

    db.execute(
        "SELECT * FROM user WHERE email = ?",
        [email],
        async (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: err });
            }
            else if (result.length > 0) {
                console.log("Got data from db!", result);
                
                var passwordIsValid = await bcrypt.compare(password, result[0].password);
                if (!passwordIsValid) {
                    console.log(err);
                    return res.status(500).json({ message: err });
                }

                var token = jwt.sign({ id: result[0].id }, "SecretKey", {
                    expiresIn: 32400, // 24 hours
                });
                console.log("Token :", token)

                let dataToSend = {
                    userInfo: {
                        user_id: result[0].id,
                        username: result[0].username,
                        email: result[0].email,
                    },
                    token: token,
                    message: "Authentication successful!",
                }

                console.log(dataToSend);
                return res.status(200).send(dataToSend);
            }
            //  else return res.status(401).json({ message: "Wrong email/password combination!" });
        }
    );
})

module.exports = apiv1;