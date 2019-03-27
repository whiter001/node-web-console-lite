const isdev= process.env.NODE_ENV == 'dev';
exports.debug = env => msg => isdev && console.log(env,msg);
