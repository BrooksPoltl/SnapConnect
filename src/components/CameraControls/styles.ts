import { StyleSheet } from 'react-native';

import { Theme } from '../../types/theme';

export const styles = (_theme: Theme) =>
  StyleSheet.create({
    cameraContainer: {
      flex: 1,
    },
    camera: {
      flex: 1,
    },
  });
