const mongoose = require('mongoose');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  ctx.body = {products: []};
};

module.exports.productList = async function productList(ctx, next) {
  ctx.body = {products: []};
};

module.exports.productById = async function productById(ctx, next) {
  if (!mongoose.Types.ObjectId.isValid(ctx.params.id)) ctx.throw(400, 'id инвалид');

  ctx.status = 404;
  ctx.body = {product: {}};

};

