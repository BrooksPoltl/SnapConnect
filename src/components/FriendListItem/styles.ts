/**
 * FriendListItem Styles
 * Consistent styling for friend/member list items across all screens
 */
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E', // Dark surface color
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#38383A', // Dark border color
  },
  selectedContainer: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  score: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 2,
  },
  rightElement: {
    marginLeft: 8,
  },
  selectedIndicator: {
    marginLeft: 8,
  },
});
