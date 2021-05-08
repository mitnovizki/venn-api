const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const bodyParser = require("body-parser");

const typeDefs = require("./graphql/typedefs");
const resolvers = require("./graphql/resolvers");
const { classifyTransaction } = require("./transactionClassifier");
const { generateReport } = require("../solution/expenseReportGenerator");

const rateLimit = require("express-rate-limit")


const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: error => {
    console.log(error);
    delete error.extensions.exception;
    return error;
  },
});

const app = express();
server.applyMiddleware({ app });
app.use(bodyParser.json());

// //mw
// const limiter = rateLimit({
//   max: 10,
//   windowMs: 10000 * 60 * 60,
//   message: "please try again later"
// })



app.post("/transaction/classification", async function (req, res) {
  if (!req.body || !req.body.transactionDescription) {
    res.status(400);
    res.send({
      error:
        "Invalid request: body should be a json with a single property: transactionDescription"
    });
    return;
  }

  const { transactionDescription } = req.body;
  //todo: use endpoint

  const transactionCategory = await classifyTransaction(transactionDescription);
  res.send({
    transactionCategory
  });
});

app.post("/transaction/generateReport", async (req, res) => {

  if (!req.body || !req.body.user) {
    res.status(400);
    res.send({
      error:
        "Invalid request: body should be a json with a following properties: user, start, end"
    });
    return;
  }

  const { user, start, end } = req.body
  await generateReport(user, start, end)
    .then((data) => {
      if (data) {
        res.status = 200
        res.send(data)
        return
      }
    })
    .catch(err => {
      res.status = 400
      res.send({ error: err })
      return
    })
})

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);

module.exports = {
  apolloServer: server
};
