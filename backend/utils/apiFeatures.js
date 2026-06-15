/**
 * APIFeatures — Chainable query helper for Mongoose
 * Usage:
 *   const features = new APIFeatures(Model.find(), req.query)
 *     .search("title")
 *     .filter()
 *     .sort()
 *     .paginate();
 *   const results = await features.query;
 */
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  /**
   * Text search on a given field (case-insensitive regex)
   * @param {string} field - The field to search on
   */
  search(field = "title") {
    const keyword = this.queryString.keyword
      ? { [field]: { $regex: this.queryString.keyword, $options: "i" } }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }

  /**
   * Filter by query params — strips out pagination/sorting keys
   */
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["keyword", "page", "limit", "sort", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Support MongoDB comparison operators: gt, gte, lt, lte
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  /**
   * Sort results — default: newest first
   */
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  /**
   * Paginate results
   */
  paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 12;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
