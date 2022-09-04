import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { safeSanityClient } from './sanityClient';

// Get a pre-configured url-builder from your sanity sanityClient
const builder = imageUrlBuilder(safeSanityClient);

// Then we like to make a simple function like this that gives the
// builder an image and returns the builder for you to specify additional
// parameters:
export function getSanityImageUrlFor(source:SanityImageSource) {
  return builder.image(source);
}

// function urlFor(source) {
//   return builder.image(source)
// }
