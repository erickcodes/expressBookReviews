const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

function runAsyncWrapper (callback) {
    return function (req, res, next) {
      callback(req, res, next)
        .catch(next)
    }
  }


public_users.post("/register", runAsyncWrapper(async (req,res) => {
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
    if (await isValid(username)){
        return res.status(400).json({message:"Try again, username already exist."})
    }
    await users.push({
        "username": username,
        "password": password
    });
    return res.status(201).json({message: `Registration completed, username: ${username} added to users.`});
}));

// Get the book list available in the shop
public_users.get('/', runAsyncWrapper(async (req, res) => {
    const result = await JSON.stringify(books);
    return res.status(200).send(result);
}));

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    let isbn = req.params.isbn;
    validationPromise = new Promise(function(resolve, reject) {
        // "Producing Code" (May take some time)
        if (books.hasOwnProperty(isbn)) {
            resolve({[isbn] : books[isbn]}); 
        }
            reject({message: `Book match with ISBN: ${isbn} not found.`}); 
    });
    validationPromise.then(
        (value) => res.status(200).send(JSON.stringify(value)), 
        (error) => res.status(404).json({message: error})
    );
 });
  

// Get book details based on author
public_users.get('/author/:author', runAsyncWrapper(async (req, res) => {
    const author = req.params.author;
    const result = await searchBooksAuthor(author);
    if (Object.keys(result).length === 0) {
        return res.status(404).json({message: `No matches for books with author: ${author}.`});
    }
  return res.status(200).send(JSON.stringify(result));
}));

// Get all books based on title
public_users.get('/title/:title', runAsyncWrapper(async (req, res) => {
    const title = req.params.title;
    const result = await searchBooksTitle(title);
    if (Object.keys(result).length === 0) {
        return res.status(404).json({message: `No matches for books with title: ${title}.`});
    }
  return res.status(200).send(JSON.stringify(result));
}));

//  Get book review
public_users.get('/review/:isbn', runAsyncWrapper(async (req, res) => {
    const isbn = req.params.isbn;
    const validISBN = await books.hasOwnProperty(isbn);
    if (!validISBN) {
        return res.status(404).json({message: `Book match with ISBN: ${isbn} not found.`});
    }
    const reviews = await books[isbn].reviews;
    return res.status(200).send(JSON.stringify(reviews));
}));

//hoisted searching books for books containing parameter title
function searchBooksTitle(title) {
    let result = {};
    for (const isbn in books){
        if (books[isbn].title.includes(title)) {
            result[isbn] = books[isbn];
        }
    }
    return result;
}

//hoisted searching books for books containing parameter author
function searchBooksAuthor(author) {
    let result = {};
    for (const isbn in books){
        if (books[isbn].author.includes(author)) {
            result[isbn] = books[isbn];
        }
    }
    return result;
}


module.exports.general = public_users;
