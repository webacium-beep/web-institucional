import type { CommercialFormatId } from "../../data/formatGallery";

export interface WorldFormatsGalleryItemView {
  id: CommercialFormatId;
  label: string;
  alt: string;
  image: {
    src: string;
    width: number;
    height: number;
  };
}

export interface WorldFormatsGalleryIslandProps {
  items: readonly WorldFormatsGalleryItemView[];
}
