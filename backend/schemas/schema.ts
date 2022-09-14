// First, we must import the schema creator
import createSchema from 'part:@sanity/base/schema-creator'

// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type'

// We import object and document schemas
import blockContent from './blockContent'
import category from './category'
import post from './post'
import author from './author'
import youtube from './youtube'
import vimeo from './vimeo'
import project from './project'
import imageFigure from './imageFigure'
import videoFigure from './videoFigure'
// import config from './config'

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  name: 'default',
  types: schemaTypes.concat([
    post,
    project,
    author,
    category,
    // config,
    imageFigure,
    videoFigure,
    blockContent,
    youtube,
    vimeo,
  ]),
})
