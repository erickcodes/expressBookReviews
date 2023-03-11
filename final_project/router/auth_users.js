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
        return res.status(400).json({message:"Try again, the username was omitted"})
    } 
    if (!password){
        return res.status(400).json({message:"Try again, the password was omitted"})
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
    const review = req.query.review;
    const isbn = req.params.isbn;
    const client_username = req.session.authorization.username;
    for (review_username in books[isbn].reviews){
        if (review_username === client_username){
            books[isbn].reviews[client_username] = review;
            return res.status(200).json({message: 'Updated your previous review.'});
        }
    }
    books[isbn].reviews[client_username] = review;
    return res.status(200).json({message: 'Added your new review.'});
});

// Deletes a review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const client_username = req.session.authorization.username;
    for (review_username in books[isbn].reviews){
        if (review_username === client_username){
            delete books[isbn].reviews[client_username];
            return res.status(200).json({message: 'Deleted your previous review.'});
        }
    }
    return res.status(200).json({message: 'No review to delete.'});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
