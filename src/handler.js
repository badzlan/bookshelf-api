const { nanoid } = require("nanoid");
const fs = require("fs");

const loadBooks = () => {
   try {
      const booksData = fs.readFileSync("./books.json", "utf8");
      return JSON.parse(booksData);
   } catch (error) {
      return [];
   }
};

const saveBooks = (books) => {
   fs.writeFileSync("./books.json", JSON.stringify(books, null, 2));
};

const indexHandler = (request, h) => {
   const response = h.response({
      status: "success",
      message: "API on /books",
   });
   response.code(200);
   return response;
};

const addBookHandler = (request, h) => {
   const books = loadBooks();

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

   saveBooks(books);

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
   const books = loadBooks();

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

const getBookByIdHandler = (request, h) => {
   const books = loadBooks();

   const { id } = request.params;
   const book = books.find((b) => b.id === id);

   if (book !== undefined) {
      return {
         status: "success",
         data: {
            book,
         },
      };
   }

   const response = h.response({
      status: "fail",
      message: "Buku tidak ditemukan",
   });
   response.code(404);
   return response;
};

const editBookByIdHandler = (request, h) => {
   const books = loadBooks();

   const { id } = request.params;
   const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

   if (name === undefined) {
      const response = h.response({
         status: "fail",
         message: "Gagal memperbarui buku. Mohon isi nama buku",
      });
      response.code(400);
      return response;
   }

   if (readPage > pageCount) {
      const response = h.response({
         status: "fail",
         message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
      });
      response.code(400);
      return response;
   }

   const updatedAt = new Date().toISOString();
   const bookIndex = books.findIndex((book) => book.id === id);

   if (bookIndex !== -1) {
      books[bookIndex] = {
         ...books[bookIndex],
         name,
         year,
         author,
         summary,
         publisher,
         pageCount,
         readPage,
         reading,
         updatedAt,
      };
      saveBooks(books);
      const response = h.response({
         status: "success",
         message: "Buku berhasil diperbarui",
      });
      response.code(200);
      return response;
   }

   const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
   });
   response.code(404);
   return response;
};

const deleteBookByIdHandler = (request, h) => {
   const books = loadBooks();

   const { id } = request.params;
   const bookIndex = books.findIndex((book) => book.id === id);

   if (bookIndex !== -1) {
      books.splice(bookIndex, 1);
      saveBooks(books);
      const response = h.response({
         status: "success",
         message: "Buku berhasil dihapus",
      });
      response.code(200);
      return response;
   }

   const response = h.response({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
   });
   response.code(404);
   return response;
};

module.exports = {
   indexHandler,
   addBookHandler,
   getAllBooksHandler,
   getBookByIdHandler,
   editBookByIdHandler,
   deleteBookByIdHandler,
};
