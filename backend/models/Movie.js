const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Movie title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
      index: true,
    },
    description: {
      type: String,
      required: [true, "Movie description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    genre: {
      type: [String],
      required: [true, "At least one genre is required"],
      enum: [
        "Action",
        "Comedy",
        "Drama",
        "Horror",
        "Thriller",
        "Romance",
        "Sci-Fi",
        "Animation",
        "Documentary",
        "Fantasy",
        "Crime",
        "Adventure",
        "Mystery",
        "Biography",
        "History",
        "Sport",
        "Musical",
        "War",
        "Western",
        "Family",
      ],
      index: true,
    },
    year: {
      type: Number,
      required: [true, "Release year is required"],
      min: [1900, "Year must be after 1900"],
      max: [new Date().getFullYear() + 2, "Year is too far in the future"],
    },
    rating: {
      type: Number,
      min: [0, "Rating cannot be negative"],
      max: [10, "Rating cannot exceed 10"],
      default: 0,
    },
    duration: {
      type: String, // e.g. "2h 30m"
      default: "N/A",
    },
    language: {
      type: String,
      default: "English",
    },
    thumbnail: {
      type: String,
      required: [true, "Thumbnail URL is required"],
    },
    backdropImage: {
      type: String,
      default: "",
    },
    videoUrl: {
      type: String,
      default: "",
    },
    isTrending: {
      type: Boolean,
      default: false,
      index: true,
    },
    isRecommended: {
      type: Boolean,
      default: false,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    cast: {
      type: [String],
      default: [],
    },
    director: {
      type: String,
      default: "",
    },
    maturityRating: {
      type: String,
      enum: ["G", "PG", "PG-13", "R", "NC-17", "NR"],
      default: "NR",
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Text index for full-text search
movieSchema.index({ title: "text", description: "text", cast: "text" }, { language_override: "none" });

const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie;
