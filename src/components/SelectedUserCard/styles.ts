/**
 * SelectedUserCard Styles
 * Styling for the selected user card component
 */
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: 12,
    marginTop: 6, // Add top margin to prevent remove button from being cut off
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#1C1C1E', // Dark surface color to match FriendListItem
    borderRadius: 12,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#38383A', // Dark border color to match FriendListItem
  },
  username: {
    fontSize: 12,
    color: '#FFFFFF', // White text for dark theme
    marginTop: 4,
    marginBottom: 2,
    textAlign: 'center',
  },
  removeButton: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF3B30', // Red background for better visibility
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FF3B30', // Match background
  },
});
