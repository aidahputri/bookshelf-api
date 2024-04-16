const { nanoid } = require("nanoid");

const books = [];

const routes = [
  {
    method: "POST",
    path: "/books",
    handler: (request, h) => {
      const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
      } = request.payload;

      if (!name) {
        return h
          .response({
            status: "fail",
            message: "Gagal menambahkan buku. Mohon isi nama buku",
          })
          .code(400);
      }

      if (readPage > pageCount) {
        return h
          .response({
            status: "fail",
            message:
              "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
          })
          .code(400);
      }

      const id = nanoid();
      const finished = pageCount === readPage;
      const insertedAt = new Date().toISOString();
      const updatedAt = insertedAt;

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

      return h
        .response({
          status: "success",
          message: "Buku berhasil ditambahkan",
          data: { bookId: id },
        })
        .code(201);
    },
  },
  {
    method: "GET",
    path: "/books",
    handler: (request, h) => {
      const { name, reading, finished } = request.query;
      let filteredBooks = [...books];

      if (name) {
        const searchQuery = name.toLowerCase();
        filteredBooks = filteredBooks.filter((book) =>
          book.name.toLowerCase().includes(searchQuery)
        );
      }

      if (reading !== undefined) {
        const isReading = reading === "1";
        filteredBooks = filteredBooks.filter(
          (book) => book.reading === isReading
        );
      }

      if (finished !== undefined) {
        const isFinished = finished === "1";
        filteredBooks = filteredBooks.filter(
          (book) => book.finished === isFinished
        );
      }

      return { status: "success", data: { books: filteredBooks } };
    },
  },
  {
    method: "GET",
    path: "/books/{bookId}",
    handler: (request, h) => {
      const { bookId } = request.params;
      const book = books.find((b) => b.id === bookId);

      if (!book) {
        return h
          .response({ status: "fail", message: "Buku tidak ditemukan" })
          .code(404);
      }

      return { status: "success", data: { book } };
    },
  },
  {
    method: "PUT",
    path: "/books/{bookId}",
    handler: (request, h) => {
      const { bookId } = request.params;
      const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
      } = request.payload;

      if (!name) {
        return h
          .response({
            status: "fail",
            message: "Gagal memperbarui buku. Mohon isi nama buku",
          })
          .code(400);
      }

      if (readPage > pageCount) {
        return h
          .response({
            status: "fail",
            message:
              "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
          })
          .code(400);
      }

      const index = books.findIndex((b) => b.id === bookId);

      if (index === -1) {
        return h
          .response({
            status: "fail",
            message: "Gagal memperbarui buku. Id tidak ditemukan",
          })
          .code(404);
      }

      books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt: new Date().toISOString(),
      };

      return h.response({
        status: "success",
        message: "Buku berhasil diperbarui",
      });
    },
  },
  {
    method: "DELETE",
    path: "/books/{bookId}",
    handler: (request, h) => {
      const { bookId } = request.params;
      const index = books.findIndex((b) => b.id === bookId);

      if (index === -1) {
        return h
          .response({
            status: "fail",
            message: "Buku gagal dihapus. Id tidak ditemukan",
          })
          .code(404);
      }

      books.splice(index, 1);

      return h.response({
        status: "success",
        message: "Buku berhasil dihapus",
      });
    },
  },
  {
    method: "*",
    path: "/{any*}",
    handler: (request, h) => {
      return "Halaman tidak ditemukan";
    },
  },
];

module.exports = routes;
