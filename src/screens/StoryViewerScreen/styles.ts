import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Black background for immersion
    justifyContent: 'center',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  username: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 24,
  },
  media: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
  },
  closeButton: {
    padding: 10,
  },
});
