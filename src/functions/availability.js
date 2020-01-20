const azure = require("azure-storage");

module.exports = {
  run: async (context, myTimer) => {
    const tableName = "LogDisponibilidade";

    // criando o serviço que utiliza as tabelas
    const tableService = azure.createTableService(
      process.env.AzureWebJobsStorage
    );

    // criando a tabela se ainda não existe
    await new Promise((resolve, reject) => {
      tableService.createTableIfNotExists(tableName, error => {
        if (!error) {
          context.log("created table: LogDisponibilidade");
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
      PartitionKey: entGen.String(process.env.LocalExecucao),
      RowKey: entGen.String(new Date().getTime().toString()),
      Message: entGen.String("AppFunctions em execucao"),
      Date: entGen.DateTime(new Date())
    };

    // inserir a entidade na tabela
    await new Promise((ok, err) => {
      tableService.insertEntity(tableName, entity, function(error) {
        if (!error) {
          context.log("**** Teste de disponibilidade executado");
          ok();
        }
        err();
      });
    });
  }
};
