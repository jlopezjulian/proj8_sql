// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// module.exports = router;

// var express = require("express");
// const res = require("express/lib/response");
// const app = require("../app");
// var router = express.Router();

// //import the Book module
// const Book = require("../models").Book;

// //IIFE helper function
// function asyncHandler(cb) {
//   return async (req, res, next) => {
//     try {
//       await cb(req, res, next);
//     } catch (err) {
//       next(err);
//     }
//   };
// }

// /* GET home page. redirect to /books */
// router.get("/", (req, res) => {
//   res.redirect("/books");
// });

// //get /books
// router.get(
//   "/books",
//   asyncHandler(async (req, res) => {
//     const books = await Book.findAll();
//     res.render("index", { title: "Books Library Manager", books });
//   })
// );

// //render the new-book page
// router.get("/books/new", (req, res) =>
//   res.render("new-book", { title: "Create New Book" })
// );

// //post the New book and redirect to /books
// router.post(
//   "/books/new",
//   asyncHandler(async (req, res) => {
//     let book;
//     try {
//       book = await Book.create(req.body);
//       res.redirect("/books");
//     } catch (err) {
//       if (err.name === "SequelizeValidationError") {
//         book = await Book.build(req.body);
//         res.render("new-book", { errors: error.errors });
//       } else {
//         throw error;
//       }
//     }
//   })
// );

// //render update-book page depend on req.params.id
// router.get(
//   "/books/:id",
//   asyncHandler(async (req, res, next) => {
//     const book = await Book.findByPk(req.params.id);
//     if (book) {
//       res.render("update-book", { book, title: `${book.title}- Update Book` });
//     } else {
//       const err = new Error();
//       err.status = 404;
//       err.message = '"Book.id" is not valid or not exist';
//       next(err);
//     }
//   })
// );

// //post for the update method
// router.post(
//   "/books/:id",
//   asyncHandler(async (req, res) => {
//     let book;
//     try {
//       book = await Book.findByPk(req.params.id);
//       if (book) {
//         await book.update(req.body);
//         res.redirect("/books");
//       } else {
//         res.sendStatus(404);
//       }
//     } catch (err) {
//       if (err.name === "SequelizeValidationError") {
//         book = await Book.build(req.body);
//         book.id = req.params.id;
//         res.render("update-book", {
//           errors: error.errors,
//           book,
//           title: book.title,
//         });
//       } else {
//         throw error;
//       }
//     }
//   })
// );

// //post for the delete method
// router.post(
//   "/books/:id/delete",
//   asyncHandler(async (req, res) => { //https://teamtreehouse.com/library/update-and-delete-entries @4:30
//     const book = await Book.findByPk(req.params.id);
//     await book.destroy();
//     res.redirect("/books");
//   })
// );

// module.exports = router;

var express = require('express');
var router = express.Router();

//IMPORT THE BOOK MODEL FROM THE MODULES FOLDER
const {Book} = require('../models/');

function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      next(error);
    }
  }
}


/* GET home page. */
router.get('/', asyncHandler(async(req, res, next) => {
  res.redirect("/books");
}));

router.get('/books', asyncHandler(async (req, res, next) => {
  //res.render('index', { title: 'Express' });
  const books = await Book.findAll();
  res.render('index', {books, title: "Library Database"})
}));

/* SHOW ALL BOOKS (books/new) */
router.get(
  "/books",
  asyncHandler(async (req, res) => {
    const books = await Book.findAll({ order: [["createdAt", "ASC"]] });
    res.render("index", { books, title: "Books" });
  })
);
/* CREATE NEW BOOK FORM (books/new) */
router.get( "/books/new", asyncHandler(async (req, res) => {
    res.render("new-book", { book: {}, title: "New Book" });
  })
);

/* CREATE NEW BOOK FORM (books/new)- post */
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
/* SHOWS BOOK DETAILS (books/:id) - get */
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


/* UPDATES BOOK DETAILS  (books/:id) - post */
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


/* DELETES BOOK (books/:id/delete)- get */
router.get( "/books/:id/delete", asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    res.render("delete", { book, title: "Delete Book" });
  })
);

/* DELETES BOOK (books/:id/delete) - post */
router.post("/books/:id/delete", asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    await book.destroy();
    res.redirect("/books");
  })
);

//404 HANDLER
router.use((req, res, next) => {
  const err = new Error(); //creating error object
  err.status = 404;
  next(err); //error object is passed to next function
});

//**Global Handler**/
router.use((err, req, res, next) => {
  if (err.status === 404) {
    err.message = "OOPS! That page doesn't exist.";
    console.log(err.message);
    res.status(err.status);
    return res.render("page-not-found", { err });
  } else {
    err.message = "Our bad, there was a server issue!";
    console.log(err.message);
    res.status(err.status);
    return res.render("error", { err });
  }
});

module.exports = router;