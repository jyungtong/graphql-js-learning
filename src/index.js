const express = require('express')
const graphqlHTTP = require('express-graphql')
const graphql = require('graphql')

const fakeDb = {
  'a': {
    id: 'a',
    name: 'alice',
    friends: ['b']
  },
  'b': {
    id: 'b',
    name: 'bob',
    friends: ['a', 'c']
  },
  'c': {
    id: 'c',
    name: 'caca',
    friends: ['a', 'b']
  }
}

// define user type
const userType = new graphql.GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString },
    friends: {
      type: new graphql.GraphQLList(userType),
      resolve ({ friends }) {
        return friends.map(f => fakeDb[f])
      }
    }
  })
})

// define query type
const queryType = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
      type: new graphql.GraphQLList(userType),
      resolve () {
        return Object.keys(fakeDb).map(k => fakeDb[k])

        /*
         * very cumblesome way
         */
        // return Object.keys(fakeDb).map(k => {
        //   let { id, name, friends } = fakeDb[k]
        //
        //   let populatedFriends = friends.map(f => fakeDb[f])
        //
        //   return {
        //     id,
        //     name,
        //     friends: populatedFriends
        //   }
        // })
      }
    },
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

const mutationType = new graphql.GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: userType,
      args: {
        name: { type: graphql.GraphQLString }
      },
      resolve (_, { name }) {
        const id = name.slice(0, 1)
        fakeDb[id] = {
          id,
          name
        }
        return fakeDb[id]
      }
    }
  }
})

const schema = new graphql.GraphQLSchema({
  query: queryType,
  mutation: mutationType
})

const app = express()
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}))

app.listen(8080)
