const mongoose = require('mongoose');
const Product = require('../models/Product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {

  const prouctsBySubcategoryId = await Product.find({subcategory: ctx.request.body.id});
  ctx.body = {'products': prouctsBySubcategoryId};
  return next();
};

module.exports.productList = async function productList(ctx) {
  const products = ctx.body.products;
  const resultProducts = [];

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    resultProducts.push({
      id         : ctx.request.body.id,
      title      : product.title,
      images     : product.images,
      category   : product.category,
      subcategory: product.subcategory,
      price      : product.price,
      description: product.description,
    })
  }
  ctx.body = {'products': resultProducts};
};

module.exports.productById = async function productById(ctx) {
  if (!mongoose.Types.ObjectId.isValid(ctx.params.id)) ctx.throw(400, 'id инвалид');

  const product = await Product.findById(ctx.params.id);

  if (!product) ctx.throw(404, `Товар с id ${ctx.params.id} отсутсвует`);

  const resultProduct = [];

  resultProduct.push({
    id         : ctx.params.id,
    title      : product.title,
    images     : product.images,
    category   : product.category,
    subcategory: product.subcategory,
    price      : product.price,
    description: product.description,
  })

  ctx.body = {"product": resultProduct};
};
