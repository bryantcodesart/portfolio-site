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
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
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
      name: "designers",
      title: "Designers",
      type: "array",
      of: [
        {
          name: "designer",
          type: "object",
          title: "Designer",
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
    {
      name: "links",
      title: "Links",
      type: "array",
      of: [
        {
          name: "link",
          type: "object",
          title: "Link",
          fields: [
            {
              name: 'text',
              title: 'Text',
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
              title: 'text',
            }
          }
        }
      ]
    },
    {
      name: "awards",
      title: "Awards",
      type: "array",
      of: [
        {
          name: "award",
          type: "object",
          title: "Award",
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
      name: "textColor",
      title: "Text Color",
      type: "color",
    },
    {
      name: "color1",
      title: "Color 1",
      type: "color",
    },
    {
      name: "color2",
      title: "Color 2",
      type: "color",
    },

  ],
};
