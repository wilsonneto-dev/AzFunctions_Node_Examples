const func = require("../src/functions/saveAcao");

module.exports = async function(context, myQueueItem) {
  context.log(
    "JavaScript queue trigger function processed work item",
    myQueueItem.Value
  );

  await func.run(context, myQueueItem);
};
