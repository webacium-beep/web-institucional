import type { ImageMetadata } from 'astro';
import newsroomImage1 from '../assets/section_new_room_images/NOWROOM_1.jpg';
import newsroomImage2 from '../assets/section_new_room_images/NOWROOM_2.jpg';
import newsroomImage3 from '../assets/section_new_room_images/NOWROOM_3.jpg';
import newsroomImage4 from '../assets/section_new_room_images/NEWROOM_4.jpg';
import newsroomImage5 from '../assets/section_new_room_images/NOWROOM_05.jpg';

export interface NewsroomGalleryItem {
  id: string;
  imageSrc: ImageMetadata;
}

export const newsroomGalleryItems: NewsroomGalleryItem[] = [
  {
    id: 'newsroom-1',
    imageSrc: newsroomImage1,
  },
  {
    id: 'newsroom-2',
    imageSrc: newsroomImage2,
  },
  {
    id: 'newsroom-3',
    imageSrc: newsroomImage3,
  },
  {
    id: 'newsroom-4',
    imageSrc: newsroomImage4,
  },
  {
    id: 'newsroom-5',
    imageSrc: newsroomImage5,
  },
];
