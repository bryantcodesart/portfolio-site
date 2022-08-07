import React from 'react'
import Vimeo from '@u-wave/react-vimeo';
import {Box} from '@sanity/ui'

function VimeoPreview ({value}:{value:{id:string}}) {
  const {id} = value

  return (
    <Box><Vimeo
      video={id}
      responsive
    /></Box>
  )
}

export default {
  name: 'vimeo',
  title: 'Vimeo',
  type: 'object',
  fields: [
    {
      name: 'id',
      title: 'Vimeo ID',
      type: 'string',
    },
  ],
  components: { preview: VimeoPreview, input: ()=><></>},
  preview: {
    select: {
      id: 'id',
    },
    prepare: (value:{
      id:string
    }) => {
      return {
        title: 'VIMEO '+value.id
      }
    }
  },
}
