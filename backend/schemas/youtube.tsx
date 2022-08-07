import React from 'react'
import YouTube from 'react-youtube'

function YoutubePreview ({value}:{value:{id:string}}) {
  const {id} = value
  return (<YouTube videoId={id} style={{
    overflow: 'hidden'
  }}/>)
}

export default {
  name: 'youtube',
  title: 'YouTube',
  type: 'object',
  fields: [
    {
      name: 'id',
      title: 'Youtube ID',
      type: 'string',
    },
  ],
  preview: {
    select: {
      id: 'id'
    },
    component: YoutubePreview
  },
}
