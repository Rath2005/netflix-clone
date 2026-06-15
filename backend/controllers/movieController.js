const asyncHandler = require("express-async-handler");
const Movie = require("../models/Movie");
const APIFeatures = require("../utils/apiFeatures");

// ─── @route   GET /api/movies ─────────────────────────────────────────────────
// ─── @access  Public ──────────────────────────────────────────────────────────
const getAllMovies = asyncHandler(async (req, res) => {
  const features = new APIFeatures(Movie.find(), req.query)
    .search("title")
    .filter()
    .sort()
    .paginate();

  const movies = await features.query;
  const total = await Movie.countDocuments();

  res.status(200).json({
    success: true,
    count: movies.length,
    total,
    data: movies,
  });
});

// ─── @route   GET /api/movies/:id ────────────────────────────────────────────
// ─── @access  Public ──────────────────────────────────────────────────────────
const getMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) {
    res.status(404);
    throw new Error("Movie not found");
  }

  // Increment view count
  movie.views += 1;
  await movie.save();

  res.status(200).json({
    success: true,
    data: movie,
  });
});

// ─── @route   GET /api/movies/trending ───────────────────────────────────────
// ─── @access  Public ──────────────────────────────────────────────────────────
const getTrending = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const movies = await Movie.find({ isTrending: true })
    .sort("-views")
    .limit(limit);

  res.status(200).json({
    success: true,
    count: movies.length,
    data: movies,
  });
});

// ─── @route   GET /api/movies/recommended ────────────────────────────────────
// ─── @access  Public ──────────────────────────────────────────────────────────
const getRecommended = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const movies = await Movie.find({ isRecommended: true })
    .sort("-rating")
    .limit(limit);

  res.status(200).json({
    success: true,
    count: movies.length,
    data: movies,
  });
});

// ─── @route   GET /api/movies/search?keyword=xyz ─────────────────────────────
// ─── @access  Public ──────────────────────────────────────────────────────────
const searchMovies = asyncHandler(async (req, res) => {
  const { keyword } = req.query;

  if (!keyword) {
    res.status(400);
    throw new Error("Please provide a search keyword");
  }

  const movies = await Movie.find({
    $or: [
      { title: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
      { cast: { $regex: keyword, $options: "i" } },
      { director: { $regex: keyword, $options: "i" } },
    ],
  }).limit(20);

  res.status(200).json({
    success: true,
    count: movies.length,
    data: movies,
  });
});

// ─── @route   GET /api/movies/genre/:genre ───────────────────────────────────
// ─── @access  Public ──────────────────────────────────────────────────────────
const filterByGenre = asyncHandler(async (req, res) => {
  const { genre } = req.params;
  const limit = parseInt(req.query.limit) || 12;

  const movies = await Movie.find({
    genre: { $in: [genre] },
  })
    .sort("-rating")
    .limit(limit);

  res.status(200).json({
    success: true,
    count: movies.length,
    genre,
    data: movies,
  });
});

// ─── @route   POST /api/movies ────────────────────────────────────────────────
// ─── @access  Admin ───────────────────────────────────────────────────────────
const createMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.create(req.body);

  res.status(201).json({
    success: true,
    message: "Movie created successfully",
    data: movie,
  });
});

// ─── @route   PUT /api/movies/:id ────────────────────────────────────────────
// ─── @access  Admin ───────────────────────────────────────────────────────────
const updateMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!movie) {
    res.status(404);
    throw new Error("Movie not found");
  }

  res.status(200).json({
    success: true,
    message: "Movie updated successfully",
    data: movie,
  });
});

// ─── @route   DELETE /api/movies/:id ─────────────────────────────────────────
// ─── @access  Admin ───────────────────────────────────────────────────────────
const deleteMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);

  if (!movie) {
    res.status(404);
    throw new Error("Movie not found");
  }

  res.status(200).json({
    success: true,
    message: "Movie deleted successfully",
  });
});

module.exports = {
  getAllMovies,
  getMovie,
  getTrending,
  getRecommended,
  searchMovies,
  filterByGenre,
  createMovie,
  updateMovie,
  deleteMovie,
};
