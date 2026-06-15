/**
 * Netflix Clone — Database Seeder
 * Seeds Movies, TV Shows, and an Admin user into MongoDB
 *
 * Usage:
 *   node utils/seeder.js          → Seeds all data
 *   node utils/seeder.js --delete → Deletes all seeded data
 */

const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Movie = require("../models/Movie");
const TVShow = require("../models/TVShow");
const User = require("../models/User");

dotenv.config();
connectDB();

// ─── Seed Data ────────────────────────────────────────────────────────────────
const movies = [
  {
    title: "Avengers: Endgame",
    description:
      "After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos' actions and restore balance to the universe.",
    genre: ["Action", "Sci-Fi", "Adventure"],
    year: 2019,
    rating: 8.4,
    duration: "3h 1m",
    language: "English",
    thumbnail: "../images/avengers.jpg",
    backdropImage: "https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
    videoUrl: "https://www.youtube.com/embed/TcMBFSGVi1c",
    isTrending: true,
    isRecommended: true,
    isFeatured: true,
    cast: ["Robert Downey Jr.", "Chris Evans", "Scarlett Johansson", "Chris Hemsworth"],
    director: "Anthony Russo, Joe Russo",
    maturityRating: "PG-13",
    views: 5200,
  },
  {
    title: "The Batman",
    description:
      "Batman ventures into Gotham City's underworld when a sadistic killer leaves behind a trail of cryptic clues targeting Gotham's elite.",
    genre: ["Action", "Crime", "Drama"],
    year: 2022,
    rating: 7.8,
    duration: "2h 56m",
    language: "English",
    thumbnail: "../images/batman.jpg",
    videoUrl: "https://www.youtube.com/embed/mqqft2x_Aa4",
    isTrending: true,
    isRecommended: false,
    cast: ["Robert Pattinson", "Zoë Kravitz", "Paul Dano", "Colin Farrell"],
    director: "Matt Reeves",
    maturityRating: "PG-13",
    views: 3800,
  },
  {
    title: "John Wick",
    description:
      "An ex-hitman comes out of retirement to track down the gangsters who killed his dog, a final gift from his deceased wife.",
    genre: ["Action", "Crime", "Thriller"],
    year: 2014,
    rating: 7.4,
    duration: "1h 41m",
    language: "English",
    thumbnail: "../images/johnwick.jpg",
    videoUrl: "https://www.youtube.com/embed/qEVUtr36LX0",
    isTrending: true,
    isRecommended: true,
    cast: ["Keanu Reeves", "Michael Nyqvist", "Alfie Allen"],
    director: "Chad Stahelski",
    maturityRating: "R",
    views: 4100,
  },
  {
    title: "Deadpool",
    description:
      "A wisecracking mercenary gets experimented on and becomes immortal but ugly. He then goes on a quest to find the man who ruined his looks.",
    genre: ["Action", "Comedy"],
    year: 2016,
    rating: 8.0,
    duration: "1h 48m",
    language: "English",
    thumbnail: "../images/deadpool.jpg",
    videoUrl: "https://www.youtube.com/embed/ONHBaC-pfsk",
    isTrending: false,
    isRecommended: true,
    cast: ["Ryan Reynolds", "Morena Baccarin", "T.J. Miller"],
    director: "Tim Miller",
    maturityRating: "R",
    views: 4500,
  },
  {
    title: "Extraction",
    description:
      "A hardened mercenary's mission becomes a soul-reckoning struggle when he's sent to rescue a drug lord's kidnapped son.",
    genre: ["Action", "Thriller"],
    year: 2020,
    rating: 6.7,
    duration: "1h 56m",
    language: "English",
    thumbnail: "../images/extraction.jpg",
    videoUrl: "https://www.youtube.com/embed/L6P3nIad3LY",
    isTrending: false,
    isRecommended: false,
    cast: ["Chris Hemsworth", "Rudhraksh Jaiswal", "Randeep Hooda"],
    director: "Sam Hargrave",
    maturityRating: "R",
    views: 2900,
  },
  {
    title: "Free Guy",
    description:
      "A bank teller who discovers he is actually a background player in an open-world video game decides to become the hero of his own story.",
    genre: ["Comedy", "Action", "Sci-Fi"],
    year: 2021,
    rating: 7.1,
    duration: "1h 55m",
    language: "English",
    thumbnail: "../images/freeguy.jpg",
    videoUrl: "https://www.youtube.com/embed/X2m-08cM0sg",
    isTrending: false,
    isRecommended: true,
    cast: ["Ryan Reynolds", "Jodie Comer", "Taika Waititi"],
    director: "Shawn Levy",
    maturityRating: "PG-13",
    views: 3200,
  },
  {
    title: "Home Alone",
    description:
      "An eight-year-old troublemaker, accidentally left home alone, has to defend his home against a pair of burglars.",
    genre: ["Comedy", "Family"],
    year: 1990,
    rating: 7.7,
    duration: "1h 43m",
    language: "English",
    thumbnail: "../images/homealone.jpg",
    videoUrl: "https://www.youtube.com/embed/jEDaVHmw7ms",
    isTrending: false,
    isRecommended: true,
    cast: ["Macaulay Culkin", "Joe Pesci", "Daniel Stern"],
    director: "Chris Columbus",
    maturityRating: "PG",
    views: 3600,
  },
  {
    title: "Jumanji: Welcome to the Jungle",
    description:
      "Four teenagers are sucked into a magical video game, and the only way they can escape is to work together to finish the game.",
    genre: ["Comedy", "Adventure", "Action"],
    year: 2017,
    rating: 6.9,
    duration: "1h 59m",
    language: "English",
    thumbnail: "../images/jumanji.jpg",
    videoUrl: "https://www.youtube.com/embed/2QKg5SZ_35I",
    isTrending: false,
    isRecommended: false,
    cast: ["Dwayne Johnson", "Kevin Hart", "Jack Black", "Karen Gillan"],
    director: "Jake Kasdan",
    maturityRating: "PG-13",
    views: 2700,
  },
  {
    title: "The Mask",
    description:
      "Bank clerk Stanley Ipkiss is transformed into a manic superhero when he wears a mysterious mask.",
    genre: ["Comedy", "Fantasy", "Romance"],
    year: 1994,
    rating: 6.9,
    duration: "1h 41m",
    language: "English",
    thumbnail: "../images/mask.jpg",
    videoUrl: "https://www.youtube.com/embed/hOqVRwGcsFY",
    isTrending: false,
    isRecommended: false,
    cast: ["Jim Carrey", "Cameron Diaz"],
    director: "Chuck Russell",
    maturityRating: "PG-13",
    views: 2100,
  },
  {
    title: "Pushpa: The Rise",
    description:
      "Pushpa Raj, a labourer, rises in the world of red sandalwood smuggling and faces the police and his rivals.",
    genre: ["Action", "Crime", "Drama"],
    year: 2021,
    rating: 7.6,
    duration: "2h 59m",
    language: "Telugu",
    thumbnail: "../images/pushpa.jpg",
    videoUrl: "https://www.youtube.com/embed/pKctjlxbFDQ",
    isTrending: true,
    isRecommended: true,
    cast: ["Allu Arjun", "Rashmika Mandanna", "Fahadh Faasil"],
    director: "Sukumar",
    maturityRating: "R",
    views: 4700,
  },
];

