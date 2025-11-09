# Delete Message Feature Documentation

## Overview
Added the ability for students and mentors to delete their own messages in chat conversations. This provides users with control over their conversation history and the ability to remove unwanted or mistaken messages.

## Features Implemented

### Backend API Endpoint

#### Delete Message
```
DELETE /api/messages/:id
```
- Removes message from `messages.json`
- Returns success message
- Returns 404 if message not found
- Permanently deletes the message

### Frontend Integration

#### ChatWindow Component
- **Delete Button**: Appears on hover for user's own messages
- **Icon**: Small trash icon (12px) from Lucide React
- **Position**: Top-right corner of message bubble
- **Visibility**: Hidden by default, appears on hover
- **Permission**: Only visible for messages sent by current user
- **Confirmation**: Requires user confirmation before deletion

### User Experience

#### Visual Design
- Delete button uses `opacity-0` and appears with `group-hover:opacity-100`
- Smooth transition effect
- Positioned absolutely within message bubble
- Styled to match message background
- Dark mode support

#### Interaction Flow
1. User hovers over their own message
2. Delete button fades in
3. User clicks delete button
4. Confirmation dialog appears: "Are you sure you want to delete this message?"
5. On confirmation: Message deleted from backend and UI
6. On cancel: Dialog closes, no action taken

## Implementation Details

### 1. Backend (server.js)

```javascript
// Delete message
app.delete('/api/messages/:id', async (req, res) => {
  try {
    const messages = await readJSON(MESSAGES_FILE);
    const { id } = req.params;

    const index = messages.findIndex(m => m.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Message not found' });
    }

    messages.splice(index, 1);
    await writeJSON(MESSAGES_FILE, messages);

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
});
```

### 2. API Service (src/services/api.js)

```javascript
// Messages API
export const messagesAPI = {
  getAll: () => apiCall('/messages'),
  
  send: (from, to, text) =>
    apiCall('/messages', {
      method: 'POST',
      body: JSON.stringify({ from, to, text }),
    }),
  
  delete: (messageId) =>
    apiCall(`/messages/${messageId}`, {
      method: 'DELETE',
    }),
};
```

### 3. State Management (src/state/AppContext.jsx)

```javascript
const deleteMessage = async (messageId) => {
  try {
    await messagesAPI.delete(messageId)
    setMessages(prev => prev.filter(m => m.id !== messageId))
    return { success: true }
  } catch (error) {
    console.error('Failed to delete message:', error)
    throw error
  }
}
```

**Exported in context:**
```javascript
messages, sendMessage, deleteMessage,
```

### 4. UI Component (src/components/ChatWindow.jsx)

**Message Rendering:**
```javascript
<div className={`max-w-[75%] px-3 py-2 rounded-lg group relative ${m.from===user.id? 'bg-primary-600 text-white self-end ml-auto':'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200'}`}>
  <p className="text-sm pr-6">{m.text}</p>
  <div className="text-[10px] opacity-70 mt-1">{new Date(m.ts).toLocaleString()}</div>
  {m.from === user.id && (
    <button
      onClick={() => handleDeleteMessage(m.id)}
      className={`absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${m.from===user.id? 'hover:bg-primary-700':'hover:bg-slate-200 dark:hover:bg-slate-600'}`}
      title="Delete message"
    >
      <Trash2 size={12} />
    </button>
  )}
</div>
```

**Delete Handler:**
```javascript
const handleDeleteMessage = async (messageId) => {
  const confirmed = window.confirm('Are you sure you want to delete this message?')
  if (confirmed) {
    try {
      await deleteMessage(messageId)
    } catch (error) {
      alert('Failed to delete message. Please try again.')
    }
  }
}
```

## Permission System

### Who Can Delete?
- ✅ **User's Own Messages**: Users can delete messages they sent
- ❌ **Other's Messages**: Users cannot delete messages sent by others

### Implementation
```javascript
{m.from === user.id && (
  <button>Delete</button>
)}
```

This ensures only the message sender sees the delete button.

## Data Flow

```
User hovers over message
      ↓
Delete button appears (CSS transition)
      ↓
User clicks delete button
      ↓
Confirmation dialog
      ↓
User confirms
      ↓
Frontend: deleteMessage(messageId)
      ↓
API: DELETE /api/messages/:id
      ↓
Backend: Remove from messages.json
      ↓
Backend: Save file
      ↓
Frontend: Update state (filter out deleted message)
      ↓
UI: Message removed from screen
```

## Safety Features

### 1. Confirmation Dialog
- Prevents accidental deletion
- Clear warning message
- Cancel option available

### 2. Error Handling
- Backend validates message exists
- Frontend catches errors
- User-friendly error messages
- Failed deletions don't affect UI

### 3. Permission Check
- Only message sender can delete
- Delete button hidden for other users' messages
- Backend could add additional user validation

## UI/UX Details

### Message Bubble Styling

**User's Own Message (with delete button):**
```
┌─────────────────────────────────┐
│ Hello! How are you?         [🗑️] │ ← Button appears on hover
│ 11/9/2025, 4:00:00 PM           │
└─────────────────────────────────┘
```

**Other User's Message (no delete button):**
```
┌─────────────────────────────────┐
│ I'm good, thanks!                │
│ 11/9/2025, 4:01:00 PM           │
└─────────────────────────────────┘
```

