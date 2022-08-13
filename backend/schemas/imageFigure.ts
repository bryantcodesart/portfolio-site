export default {
  name: "imageFigure",
  title: "Image Figure",
  type: 'object',
  fields: [
    {
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      }
    },
    {
      name: "alt",
      title: "Alt text",
      type: "string",
    },
  ],
}