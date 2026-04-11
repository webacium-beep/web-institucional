import type {
  AboutPostMainImage,
  LanzamientosPost,
  LanzamientosSectionImage,
  LanzamientosSectionSanityState,
  RawGalleryImage,
  SanityImageSource,
} from './types';

function resolveAssetRef(asset: SanityImageSource | Record<string, unknown> | undefined): string | undefined {
  if (!asset || typeof asset !== 'object') return undefined;

  const record = asset as Record<string, unknown>;

  if (typeof record['_ref'] === 'string' && record['_ref'].length > 0) return record['_ref'];
  if (typeof record['_id'] === 'string' && record['_id'].length > 0) return record['_id'];

  return undefined;
}

function buildImageSource(asset: SanityImageSource | Record<string, unknown> | undefined): SanityImageSource | undefined {
  const ref = resolveAssetRef(asset);

  if (!ref) return undefined;

  return {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: ref,
    },
  } as SanityImageSource;
}

function hasUsableUrl(url: string | undefined): url is string {
  return typeof url === 'string' && url.length > 0;
}

function toSectionImage(candidate: RawGalleryImage | AboutPostMainImage | undefined): LanzamientosSectionImage | undefined {
  if (!candidate || !hasUsableUrl(candidate.url)) return undefined;

  const source = buildImageSource(candidate.asset);

  if (!source) return undefined;

  return {
    url: candidate.url,
    alt: candidate.alt ?? '',
    source,
    lqip: candidate.lqip,
  };
}

export function buildLanzamientosSanityState(
  post: LanzamientosPost | null | undefined
): LanzamientosSectionSanityState {
  if (!post) return { hasImage: false };

  const firstArrayImage = post.images?.[0];
  if (post.images) {
    const image = toSectionImage(firstArrayImage);
    return image ? { hasImage: true, image } : { hasImage: false };
  }

  const fallbackImage = toSectionImage(post.mainImage);
  return fallbackImage ? { hasImage: true, image: fallbackImage } : { hasImage: false };
}
