import type {
  SanityReference,
  SanityKeyedReference,
  SanityAsset,
  SanityImage,
  SanityFile,
  SanityGeoPoint,
  SanityBlock,
  SanityDocument,
  SanityImageCrop,
  SanityImageHotspot,
  SanityKeyed,
  SanityImageAsset,
  SanityImageMetadata,
  SanityImageDimensions,
  SanityImagePalette,
  SanityImagePaletteSwatch,
} from "sanity-codegen";

export type {
  SanityReference,
  SanityKeyedReference,
  SanityAsset,
  SanityImage,
  SanityFile,
  SanityGeoPoint,
  SanityBlock,
  SanityDocument,
  SanityImageCrop,
  SanityImageHotspot,
  SanityKeyed,
  SanityImageAsset,
  SanityImageMetadata,
  SanityImageDimensions,
  SanityImagePalette,
  SanityImagePaletteSwatch,
};

/**
 * Project
 *
 *
 */
export interface Project extends SanityDocument {
  _type: "project";

  /**
   * Title — `string`
   *
   *
   */
  title?: string;

  /**
   * URL Slug — `slug`
   *
   * The URL safe version of the title that will be used for the permalink
   */
  slug?: { _type: "slug"; current: string };

  /**
   * Summary — `array`
   *
   * Short project summary that can be revealed by user.
   */
  summary?: Array<SanityKeyed<SanityBlock>>;

  /**
   * Homepage Thumbnail — `imageFigure`
   *
   * Image that appears on the homepage sliding tile board, ideally square aspect ratio.
   */
  homepageThumbnail?: ImageFigure;

  /**
   * Showcase — `array`
   *
   * Vimeo and image figures that showcase the project
   */
  showcase?: Array<SanityKeyed<ImageFigure> | SanityKeyed<VimeoFigure>>;
}

export type ImageFigure = {
  _type: "imageFigure";
  /**
   * Image — `image`
   *
   * Images should be large and high quality. (Don't worry about size.  They will be sized/optimized by the code.)
   */
  image?: {
    _type: "image";
    asset: SanityReference<SanityImageAsset>;
    crop?: SanityImageCrop;
    hotspot?: SanityImageHotspot;
  };

  /**
   * Alt Text — `string`
   *
   * Copy that describes the image for those who cannot see it – e.g. users without sight and SEO robots.
   */
  alt?: string;
};

export type VimeoFigure = {
  _type: "vimeoFigure";
  /**
   * Thumbnail — `image`
   *
   *
   */
  thumbnail?: {
    _type: "image";
    asset: SanityReference<SanityImageAsset>;
    crop?: SanityImageCrop;
    hotspot?: SanityImageHotspot;
  };

  /**
   * Vimeo ID — `string`
   *
   * The ID can be found as part of the URL
   */
  vimeoId?: string;

  /**
   * Alt Text — `string`
   *
   * Copy that describes the thumbnail for those who cannot see it – e.g. users without sight and SEO robots.
   */
  alt?: string;
};

export type Documents = Project;
