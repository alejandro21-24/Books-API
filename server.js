
const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Books for bookstore API
let books = [
    {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        genre: "Fiction",
        copiesAvailable: 5
    },
    {
        id: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        genre: "Fiction",
        copiesAvailable: 3
    },
    {
        id: 3,
        title: "1984",
        author: "George Orwell",
        genre: "Dystopian Fiction",
        copiesAvailable: 7
    }
];

// GET /api/books - Get all books
app.get('/api/books', (req, res) => {
    res.json(books);
});

// GET /api/books/:id - Get a specific book
app.get('/api/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const book = books.find(b => b.id === bookId);

    if (!book) {
        return res.status(404).json({
            error: 'Book not found'
        });
    }

    res.json(book);
});

// POST /api/books - Add a new book
app.post('/api/books', (req, res) => {
    const { title, author, genre, copiesAvailable } = req.body;

    if (!title || !author) {
        return res.status(400).json({
            error: 'Title and author are required'
        });
    }

    const newBook = {
        id: books.length + 1,
        title,
        author,
        genre,
        copiesAvailable
    };

    books.push(newBook);

    res.status(201).json(newBook);
});

// PUT /api/books/:id - Update a book
app.put('/api/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const book = books.find(b => b.id === bookId);

    if (!book) {
        return res.status(404).json({
            error: 'Book not found'
        });
    }

    const { title, author, genre, copiesAvailable } = req.body;

    if (title !== undefined) book.title = title;
    if (author !== undefined) book.author = author;
    if (genre !== undefined) book.genre = genre;
    if (copiesAvailable !== undefined) {
        book.copiesAvailable = copiesAvailable;
    }

    res.json(book);
});

// DELETE /api/books/:id - Delete a book
app.delete('/api/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const bookIndex = books.findIndex(b => b.id === bookId);

    if (bookIndex === -1) {
        return res.status(404).json({
            error: 'Book not found'
        });
    }

    const deletedBook = books.splice(bookIndex, 1)[0];

    res.json({
        message: 'Book deleted successfully',
        book: deletedBook
    });
});

// Start server only when running directly
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Books API running at http://localhost:${port}`);
    });
}

// Export app for automated testing
module.exports = app;
