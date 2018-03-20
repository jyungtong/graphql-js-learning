const Koa = require('koa')
const Router = require('koa-router')
const graphqlHTTP = require('koa-graphql')
const glue = require('schemaglue')
const { makeExecutableSchema } = require('graphql-tools')

const { schema: typeDefs, resolver: resolvers } = glue('src/graphql')
const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers
})

const app = new Koa()
const router = new Router()
router.all('/graphql', graphqlHTTP(() => ({
  schema: executableSchema,
  graphiql: true,
  context: { 'secretauth': 'something very secret' }
})))

app
  .use(router.routes())
  .listen(8080)