### Dark Mode Support
- Delete button visible in dark mode
- Hover states adapted for dark backgrounds
- Message text contrast maintained

## Testing the Feature

### Test Case 1: Delete Own Message
1. Login as a student
2. Open Messages page
3. Send a message to a mentor
4. Hover over your message
5. Click the delete button (trash icon)
6. Confirm deletion
7. ✅ Message disappears from chat
8. ✅ Check `messages.json` - message removed

### Test Case 2: Cannot Delete Other's Messages
1. Login as student
2. View messages from mentor
3. Hover over mentor's message
4. ✅ No delete button appears
5. ✅ Cannot delete other user's messages

### Test Case 3: Confirmation Dialog
1. Send a message
2. Click delete button
3. Click "Cancel" in confirmation dialog
4. ✅ Message remains in chat
5. Click delete again
6. Click "OK"
7. ✅ Message deleted

### Test Case 4: Error Handling
1. Delete a message
2. Try to delete the same message ID again (simulate error)
3. ✅ Error message displayed
4. ✅ UI remains stable

## Current Message Data Structure

```json
{
  "id": "1762682108081",
  "threadId": "m1-stu_1762681632128",
  "from": "stu_1762681632128",
  "to": "m1",
  "text": "hiii",
  "ts": "2025-11-09T09:55:08.081Z"
}
```

**After Deletion:** Entry completely removed from array.

## Benefits

### 1. **User Control**
- Users can remove mistaken messages
- Delete inappropriate or incorrect content
- Maintain clean conversation history

### 2. **Privacy**
- Remove sensitive information
- Control what remains in chat history
- Better data management

### 3. **Professional**
- Fix typos or mistakes
- Remove draft messages sent by accident
- Maintain professional communication

### 4. **Trust**
- Users feel in control
- Reduces anxiety about messaging
- Encourages more open communication

## Limitations & Considerations

### Current Limitations

1. **No Edit Feature**: Can only delete, not edit messages
2. **No "Deleted" Marker**: Message completely disappears (no "This message was deleted" placeholder)
3. **Permanent Deletion**: No undo or recovery option
4. **No Notification**: Other user doesn't know message was deleted
5. **No Deletion History**: No log of deleted messages

### Future Enhancements

1. **Soft Delete**: Keep deleted messages with `deleted: true` flag
2. **Deleted Marker**: Show "Message deleted" placeholder
3. **Edit Feature**: Allow editing instead of just deletion
4. **Delete for Everyone**: Option to delete message from both sides
5. **Time Limit**: Only allow deletion within X minutes of sending
6. **Undo Feature**: Allow undoing deletion within short window
7. **Admin Override**: Allow admins to view/restore deleted messages
8. **Bulk Delete**: Delete entire conversation at once

## Security Considerations

### Current Implementation
- ✅ Frontend checks: Only show delete button for own messages
- ⚠️ Backend needs: Should validate user owns the message

### Recommended Backend Enhancement
```javascript
app.delete('/api/messages/:id', async (req, res) => {
  try {
    const messages = await readJSON(MESSAGES_FILE);
    const { id } = req.params;
    const { userId } = req.body; // Pass current user ID

    const message = messages.find(m => m.id === id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Verify user owns the message
    if (message.from !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const index = messages.findIndex(m => m.id === id);
    messages.splice(index, 1);
    await writeJSON(MESSAGES_FILE, messages);

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
});
```

## Files Modified

1. ✅ **server/server.js** - Added DELETE endpoint (lines 261-279)
2. ✅ **src/services/api.js** - Added delete function to messagesAPI
3. ✅ **src/state/AppContext.jsx** - Added deleteMessage function and context export
4. ✅ **src/components/ChatWindow.jsx** - Added delete button UI and handler

## API Usage Example

### Delete a Message
```javascript
// From frontend
await messagesAPI.delete('1762682108081')

// Backend request
DELETE http://localhost:5000/api/messages/1762682108081

// Backend response (success)
{
  "message": "Message deleted successfully"
}

// Backend response (not found)
{
  "error": "Message not found"
}
```

## Hackathon Demo Points

**Show the judges:**
1. ✅ "Users can delete their own messages"
2. ✅ "Hover interaction with smooth animations"
3. ✅ "Confirmation dialog prevents accidents"
4. ✅ "Permission system - can't delete others' messages"
5. ✅ "Real-time UI updates"
6. ✅ Demo: Send message → Hover → Delete → Gone!

**Key Selling Points:**
- User control and privacy
- Professional messaging system
- Smooth UX with hover interactions
- Safety with confirmation dialogs
- Dark mode support

## Accessibility

- ✅ Button has `title` attribute for tooltip
- ✅ Keyboard accessible (can tab to button)
- ✅ Clear confirmation dialog
- ⚠️ Consider: Screen reader announcements when message deleted
- ⚠️ Consider: Keyboard shortcut for delete

## Performance

- ✅ Efficient: Only filters array on delete
- ✅ Fast: Direct file write in backend
- ✅ Smooth: CSS transitions for hover effect
- ✅ Scalable: Works with large message lists

Your MentorConnect platform now has a complete message management system with delete functionality! 🗑️✨
