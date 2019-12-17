const mongoose = require('mongoose');
const Product = require('../models/Product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {

  // const products = await Product.find({subcategory: ctx.request.body.subcategory});
  const products = await Product.find({subcategory: ctx.query.subcategory});
  ctx.body = {products};
  return next();
};

module.exports.productList = async function productList(ctx, next) {

  const productsBySubcatId = ctx.body.products;

  const productList = productsBySubcatId.map(item => {
    return {
      id         : item._id,
      title      : item.title,
      images     : item.images,
      category   : item.category,
      subcategory: item.subcategory,
      price      : item.price,
      description: item.description,
    }
  });
  ctx.body = {'products': productList};
};

module.exports.productById = async function productById(ctx) {
  if (!mongoose.Types.ObjectId.isValid(ctx.params.id)) ctx.throw(400, 'id инвалид');

  const product = await Product.findById(ctx.params.id);

  if (!product) {
    ctx.body = {"product": []};
    ctx.throw(404, `Товар с id ${ctx.params.id} отсутсвует`);
  }

  const resultProduct = {
    id         : ctx.params.id,
    title      : product.title,
    images     : product.images,
    category   : product.category,
    subcategory: product.subcategory,
    price      : product.price,
    description: product.description,
  };

  ctx.body = {"product": resultProduct};
};
