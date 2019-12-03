const mongoose = require('mongoose');
const Product = require('../models/Product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx) {
  const products = await Product.find({subcategory: ctx.request.body.id});
  ctx.body = {products};
};

module.exports.productList = async function productList(ctx, next) {
  ctx.body = {'products': []};
};

module.exports.productById = async function productById(ctx, next) {
  if (!mongoose.Types.ObjectId.isValid(ctx.params.id)) ctx.throw(400, 'id инвалид');

  const product = await Product.findById(ctx.params.id);
  ctx.body = {product};

  if (!product) ctx.throw(404, `Товар с id ${ctx.params.id} отсутсвует`);
};
