import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  toolbar: {
    position: 'absolute',
    top: 120,
    right: 10,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    padding: 8,
  },
  colorButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginVertical: 8,
    borderWidth: 2,
  },
  selectedColorButton: {
    borderColor: '#00FFFF',
  },
  unselectedColorButton: {
    borderColor: '#FFFFFF',
  },
  undoButton: {
    marginVertical: 8,
  },
});
