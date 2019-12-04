const mongoose = require('mongoose');
const Product = require('../models/Product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx) {
  const products = await Product.find({subcategory: ctx.request.body.id});

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

module.exports.productList = async function productList(ctx) {
  ctx.body = {'products': []};
};

module.exports.productById = async function productById(ctx, next) {
  if (!mongoose.Types.ObjectId.isValid(ctx.params.id)) ctx.throw(400, 'id инвалид');

  const product = await Product.findById(ctx.params.id);
  ctx.body = {
    "product": {
      id         : ctx.params.id,
      title      : product.title,
      images     : product.images,
      category   : product.category,
      subcategory: product.subcategory,
      price      : product.price,
      description: product.description,
    }
  };

  if (!product) ctx.throw(404, `Товар с id ${ctx.params.id} отсутсвует`);
};
