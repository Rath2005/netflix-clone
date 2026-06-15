const mongoose = require("mongoose");

const tvShowSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "TV Show title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
      index: true,
    },
    description: {
      type: String,
      required: [true, "TV Show description is required"],
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
        "Reality",
        "Talk Show",
        "Family",
      ],
      index: true,
    },
    year: {
      type: Number,
      required: [true, "Start year is required"],
    },
    rating: {
      type: Number,
      min: [0, "Rating cannot be negative"],
      max: [10, "Rating cannot exceed 10"],
      default: 0,
    },
    seasons: {
      type: Number,
      default: 1,
      min: [1, "Must have at least 1 season"],
    },
    episodes: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ["Ongoing", "Completed", "Cancelled"],
      default: "Ongoing",
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
    language: {
      type: String,
      default: "English",
    },
    isTrending: {
      type: Boolean,
      default: false,
      index: true,
    },
    isRecommended: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    creator: {
      type: String,
      default: "",
    },
    cast: {
      type: [String],
      default: [],
    },
    maturityRating: {
      type: String,
      enum: ["TV-Y", "TV-G", "TV-PG", "TV-14", "TV-MA"],
      default: "TV-14",
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

tvShowSchema.index({ title: "text", description: "text", cast: "text" }, { language_override: "none" });

const TVShow = mongoose.model("TVShow", tvShowSchema);
module.exports = TVShow;
