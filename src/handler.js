const { nanoid } = require("nanoid");
const books = require("./books")

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

module.exports = { addBookHandler };
