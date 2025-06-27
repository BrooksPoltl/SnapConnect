/**
 * GroupDetailsScreen Styles
 * Styling for the group details and member management interface
 */
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  placeholder: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  groupInfoSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  groupAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  groupAvatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '600',
  },
  groupName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  groupMemberCount: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 4,
  },
  groupCreatedDate: {
    fontSize: 14,
    color: '#8E8E93',
  },
  actionsSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
  },
  actionButtonText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  membersSection: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  membersList: {
    flex: 1,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  memberInfo: {
    flex: 1,
    marginLeft: 12,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  memberScore: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  memberJoinDate: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  creatorBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  creatorBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  leaveGroupSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  leaveGroupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    borderRadius: 8,
  },
  leaveGroupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  errorBanner: {
    backgroundColor: '#FFEBEE',
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
    paddingHorizontal: 16,
    paddingVertical: 12,
    margin: 16,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorBannerText: {
    color: '#D32F2F',
    fontSize: 14,
    flex: 1,
  },
  dismissError: {
    color: '#D32F2F',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 12,
  },
});
