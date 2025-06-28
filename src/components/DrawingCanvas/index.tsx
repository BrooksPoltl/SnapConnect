import React, { useCallback } from 'react';
import { Canvas, Path, Skia } from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { PathWithColor } from './types';
import styles from './styles';

interface DrawingCanvasProps {
  paths: PathWithColor[];
  setPaths: React.Dispatch<React.SetStateAction<PathWithColor[]>>;
  color: string;
  strokeWidth: number;
  isEnabled?: boolean;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  paths,
  setPaths,
  color,
  strokeWidth,
  isEnabled = true,
}) => {
  const onDrawingStart = useCallback(
    (x: number, y: number) => {
      setPaths(currentPaths => {
        const newPath: PathWithColor = {
          path: Skia.Path.Make(),
          color,
          strokeWidth,
        };
        newPath.path.moveTo(x, y);
        return [...currentPaths, newPath];
      });
    },
    [color, strokeWidth, setPaths],
  );

  const onDrawingActive = useCallback(
    (x: number, y: number) => {
      setPaths(currentPaths => {
        const lastPath = currentPaths[currentPaths.length - 1];
        if (lastPath) {
          lastPath.path.lineTo(x, y);
          return [...currentPaths.slice(0, currentPaths.length - 1), lastPath];
        }
        return currentPaths;
      });
    },
    [setPaths],
  );

  const panGesture = Gesture.Pan()
    .enabled(isEnabled)
    .onStart(event => {
      'worklet';
      runOnJS(onDrawingStart)(event.x, event.y);
    })
    .onUpdate(event => {
      'worklet';
      runOnJS(onDrawingActive)(event.x, event.y);
    });

  return (
    <GestureDetector gesture={panGesture}>
      <Canvas style={styles.canvas}>
        {paths.map((pathWithColor, index) => (
          <Path
            key={index}
            path={pathWithColor.path}
            color={pathWithColor.color}
            style='stroke'
            strokeWidth={pathWithColor.strokeWidth}
          />
        ))}
      </Canvas>
    </GestureDetector>
  );
};

export default DrawingCanvas;
