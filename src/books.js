const books = [];

export const addBook = (newBook) => {
  books.push(newBook);
};

export const getBooks = (h, { name, reading, finished }) => {
  let filteredBooks = [...books];

  if (name) {
    const searchQuery = name.toLowerCase();
    filteredBooks = filteredBooks.filter((book) =>
      book.name.toLowerCase().includes(searchQuery)
    );
  }

  if (reading !== undefined) {
    const isReading = reading === "1";
    filteredBooks = filteredBooks.filter((book) => book.reading === isReading);
  }

  if (finished !== undefined) {
    const isFinished = finished === "1";
    filteredBooks = filteredBooks.filter(
      (book) => book.finished === isFinished
    );
  }

  const simplifiedBooks = filteredBooks.map(({ id, name, publisher }) => ({
    id,
    name,
    publisher,
  }));

  if (simplifiedBooks.length === 0) {
    return h.response({ status: "success", data: { books: [] } });
  }

  return h.response({ status: "success", data: { books: simplifiedBooks } });
};

export const getBookById = (bookId, h) => {
  const book = books.find((b) => b.id === bookId);
  console.log(book);

  if (!book) {
    return h
      .response({ status: "fail", message: "Buku tidak ditemukan" })
      .code(404);
  }

  return h.response({ status: "success", data: { book } }).code(200);
};

export const updateBook = (bookId, updatedData, h) => {
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
    ...updatedData,
    finished: updatedData.pageCount === updatedData.readPage,
    updatedAt: new Date().toISOString(),
  };

  return h
    .response({ status: "success", message: "Buku berhasil diperbarui" })
    .code(200);
};

export const deleteBook = (bookId, h) => {
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

  return h
    .response({ status: "success", message: "Buku berhasil dihapus" })
    .code(200);
};
