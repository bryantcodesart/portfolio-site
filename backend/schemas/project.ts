import { Rule } from "@sanity/types/dist/dts";

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
      name: "client",
      title: "Client",
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
      name: "video",
      title: "Thumbnail Video",
      type: "url",
      validation: (Rule:Rule) => Rule.uri({
        allowRelative: true,
      })
    },
    {
      name: "body",
      title: "Body",
      type: "blockContent",
    },
    {
      name: "collaborators",
      title: "Collaborators",
      type: "array",
      of: [
        {
          name: "designers",
          type: "object",
          title: "Designers",
          fields: [
            {
              name: 'name',
              title: 'Name',
              type: 'string',
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
            },
          ],
          preview: {
            select: {
              title: 'name',
            }
          }
        }
      ]
    },
    // {
    //   name: "tech",
    //   title: "Tech",
    //   type: "array",
    //   of: [
    //     {
    //       name: "name",
    //       type: "string",
    //       title: "Name",
    //     }
    //   ]
    // },
  ],
};
