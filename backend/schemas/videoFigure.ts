export default {
  name: "videoFigure",
  title: "Video Figure",
  type: 'object',
  fields: [
    {
      name: "video",
      title: "Video",
      type: "file",
      options: {
        accept: ['video/mp4'],
      }
    },
    {
      name: "alt",
      title: "Alt text",
      type: "string",
    },
    {
      name: "thumbnail",
      title: "Thumbnail",
      type: "image",
    }
  ],
}