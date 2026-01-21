export interface StyleDefinition {
  id: string;
  name: string;
  description: string;
  prompt: string;
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface GeneratedImage {
  styleId: string;
  imageUrl: string | null;
  status: GenerationStatus;
  error?: string;
}

export type AspectRatio = '1:1' | '3:4' | '16:9';

export interface GenerationConfig {
  aspectRatio: AspectRatio;
}