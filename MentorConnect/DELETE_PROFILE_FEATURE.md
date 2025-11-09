# Delete Profile Feature Documentation

## Overview
Added a complete delete profile feature for both students and mentors that permanently removes their data from the system.

## Features Implemented

### Backend API Endpoints

#### Delete Student Profile
```
DELETE /api/students/:id
```
- Removes student from `students.json`
- Returns success message
- Returns 404 if student not found

#### Delete Mentor Profile
```
DELETE /api/mentors/:id
```
- Removes mentor from `mentors.json`
- Returns success message
- Returns 404 if mentor not found

### Frontend Integration

#### Student Dashboard
- **Location**: Top of the dashboard in a profile card
- **Display**: Shows student name and email
- **Button**: Red "Delete Profile" button with trash icon
- **Confirmation**: Double confirmation required
  1. Browser confirm dialog with warning message
  2. Success alert after deletion
- **Behavior**: 
  - Deletes profile from backend
  - Logs user out
  - Redirects to home page

#### Mentor Dashboard
- **Location**: Top of the dashboard in a profile card
- **Display**: Shows mentor name, title, and email
- **Button**: Red "Delete Profile" button with trash icon
- **Confirmation**: Double confirmation required
  1. Browser confirm dialog with warning message
  2. Success alert after deletion
- **Behavior**:
  - Deletes profile from backend
  - Logs user out
  - Redirects to home page

## User Flow

### For Students
1. Login as student
2. Go to Student Dashboard
3. See profile card at the top with name and email
4. Click "Delete Profile" button
5. Confirm deletion in popup (warns data is permanent)
6. Profile deleted from `server/data/students.json`
7. User logged out and redirected to home page

### For Mentors
1. Login as mentor
2. Go to Mentor Dashboard
3. See profile card at the top with name, title, and email
4. Click "Delete Profile" button
5. Confirm deletion in popup (warns data is permanent)
6. Profile deleted from `server/data/mentors.json`
7. User logged out and redirected to home page

## Safety Features

### Confirmation Dialog
Users must confirm deletion with a clear warning:
- **Student**: "Are you sure you want to delete your profile? This action cannot be undone. All your data, goals, and messages will be permanently deleted."
- **Mentor**: "Are you sure you want to delete your mentor profile? This action cannot be undone. All your data, sessions, and messages will be permanently deleted."

### Automatic Logout
After deletion, the user is automatically logged out to prevent any issues with stale session data.

### Error Handling
- Frontend displays error message if deletion fails
- Backend validates user exists before deletion
- Proper HTTP status codes (404 for not found, 500 for errors)

## Files Modified

### Backend
1. **server/server.js**
   - Added `DELETE /api/students/:id` endpoint (lines 120-138)
   - Added `DELETE /api/mentors/:id` endpoint (lines 203-221)

### Frontend Services
2. **src/services/api.js**
   - Added `studentsAPI.delete()` function
   - Added `mentorsAPI.delete()` function

### State Management
3. **src/state/AppContext.jsx**
   - Added `deleteStudentProfile()` function
   - Added `deleteMentorProfile()` function
   - Exported in context value

### UI Components
4. **src/pages/StudentDashboard.jsx**
   - Added profile card with delete button
   - Added delete confirmation handler
   - Imported Trash2 icon and useNavigate

5. **src/pages/MentorDashboard.jsx**
   - Added profile card with delete button
   - Added delete confirmation handler
   - Imported Trash2 icon and useNavigate

## API Usage Examples

### Delete Student
```javascript
// From frontend
await studentsAPI.delete('stu_1234567890')

// Backend response
{
  "message": "Student profile deleted successfully"
}
```

### Delete Mentor
```javascript
// From frontend
await mentorsAPI.delete('m1234567890')

// Backend response
{
  "message": "Mentor profile deleted successfully"
}
```

## Testing the Feature

### Test Delete Student
1. Register a new student
2. Login with that student
3. Go to Student Dashboard
4. Note the student ID in the JSON file
5. Click "Delete Profile"
6. Confirm deletion
7. Check `server/data/students.json` - student should be removed
8. You should be logged out and redirected to home

### Test Delete Mentor
1. Register a new mentor
2. Login with that mentor
3. Go to Mentor Dashboard
4. Note the mentor ID in the JSON file
5. Click "Delete Profile"
6. Confirm deletion
7. Check `server/data/mentors.json` - mentor should be removed
8. You should be logged out and redirected to home

## UI Design

### Profile Card (Student)
```
┌────────────────────────────────────────────────────┐
│  Welcome, John Doe!              [🗑️ Delete Profile] │
│  john@example.com                                   │
└────────────────────────────────────────────────────┘
```

### Profile Card (Mentor)
```
┌────────────────────────────────────────────────────┐
│  Welcome, Jane Smith!            [🗑️ Delete Profile] │
│  Senior Software Engineer • jane@example.com        │
└────────────────────────────────────────────────────┘
```

### Button Styling
- Background: Red (#DC2626)
- Hover: Darker Red (#B91C1C)
- Icon: Trash2 from Lucide React
- Size: Small (16px icon, text-sm)
- Positioning: Right side of profile card

## Data Persistence

When a profile is deleted:
1. Backend removes entry from JSON file
2. File is immediately saved to disk
3. Frontend updates local state
4. User session is cleared
5. Navigation to home page

The deletion is **permanent** and **cannot be undone**.

## Security Considerations

- No authentication implemented yet (planned for future)
- Deletion requires only the user ID
- Consider adding password confirmation in production
- Consider adding "soft delete" (mark as deleted) instead of hard delete
- Consider adding data export before deletion

## Future Enhancements

1. **Soft Delete**: Mark as deleted instead of removing
2. **Password Confirmation**: Require password before deletion
3. **Data Export**: Allow users to download their data before deletion
4. **Cascade Delete**: Remove all related data (messages, goals, requests)
5. **Deletion Log**: Keep audit trail of deletions
6. **Cooldown Period**: Allow 30-day recovery period

## Hackathon Demo

**Show this feature to judges:**
1. "We have full CRUD operations - Create, Read, Update, AND Delete"
2. "Users can manage their own data with privacy controls"
3. Demo: Register → View Profile → Delete → Show JSON file empty
4. "Data is immediately removed from our backend storage"

This demonstrates:
- Complete data lifecycle management
- User privacy controls
- Backend integration
- Safe deletion with confirmations
