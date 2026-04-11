import { describe, expect, it } from 'vitest';

import { buildLanzamientosSanityState } from './lanzamientos.utils';

describe('buildLanzamientosSanityState', () => {
  const firstImage = {
    _key: 'launch-1',
    alt: 'Imagen principal',
    url: 'https://cdn.sanity.io/images/proj/dataset/launch-1.jpg',
    lqip: 'data:image/jpeg;base64,first',
    asset: { _type: 'reference', _ref: 'image-launch-1-1200x800-jpg' },
  };

  const secondImage = {
    _key: 'launch-2',
    alt: 'Segunda imagen',
    url: 'https://cdn.sanity.io/images/proj/dataset/launch-2.jpg',
    asset: { _type: 'reference', _ref: 'image-launch-2-1200x800-jpg' },
  };

  it('returns only the first image when Sanity provides an images array', () => {
    const state = buildLanzamientosSanityState({
      _id: 'launch-doc',
      _type: 'lanzamientosPost',
      images: [firstImage, secondImage],
    });

    expect(state.hasImage).toBe(true);
    expect(state.image?.url).toBe(firstImage.url);
    expect(state.image?.alt).toBe('Imagen principal');
    expect(state.image?.lqip).toBe(firstImage.lqip);
  });

  it('falls back to mainImage when the images array is absent', () => {
    const state = buildLanzamientosSanityState({
      _id: 'launch-doc',
      _type: 'lanzamientosPost',
      mainImage: {
        alt: 'Fallback image',
        url: 'https://cdn.sanity.io/images/proj/dataset/fallback.jpg',
        asset: { _type: 'reference', _ref: 'image-fallback-1200x800-jpg' },
      },
    });

    expect(state.hasImage).toBe(true);
    expect(state.image?.url).toContain('fallback.jpg');
    expect(state.image?.alt).toBe('Fallback image');
  });

  it('keeps placeholder mode when images[0] is absent even if later items exist', () => {
    const state = buildLanzamientosSanityState({
      _id: 'launch-doc',
      _type: 'lanzamientosPost',
      images: [undefined, secondImage],
    });

    expect(state.hasImage).toBe(false);
    expect(state.image).toBeUndefined();
  });

  it('returns placeholder mode when the selected image is missing a usable asset', () => {
    const state = buildLanzamientosSanityState({
      _id: 'launch-doc',
      _type: 'lanzamientosPost',
      images: [
        {
          _key: 'launch-invalid',
          alt: 'Broken image',
          url: 'https://cdn.sanity.io/images/proj/dataset/broken.jpg',
        },
      ],
    });

    expect(state.hasImage).toBe(false);
    expect(state.image).toBeUndefined();
  });
});
