/**
 * seedData.js — Seed the Netflix Clone database with popular movies & TV shows
 *
 * Usage:  node seedData.js
 *         node seedData.js --clear   (wipe existing data first)
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const Movie = require("./models/Movie");
const TVShow = require("./models/TVShow");

// ─── Movie Data ──────────────────────────────────────────────────────────────
const movies = [
  // ── Avengers: Endgame ──
  {
    title: "Avengers: Endgame",
    description:
      "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to reverse Thanos' actions and restore balance to the universe.",
    genre: ["Action", "Adventure", "Sci-Fi"],
    year: 2019,
    rating: 8.4,
    duration: "3h 1m",
    language: "English",
    thumbnail:
      "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9SlMiEKjiCI.jpg",
    backdropImage:
      "https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
    videoUrl: "",
    isTrending: true,
    isRecommended: true,
    isFeatured: true,
    cast: [
      "Robert Downey Jr.",
      "Chris Evans",
      "Mark Ruffalo",
      "Scarlett Johansson",
      "Chris Hemsworth",
    ],
    director: "Anthony Russo, Joe Russo",
    maturityRating: "PG-13",
    views: 58200,
  },

  // ── The Dark Knight ──
  {
    title: "The Dark Knight",
    description:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    genre: ["Action", "Crime", "Drama"],
    year: 2008,
    rating: 9.0,
    duration: "2h 32m",
    language: "English",
    thumbnail:
      "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdropImage:
      "https://image.tmdb.org/t/p/original/cfT29Im5VDvjE0RpyKOSdCKZal7.jpg",
    videoUrl: "",
    isTrending: true,
    isRecommended: true,
    isFeatured: false,
    cast: [
      "Christian Bale",
      "Heath Ledger",
      "Aaron Eckhart",
      "Michael Caine",
      "Gary Oldman",
    ],
    director: "Christopher Nolan",
    maturityRating: "PG-13",
    views: 72300,
  },

  // ── Inception ──
  {
    title: "Inception",
    description:
      "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.",
    genre: ["Action", "Sci-Fi", "Thriller"],
    year: 2010,
    rating: 8.8,
    duration: "2h 28m",
    language: "English",
    thumbnail:
      "https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg",
    backdropImage:
      "https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
    videoUrl: "",
    isTrending: true,
    isRecommended: true,
    isFeatured: false,
    cast: [
      "Leonardo DiCaprio",
      "Joseph Gordon-Levitt",
      "Elliot Page",
      "Tom Hardy",
      "Ken Watanabe",
    ],
    director: "Christopher Nolan",
    maturityRating: "PG-13",
    views: 64800,
  },

  // ── Interstellar ──
  {
    title: "Interstellar",
    description:
      "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot Joseph Cooper is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.",
    genre: ["Adventure", "Drama", "Sci-Fi"],
    year: 2014,
    rating: 8.7,
    duration: "2h 49m",
    language: "English",
    thumbnail:
      "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdropImage:
      "https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK1DVfjXo.jpg",
    videoUrl: "",
    isTrending: false,
    isRecommended: true,
    isFeatured: false,
    cast: [
      "Matthew McConaughey",
      "Anne Hathaway",
      "Jessica Chastain",
      "Michael Caine",
      "Matt Damon",
    ],
    director: "Christopher Nolan",
    maturityRating: "PG-13",
    views: 55400,
  },

  // ── Spider-Man: No Way Home ──
  {
    title: "Spider-Man: No Way Home",
    description:
      "With Spider-Man's identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear, forcing Peter to discover what it truly means to be Spider-Man.",
    genre: ["Action", "Adventure", "Fantasy"],
    year: 2021,
    rating: 8.2,
    duration: "2h 28m",
    language: "English",
    thumbnail:
      "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
    backdropImage:
      "https://image.tmdb.org/t/p/original/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg",
    videoUrl: "",
    isTrending: true,
    isRecommended: true,
    isFeatured: false,
    cast: [
      "Tom Holland",
      "Zendaya",
      "Benedict Cumberbatch",
      "Tobey Maguire",
      "Andrew Garfield",
    ],
    director: "Jon Watts",
    maturityRating: "PG-13",
    views: 61700,
  },

  // ── Oppenheimer ──
  {
    title: "Oppenheimer",
    description:
      "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.",
    genre: ["Biography", "Drama", "History"],
    year: 2023,
    rating: 8.5,
    duration: "3h 0m",
    language: "English",
    thumbnail:
      "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    backdropImage:
      "https://image.tmdb.org/t/p/original/nb3xI8XI3w4pMVZ38VijbsyBqP4.jpg",
    videoUrl: "",
    isTrending: true,
    isRecommended: true,
    isFeatured: false,
    cast: [
      "Cillian Murphy",
      "Emily Blunt",
      "Matt Damon",
      "Robert Downey Jr.",
      "Florence Pugh",
    ],
    director: "Christopher Nolan",
    maturityRating: "R",
    views: 48900,
  },

  // ── The Hangover ──
  {
    title: "The Hangover",
    description:
      "Three buddies wake up from a bachelor party in Las Vegas, with no memory of the previous night and the bachelor missing. They make their way around the city in order to find their friend before his wedding.",
    genre: ["Comedy"],
    year: 2009,
    rating: 7.7,
    duration: "1h 40m",
    language: "English",
    thumbnail:
      "https://image.tmdb.org/t/p/w500/uluhlXubGu1VxkAB9qUP6vFCLbS.jpg",
    backdropImage:
      "https://image.tmdb.org/t/p/original/xxuMncwVMSomkCvTPcTh45LqwZ5.jpg",
    videoUrl: "",
    isTrending: false,
    isRecommended: true,
    isFeatured: false,
    cast: [
      "Bradley Cooper",
      "Ed Helms",
      "Zach Galifianakis",
      "Justin Bartha",
      "Heather Graham",
    ],
    director: "Todd Phillips",
    maturityRating: "R",
    views: 39500,
  },

  // ── John Wick: Chapter 4 ──
  {
    title: "John Wick: Chapter 4",
    description:
      "John Wick uncovers a path to defeating the High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances across the globe and forces that turn old friends into foes.",
    genre: ["Action", "Crime", "Thriller"],
    year: 2023,
    rating: 7.7,
    duration: "2h 49m",
    language: "English",
    thumbnail:
      "https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",
    backdropImage:
      "https://image.tmdb.org/t/p/original/7I6VUdPj6tQECNHdviJkUHD2u89.jpg",
    videoUrl: "",
    isTrending: true,
    isRecommended: false,
    isFeatured: false,
    cast: [
      "Keanu Reeves",
      "Donnie Yen",
      "Bill Skarsgård",
      "Laurence Fishburne",
      "Ian McShane",
    ],
    director: "Chad Stahelski",
    maturityRating: "R",
    views: 42800,
  },

  // ── Dune: Part Two ──
  {
    title: "Dune: Part Two",
    description:
      "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe.",
    genre: ["Action", "Adventure", "Sci-Fi"],
    year: 2024,
    rating: 8.5,
    duration: "2h 46m",
    language: "English",
    thumbnail:
      "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
    backdropImage:
      "https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
    videoUrl: "",
    isTrending: true,
    isRecommended: true,
    isFeatured: false,
    cast: [
      "Timothée Chalamet",
      "Zendaya",
      "Austin Butler",
      "Florence Pugh",
      "Josh Brolin",
    ],
    director: "Denis Villeneuve",
    maturityRating: "PG-13",
    views: 53100,
  },

  // ── Superbad ──
  {
    title: "Superbad",
    description:
      "Two co-dependent high school seniors are forced to deal with separation anxiety after their plan to stage a booze-soaked party goes awry, threatening to ruin them socially.",
    genre: ["Comedy"],
    year: 2007,
    rating: 7.6,
    duration: "1h 53m",
    language: "English",
    thumbnail:
      "https://image.tmdb.org/t/p/w500/ek8e8txUyUwd2BNqj6lFEerJfbq.jpg",
    backdropImage:
      "https://image.tmdb.org/t/p/original/yYkNaFXfUHEEo7EVOvUfaWIi3b7.jpg",
    videoUrl: "",
    isTrending: false,
    isRecommended: false,
    isFeatured: false,
    cast: [
      "Jonah Hill",
      "Michael Cera",
      "Christopher Mintz-Plasse",
      "Seth Rogen",
      "Bill Hader",
    ],
    director: "Greg Mottola",
    maturityRating: "R",
    views: 28700,
  },

  // ── The Conjuring ──
  {
    title: "The Conjuring",
    description:
      "Paranormal investigators Ed and Lorraine Warren work to help a family terrorized by a dark presence in their farmhouse. Their case files reveal the most sinister entity they have ever encountered.",
    genre: ["Horror", "Mystery", "Thriller"],
    year: 2013,
    rating: 7.5,
    duration: "1h 52m",
    language: "English",
    thumbnail:
      "https://image.tmdb.org/t/p/w500/wVYREutTvI2tmxr6ujrHT704wGF.jpg",
    backdropImage:
      "https://image.tmdb.org/t/p/original/tRgyCrMiJVFpJKOOBiF2U7TYpjr.jpg",
    videoUrl: "",
    isTrending: false,
    isRecommended: true,
    isFeatured: false,
    cast: [
      "Vera Farmiga",
      "Patrick Wilson",
      "Lili Taylor",
      "Ron Livingston",
      "Shanley Caswell",
    ],
    director: "James Wan",
    maturityRating: "R",
    views: 34200,
  },

  // ── Titanic ──
  {
    title: "Titanic",
    description:
      "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic. Their forbidden romance blossoms as the great ship sails toward disaster.",
    genre: ["Drama", "Romance"],
    year: 1997,
    rating: 7.9,
    duration: "3h 14m",
    language: "English",
    thumbnail:
      "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kFB3kv1eIKT.jpg",
    backdropImage:
      "https://image.tmdb.org/t/p/original/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    videoUrl: "",
    isTrending: false,
    isRecommended: true,
    isFeatured: false,
    cast: [
      "Leonardo DiCaprio",
      "Kate Winslet",
      "Billy Zane",
      "Kathy Bates",
      "Frances Fisher",
    ],
    director: "James Cameron",
    maturityRating: "PG-13",
    views: 71000,
  },
];

// ─── TV Show Data ────────────────────────────────────────────────────────────
const tvShows = [
  // ── Squid Game ──
  {
    title: "Squid Game",
    description:
      "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits with deadly high stakes — a survival game that has a whopping 45.6 billion-won prize at stake.",
    genre: ["Action", "Drama", "Thriller"],
    year: 2021,
    rating: 8.0,
    seasons: 2,
    episodes: 16,
    status: "Ongoing",
    thumbnail:
      "https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg",
    backdropImage:
      "https://image.tmdb.org/t/p/original/oaGvjB0DvdhXhOAuADfHb261ZHa.jpg",
    language: "Korean",
    isTrending: true,
    isRecommended: true,
    isFeatured: true,
    creator: "Hwang Dong-hyuk",
    cast: [
      "Lee Jung-jae",
      "Park Hae-soo",
      "Wi Ha-joon",
      "Jung Ho-yeon",
      "O Yeong-su",
    ],
    maturityRating: "TV-MA",
    views: 82100,
  },

  // ── Stranger Things ──
  {
    title: "Stranger Things",
    description:
      "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back. Set in 1980s Indiana, the series blends horror, adventure and government conspiracies.",
    genre: ["Drama", "Fantasy", "Horror"],
    year: 2016,
    rating: 8.7,
    seasons: 4,
    episodes: 34,
    status: "Completed",
    thumbnail:
      "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    backdropImage:
      "https://image.tmdb.org/t/p/original/56v2KjBlYj3Uf3yFThI3uXNx8eM.jpg",
    language: "English",
    isTrending: true,
    isRecommended: true,
    isFeatured: false,
    creator: "The Duffer Brothers",
    cast: [
      "Millie Bobby Brown",
      "Finn Wolfhard",
      "Winona Ryder",
      "David Harbour",
      "Gaten Matarazzo",
    ],
    maturityRating: "TV-14",
    views: 91500,
  },

  // ── Breaking Bad ──
  {
    title: "Breaking Bad",
    description:
      "A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student in order to secure his family's future.",
    genre: ["Crime", "Drama", "Thriller"],
    year: 2008,
    rating: 9.5,
    seasons: 5,
    episodes: 62,
    status: "Completed",
    thumbnail:
      "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    backdropImage:
      "https://image.tmdb.org/t/p/original/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
    language: "English",
    isTrending: true,
    isRecommended: true,
    isFeatured: false,
    creator: "Vince Gilligan",
    cast: [
      "Bryan Cranston",
      "Aaron Paul",
      "Anna Gunn",
      "Dean Norris",
      "Betsy Brandt",
    ],
    maturityRating: "TV-MA",
    views: 105000,
  },

  // ── Wednesday ──
  {
    title: "Wednesday",
    description:
      "Follows Wednesday Addams' years as a student, when she attempts to master her emerging psychic ability, thwart a monstrous killing spree that has terrorized the local town, and solve the murder mystery that embroiled her parents.",
    genre: ["Comedy", "Crime", "Fantasy"],
    year: 2022,
    rating: 8.1,
    seasons: 1,
    episodes: 8,
    status: "Ongoing",
    thumbnail:
      "https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg",
    backdropImage:
      "https://image.tmdb.org/t/p/original/iHSwvRVsNBEzI0apVMKBkR2ceSH.jpg",
    language: "English",
    isTrending: true,
    isRecommended: true,
    isFeatured: false,
    creator: "Alfred Gough, Miles Millar",
    cast: [
      "Jenna Ortega",
      "Gwendoline Christie",
      "Riki Lindhome",
      "Jamie McShane",
      "Catherine Zeta-Jones",
    ],
    maturityRating: "TV-14",
    views: 74300,
  },
];

// ─── Seed Function ───────────────────────────────────────────────────────────
const seedDatabase = async () => {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB!\n");

    const clearFlag = process.argv.includes("--clear");

    if (clearFlag) {
      console.log("🗑️  Clearing existing movies and TV shows and dropping collections...");
      try {
        await Movie.collection.drop();
      } catch (e) {
        console.log("Movie collection did not exist or could not be dropped");
      }
      try {
        await TVShow.collection.drop();
      } catch (e) {
        console.log("TVShow collection did not exist or could not be dropped");
      }
      console.log("   ✅ Cleared and Dropped!\n");
    }

    // ── Insert Movies ──
    console.log(`🎬 Inserting ${movies.length} movies...`);
    for (const movie of movies) {
      const exists = await Movie.findOne({ title: movie.title });
      if (exists) {
        console.log(`   ⏭️  "${movie.title}" already exists — skipping`);
      } else {
        await Movie.create(movie);
        console.log(`   ✅ Added: "${movie.title}"`);
      }
    }

    // ── Insert TV Shows ──
    console.log(`\n📺 Inserting ${tvShows.length} TV shows...`);
    for (const show of tvShows) {
      const exists = await TVShow.findOne({ title: show.title });
      if (exists) {
        console.log(`   ⏭️  "${show.title}" already exists — skipping`);
      } else {
        await TVShow.create(show);
        console.log(`   ✅ Added: "${show.title}"`);
      }
    }

    // ── Summary ──
    const movieCount = await Movie.countDocuments();
    const showCount = await TVShow.countDocuments();
    console.log(`\n────────────────────────────────────────`);
    console.log(`📊 Database now has:`);
    console.log(`   🎬 ${movieCount} movies`);
    console.log(`   📺 ${showCount} TV shows`);
    console.log(`────────────────────────────────────────\n`);
    console.log("🎉 Seeding complete!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDatabase();
