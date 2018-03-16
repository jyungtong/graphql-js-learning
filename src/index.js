const express = require('express')
const graphqlHTTP = require('express-graphql')
const { buildSchema } = require('graphql')

// Construct a schema using GraphQL Schema Language
var schema = buildSchema(`
  type RandomDie {
    numSides: Int!
    rollOnce: Int!
    roll(numRolls: Int!): [Int]
  }

  type Query {
    quoteOfTheDay: String
    random: Float!
    getDie(numSides: Int): RandomDie
    getMessage(id: ID!): Message
  }

  input MessageInput {
    content: String
    author: String
  }

  type Message {
    id: ID!
    content: String
    author: String
  }

  type Mutation {
    createMessage(input: MessageInput): Message
    updateMessage(id: ID!, input: MessageInput): Message
  }
`)

var fakeDb = {}

class Message {
  constructor({ id, content, author }) {
    this.id = id
    this.content = content
    this.author = author
  }
}

class RandomDie {
  constructor (numSides) {
    this.numSides = numSides
  }

  rollOnce () {
    return 1 + Math.floor(Math.random() * this.numSides)
  }

  roll ({ numRolls }) {
    var output = []
    for (var i = 0; i < numRolls; i++) {
      output.push(this.rollOnce())
    }
    return output
  }
}

// The root provides a resolver function for each API endpoint
var root = {
  quoteOfTheDay: () => Math.random() < 0.5 ? 'Take it easy' : 'salvation lies between',
  random: () => Math.random(),
  getDie: ({ numSides = 6 }) => new RandomDie(numSides),
  getMessage: ({ id }) => {
    if (!fakeDb[id]) {
      throw new Error('no messages exist with id ' + id)
    }
    return new Message({
      id,
      content: fakeDb[id].content,
      author: fakeDb[id].author
    })
  },

  createMessage: ({ input }) => {
    const id = Object.keys(fakeDb).length + 1 + ''
    fakeDb[id] = input
    return new Message({
      id,
      content: input.content,
      author: input.author
    })
  },

  updateMessage: ({ id, input }) => {
    if (!fakeDb[id]) {
      throw new Error('no messages exist with id ' + id)
    }

    fakeDb[id] = input
    return new Message({
      id,
      content: input.content,
      author: input.author
    })
  }
}

const app = express()
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true
}))

app.listen(8080)
