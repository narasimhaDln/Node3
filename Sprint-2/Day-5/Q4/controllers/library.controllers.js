const getAllBooks = async (req, res) => {
  try {
    const libraries = await Library.find();
    const allBooks = libraries.flatMap((lib) =>
      lib.books.map((book) => ({
        ...book.toObject(),
        libraryName: lib.name,
      }))
    );
    res.status(200).json(allBooks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const addGenreToBook = async (req, res) => {
  const { libraryId, bookTitle } = req.params;
  const { genre } = req.body;

  try {
    const library = await Library.findById(libraryId);
    const book = library.books.find((b) => b.title === bookTitle);

    if (!book) return res.status(404).json({ error: "Book not found" });
    if (!book.genres.includes(genre)) book.genres.push(genre);

    await library.save();
    res.status(200).json({ message: "Genre added", book });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getLibrariesByGenres = async (req, res) => {
  const genres = req.query.genres?.split(",") || [];

  try {
    const libraries = await Library.find({
      books: { $elemMatch: { genres: { $in: genres } } },
    });
    res.status(200).json(libraries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getBooksByCriteria = async (req, res) => {
  const { author, minPublicationYear, genres } = req.query;
  const genreList = genres?.split(",") || [];

  try {
    const libraries = await Library.find();
    const filteredBooks = libraries.flatMap((lib) =>
      lib.books
        .filter(
          (book) =>
            (!author || book.author === author) &&
            (!minPublicationYear ||
              book.publicationYear >= parseInt(minPublicationYear)) &&
            (!genres || genreList.some((g) => book.genres.includes(g)))
        )
        .map((book) => ({ ...book.toObject(), libraryName: lib.name }))
    );

    res.status(200).json(filteredBooks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const removeBookFromLibrary = async (req, res) => {
  const { libraryId, bookTitle } = req.params;

  try {
    const library = await Library.findById(libraryId);
    const initialLength = library.books.length;
    library.books = library.books.filter((book) => book.title !== bookTitle);

    if (library.books.length === initialLength)
      return res.status(404).json({ error: "Book not found" });

    await library.save();
    res.status(200).json({ message: "Book removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = {
  removeBookFromLibrary,
  getBooksByCriteria,
  getLibrariesByGenres,
  addGenreToBook,
  getAllBooks,
};
