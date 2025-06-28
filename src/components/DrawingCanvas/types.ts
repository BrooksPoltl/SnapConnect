import { SkPath } from '@shopify/react-native-skia';

export interface PathWithColor {
  path: SkPath;
  color: string;
  strokeWidth: number;
}
