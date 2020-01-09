module.exports = {
  mongodb: {
    uri: (process.env.NODE_ENV === 'test')
      ? 'mongodb://localhost/7-module-2-task'
      : 'mongodb://localhost/any-shop',
  },
  crypto: {
    iterations: (process.env.NODE_ENV === 'test' ? 1 : 12000),
    length: 128,
    digest: 'sha512',
  },
  providers: {
    github: {
      app_id: process.env.GITHUB_APP_ID || 'df328f2e4e62701e2a46',
      app_secret: process.env.GITHUB_APP_SECRET || '9c76c56d7b37bedacdee834b1b7ccac144cc5674',
      callback_uri: 'http://localhost:3000/oauth/github',
      options: {
        scope: ['user:email'],
      },
    },
    facebook: {
      app_id: process.env.FACEBOOK_APP_ID || '453159062022493',
      app_secret: process.env.FACEBOOK_APP_SECRET || '313e178a3e8e5d99f64557acc2364e6c',
      callback_uri: 'http://localhost:3000/oauth/facebook',
      options: {
        scope: ['email'],
      },
    },
    vkontakte: {
      app_id: process.env.VKONTAKTE_APP_ID || '7273037',
      app_secret: process.env.VKONTAKTE_APP_SECRET || 'odN0Dj4p3f1xLuZKT3vt',
      callback_uri: 'http://localhost:3000/api/oauth/vkontakte',
      options: {
        scope: ['email'],
      },
    },
  },
};
