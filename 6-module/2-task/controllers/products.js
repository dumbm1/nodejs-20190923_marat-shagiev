const mongoose = require('mongoose');
const Product = require('../models/Product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  if (!mongoose.Types.ObjectId.isValid(ctx.request.body.id)) {
    ctx.body = {'products': []};
    ctx.throw(400, 'id инвалид-c');
    return next();
  }

  const prodsBySubcatId = await Product.find({subcategory: ctx.request.body.id});

  ctx.body = prodsBySubcatId;
  return next();
};

module.exports.productList = function productList(ctx, next) {

  const prodsBySubcatId = ctx.body;

  if (!prodsBySubcatId[0]) {
    ctx.throw(404, `Подкатегория с id ${ctx.request.body.id} отсутсвует`);
    ctx.body = {'products': []};
    return next();
  }

  const resultProducts = [];

  for (let i = 0; i < prodsBySubcatId.length; i++) {
    const product = prodsBySubcatId[i];

    resultProducts.push({
      id         : product._id,
      title      : product.title,
      images     : product.images,
      category   : product.category,
      subcategory: ctx.request.body.id,
      price      : product.price,
      description: product.description,
    });
  }
  ctx.body = {'products': resultProducts};
};

module.exports.productById = async function productById(ctx) {
  if (!mongoose.Types.ObjectId.isValid(ctx.params.id)) ctx.throw(400, 'id инвалид');

  const product = await Product.findById(ctx.params.id);

  if (!product) ctx.throw(404, `Товар с id ${ctx.params.id} отсутсвует`);

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
