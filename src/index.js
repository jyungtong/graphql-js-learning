const express = require('express')
const graphqlHTTP = require('express-graphql')
const glue = require('schemaglue')
const { makeExecutableSchema } = require('graphql-tools')

const { schema: typeDefs, resolver: resolvers } = glue('src/graphql')

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers
})

const app = express()
app.use('/graphql', graphqlHTTP({
  schema: executableSchema,
  graphiql: true
}))

app.listen(8080)
