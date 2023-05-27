const { MongoClient } = require("mongodb");

let dbConnection;

module.exports = {
  connectToDb: async (cb) => {
    try {
      const client = await MongoClient.connect(
        "mongodb://0.0.0.0:27017/task-tracker"
      );
      if (!client) throw new Error("Enable to connect to database");
      dbConnection = client.db();
      cb();
    } catch (err) {
      cb(err);
    }
  },
  getDb: () => dbConnection,
};
