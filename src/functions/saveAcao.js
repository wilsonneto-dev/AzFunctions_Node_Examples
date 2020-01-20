const azure = require("azure-storage");
const tableName = "cotacao";

module.exports = {
  run: async (context, queueItem) => {
    if (!queueItem.Value || !queueItem.Code) {
      context.log("** invalid format...");
    } else {
      // criando o serviço que utiliza as tabelas
      const tableService = azure.createTableService(
        process.env.AzureWebJobsStorage
      );

      // criando a tabela se ainda não existe
      await new Promise((resolve, reject) => {
        tableService.createTableIfNotExists(tableName, error => {
          if (!error) {
            context.log(`created table ${tableName}`);
            resolve();
          } else {
            context.log("error on crate table: " + error.message);
            reject();
          }
        });
      });

      // utilizar o entity generator pra gerar a entiddae a ser salva
      var entGen = azure.TableUtilities.entityGenerator;
      var entity = {
        PartitionKey: entGen.String(queueItem.Code),
        RowKey: entGen.String(new Date().getTime().toString()),
        Value: entGen.Double(queueItem.Value),
        Date: entGen.DateTime(new Date())
      };

      // inserir a entidade na tabela
      await new Promise((ok, err) => {
        tableService.insertEntity(tableName, entity, function(error) {
          if (!error) {
            context.log(
              "** Salvo na tabela de cotacoes: " + JSON.stringify(queueItem)
            );
            ok();
          }
          err();
        });
      });
    }
  }
};
