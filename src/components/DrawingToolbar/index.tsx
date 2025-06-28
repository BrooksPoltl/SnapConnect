import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import styles from './styles';
import Icon from '../Icon';

const COLORS = ['#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF'];

interface DrawingToolbarProps {
  onColorChange: (color: string) => void;
  onUndo: () => void;
  selectedColor: string;
}

const DrawingToolbar: React.FC<DrawingToolbarProps> = ({
  onColorChange,
  onUndo,
  selectedColor,
}) => (
  <View style={styles.toolbar}>
    {COLORS.map(color => (
      <TouchableOpacity
        key={color}
        style={[
          styles.colorButton,
          selectedColor === color ? styles.selectedColorButton : styles.unselectedColorButton,
          { backgroundColor: color },
        ]}
        onPress={() => onColorChange(color)}
      />
    ))}
    <TouchableOpacity style={styles.undoButton} onPress={onUndo}>
      <Icon name='rotate-ccw' size={30} color='white' />
    </TouchableOpacity>
  </View>
);

export default DrawingToolbar;
