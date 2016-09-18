import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} from 'graphql'
import {
  ProjectType,
  UserType,
} from './customTypes'
import { getProjects, getUsers } from './Api'

const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'query the metropolis rest api in a better way.',
  fields: () => ({
    project: {
      type: ProjectType,
      args: {
        slug: {type: GraphQLString}
      },
      resolve: (root, args, { loaders }) => loaders.project.load(args.slug)
    },
    projects: {
      type: new GraphQLList(ProjectType),
      resolve: root => getProjects()
    },
    user: {
      type: UserType,
      args: {
        username: {type: GraphQLString}
      },
      resolve: (root, args, { loaders }) => loaders.user.load(args.username)
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: root => getUsers()
    },
  })
})


export default new GraphQLSchema({
  query: QueryType
})
