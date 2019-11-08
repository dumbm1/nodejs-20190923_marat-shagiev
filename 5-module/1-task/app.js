const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')('public'));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let subscribers = [];

router.get('/subscribe', async (ctx, next) => {

  const promise = new Promise((resolve, reject) => {
    subscribers.push(resolve);

    ctx.res.on("close", function () {
      subscribers.splice(subscribers.indexOf(resolve), 1);
      const error = new Error("Connection closed");
      error.code = "ECONNRESET";
      reject(error);
    });

  });

  let message;

  try {
    message = await promise;
  } catch (err) {
    if (err.code === "ECONNRESET") return;
    throw err;
  }

  ctx.body = message;

});

router.post("/publish", async (ctx, next) => {
  const message = ctx.request.body.message;

  if (!message) {
    ctx.throw(400);
  }

  subscribers.forEach(function (resolve) {
    resolve(String(message));
  });

  subscribers = [];

  ctx.body = "ok";

});

/*
// this minimalistik resolve is work, but not full, tests are not resolve

 router.get('/subscribe', async (ctx, next) => {

 const promise = new Promise((resolve, reject) => subscribers.push(resolve));

 let message = await promise;

 ctx.body = message;

 });

 router.post('/publish', async (ctx, next) => {

 const message = ctx.request.body.message;

 if (!message) ctx.throw(400);

 subscribers.forEach(resolve => {resolve(message.toString())});

 subscribers = [];
 });*/

app.use(router.routes());

module.exports = app;
