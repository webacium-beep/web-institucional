import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { beforeAll, describe, expect, it } from 'vitest';

const FEATURED_WORLD_MEDIA_PATH = resolve(__dirname, './FeaturedWorldMedia.astro');
const VIDEO_MEDIA_TYPES_PATH = resolve(__dirname, './VideoMedia.types.ts');

describe('FeaturedWorldMedia.astro', () => {
  let templateContent: string;
  let sharedTypesContent: string;

  beforeAll(() => {
    templateContent = readFileSync(FEATURED_WORLD_MEDIA_PATH, 'utf-8');
    sharedTypesContent = readFileSync(VIDEO_MEDIA_TYPES_PATH, 'utf-8');
  });

  it('reuses the shared video media contract', () => {
    expect(templateContent).toContain("import type { VideoMediaProps } from './VideoMedia.types';");
    expect(templateContent).toContain('type Props = VideoMediaProps;');
    expect(sharedTypesContent).toContain('export interface VideoMediaProps');
  });

  it('keeps world media decorative by default while preserving the video API', () => {
    expect(templateContent).toContain("const { fallbackText = 'Video de la sección world pendiente de definición', videoSrc, decorative = true } = Astro.props;");
    expect(templateContent).toContain("const mediaRole = !decorative && fallbackText ? 'img' : undefined;");
    expect(templateContent).toContain("const mediaLabel = !decorative ? fallbackText : undefined;");
    expect(templateContent).toContain('src={videoSrc}');
  });

  it('marks the wrapper as decorative when needed and hides the raw video from assistive tech', () => {
    expect(templateContent).toContain("aria-hidden={decorative ? 'true' : undefined}");
    expect(templateContent).toContain('role={mediaRole}');
    expect(templateContent).toContain('aria-label={mediaLabel}');
    expect(templateContent).toContain('aria-hidden="true"');
  });
});
