const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    let user_found = users.find((account) => account.username === username);
    return Boolean(user_found)
}

const authenticatedUser = (username,password)=>{ 
    let valid_credentials = users.find((account) => {
        return account.username === username && account.password === password;
    });
    return Boolean(valid_credentials)
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    username = req.body.username;
    password = req.body.password;

    if (!username && !password){
        return res.status(400).json({message:"Try again, the username and password were omitted"})
    } 
    if (!username){
        return res.status(400).json({message:"Try again, the username  were omitted"})
    } 
    if (!password){
        return res.status(400).json({message:"Try again, the password  were omitted"})
    }
    if (authenticatedUser(username, password)){
        let accessToken = jwt.sign({
            data: password
        }, 'access', {expiresIn: 60 * 60});
        req.session.authorization = {
            accessToken,
            username}
            return res.status(200).json({message: `Login Successful, welcome ${username}`});
    }
    return res.status(401).json({message: `Login Failed!`});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
