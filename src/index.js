const express = require('express')
const graphqlHTTP = require('express-graphql')
const { buildSchema } = require('graphql')

// Construct a schema using GraphQL Schema Language
var schema = buildSchema(`
  type Query {
    quoteOfTheDay: String,
    random: Float!,
    rollDice(numDice: Int!, numSides: Int): [Int]
  }
`)

// The root provides a resolver function for each API endpoint
var root = {
  quoteOfTheDay: () => Math.random() < 0.5 ? 'Take it easy' : 'salvation lies between',
  random: () => Math.random(),
  rollDice: ({ numDice, numSides = 6 }) => {
    var output = []
    for (var i = 0; i < numDice; i++) {
      output.push(1 + Math.floor(Math.random() * numSides))
    }
    return output
  }
}

const app = express()
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true
}))

app.listen(8080)
