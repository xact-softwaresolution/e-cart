class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // Basic filtering
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Advanced filtering for gt, gte, lt, lte
    // Prisma filter structure is different from Mongoose, so we need to adapt
    // For now, we'll support simple equality and basic range if passed correctly
    // This class might need adaptation for Prisma syntax which is strict
    
    // In Prisma, we usually build the 'where' object
    this.where = queryObj; // Simplified for now
    
    // Handle price range if passed as price[gte]=100
    // Express parses this as { price: { gte: '100' } }
    // We need to convert strings to numbers for Prisma decimal/int fields
    
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      // Prisma orderBy format: { field: 'asc' }
      // We need to parse "price" to { price: 'asc' } and "-price" to { price: 'desc' }
      const sortFields = this.queryString.sort.split(',');
      this.orderBy = sortFields.map(field => {
        if (field.startsWith('-')) {
          return { [field.substring(1)]: 'desc' };
        }
        return { [field]: 'asc' };
      });
      // Prisma expects array or object
    } else {
      this.orderBy = { createdAt: 'desc' };
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',');
      this.select = fields.reduce((acc, field) => {
        acc[field] = true;
        return acc;
      }, {});
    } else {
      this.select = undefined; // Select all
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.skip = skip;
    this.take = limit;

    return this;
  }
}

module.exports = APIFeatures;
