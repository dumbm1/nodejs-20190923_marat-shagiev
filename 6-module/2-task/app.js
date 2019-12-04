const Koa = require('koa');
const Router = require('koa-router');
const {productsBySubcategory, productList, productById} = require('./controllers/products');
const {categoryList} = require('./controllers/categories');

const app = new Koa();

app.use(require('koa-bodyparser')());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.status) {
      ctx.status = err.status;
      ctx.body = {error: err.message};
    } else {
      console.error(err);
      ctx.status = 500;
      ctx.body = {error: 'Internal server error'};
    }
  }
});

const router = new Router({prefix: '/api'});

router.get('/categories', categoryList);
router.get('/products', productsBySubcategory, productList);
router.get('/products/:id', productById);

router.post('/products', async (ctx) => {
  const Product = require('./models/Product');
  const Category = require('./models/Category');

  await Category.deleteMany();
  await Product.deleteMany();

  const categories = await Category.create({
    title        : 'Ноутбуки',
    subcategories: [{
      title: 'Apple',
    }, {
      title: 'Other'
    }],
  }, {
    title        : 'Настольные ПК',
    subcategories: [{
      title: 'HP',
    }, {
      title: 'Dell'
    }],
  },);

  const products = await Product.create([
    {
      title      : 'Apple555',
      description: '15`mate, Corei3 3Mb 3GHz, 8Gb, HDD1000, 4000mAh',
      price      : 1000,
      category   : categories[0].id,
      subcategory: categories[0].subcategories[0].id,
      images     : ['Apple555_image0', 'Apple555_image1', 'Apple555_image2', 'Apple555_image3', 'Apple555_image4'],
    },
    {
      title      : 'Apple666',
      description: '15`mate, Corei5 6Mb 3GHz, 8Gb, HDD2000, 4500mAh',
      price      : 1500,
      category   : categories[0].id,
      subcategory: categories[0].subcategories[0].id,
      images     : ['Apple666_image0', 'Apple666_image1', 'Apple666_image2', 'Apple666_image3', 'Apple666_image4'],
    },
    {
      title      : 'Apple777',
      description: '15`mate, Corei7 8Mb 3GHz, 16Gb, SSD500, 5000mAh',
      price      : 2000,
      category   : categories[0].id,
      subcategory: categories[0].subcategories[0].id,
      images     : ['Apple777_image0', 'Apple777_image1', 'Apple777_image2', 'Apple777_image3', 'Apple777_image4'],
    },
    {
      title      : 'HP-xxx',
      description: '15`gloss, Corei7 8Mb 3.5GHz, 8Gb, HDD2000, 5000mAh',
      price      : 1700,
      category   : categories[0].id,
      subcategory: categories[0].subcategories[1].id,
      images     : ['HP-xxx_image0', 'HP-xxx_image1', 'HP-xxx_image2', 'HP-xxx_image3', 'HP-xxx_image4'],
    },
    {
      title      : 'HP-ProDesk 400',
      description: 'Corei7 8Mb 4GHz, 8Gb, HDD2000',
      price      : 1200,
      category   : categories[1].id,
      subcategory: categories[1].subcategories[0].id,
      images     : ['HP-ProDesk-400_image0', 'HP-ProDesk-400_image1', 'HP-ProDesk-400_image2', 'HP-ProDesk-400_image3', 'HP-ProDesk-400_image4'],
    },
    {
      title      : 'Dell OptiPlex 7050',
      description: 'Corei7 8Mb 4000GHz, 8Gb, SSD256 + HDD1000',
      price      : 1500,
      category   : categories[1].id,
      subcategory: categories[1].subcategories[1].id,
      images     : ['Dell-OptiPlex-7050_image0', 'Dell-OptiPlex-7050_image1', 'Dell-OptiPlex-7050_image2', 'Dell-OptiPlex-7050_image3', 'Dell-OptiPlex-7050_image4'],
    },

  ]);

  ctx.body = products;
})

app.use(router.routes());

module.exports = app;