const tvshows = [
  {
    title: "Stranger Things",
    description:
      "When a young boy disappears, his mother, a police chief, and his friends must confront terrifying supernatural forces in order to get him back.",
    genre: ["Drama", "Horror", "Sci-Fi"],
    year: 2016,
    rating: 8.7,
    seasons: 4,
    episodes: 42,
    status: "Completed",
    thumbnail: "../images/stranger.jpg",
    videoUrl: "https://www.youtube.com/embed/b9EkMc79ZSU",
    isTrending: true,
    isRecommended: true,
    isFeatured: true,
    creator: "The Duffer Brothers",
    cast: ["Millie Bobby Brown", "Finn Wolfhard", "Winona Ryder", "David Harbour"],
    maturityRating: "TV-14",
    views: 8900,
  },
  {
    title: "Money Heist",
    description:
      "An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history - stealing 2.4 billion euros from the Royal Mint of Spain.",
    genre: ["Crime", "Drama", "Thriller"],
    year: 2017,
    rating: 8.2,
    seasons: 5,
    episodes: 41,
    status: "Completed",
    thumbnail: "../images/moneyheist.jpg",
    videoUrl: "https://www.youtube.com/embed/_InqQJRqGW4",
    isTrending: true,
    isRecommended: true,
    creator: "Álex Pina",
    cast: ["Álvaro Morte", "Úrsula Corberó", "Itziar Ituño"],
    maturityRating: "TV-MA",
    views: 7600,
  },
  {
    title: "Squid Game",
    description:
      "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits with deadly high stakes.",
    genre: ["Drama", "Thriller", "Action"],
    year: 2021,
    rating: 8.0,
    seasons: 2,
    episodes: 17,
    status: "Ongoing",
    thumbnail: "../images/squidgame.jpg",
    videoUrl: "https://www.youtube.com/embed/oqxAJKy0R4A",
    isTrending: true,
    isRecommended: true,
    creator: "Hwang Dong-hyuk",
    cast: ["Lee Jung-jae", "Park Hae-soo", "Wi Ha-jun"],
    maturityRating: "TV-MA",
    views: 9200,
  },
];

// ─── Import Data ──────────────────────────────────────────────────────────────
const importData = async () => {
  try {
    // Clear existing data
    await Movie.deleteMany();
    await TVShow.deleteMany();

    // Insert seed data
    await Movie.insertMany(movies);
    await TVShow.insertMany(tvshows);

    // Create default admin account
    const adminExists = await User.findOne({ email: "admin@netflix.com" });
    if (!adminExists) {
      await User.create({
        name: "Admin",
        email: "admin@netflix.com",
        password: "admin123",
        role: "admin",
      });
      console.log("👤 Admin created — email: admin@netflix.com | password: admin123");
    }

    console.log(`✅ Seeded ${movies.length} movies`);
    console.log(`✅ Seeded ${tvshows.length} TV shows`);
    console.log("🌱 Data imported successfully!");
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding error: ${error.message}`);
    process.exit(1);
  }
};

// ─── Delete Data ──────────────────────────────────────────────────────────────
const deleteData = async () => {
  try {
    await Movie.deleteMany();
    await TVShow.deleteMany();
    await User.deleteMany({ role: { $ne: "admin" } }); // Keep admins
    console.log("🗑️  All data deleted successfully!");
    process.exit(0);
  } catch (error) {
    console.error(`❌ Delete error: ${error.message}`);
    process.exit(1);
  }
};

// ─── Run ──────────────────────────────────────────────────────────────────────
if (process.argv[2] === "--delete") {
  deleteData();
} else {
  importData();
}
