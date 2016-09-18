import fetch from 'node-fetch'

const BASE_URL = 'http://metropolis-api-dev.herokuapp.com/api/v1'

export const getProjectBySlug = slug =>
  fetch(`${BASE_URL}/projects/${slug}?populate=followers`)
    .then(res => res.json())
    .then(json => json.data)

export const getProjectById = getProjectBySlug

export const getProjects = () =>
  fetch(`${BASE_URL}/projects`)
    .then(res => res.json())
    .then(json => json.data)


export const getUsers = () =>
  fetch(`${BASE_URL}/users`)
    .then(res => res.json())
    .then(json => json.data)

export const getUserByUsername = username =>
  fetch(`${BASE_URL}/users/${username}?populate=projects,followed_projects`)
    .then(res => res.json())
    .then(json => json.data)

export const getUserById = getUserByUsername
