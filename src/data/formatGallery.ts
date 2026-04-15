import type { ImageMetadata } from "astro";
import type { WorldSectionData } from "../i18n/ui";
// Imports de los assets reales (SVG)
import kioskImg from "../assets/images/kiosk.svg";
import standImg from "../assets/images/stand.svg";
import storeImg from "../assets/images/store.svg";
import showroomImg from "../assets/images/showroom.svg";

export type CommercialFormatId = "kiosk" | "stand" | "store" | "showroom";

export interface FormatGalleryItem {
  id: CommercialFormatId;
  labelKey: keyof WorldSectionData;
  imageSrc: ImageMetadata; // El tipo de imagen en Astro
  altKey: keyof WorldSectionData;
}

export const commercialFormats: FormatGalleryItem[] = [
  {
    id: "kiosk",
    labelKey: "world.format.kiosk",
    imageSrc: kioskImg,
    altKey: "world.format.kiosk",
  },
  {
    id: "stand",
    labelKey: "world.format.stand",
    imageSrc: standImg,
    altKey: "world.format.stand",
  },
  {
    id: "store",
    labelKey: "world.format.store",
    imageSrc: storeImg,
    altKey: "world.format.store",
  },
  {
    id: "showroom",
    labelKey: "world.format.showroom",
    imageSrc: showroomImg,
    altKey: "world.format.showroom",
  },
];
