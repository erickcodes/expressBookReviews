const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username && !password){
        return res.status(400).json({message:"Try again, the username and password were omitted"})
    } 
    if (!username){
        return res.status(400).json({message:"Try again, the username was omitted"})
    } 
    if (!password){
        return res.status(400).json({message:"Try again, the password was omitted"})
    } 
    if (isValid(username)){
        return res.status(400).json({message:"Try again, username already exist."})
    }
    users.push({
        "username": username,
        "password": password
    });
    return res.status(201).json({message: `Registration completed, username: ${username} added to users.`});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.status(200).send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    if (!books.hasOwnProperty(isbn)) {
        return res.status(404).json({message: `Book match with ISBN: ${isbn} not found.`});
    }
    return res.status(200).send(JSON.stringify({[isbn] : books[isbn]}));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let result = {};
    for (const isbn in books){
        if (books[isbn].author.includes(author)) {
            result[isbn] = books[isbn];
        }
    }
    if (Object.keys(result).length === 0) {
        return res.status(404).json({message: `No matches for books with author: ${author}.`});
    }
  return res.status(200).send(JSON.stringify(result));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let booksArray = Object.entries(books);
    let result = {};
    for (const isbn in books){
        if (books[isbn].title.includes(title)) {
            result[isbn] = books[isbn];
        }
    }
    if (Object.keys(result).length === 0) {
        return res.status(404).json({message: `No matches for books with title: ${title}.`});
    }
  return res.status(200).send(JSON.stringify(result));
});

public_users.get('/users',function (req, res) {
    return res.status(200).send(users);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (!books.hasOwnProperty(isbn)) {
        return res.status(404).json({message: `Book match with ISBN: ${isbn} not found.`});
    }
    return res.status(200).send(JSON.stringify({[isbn] : books[isbn]}));
});

module.exports.general = public_users;
