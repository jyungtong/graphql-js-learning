const express = require('express')
const graphqlHTTP = require('express-graphql')
const { buildSchema } = require('graphql')

// Construct a schema using GraphQL Schema Language
var schema = buildSchema(`
  type Query {
    quoteOfTheDay: String,
    random: Float!,
    rollThreeDice: [Int]
  }
`)

// The root provides a resolver function for each API endpoint
var root = {
  quoteOfTheDay: () => Math.random() < 0.5 ? 'Take it easy' : 'salvation lies between',
  random: () => Math.random(),
  rollThreeDice: () => [1, 2, 3].map(_ => 1 + Math.floor(Math.random() * 6))
}

const app = express()
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true
}))

app.listen(8080)
