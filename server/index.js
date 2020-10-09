const express = require('express');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const getAllVehicles = require('./model/vehicles.js');
const {checkIfUserEmailExist, 
    insertNewUserAndGenerateHash, 
    getHashPasswordByEmail, 
    checkEmailAndPasswordMatches} = require('./model/user.js');
const getTodaysDateTime = require('./utils/date.js');
const {doPasswordsMatch} = require('./utils/encryption.js');


const app = express();
const env = process.env.NODE_ENV || 'development';
const config = require('../config.js')[env];

app.use(bodyParser.json()); //support json encoded bodies
app.use(bodyParser.urlencoded({extended : false})); // support encoded bodies
//Serve the static files from the React App
app.use(express.static(path.join(__dirname, '../client/build')));

app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build/index.html'));
})

app.get("/vehicles", (req, res) => {
    let connection = mysql.createConnection(config.database);

    getAllVehicles(connection)
    .then(result=> {
        res.json(result);
    }).catch(err => {
        console.error('Unable to get all vehicles from database. ERROR:' + err);
        res.status(400).json({msg : 'Something went wrong on the server', success: false});
    })

    connection.end();
})

app.get('/date', (req, res) => {
    res.json(getTodaysDateTime());
})


app.post("/signup", async (req, res) => {
    const userEmail = req.body.email;
    const userPassword = req.body.password;
    if(!userEmail || !userPassword){
        console.error('Empty email/password');
        res.status(500).json({msg: 'Email/password must not be empty', success: false})
        return;
    }

    let isUserEmailUnique;
    let newUserResult;

    try {
        isUserEmailUnique = await checkIfUserEmailExist(userEmail);
    } catch (err) {
        console.error(err);
        res.status(500).json({msg : 'Something went wrong on the server', success: false});
        return;
    }

    if(isUserEmailUnique){
        try {
            newUserResult = await insertNewUserAndGenerateHash(userEmail, userPassword);
            res.status(200).json({msg : newUserResult.msg, success: true});
        } catch (err){
            console.error(err);
            res.status(500).json({msg : 'Something went wrong on the server', success: false});
        }
    } else {
        console.info(userEmail + ' already exists');
        res.status(400).json({msg : 'Email already exists. Please use another one', success: false});
    }    
})

app.post("/login", async (req, res) => {
    if(req.body.email == null || req.body.email == '' || req.body.password == '' || req.body.password == null){
        res.status(400).json({msg : 'Missing email/password', success: false});
        console.log(req.body);
        return;
    }

    const userEmail = req.body.email;
    const userPassword = req.body.password;
    let isPasswordsMatch;
    let hashResult;

    try{
        hashResult = await getHashPasswordByEmail(userEmail);
        isPasswordsMatch = await doPasswordsMatch(userPassword, hashResult.hash);
              
        if(isPasswordsMatch){
            console.info('Successful login for ' + userEmail);
            res.send({message: 'Successful login for user', isAuthenticated : true, success: true});
            //res.sendFile(path.resolve(__dirname, '../client/build/index.html'));
            return;

        } else {
            console.error('Passwords do not match');
            res.status(400).json({msg : 'Unsuccessful Login', success: false});
            return;
        }
    }catch(err){
        console.error(err);
        res.status(400).json({msg : 'Unsuccessful Login', success: false});
        return;
    }
})

app.listen(config.server.port);

console.log(`App listening on port ${config.server.port}`);