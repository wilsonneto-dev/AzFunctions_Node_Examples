const fn = require("../src/functions/availability");

module.exports = async function(context, myTimer) {
  const timeStamp = new Date().toISOString();

  context.log(
    `function \"${context.executionContext.functionName}\" started! running...`,
    timeStamp
  );

  await fn.run(context, myTimer);
};
