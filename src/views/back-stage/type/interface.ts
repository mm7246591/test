interface Position {
  x: number;
  y: number;
}

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Size {
  width: number;
  height: number;
}

interface SourceImage {
  id: string;
  src: string;
}

interface ImageForm {
  name: string;
  description: string;
}

interface PlacedItem {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  description: string;
}

export type { Position, Rect, Size, SourceImage, ImageForm, PlacedItem };
