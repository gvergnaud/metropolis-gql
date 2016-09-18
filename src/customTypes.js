import prop from 'lodash/fp/prop'
import {
  GraphQLString,
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLObjectType,
  GraphQLID,
  GraphQLList,
  GraphQLInt,
} from 'graphql'

export const ImageTargetType = new GraphQLEnumType({
  name: 'ImageTarget',
  description: 'differents types d\'images possible.',
  values: {
    user: { value: 'User' },
    project: { value: 'Project' },
  }
})

export const ImageType = new GraphQLObjectType({
  name: 'Image',
  description: 'any images uploaded on metropolis.watch',
  fields: () => ({
    id: { type: GraphQLID },
    createdAt: {
      type: GraphQLString,
      resolve: prop('created_at'),
    },
    updatedAt: {
      type: GraphQLString,
      resolve: prop('updated_at'),
    },
    imageName: {
      type: GraphQLString,
      resolve: prop('image_name'),
    },
    imgTargetId: {
      type: GraphQLID,
      resolve: prop('img_target_id'),
    },
    imgTargetType: {
      type: ImageTargetType,
      resolve: prop('img_target_type')
    }
  })
})

export const CommentType = new GraphQLObjectType({
  name: 'Comment',
  description: 'Comment on a project.',
  fields: () => ({
    id: { type: GraphQLID },
    user: { type: UserType },
    content: { type: GraphQLString },
    createdAt: {
      type: GraphQLString,
      resolve: prop('created_at'),
    },
    updatedAt: {
      type: GraphQLString,
      resolve: prop('updated_at'),
    },
    deletedAt: {
      type: GraphQLString,
      resolve: prop('deleted_at'),
    },
  })
})

export const ProjectStatusType = new GraphQLEnumType({
  name: 'ProjectStatus',
  description: 'niveau d\'avancement d\'un projet',
  values: {
    draft: { value: 'draft' },
    competition: { value: 'competition' },
    production: { value: 'production' },
    released: { value: 'released' },
  }
})

export const TagType = new GraphQLObjectType({
  name: 'Tag',
  description: 'a skill that can be shared between different users.',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    taggingsCount: {
      type: GraphQLInt,
      resolve: prop('taggings_count')
    }
  })
})

export const ProjectType = new GraphQLObjectType({
  name: 'Project',
  description: 'project on metropolis.watch',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    slug: { type: GraphQLString },
    status: { type: ProjectStatusType },
    youtubeId: {
      type: GraphQLString,
      resolve: prop('youtube_id'),
    },
    releasedYoutubeId: {
      type: GraphQLString,
      resolve: prop('released_youtube_id'),
    },
    cover: { type: ImageType },
    authorId: {
      type: GraphQLID,
      resolve: prop('author_id'),
    },
    comments: { type: new GraphQLList(CommentType) },
    createdAt: {
      type: GraphQLString,
      resolve: prop('created_at'),
    },
    updatedAt: {
      type: GraphQLString,
      resolve: prop('updated_at'),
    },
    deletedAt: {
      type: GraphQLString,
      resolve: prop('deleted_at'),
    },
    competitionAt: {
      type: GraphQLString,
      resolve: prop('competition_at'),
    },
    productionAt: {
      type: GraphQLString,
      resolve: prop('production_at'),
    },
    releasedAt: {
      type: GraphQLString,
      resolve: prop('released_at'),
    },
    author: {
      type: UserType,
      resolve: (project, args, { loaders }) => loaders.user.load(project.author_id),
    },
    tags: { type: new GraphQLList(TagType) },
    followers: {
      type: new GraphQLList(UserType),
      resolve: (project, args, { loaders }) =>
        loaders.project.load(project.id).then(p =>
          Promise.all(p.followers.map(({ id }) => loaders.user.load(id)))
        )
    },
  })
})

export const UserNetworksType = new GraphQLObjectType({
  name: 'UserNetworks',
  description: 'social networks links of a user.',
  fields: () => ({
    twitter: { type: GraphQLString },
    facebook: { type: GraphQLString },
    youtube: { type: GraphQLString },
    linkedin: { type: GraphQLString },
  })
})

export const SkillType = new GraphQLObjectType({
  name: 'Skill',
  description: 'a skill that can be shared between different users.',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    taggingsCount: {
      type: GraphQLInt,
      resolve: prop('taggings_count')
    }
  })
})

export const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'metropolis users.',
  fields: () => ({
    email: { type: GraphQLString },
    username: { type: GraphQLString },
    firstName: {
      type: GraphQLString,
      resolve: prop('first_name'),
    },
    lastName: {
      type: GraphQLString,
      resolve: prop('last_name'),
    },
    bio: { type: GraphQLString },
    isAdmin: {
      type: GraphQLBoolean,
      resolve: prop('is_admin'),
    },
    isCreator: {
      type: GraphQLBoolean,
      resolve: prop('is_creator'),
    },
    isConfirmed: {
      type: GraphQLBoolean,
      resolve: prop('is_confirmed'),
    },
    createdAt: {
      type: GraphQLString,
      resolve: prop('created_at'),
    },
    updatedAt: {
      type: GraphQLString,
      resolve: prop('updated_at'),
    },
    networks: { type: UserNetworksType },
    phone: { type: GraphQLString },
    avatar: { type: ImageType },
    skills: { type: new GraphQLList(SkillType) },
    projects: {
      type: new GraphQLList(ProjectType),
      resolve: (user, args, { loaders }) =>
      loaders.user.load(user.id).then(user =>
        Promise.all(user.projects.map(({ id }) => loaders.project.load(id)))
      )
    },
    followedProjects: {
      type: new GraphQLList(ProjectType),
      resolve: (user, args, { loaders }) =>
        loaders.user.load(user.id).then(user =>
          Promise.all(user.followed_projects.map(({ id }) => loaders.project.load(id)))
        )
    },
  })
})
