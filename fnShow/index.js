const azure = require("azure-storage");
const tableName = "cotacao";

module.exports = async function(context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");

  const tableService = azure.createTableService(
    process.env.AzureWebJobsStorage
  );

  if (req.query.acao || (req.body && req.body.acao)) {
    const query = new azure.TableQuery()
      .top(25)
      .where("PartitionKey eq ?", req.query.acao);

    const options = { payloadFormat: "application/json;odata=nometadata" };

    const entries = await new Promise((resolve, reject) => {
      tableService.queryEntities(tableName, query, null, options, function(
        error,
        result,
        response
      ) {
        if (!error) {
          resolve(response.body);
        }
        reject(error);
      });
    });

    context.res = {
      status: 200,
      body: JSON.stringify(entries)
    };
  } else {
    context.res = {
      status: 400,
      body: "Passe a acao por parametro para que seja mostrado o valor"
    };
  }
};
