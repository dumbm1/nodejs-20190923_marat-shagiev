const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find();
  const categoryList = [];

  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    categoryList.push({
      id           : category._id,
      title        : category.title,
      subcategories: (category.subcategories).map(item => { return {'id': item._id, 'title': item.title}}
      ),
    })
  }
  ctx.body = {'categories': categoryList};
};