const express = require('express')
const graphqlHTTP = require('express-graphql')
const graphql = require('graphql')

const fakeDb = {
  'a': {
    id: 'a',
    name: 'alice'
  },
  'b': {
    id: 'b',
    name: 'bob'
  }
}

// define user type
const userType = new graphql.GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString }
  }
})

// define query type
const queryType = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: {
    user: {
      type: userType,
      args: {
        id: { type: graphql.GraphQLString }
      },
      resolve (_, { id }) {
        return fakeDb[id]
      }
    }
  }
})

const schema = new graphql.GraphQLSchema({ query: queryType })

const app = express()
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}))

app.listen(8080)
