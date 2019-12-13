const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const title = ctx.request.body.title;
  let subcatId;
  const categories = await Category.find();

  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const subcat = (category.subcategories).filter(item => item.title === title);
    console.log(subcat);
    if (!subcat.length) continue;
    subcatId = subcat[0]._id;
    break;
  }

  ctx.body = subcatId;
  return next();
};

module.exports.productList = async function productList(ctx, next) {
  const subcatId = ctx.body;
  const productsBySubcatId = await Product.find({subcategory: subcatId});

  const productList = productsBySubcatId.map(item => {
    return {
      id         : item._id,
      title      : item.title,
      images     : item.images,
      category   : item.categories,
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
