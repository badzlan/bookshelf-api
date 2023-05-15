const { nanoid } = require("nanoid");
const books = require("./books");

const addBookHandler = (request, h) => {
   const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

   if (name === undefined) {
      const response = h.response({
         status: "fail",
         message: "Gagal menambahkan buku. Mohon isi nama buku",
      });
      response.code(400);
      return response;
   }

   if (readPage > pageCount) {
      const response = h.response({
         status: "fail",
         message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      });
      response.code(400);
      return response;
   }

   const id = nanoid(16);
   const insertedAt = new Date().toISOString();
   const updatedAt = insertedAt;
   const finished = pageCount === readPage;

   const newBook = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      insertedAt,
      updatedAt,
   };

   books.push(newBook);

   const isSuccess = books.filter((book) => book.id === id).length > 0;

   if (isSuccess) {
      const response = h.response({
         status: "success",
         message: "Buku berhasil ditambahkan",
         data: {
            bookId: id,
         },
      });
      response.code(201);
      return response;
   }
};

const getAllBooksHandler = (request, h) => {
   const { name, reading, finished } = request.query;

   if (name !== undefined) {
      const BooksName = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
      const response = h.response({
         status: "success",
         data: {
            books: BooksName.map((book) => ({
               id: book.id,
               name: book.name,
               publisher: book.publisher,
            })),
         },
      });
      response.code(200);
      return response;
   }

   if (reading !== undefined) {
      const BooksReading = books.filter((book) => Number(book.reading) === Number(reading));
      const response = h.response({
         status: "success",
         data: {
            books: BooksReading.map((book) => ({
               id: book.id,
               name: book.name,
               publisher: book.publisher,
            })),
         },
      });
      response.code(200);
      return response;
   }

   if (finished !== undefined) {
      const BooksFinished = books.filter((book) => book.finished == finished);
      const response = h.response({
         status: "success",
         data: {
            books: BooksFinished.map((book) => ({
               id: book.id,
               name: book.name,
               publisher: book.publisher,
            })),
         },
      });
      response.code(200);
      return response;
   }

   const response = h.response({
      status: "success",
      data: {
         books: books.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
         })),
      },
   });
   response.code(200);
   return response;
};

module.exports = { addBookHandler, getAllBooksHandler };
