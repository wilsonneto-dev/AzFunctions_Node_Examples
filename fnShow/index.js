const fn = require("../src/functions/show");
module.exports = async function(context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");
  await fn.run(context, req);
};
