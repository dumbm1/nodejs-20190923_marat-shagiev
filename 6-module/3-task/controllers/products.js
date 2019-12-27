const Product = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {

  const products = await Product
    .find({
      $text: {
        $search  : ctx.query.query,
        $language: 'ru'
      }
    });

  const prodList = products.map(item => {
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

  ctx.body = {'products': prodList};
};
