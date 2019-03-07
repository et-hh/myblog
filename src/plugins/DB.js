import { isPostIdValid } from '@/plugins'

const getPostsFromStorage = () => localStorage.posts ? JSON.parse(localStorage.posts) : []

export const savePost = ({ id, markdown }) => {
  const posts = getPostsFromStorage()
  id = +id

  if (isPostIdValid(id)) {
    posts[id] = markdown
  } else {
    posts.push(markdown)
  }
  localStorage.posts = JSON.stringify(posts)

  return isPostIdValid(id) ? id : posts.length - 1
}

export const getPost = (id) => isPostIdValid(+id) ? getPostsFromStorage()[+id] : getPostsFromStorage()

export const delPost = id => {
  id = +id
  if (isPostIdValid(id)) {
    const posts = getPostsFromStorage()

    posts.splice(id, 1)
    localStorage.posts = JSON.stringify(posts)
  }
}