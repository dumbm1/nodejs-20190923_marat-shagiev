const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const cats = await Category.find();
  ctx.body = cats;
  // ctx.body = {categories: []};
};
