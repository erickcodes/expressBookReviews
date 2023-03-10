const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

  if (!username && !password){
      res.status(404).json({message:""})
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.status(200).send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let filtered_books = books.filter((book) => book.isbn === isbn);
    if (filtered_books.length == 0) {
        res.status(204).json({message: `Book with ISBN: ${isbn} not found.`});
    }
  return res.status(200).send(JSON.stringify(filtered_books[0]));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let filtered_books = books.filter((book) => book.author.includes(author));
    if (filtered_books.length == 0) {
        res.status(204).json({message: `No matches for books with author: ${author}.`});
    }
  return res.status(200).send(JSON.stringify(filtered_books));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let filtered_books = books.filter((book) => book.title.includes(title));
    if (filtered_books.length == 0) {
        res.status(204).json({message: `No matches for books with title: ${title}.`});
    }
  return res.status(200).send(JSON.stringify(filtered_books));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let filtered_books = books.filter((book) => book.isbn === isbn);
    if (filtered_books.length == 0) {
        res.status(204).json({message: `Book matches with ISBN: ${isbn} not found.`});
    }
  return res.status(200).send(JSON.stringify(filtered_books[0]));
});

module.exports.general = public_users;
