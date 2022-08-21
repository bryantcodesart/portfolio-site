// import fetch from 'node-fetch';
import { env } from 'process';
// import { createClient as createExperimentalTypesafeClient } from 'sanity-codegen';
import createClient from '@sanity/client';
import { Project } from '../../generatedSanitySchemaTypes';
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

// For dummy content

export const sanityExperimentalTypesafeClient = {
  getAll: (_:string):Project[] => (
    [
      {
        _createdAt: '2022-08-17T14:38:16Z',
        _id: '536d2bb1-5c95-4df2-88d1-dd9af115afd7',
        _rev: 'uXabiSfzymOzjuQtahy5qk',
        _type: 'project',
        _updatedAt: '2022-08-17T21:28:40Z',
        body: [
          {
            _key: '7d327c82036b',
            _type: 'block',
            children: [
              {
                _key: '0f4a3ea552f9',
                _type: 'span',
                marks: [],
                text: '',
              },
            ],
            markDefs: [],
            style: 'normal',
          },
          {
            _key: '41325ff2e15b',
            _type: 'quote',
            author: 'Stephanie Jung',
            headshot: {
              _type: 'image',
              asset: {
                _ref: 'image-6c2dc4f88a68db975dbba292a0c2c18cf57dbdfb-800x800-jpg',
                _type: 'reference',
              },
            },
            quote: 'Bryant has a really nice hat.  Look at that hat.  I recommend you work with him if you like hats.',
            title: 'Brand Design Lead, Employer Marketing',
          },
        ],
        client: 'Handshake',
        designers: [
          {
            _key: 'ed83b79b9bf8',
            _type: 'designer',
            name: 'Stef Jung',
          },
        ],
        slug: {
          _type: 'slug',
          current: 'next-is-now',
        },
        subTitle: 'A simulated computer desktop that transforms from past to future',
        title: 'Next Is Now',
        video: 'next-is-now.mp4',
      },
      {
        _createdAt: '2022-08-10T23:55:39Z',
        _id: '7fb414f0-ef4b-41be-b910-fe97cdb456fc',
        _rev: 'uXabiSfzymOzjuQtahtBiS',
        _type: 'project',
        _updatedAt: '2022-08-17T20:53:19Z',
        body: [
          {
            _key: 'f626d80237cb',
            _type: 'block',
            children: [
              {
                _key: 'e6a866949787',
                _type: 'span',
                marks: [],
                text: 'A microsite announcing the 12th annual Typeforce Exhibition–"an annual exhibit celebrating wildly talented, emerging typographic artists and designers."  Typeforce has a reputation for being wild, engaging, innovative and experimental. They wanted a microsite that reflected that energy, creating excitement among the audience and inspiring great submissions from potential featured artists.',
              },
            ],
            markDefs: [],
            style: 'normal',
          },
          {
            _key: '63903e6e8a6a',
            _type: 'block',
            children: [
              {
                _key: '02fec0c054b8',
                _type: 'span',
                marks: [],
                text: 'The star of this project was the big jiggling 12 that is reeallllly fun to drag, throw, and tug over a video background.  We spent a LONG time trying to get the physics of the 12',
              },
              {
                _key: 'cae55d5cea85',
                _type: 'span',
                marks: [
                  'em',
                ],
                text: ' just',
              },
              {
                _key: '32e1b9881a11',
                _type: 'span',
                marks: [],
                text: ' right–and I regret none of it.',
              },
            ],
            markDefs: [],
            style: 'normal',
          },
          {
            _key: '56d93611309a',
            _type: 'link',
            text: 'Try it yourself!',
            url: 'https://12.typeforce.com',
          },
          {
            _key: '5b82ef570208',
            _type: 'block',
            children: [
              {
                _key: '655a1a2952b8',
                _type: 'span',
                marks: [],
                text: 'Collaboration as a dance.',
              },
            ],
            markDefs: [],
            style: 'h2',
          },
          {
            _key: 'd63944fc89b3',
            _type: 'block',
            children: [
              {
                _key: '22a718b0aa2c',
                _type: 'span',
                marks: [],
                text: "I loved our collaborative process.  Nermin and Will would throw out an inspiring, crazy idea. I would take it as a challenge and try to build a minimal prototype.  They would react and give feedback.  Repeat. And so on, trading figma files for code demos, iterating and refining, hopping from eureka to eureka. Once we had a prototype we were excited about, we revamped it with their amazing imagery, palette and typography to create the final product.  Their vision, masterful attention to detail, and skillful combination of aesthetics gave this announement a unique, fresh feel–somehow simultaneously refined and playful.\n\nThey trusted me to flesh out their concept into a great user experience and interpret their feedback creatively.  I think that's a must for a project like this, since there is no way to capture this interaction in a mockup alone.  It ",
              },
              {
                _key: 'bfc6a12cab43',
                _type: 'span',
                marks: [
                  'em',
                ],
                text: 'has',
              },
              {
                _key: '471a861e4a6e',
                _type: 'span',
                marks: [],
                text: " to be a dance with the developer--and I'm privileged to have dance partners as skilled as Nermin and Will!",
              },
            ],
            markDefs: [],
            style: 'normal',
          },
          {
            _key: 'eb37e3891974',
            _type: 'block',
            children: [
              {
                _key: '555915471794',
                _type: 'span',
                marks: [],
                text: 'How to make a 12 jiggle.',
              },
            ],
            markDefs: [],
            style: 'h2',
          },
          {
            _key: 'd02dd52e2fa1',
            _type: 'block',
            children: [
              {
                _key: '658832dbcee9',
                _type: 'span',
                marks: [],
                text: 'To get this effect, I converted the vector art of the original "1" and "2" glyphs into a set of points.  I used a physics simulation (',
              },
              {
                _key: '80e8eaba9f4f',
                _type: 'span',
                marks: [
                  'dba59c797896',
                ],
                text: 'matter.js',
              },
              {
                _key: '3aac61579782',
                _type: 'span',
                marks: [],
                text: ') to simulate springs at each of those points.  The springs would jiggle around freely as you interacted (tugging or dragging) and I would feed their coordinates in real time into a 3d renderer (',
              },
              {
                _key: 'de9cb6e042db',
                _type: 'span',
                marks: [
                  '715c99ae41b1',
                ],
                text: 'three.js',
              },
              {
                _key: '5479644fc71b',
                _type: 'span',
                marks: [],
                text: ') where I converted the spring points into lines and shapes (rendered as flat-color meshes viewed via orthographic camera). ',
              },
            ],
            markDefs: [
              {
                _key: 'dba59c797896',
                _type: 'link',
                href: 'https://brm.io/matter-js/',
              },
              {
                _key: '715c99ae41b1',
                _type: 'link',
                href: 'https://threejs.org/',
              },
            ],
            style: 'normal',
          },
          {
            _key: 'e37b5b155cee',
            _type: 'vimeo',
            id: '740477602',
          },
          {
            _key: '7116bf3d8971',
            _type: 'block',
            children: [
              {
                _key: '7d42e9f443b9',
                _type: 'span',
                marks: [],
                text: 'Although I didnt use any of his code, I was inspired in my research by ',
              },
              {
                _key: '3bee4a552889',
                _type: 'span',
                marks: [
                  '854bbf83bea2',
                ],
                text: 'Yuriy Artyukh',
              },
              {
                _key: '234deedf8174',
                _type: 'span',
                marks: [],
                text: ', who documented the technique of getting performant jiggly blob simulations using springs.  I rewrote and expanded this technique considerably to achieve our more complex interactions/effects and I used a different animation/rendering engine, as I found 3D/webgl rendering was more performant.  This gave us a smooth 60 frames per second on even less powerful machines which was ',
              },
              {
                _key: '992e08a7e778',
                _type: 'span',
                marks: [
                  'em',
                ],
                text: 'critical',
              },
              {
                _key: '808f98cc7986',
                _type: 'span',
                marks: [],
                text: ' to the jiggle feeling GREAT!',
              },
            ],
            markDefs: [
              {
                _key: '854bbf83bea2',
                _type: 'link',
                href: 'https://tympanus.net/codrops/2021/04/12/wobbly-2d-physics-with-matter-js-and-paper-js/',
              },
            ],
            style: 'normal',
          },
          {
            _key: '136d044e19d7',
            _type: 'block',
            children: [
              {
                _key: '96de2138136b',
                _type: 'span',
                marks: [],
                text: "In the video, you may notice a few more physics simulation complexities worth mention.  Some gory details: We attached the point springs to two movable rounded-rectangle bodies with minimal friction so the numbers would \"float\" and would appropriately collide with the walls and each other.   When the user interacts, we would also dynamically create new springs attached the original point springs to create the \"tug.\"  So, springs pulling on springs! We also found the drag jiggle was most pleasing if \"dampened\" by additional springs anchored to the center of the floating body.  You'll see those are created dynamically while the user is dragging the twelve.",
              },
            ],
            markDefs: [],
            style: 'normal',
          },
        ],
        client: 'Typeforce',
        designers: [
          {
            _key: 'a03cb751f494',
            _type: 'designer',
            name: 'Nermin Moufti',
            url: 'https://www.instagram.com/q_type/',
          },
          {
            _key: 'fb93cbaababe',
            _type: 'designer',
            name: 'Will Miller',
            url: 'https://www.instagram.com/q_type/',
          },
        ],
        slug: {
          _type: 'slug',
          current: 'typeforce-12',
        },
        subTitle: 'A jiggling, tuggable, interactive "12" using physics simulations',
        title: 'Typeforce 12',
        video: 'typeforce-12.mp4',
      },
      {
        _createdAt: '2022-08-10T23:57:55Z',
        _id: '7fe27d4c-9a69-460b-b1bb-114db88c1be5',
        _rev: 'c8tu5pjdnA0Td4xA6gwAyk',
        _type: 'project',
        _updatedAt: '2022-08-17T21:53:37Z',
        body: [
          {
            _key: 'cab5de8ec83c',
            _type: 'block',
            children: [
              {
                _key: 'cb3e5dcc91f9',
                _type: 'span',
                marks: [],
                text: 'A microsite announcing the 9th annual Typeforce Exhibition–"an annual exhibit celebrating wildly talented, emerging typographic artists and designers."  ',
              },
            ],
            markDefs: [],
            style: 'normal',
          },
          {
            _key: 'c8d7e4fec935',
            _type: 'block',
            children: [
              {
                _key: 'c6fbed43ef40',
                _type: 'span',
                marks: [],
                text: "To reflect the chaotic, wild, and innovative energy of the event, Typeforce is always looking to push the envelope with their announcement microsites.  Tom's abstract and gorgeous, abstract 3D explorations were a perfect fit.",
              },
            ],
            markDefs: [],
            style: 'normal',
          },
          {
            _key: '48f14febf9c1',
            _type: 'link',
            text: 'Try it yourself!',
            url: 'https://9.typeforce.com',
          },
          {
            _key: '48aaa839e65c',
            _type: 'block',
            children: [
              {
                _key: '14bf7e370b70',
                _type: 'span',
                marks: [],
                text: 'The site explores a scene centering around a fractured 3D model that changes geometry from jagged to smooth as you move the mouse.  It reflects photography of an invisible world and is staged among wireframe meshes and abstract geometry.  ',
              },
            ],
            markDefs: [],
            style: 'normal',
          },
          {
            _key: '8ae720523d9a',
            _type: 'block',
            children: [
              {
                _key: '6b4c5a854e06',
                _type: 'span',
                marks: [],
                text: 'This was my first foray into three dimensional web development and it was exciting to work with somebody with so much expertise and vision. Tom had this world planned down to the tiniest detail--and it was an exhilerating challenge to keep up. Nudging camera angles, adjusting animation speeds, every detail matters because often the tiniest adjustment brings an experience together!',
              },
            ],
            markDefs: [],
            style: 'normal',
          },
          {
            _key: '6ed032686ec8',
            _type: 'block',
            children: [
              {
                _key: 'f90e5c177890',
                _type: 'span',
                marks: [],
                text: 'The scene is rendered with ',
              },
              {
                _key: 'c4fda79c6d4c',
                _type: 'span',
                marks: [
                  '8e18fa78d04a',
                ],
                text: 'three.js',
              },
              {
                _key: '9f2ca72e59e7',
                _type: 'span',
                marks: [],
                text: " and we were able to directly import Tom's handcrafted geometries.",
              },
            ],
            markDefs: [
              {
                _key: '8e18fa78d04a',
                _type: 'link',
                href: 'https://threejs.org/',
              },
            ],
            style: 'normal',
          },
          {
            _key: 'c30e105d728a',
            _type: 'block',
            children: [
              {
                _key: '6de1caac4140',
                _type: 'span',
                marks: [],
                text: 'Back before new device security protocols made it awkward to do so, the mobile experience was controlled by the tilting the phone.  I miss that sort of interaction!\n',
              },
            ],
            markDefs: [],
            style: 'normal',
          },
        ],
        client: 'Typeforce',
        designers: [
          {
            _key: 'dd461d020829',
            _type: 'designer',
            name: 'Tom Tian',
            url: 'https://tomtian.com/',
          },
        ],
        slug: {
          _type: 'slug',
          current: 'typeforce-9',
        },
        subTitle: 'An abstract 3D geometrical scene featuring a dynamically shattering 9.',
        title: 'Typeforce 9',
        video: 'typeforce-9.mp4',
      },
    ]

  ),
};
