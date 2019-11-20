const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const cats = await Category.find();
  const catsArr = cats.map(value => value.title);
  ctx.body = {categories: catsArr};
  // ctx.body = {categories: []};
};