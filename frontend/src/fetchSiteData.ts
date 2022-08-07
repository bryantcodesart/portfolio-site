import { getUrlFromProjectSlug } from './getUrlFromProjectSlug';
// import { manuallySavedProjects } from '../manuallySavedProjects';
import { sanityExperimentalTypesafeClient } from './sanity/sanityClient';
import { getSanityImageUrlFor } from './sanity/sanityImageBuilder';
import { Project } from '../generatedSanitySchemaTypes';

export interface HomepageTile {
  title: string|null,
  imageUrl: string|null,
  slug: string|null,
}

export interface NavLinks {
  projects: {
    title: string,
    url: string,
  }[]
}
export async function fetchSiteData() {
  const projects:Project[] = await sanityExperimentalTypesafeClient.getAll('project');
  // const projects:Project[] = manuallySavedProjects as Project[];

  // console.log(JSON.stringify(projects, null, 2));

  const allHomepageTiles = projects.map((project) => {
    const getImageUrl = () => {
      if (project.homepageThumbnail?.image) {
        return getSanityImageUrlFor(project.homepageThumbnail.image)
          .focalPoint(0.5, 0.5).width(500).height(500)
          .url();
      }
      return null;
    };
    return {
      title: project.title ?? null,
      imageUrl: getImageUrl(),
      slug: project?.slug?.current ?? null,
    };
  });
  const N_FEATURED_PROJECTS = 8;
  const homepageTiles = (new Array(N_FEATURED_PROJECTS)).fill(undefined)
    .map((_, index) => allHomepageTiles[index % allHomepageTiles.length]);

  const navLinks = {
    projects: projects.map((project) => ({
      title: project.title ?? '',
      url: getUrlFromProjectSlug(project?.slug?.current ?? ''),
    })),
  };

  return { projects, homepageTiles, navLinks };
}
