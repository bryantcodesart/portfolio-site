import React from 'react'
import Vimeo from '@u-wave/react-vimeo';

function VimeoPreview ({value}:{value:{id:string}}) {
  const {id} = value

  return (
    <Vimeo
      video={id}
      responsive
    />
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
  preview: {
    select: {
      id: 'id',
    },
    component: VimeoPreview,
  },
}
