const asyncHandler = require("express-async-handler");
const TVShow = require("../models/TVShow");
const APIFeatures = require("../utils/apiFeatures");

// ─── @route   GET /api/tvshows ────────────────────────────────────────────────
// ─── @access  Public ──────────────────────────────────────────────────────────
const getAllTVShows = asyncHandler(async (req, res) => {
  const features = new APIFeatures(TVShow.find(), req.query)
    .search("title")
    .filter()
    .sort()
    .paginate();

  const tvshows = await features.query;
  const total = await TVShow.countDocuments();

  res.status(200).json({
    success: true,
    count: tvshows.length,
    total,
    data: tvshows,
  });
});

// ─── @route   GET /api/tvshows/:id ───────────────────────────────────────────
// ─── @access  Public ──────────────────────────────────────────────────────────
const getTVShow = asyncHandler(async (req, res) => {
  const tvshow = await TVShow.findById(req.params.id);

  if (!tvshow) {
    res.status(404);
    throw new Error("TV Show not found");
  }

  tvshow.views += 1;
  await tvshow.save();

  res.status(200).json({
    success: true,
    data: tvshow,
  });
});

// ─── @route   GET /api/tvshows/trending ──────────────────────────────────────
// ─── @access  Public ──────────────────────────────────────────────────────────
const getTrendingTVShows = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const tvshows = await TVShow.find({ isTrending: true })
    .sort("-views")
    .limit(limit);

  res.status(200).json({
    success: true,
    count: tvshows.length,
    data: tvshows,
  });
});

// ─── @route   GET /api/tvshows/search?keyword=xyz ────────────────────────────
// ─── @access  Public ──────────────────────────────────────────────────────────
const searchTVShows = asyncHandler(async (req, res) => {
  const { keyword } = req.query;

  if (!keyword) {
    res.status(400);
    throw new Error("Please provide a search keyword");
  }

  const tvshows = await TVShow.find({
    $or: [
      { title: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
      { cast: { $regex: keyword, $options: "i" } },
    ],
  }).limit(20);

  res.status(200).json({
    success: true,
    count: tvshows.length,
    data: tvshows,
  });
});

// ─── @route   GET /api/tvshows/genre/:genre ──────────────────────────────────
// ─── @access  Public ──────────────────────────────────────────────────────────
const filterTVByGenre = asyncHandler(async (req, res) => {
  const { genre } = req.params;
  const limit = parseInt(req.query.limit) || 12;

  const tvshows = await TVShow.find({
    genre: { $in: [genre] },
  })
    .sort("-rating")
    .limit(limit);

  res.status(200).json({
    success: true,
    count: tvshows.length,
    genre,
    data: tvshows,
  });
});

// ─── @route   POST /api/tvshows ───────────────────────────────────────────────
// ─── @access  Admin ───────────────────────────────────────────────────────────
const createTVShow = asyncHandler(async (req, res) => {
  const tvshow = await TVShow.create(req.body);

  res.status(201).json({
    success: true,
    message: "TV Show created successfully",
    data: tvshow,
  });
});

// ─── @route   PUT /api/tvshows/:id ───────────────────────────────────────────
// ─── @access  Admin ───────────────────────────────────────────────────────────
const updateTVShow = asyncHandler(async (req, res) => {
  const tvshow = await TVShow.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tvshow) {
    res.status(404);
    throw new Error("TV Show not found");
  }

  res.status(200).json({
    success: true,
    message: "TV Show updated successfully",
    data: tvshow,
  });
});

// ─── @route   DELETE /api/tvshows/:id ────────────────────────────────────────
// ─── @access  Admin ───────────────────────────────────────────────────────────
const deleteTVShow = asyncHandler(async (req, res) => {
  const tvshow = await TVShow.findByIdAndDelete(req.params.id);

  if (!tvshow) {
    res.status(404);
    throw new Error("TV Show not found");
  }

  res.status(200).json({
    success: true,
    message: "TV Show deleted successfully",
  });
});

module.exports = {
  getAllTVShows,
  getTVShow,
  getTrendingTVShows,
  searchTVShows,
  filterTVByGenre,
  createTVShow,
  updateTVShow,
  deleteTVShow,
};
