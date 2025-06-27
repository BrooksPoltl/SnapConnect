/**
 * GroupConversationScreen Styles
 * Styling for the group chat interface
 */
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    backgroundColor: '#000000',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  groupName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  memberCount: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  detailsButton: {
    padding: 8,
    marginLeft: 8,
  },
  messagesList: {
    flex: 1,
    backgroundColor: '#000000',
  },
  messagesContent: {
    paddingVertical: 16,
  },
  messageContainer: {
    marginHorizontal: 16,
    marginVertical: 4,
  },
  ownMessageContainer: {
    alignItems: 'flex-end',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  senderName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
    marginLeft: 8,
  },
  messageBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxWidth: '80%',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  ownMessageBubble: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  messageText: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 20,
  },
  ownMessageText: {
    color: '#FFFFFF',
  },
  messageTime: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
    textAlign: 'right',
  },
  ownMessageTime: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  sendingStatus: {
    fontSize: 12,
    color: '#8E8E93',
    fontStyle: 'italic',
    marginTop: 2,
    textAlign: 'right',
  },
  failedStatus: {
    fontSize: 12,
    color: '#FF3B30',
    fontStyle: 'italic',
    marginTop: 2,
    textAlign: 'right',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 8,
  },
  errorContainer: {
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
  errorText: {
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#000000',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#F2F2F7',
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D1D1D6',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
