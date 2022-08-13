// sanity-client.ts
// import fetch from 'node-fetch';
import { env } from 'process';
// import { createClient as createExperimentalTypesafeClient } from 'sanity-codegen';
import createClient from '@sanity/client';
// eslint-disable-next-line import/no-relative-packages
// import { Documents } from '../../generatedSanitySchemaTypes';

const clientConfig = {
  projectId: env.SANITY_PROJECT_ID ?? '',
  dataset: env.SANITY_DATASET ?? '',
  previewMode: false,
  token: env.SANITY_TOKEN ?? '',
  useCdn: false,
  apiVersion: '2022-07-31',
};

// @ts-ignore
// export const sanityExperimentalTypesafeClient = createExperimentalTypesafeClient<Documents>({
//   ...clientConfig,
//   // @ts-ignore
//   fetch,
// });

export const sanityClient = createClient(clientConfig);

export const sanityExperimentalTypesafeClient = {
  getAll: (_:string) => ([
    {
      _createdAt: '2022-08-10T23:55:39Z',
      _id: '7fb414f0-ef4b-41be-b910-fe97cdb456fc',
      _rev: '7kLtVoBRrDAwzwVryJUWYE',
      _type: 'project',
      _updatedAt: '2022-08-11T00:00:08Z',
      body: [
        {
          _key: '30fb61ae4c06',
          _type: 'block',
          children: [
            {
              _key: 'fd14d471e8fe',
              _type: 'span',
              marks: [],
              text: 'Hello world',
            },
          ],
          markDefs: [],
          style: 'h2',
        },
        {
          _key: '77d8f3d55a67',
          _type: 'block',
          children: [
            {
              _key: 'f973e95a84e2',
              _type: 'span',
              marks: [],
              text: 'Thoughts on my time',
            },
          ],
          markDefs: [],
          style: 'h3',
        },
        {
          _key: '597ba25c8840',
          _type: 'block',
          children: [
            {
              _key: '5687fd54fe00',
              _type: 'span',
              marks: [],
              text: 'lol I handshaked.',
            },
          ],
          markDefs: [],
          style: 'normal',
        },
        {
          _key: '5203f86232c2',
          _type: 'block',
          children: [
            {
              _key: '333918682fc0',
              _type: 'span',
              marks: [],
              text: 'More thoughts',
            },
          ],
          markDefs: [],
          style: 'h3',
        },
        {
          _key: '03afe0060fb9',
          _type: 'block',
          children: [
            {
              _key: '1d6a369e17a4',
              _type: 'span',
              marks: [],
              text: 'I did this',
            },
          ],
          level: 1,
          listItem: 'bullet',
          markDefs: [],
          style: 'normal',
        },
        {
          _key: '6c2882473027',
          _type: 'block',
          children: [
            {
              _key: '5afd5fdf4544',
              _type: 'span',
              marks: [],
              text: 'and this',
            },
          ],
          level: 1,
          listItem: 'bullet',
          markDefs: [],
          style: 'normal',
        },
        {
          _key: '55625256c2b3',
          _type: 'block',
          children: [
            {
              _key: 'f9b19f10534c',
              _type: 'span',
              marks: [],
              text: 'and that',
            },
          ],
          level: 1,
          listItem: 'bullet',
          markDefs: [],
          style: 'normal',
        },
        {
          _key: 'f4080a43a57c',
          _type: 'block',
          children: [
            {
              _key: 'f6d6b5609711',
              _type: 'span',
              marks: [],
              text: 'but never this',
            },
          ],
          level: 1,
          listItem: 'bullet',
          markDefs: [],
          style: 'normal',
        },
        {
          _key: '6edb3b547a80',
          _type: 'block',
          children: [
            {
              _key: '89001a2e4e2a',
              _type: 'span',
              marks: [],
              text: '',
            },
          ],
          markDefs: [],
          style: 'normal',
        },
      ],
      gallery: [
        {
          _key: 'b5a2b7daf684',
          _type: 'imageFigure',
          alt: 'I was hired on handshake',
          image: {
            _type: 'image',
            asset: {
              _ref: 'image-84d328c4620724029d818eb4da902664f4af25a3-1080x1080-jpg',
              _type: 'reference',
            },
          },
        },
        {
          _key: '34a957f98c11',
          _type: 'imageFigure',
          alt: 'A design',
          image: {
            _type: 'image',
            asset: {
              _ref: 'image-31bf4696728b53b8bee734ef90cf72b20434d118-1360x946-png',
              _type: 'reference',
            },
          },
        },
        {
          _key: '42758667f23d',
          _type: 'videoFigure',
          alt: 'This is a video',
          thumbnail: {
            _type: 'image',
            asset: {
              _ref: 'image-7859db95ac3503a8eec8f448ba1e1c9e92eeae5c-3176x2591-png',
              _type: 'reference',
            },
          },
          video: {
            _type: 'file',
            asset: {
              _ref: 'file-83324b5e0b8d38d84ba317dc45f7c2c1cfdade51-mp4',
              _type: 'reference',
            },
          },
        },
      ],
      slug: {
        _type: 'slug',
        current: 'typeforce-12',
      },
      subTitle: 'So jiggly',
      title: 'Typeforce 12',
      url: 'https://12.typeforce.com',
    },
    {
      _createdAt: '2022-08-10T23:57:55Z',
      _id: '7fe27d4c-9a69-460b-b1bb-114db88c1be5',
      _rev: 'czwwyu9MWPQ1ABlIahd9Wu',
      _type: 'project',
      _updatedAt: '2022-08-10T23:59:27Z',
      body: [
        {
          _key: '30fb61ae4c06',
          _type: 'block',
          children: [
            {
              _key: 'fd14d471e8fe',
              _type: 'span',
              marks: [],
              text: 'Hello world',
            },
          ],
          markDefs: [],
          style: 'h2',
        },
        {
          _key: '77d8f3d55a67',
          _type: 'block',
          children: [
            {
              _key: 'f973e95a84e2',
              _type: 'span',
              marks: [
                '2ba440a4025a',
              ],
              text: 'Thoughts on my time',
            },
          ],
          markDefs: [
            {
              _key: '2ba440a4025a',
              _type: 'link',
            },
          ],
          style: 'h3',
        },
        {
          _key: '597ba25c8840',
          _type: 'block',
          children: [
            {
              _key: '5687fd54fe00',
              _type: 'span',
              marks: [],
              text: 'lol I handshaked.',
            },
          ],
          markDefs: [],
          style: 'normal',
        },
        {
          _key: '5203f86232c2',
          _type: 'block',
          children: [
            {
              _key: '333918682fc0',
              _type: 'span',
              marks: [],
              text: 'More thoughts',
            },
          ],
          markDefs: [],
          style: 'h3',
        },
        {
          _key: '03afe0060fb9',
          _type: 'block',
          children: [
            {
              _key: '1d6a369e17a4',
              _type: 'span',
              marks: [],
              text: 'I did this',
            },
          ],
          level: 1,
          listItem: 'bullet',
          markDefs: [],
          style: 'normal',
        },
        {
          _key: '6c2882473027',
          _type: 'block',
          children: [
            {
              _key: '5afd5fdf4544',
              _type: 'span',
              marks: [],
              text: 'and this',
            },
          ],
          level: 1,
          listItem: 'bullet',
          markDefs: [],
          style: 'normal',
        },
        {
          _key: '55625256c2b3',
          _type: 'block',
          children: [
            {
              _key: 'f9b19f10534c',
              _type: 'span',
              marks: [],
              text: 'and that',
            },
          ],
          level: 1,
          listItem: 'bullet',
          markDefs: [],
          style: 'normal',
        },
        {
          _key: 'f4080a43a57c',
          _type: 'block',
          children: [
            {
              _key: 'f6d6b5609711',
              _type: 'span',
              marks: [],
              text: 'but never this',
            },
          ],
          level: 1,
          listItem: 'bullet',
          markDefs: [],
          style: 'normal',
        },
        {
          _key: '6edb3b547a80',
          _type: 'block',
          children: [
            {
              _key: '89001a2e4e2a',
              _type: 'span',
              marks: [],
              text: '',
            },
          ],
          markDefs: [],
          style: 'normal',
        },
      ],
      gallery: [
        {
          _key: 'b5a2b7daf684',
          _type: 'imageFigure',
          alt: 'I was hired on handshake',
          image: {
            _type: 'image',
            asset: {
              _ref: 'image-84d328c4620724029d818eb4da902664f4af25a3-1080x1080-jpg',
              _type: 'reference',
            },
          },
        },
        {
          _key: '34a957f98c11',
          _type: 'imageFigure',
          alt: 'A design',
          image: {
            _type: 'image',
            asset: {
              _ref: 'image-31bf4696728b53b8bee734ef90cf72b20434d118-1360x946-png',
              _type: 'reference',
            },
          },
        },
        {
          _key: '42758667f23d',
          _type: 'videoFigure',
          alt: 'This is a video',
          thumbnail: {
            _type: 'image',
            asset: {
              _ref: 'image-7859db95ac3503a8eec8f448ba1e1c9e92eeae5c-3176x2591-png',
              _type: 'reference',
            },
          },
          video: {
            _type: 'file',
            asset: {
              _ref: 'file-83324b5e0b8d38d84ba317dc45f7c2c1cfdade51-mp4',
              _type: 'reference',
            },
          },
        },
      ],
      slug: {
        _type: 'slug',
        current: 'typeforce-9',
      },
      subTitle: 'Mostly I just make typeforce sites',
      title: 'Typeforce 9',
      url: 'https://9.typeforce.com',
    },
    {
      _createdAt: '2022-08-10T23:21:04Z',
      _id: 'eb83c022-383e-495f-a173-6a568582d8ae',
      _rev: 'czwwyu9MWPQ1ABlIahdFR3',
      _type: 'project',
      _updatedAt: '2022-08-10T23:59:55Z',
      body: [
        {
          _key: '30fb61ae4c06',
          _type: 'block',
          children: [
            {
              _key: 'fd14d471e8fe',
              _type: 'span',
              marks: [],
              text: 'Hello world',
            },
          ],
          markDefs: [],
          style: 'h2',
        },
        {
          _key: '77d8f3d55a67',
          _type: 'block',
          children: [
            {
              _key: 'f973e95a84e2',
              _type: 'span',
              marks: [],
              text: 'Thoughts on my time',
            },
          ],
          markDefs: [],
          style: 'h3',
        },
        {
          _key: '597ba25c8840',
          _type: 'block',
          children: [
            {
              _key: '5687fd54fe00',
              _type: 'span',
              marks: [],
              text: 'lol I handshaked.',
            },
          ],
          markDefs: [],
          style: 'normal',
        },
        {
          _key: '5203f86232c2',
          _type: 'block',
          children: [
            {
              _key: '333918682fc0',
              _type: 'span',
              marks: [],
              text: 'More thoughts',
            },
          ],
          markDefs: [],
          style: 'h3',
        },
        {
          _key: '03afe0060fb9',
          _type: 'block',
          children: [
            {
              _key: '1d6a369e17a4',
              _type: 'span',
              marks: [],
              text: 'I did this',
            },
          ],
          level: 1,
          listItem: 'bullet',
          markDefs: [],
          style: 'normal',
        },
        {
          _key: '6c2882473027',
          _type: 'block',
          children: [
            {
              _key: '5afd5fdf4544',
              _type: 'span',
              marks: [],
              text: 'and this',
            },
          ],
          level: 1,
          listItem: 'bullet',
          markDefs: [],
          style: 'normal',
        },
        {
          _key: '55625256c2b3',
          _type: 'block',
          children: [
            {
              _key: 'f9b19f10534c',
              _type: 'span',
              marks: [],
              text: 'and that',
            },
          ],
          level: 1,
          listItem: 'bullet',
          markDefs: [],
          style: 'normal',
        },
        {
          _key: 'f4080a43a57c',
          _type: 'block',
          children: [
            {
              _key: 'f6d6b5609711',
              _type: 'span',
              marks: [],
              text: 'but never this',
            },
          ],
          level: 1,
          listItem: 'bullet',
          markDefs: [],
          style: 'normal',
        },
        {
          _key: '6edb3b547a80',
          _type: 'block',
          children: [
            {
              _key: '89001a2e4e2a',
              _type: 'span',
              marks: [],
              text: '',
            },
          ],
          markDefs: [],
          style: 'normal',
        },
      ],
      gallery: [
        {
          _key: 'b5a2b7daf684',
          _type: 'imageFigure',
          alt: 'I was hired on handshake',
          image: {
            _type: 'image',
            asset: {
              _ref: 'image-84d328c4620724029d818eb4da902664f4af25a3-1080x1080-jpg',
              _type: 'reference',
            },
          },
        },
        {
          _key: '34a957f98c11',
          _type: 'imageFigure',
          alt: 'A design',
          image: {
            _type: 'image',
            asset: {
              _ref: 'image-31bf4696728b53b8bee734ef90cf72b20434d118-1360x946-png',
              _type: 'reference',
            },
          },
        },
        {
          _key: '42758667f23d',
          _type: 'videoFigure',
          alt: 'This is a video',
          thumbnail: {
            _type: 'image',
            asset: {
              _ref: 'image-7859db95ac3503a8eec8f448ba1e1c9e92eeae5c-3176x2591-png',
              _type: 'reference',
            },
          },
          video: {
            _type: 'file',
            asset: {
              _ref: 'file-83324b5e0b8d38d84ba317dc45f7c2c1cfdade51-mp4',
              _type: 'reference',
            },
          },
        },
      ],
      slug: {
        _type: 'slug',
        current: 'handshake',
      },
      subTitle: 'I can make sane thing too!',
      title: 'Handshake',
      url: 'https://joinhandshake.com',
    },
  ].flatMap((entry) => [entry, entry])),
};
