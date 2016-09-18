import express from 'express'
import graphQLHTTP from 'express-graphql'
import DataLoader from 'dataloader'
import { getUserById, getProjectById, getUsers, getProjects } from './Api'

import schema from './schema'

const app = express()

app.use(graphQLHTTP(req => {
  const loaders = {
    user: new DataLoader(
      keys => Promise.all(keys.map(getUserById))
    ),
    project: new DataLoader(
      keys => Promise.all(keys.map(getProjectById))
    ),
    projects: new DataLoader(
      () => getProjects
    ),
    users: new DataLoader(
      () => getUsers
    )
  }

  return {
    context: { loaders },
    schema,
    graphiql: true
  }
}))

app.listen(process.env.PORT || 3000)
