import { StyleDefinition } from './types';

export const APP_NAME = "NanoPortrait Studio";

export const STYLES: StyleDefinition[] = [
  {
    id: 'corporate',
    name: 'Corporate Headshot',
    description: 'Professional, confident, sharp focus.',
    prompt: "A professional corporate headshot of the person in the uploaded photo, high resolution, realistic lighting, neutral background, sharp focus, confident and approachable expression.",
  },
  {
    id: 'fashion',
    name: 'Fashion Portrait',
    description: 'Trendy, vibrant, editorial look.',
    prompt: "A stylish fashion portrait of the person, full-body or half-body, studio lighting, trendy clothing, modern editorial look, vibrant colors, high fashion style.",
  },
  {
    id: 'art_gallery',
    name: 'Lost in the Gallery',
    description: 'Moody, painterly, cinematic composition.',
    prompt: "Artistic portrait of the person wandering inside a museum, soft lighting, thoughtful pose, cinematic composition, painterly style, moody and artistic atmosphere.",
  },
  {
    id: 'bw_art',
    name: 'B&W Artistic',
    description: 'High contrast, dramatic, elegant.',
    prompt: "Black and white artistic portrait of the person, high contrast, dramatic lighting, fine art photography style, elegant and expressive.",
  },
  {
    id: 'magazine',
    name: 'Magazine Cover',
    description: 'Bold, polished, studio lighting.',
    prompt: "American magazine cover style portrait of the person, vibrant and polished, professional studio lighting, bold typography background optional, high fashion editorial.",
  },
  {
    id: 'cinematic',
    name: 'Cinematic',
    description: 'Film-like, moody, movie poster style.',
    prompt: "Cinematic portrait of the person, moody lighting, film-like color grading, dramatic composition, high-resolution, inspired by movie poster photography.",
  },
];