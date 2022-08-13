export default {
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "subTitle",
      title: "Subtitle",
      type: "string",
    },

    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    },
    {
      name: "url",
      title: "URL",
      type: "url",
    },
    {
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [
        {
          type: 'imageFigure'
        },
        {
          type: 'videoFigure'
        }
      ]
    },
    {
      name: "body",
      title: "Body",
      type: "blockContent",
    },
  ],
};
