
const request = require('supertest');
const app = require('../server');

describe('Books API Tests', () => {

    // Test GET all books
    test('GET /api/books returns all books', async () => {
        const response = await request(app).get('/api/books');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThanOrEqual(3);
    });

    // Test GET book by ID
    test('GET /api/books/1 returns a book', async () => {
        const response = await request(app).get('/api/books/1');

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(1);
        expect(response.body.title).toBe('The Great Gatsby');
    });

    // Test GET invalid ID
    test('GET invalid ID returns 404', async () => {
        const response = await request(app).get('/api/books/999');

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
    });

    // Test POST create book
    test('POST /api/books creates a new book', async () => {
        const newBook = {
            title: 'Harry Potter',
            author: 'J.K. Rowling',
            genre: 'Fantasy',
            copiesAvailable: 10
        };

        const response = await request(app)
            .post('/api/books')
            .send(newBook);

        expect(response.status).toBe(201);
        expect(response.body.title).toBe('Harry Potter');
        expect(response.body).toHaveProperty('id');
    });

    // Test PUT update book
    test('PUT /api/books/1 updates a book', async () => {
        const response = await request(app)
            .put('/api/books/1')
            .send({
                copiesAvailable: 8
            });

        expect(response.status).toBe(200);
        expect(response.body.copiesAvailable).toBe(8);
    });

    // Test PUT invalid ID
    test('PUT invalid ID returns 404', async () => {
        const response = await request(app)
            .put('/api/books/999')
            .send({ title: 'Unknown Book' });

        expect(response.status).toBe(404);
    });

    // Test DELETE book
    test('DELETE /api/books removes a book', async () => {
        const created = await request(app)
            .post('/api/books')
            .send({
                title: 'Book to Delete',
                author: 'Test Author',
                genre: 'Fiction',
                copiesAvailable: 1
            });

        const response = await request(app)
            .delete(`/api/books/${created.body.id}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Book deleted successfully');
    });

    // Test DELETE invalid ID
    test('DELETE invalid ID returns 404', async () => {
        const response = await request(app).delete('/api/books/999');

        expect(response.status).toBe(404);
    });

});
