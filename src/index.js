const { graphql, buildSchema } = require('graphql')

// Construct a schema using GraphQL Schema Language
var schema = buildSchema(`
  type Query {
    hello: String
  }
`)

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => 'Hello world from Graphql'
}

// run the graphql query '{ hello }'
graphql(schema, '{ hello }', root)
.then(console.log)
