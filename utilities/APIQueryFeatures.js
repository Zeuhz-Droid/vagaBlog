class APIQueryFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    this.docsLength;
  }

  // helps filter documents
  filter(...inputs) {
    const queryObj = { ...this.queryString };
    inputs.forEach((field) => delete queryObj[field]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(lte|lt|gte|gt)\b/, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  //  paginate the documents
  paginate() {
    const page = this.queryString.page * 1;
    const limit = this.queryString.limit * 1 || 20;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }

  // allowes specific search in the document
  search(...allowedFields) {
    const newObj = {};
    Object.keys(this.queryString).forEach((field) => {
      if (allowedFields.includes(field)) {
        if (field != 'author') {
          newObj[field] = {
            $regex: new RegExp('^' + this.queryString[field] + '.*', 'i'),
          };
        } else newObj[field] = this.queryString[field];
      }
    });
    this.query = this.query.find(newObj);

    return this;
  }

  // allows sorting of document via fields
  sort() {
    if (this.queryString.sort) {
      const ExpectedFields = [
        'read_count',
        'reading_time',
        'timestamp',
        '-read_count',
        '-reading_time',
        '-timestamp',
      ];
      const sortArr = this.queryString.sort.split(',');
      const sortBy = [];
      for (let i = 0; i < ExpectedFields.length; i++) {
        for (let j = 0; j < sortArr.length; j++) {
          if (ExpectedFields[i] == sortArr[j]) sortBy.push(sortArr[j]);
        }
      }
      this.query = this.query.sort(sortBy.join(' '));
    } else {
      this.query = this.query.sort('-read_count reading_time -timestamp');
    }

    return this;
  }

  // helps count the available document
  getDocumentAmount() {
    this.docsLength = this.query.countDocuments();
    return this;
  }
}

module.exports = APIQueryFeatures;
