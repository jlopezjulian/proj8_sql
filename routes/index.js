/**
 * testing the book model and communication with the database (step 6 & 7 from instructions)
 */

var express = require('express');
var router = express.Router();

/**
 * import the book model from the (../models)
 */
const {Book} = require('../models/');

/**
 * helper function
 */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      next(error);
    }
  }
}


/**
 * Get route handler, /-get
 */
router.get('/', asyncHandler(async(req, res, next) => {
  res.redirect("/books");
}));

router.get('/books', asyncHandler(async (req, res, next) => {
  //res.render('index', { title: 'Express' });
  const books = await Book.findAll(); //method on the Book model to get all the books and store in books variable
  res.render('index', {books, title: "Library Database"})
}));

//Display all books, /books-get
router.get(
  "/books",
  asyncHandler(async (req, res) => {
    const books = await Book.findAll({ order: [["createdAt", "ASC"]] }); //ascending order
    res.render("index", { books, title: "Books" });
  })
);
//create new books, /books/new-get
router.get( "/books/new", asyncHandler(async (req, res) => {
    res.render("new-book", { book: {}, title: "New Book" });
  })
);

//create new book form and redirects to, /books/new-post
router.post( "/books/new", asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.create(req.body);
      res.redirect("/books");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        res.render("new-book", {
          book,
          errors: error.errors,
          title: "New Book"
        });
      } else {
        throw error;
      }
    }
  })
);
//show book details and update book, /books/:id-get
router.get( "/books/:id", asyncHandler(async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render("update-book", { book, title: "Update Book" });
    } else {
      const err = new Error();
      err.status = 404;
      next(err);
    }
  })
);


//post for the update method, /books/:id-post
router.post( "/books/:id", asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      if (book) {
        await book.update(req.body);
        res.redirect("/books");
      }
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        book.id = req.params.id;
        res.render("update-book", {
          book,
          errors: error.errors,
          title: "Update Book",
          id: book.id
        });
      } else {
        throw error;
      }
    }
  })
);


//post for the delete method, /books:id/delete-post
router.get( "/books/:id/delete", asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    res.render("delete", { book, title: "Delete Book" });
  })
);

//deleting books
router.post("/books/:id/delete", asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    await book.destroy();
    res.redirect("/books");
  })
);

//404 handler
router.use((req, res, next) => {
  const err = new Error(); //creating error object
  err.status = 404;
  next(err); //error object is passed to next function
});

//global error handler
router.use((err, req, res, next) => {
  if (err.status === 404) {
    err.message = "Sorry, this page doesn't exist.";
    console.log(err.message);
    res.status(err.status);
    return res.render("page-not-found", { err }); //render the page-not-found template
  } else {
    err.message = "Sorry, there appears to be a server issue."; //typically a 500 error
    console.log(err.message);
    res.status(err.status);
    return res.render("error", { err });
  }
});

module.exports = router;