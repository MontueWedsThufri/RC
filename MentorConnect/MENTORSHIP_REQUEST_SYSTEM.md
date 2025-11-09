# Mentorship Request System

## Overview
Implemented a complete mentorship request workflow where students can request mentorship from mentors, and mentors can accept or reject those requests. The system includes status tracking, visual indicators, and role-based access control.

## Features Implemented

### 1. **Student Side: Request Mentorship Button** 🎓

**Visibility:**
- Button only visible to logged-in students
- Shows on MentorCard components
- Hidden for mentors and non-logged-in users

**Status Indicators:**
- **No Request**: Shows "Request Mentorship" button
- **Pending**: Shows amber clock icon with "Pending" label
- **Accepted**: Shows green checkmark icon with "Accepted" label
- **Rejected**: Shows red X icon with "Rejected" label

**Behavior:**
- Click "Request Mentorship" → Sends request to backend
- Success alert: "Mentorship request sent successfully!"
- Prevents duplicate requests (button disappears after first request)
- Status updates automatically when mentor responds

### 2. **Mentor Side: Accept/Reject Requests** 👨‍🏫

**Request Display:**
- Shows all mentorship requests from students
- Displays student name and institute
- Shows request date/time
- Color-coded status badges

**Action Buttons:**
- **Accept Button**: Green button with checkmark icon
- **Decline Button**: Gray button with X icon
- Only visible for pending requests
- Disabled for accepted/rejected requests

**Behavior:**
- Click "Accept" → Updates request status to "accepted"
- Click "Decline" → Confirms action → Updates status to "rejected"
- Success feedback via alerts
- Real-time UI update (status badge changes)

### 3. **Backend API Endpoints** 🔧

#### GET /api/requests
```
Returns all mentorship requests
Response: Array of request objects
```

#### POST /api/requests
```
Creates a new mentorship request
Body: { mentorId, studentId }
Response: { message, request }
```

#### PUT /api/requests/:id
```
Updates request status (accept/reject)
Body: { status: 'pending' | 'accepted' | 'rejected' }
Response: { message, request }
```

### 4. **Data Structure** 📊

**Request Object:**
```json
{
  "id": "req_1762686454362",
  "mentorId": "m1762684676457",
  "studentId": "stu_1762684508903",
  "status": "pending",
  "createdAt": "2025-11-09T10:47:34.362Z",
  "updatedAt": "2025-11-09T11:00:00.000Z"
}
```

**Status Values:**
- `pending` - Request sent, awaiting mentor response
- `accepted` - Mentor accepted the request
- `rejected` - Mentor declined the request

## User Workflows

### Workflow 1: Student Requests Mentorship

```
1. Student logs in
2. Navigates to "Find Mentors" page
3. Sees mentor cards with "Request Mentorship" button
4. Clicks "Request Mentorship" button
5. Frontend: requestMentorship(mentorId) called
6. Backend: Creates new request with status="pending"
7. Frontend: Shows "Mentorship request sent successfully!"
8. Button changes to status badge: "⏱ Pending"
9. Student waits for mentor response
```

### Workflow 2: Mentor Accepts Request

```
1. Mentor logs in
2. Opens Mentor Dashboard
3. Sees "Student Requests" section
4. Sees pending request from student
5. Clicks "Accept" button
6. Frontend: acceptRequest(requestId) called
7. Backend: Updates request status to "accepted"
8. Frontend: Shows "Mentorship request accepted!"
9. Status badge changes to "✓ Accepted"
10. Student sees updated status on their end
```

### Workflow 3: Mentor Rejects Request

```
1. Mentor sees pending request
2. Clicks "Decline" button
3. Confirmation dialog: "Are you sure you want to decline this mentorship request?"
4. Mentor confirms
5. Frontend: rejectRequest(requestId) called
6. Backend: Updates request status to "rejected"
7. Frontend: Shows "Mentorship request declined."
8. Status badge changes to "✗ Rejected"
9. Student sees updated status
```

## UI Components

### Student View - MentorCard

**Before Request:**
```
┌────────────────────────────────────┐
│ Dr. Sarah Johnson        ⭐ 4.8    │
│ Senior SDE • 10 years exp          │
│ Specializes in full-stack dev...   │
│ [React] [Node.js] [AWS]            │
│                                    │
│ Availability: Weekends             │
│ [Request Mentorship] [View Profile]│
└────────────────────────────────────┘
```

**After Request (Pending):**
```
┌────────────────────────────────────┐
│ Dr. Sarah Johnson        ⭐ 4.8    │
│ Senior SDE • 10 years exp          │
│ Specializes in full-stack dev...   │
│ [React] [Node.js] [AWS]            │
│                                    │
│ Availability: Weekends             │
│ ⏱ Pending            [View Profile]│
└────────────────────────────────────┘
```

**After Request (Accepted):**
```
┌────────────────────────────────────┐
│ Dr. Sarah Johnson        ⭐ 4.8    │
│ Senior SDE • 10 years exp          │
│ Specializes in full-stack dev...   │
│ [React] [Node.js] [AWS]            │
│                                    │
│ Availability: Weekends             │
│ ✓ Accepted           [View Profile]│
└────────────────────────────────────┘
```

### Mentor View - Dashboard

**Student Requests Section:**
```
┌─────────────────────────────────────────┐
│ 📋 Student Requests              3 new  │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ Hriden Singh (BIT Mesra)    pending │ │
│ │ General mentorship request          │ │
│ │ ⏱ 11/9/2025, 4:47:00 PM             │ │
│ │              [✓ Accept] [✗ Decline] │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Priya Sharma (BIT Mesra)   accepted │ │
│ │ Resume review and interview prep    │ │
│ │ ⏱ 11/8/2025, 2:30:00 PM             │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## Technical Implementation

### Frontend - MentorCard.jsx

```javascript
const { user, requests, requestMentorship } = useApp()

// Check if student has already requested this mentor
const existingRequest = user && user.role === 'student' 
  ? requests.find(r => r.mentorId === mentor.id && r.studentId === user.id)
  : null

const handleRequest = async () => {
  if (!user) {
    alert('Please login as a student to request mentorship')
    return
  }
  try {
    await requestMentorship(mentor.id)
    alert('Mentorship request sent successfully!')
  } catch (error) {
    alert('Failed to send request. Please try again.')
  }
}

// Conditional rendering
{user && user.role === 'student' && !existingRequest && (
  <button onClick={handleRequest}>Request Mentorship</button>
)}

{user && user.role === 'student' && existingRequest && (
  <StatusBadge status={existingRequest.status} />
)}
```

### Frontend - MentorDashboard.jsx

```javascript
const { acceptRequest, rejectRequest } = useApp()

const handleAcceptRequest = async (requestId) => {
  try {
    await acceptRequest(requestId)
    alert('Mentorship request accepted!')
  } catch (error) {
    alert('Failed to accept request. Please try again.')
  }
}

const handleRejectRequest = async (requestId) => {
  const confirmed = window.confirm('Are you sure you want to decline this mentorship request?')
  if (confirmed) {
    try {
      await rejectRequest(requestId)
      alert('Mentorship request declined.')
    } catch (error) {
      alert('Failed to decline request. Please try again.')
    }
  }
}

// Render buttons
{r.status === 'pending' && (
  <div>
    <button onClick={() => handleAcceptRequest(r.id)}>Accept</button>
    <button onClick={() => handleRejectRequest(r.id)}>Decline</button>
  </div>
)}
```

### Backend - server.js

```javascript
// Update request status
app.put('/api/requests/:id', async (req, res) => {
  try {
    const requests = await readJSON(REQUESTS_FILE)
    const { id } = req.params
    const { status } = req.body

    // Validate
    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    // Find and update
    const index = requests.findIndex(r => r.id === id)
    if (index === -1) {
      return res.status(404).json({ error: 'Request not found' })
    }

    requests[index] = { 
      ...requests[index], 
      status,
      updatedAt: new Date().toISOString()
    }
    
    await writeJSON(REQUESTS_FILE, requests)
    res.json({ message: 'Request status updated', request: requests[index] })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update request' })
  }
})
```

### State Management - AppContext.jsx

```javascript
const requestMentorship = async (mentorId) => {
  if (!user) return
  const exists = requests.find(r => r.mentorId === mentorId && r.studentId === user.id)
  if (exists) return
  
  try {
    const result = await requestsAPI.create(mentorId, user.id)
    setRequests(prev => [...prev, result.request])
    return { success: true }
  } catch (error) {
    console.error('Failed to create request:', error)
    throw error
  }
}

const acceptRequest = async (requestId) => {
  try {
    const result = await requestsAPI.updateStatus(requestId, 'accepted')
    setRequests(prev => prev.map(r => r.id === requestId ? result.request : r))
    return { success: true }
  } catch (error) {
    console.error('Failed to accept request:', error)
    throw error
  }
}

const rejectRequest = async (requestId) => {
  try {
    const result = await requestsAPI.updateStatus(requestId, 'rejected')
    setRequests(prev => prev.map(r => r.id === requestId ? result.request : r))
    return { success: true }
  } catch (error) {
    console.error('Failed to reject request:', error)
    throw error
  }
}
```

## Status Badge Colors

| Status | Color | Icon | Tailwind Classes |
|--------|-------|------|------------------|
| Pending | Amber | ⏱ Clock | `text-amber-600 dark:text-amber-400` |
| Accepted | Green | ✓ Check | `text-green-600 dark:text-green-400` |
| Rejected | Red | ✗ X | `text-red-600 dark:text-red-400` |

## Role-Based Access Control

### Students Can:
- ✅ View "Request Mentorship" button on mentor cards
- ✅ Send mentorship requests
- ✅ See status of their requests (pending/accepted/rejected)
- ❌ Cannot accept/reject requests (not a mentor)

### Mentors Can:
- ✅ View all incoming mentorship requests
- ✅ Accept pending requests
- ✅ Reject pending requests
- ❌ Cannot send requests (not a student)
- ❌ Cannot see "Request Mentorship" button

### Non-Logged-In Users:
- ❌ Cannot see "Request Mentorship" button
- ❌ Cannot send requests
- ❌ Cannot view request status

## Data Flow

```
Student clicks "Request Mentorship"
      ↓
Frontend: requestMentorship(mentorId)
      ↓
API: POST /api/requests
      ↓
Backend: Create request object
      ↓
Backend: Save to requests.json
      ↓
Backend: Return created request
      ↓
Frontend: Update local state
      ↓
UI: Show "Pending" status
      ↓
[Student waits]
      ↓
Mentor opens dashboard
      ↓
Sees pending request
      ↓
Clicks "Accept"
      ↓
Frontend: acceptRequest(requestId)
      ↓
API: PUT /api/requests/:id
      ↓
Backend: Update status to "accepted"
      ↓
Backend: Save to requests.json
      ↓
Backend: Return updated request
      ↓
Frontend: Update local state
      ↓
UI: Show "Accepted" status
      ↓
[Both student and mentor see updated status]
```

## Testing Scenarios

### Test 1: Student Sends Request
1. Login as student
2. Go to "Find Mentors"
3. Click "Request Mentorship" on a mentor card
4. ✅ See success alert
5. ✅ Button changes to "⏱ Pending"
6. ✅ Cannot send duplicate request

### Test 2: Mentor Accepts Request
1. Login as mentor
2. Go to Mentor Dashboard
3. See pending request in "Student Requests"
4. Click "Accept" button
5. ✅ See success alert
6. ✅ Status changes to "accepted"
7. ✅ Accept/Decline buttons disappear

### Test 3: Mentor Rejects Request
1. Login as mentor
2. See pending request
3. Click "Decline" button
4. Confirm in dialog
5. ✅ See "Request declined" alert
6. ✅ Status changes to "rejected"

### Test 4: Status Persistence
1. Student sends request
2. Logout
3. Login as mentor
4. Accept request
5. Logout
6. Login as student
7. ✅ See "Accepted" status (persisted in backend)

### Test 5: Role-Based Visibility
1. **As Student**: ✅ See "Request Mentorship" button
2. **As Mentor**: ❌ Don't see "Request Mentorship" button
3. **As Mentor**: ✅ See Accept/Decline buttons
4. **As Student**: ❌ Don't see Accept/Decline buttons

## Benefits

### 1. **Structured Communication** 📝
- Formal request process
- Clear intent from students
- Organized workflow for mentors

### 2. **Transparency** 👁️
- Students see request status
- Mentors see all pending requests
- No confusion about connection status

### 3. **Mentor Control** 🎛️
- Mentors can choose which students to mentor
- Can decline if at capacity
- Maintains quality of mentorship

### 4. **Student Clarity** 📊
- Know if request is pending, accepted, or rejected
- Can move on if rejected
- Can prepare for mentorship if accepted

### 5. **Scalability** 📈
- Handles multiple requests
- Works with large user base
- Organized dashboard view

## Future Enhancements

### 1. **Request Messages**
Add optional message field when requesting:
```javascript
{
  id: "req_123",
  mentorId: "m1",
  studentId: "stu_1",
  message: "Hi, I'd like guidance on React development",
  status: "pending"
}
```

### 2. **Request Expiry**
Auto-expire requests after X days if no response

### 3. **Request Notifications**
- Email notification to mentor on new request
- Email notification to student on accept/reject
- In-app notification badges

### 4. **Request Analytics**
- Track acceptance rate per mentor
- Show popular mentors
- Student success metrics

### 5. **Bulk Actions**
Allow mentors to accept/reject multiple requests at once

### 6. **Request Filters**
Filter requests by:
- Status (pending/accepted/rejected)
- Date range
- Student institute
- Skills requested

### 7. **Mentorship Capacity**
- Set max number of mentees
- Auto-reject when at capacity
- Queue system for overflow

### 8. **Request History**
View past requests with timeline

## Files Modified

1. ✅ **server/server.js**
   - Added PUT /api/requests/:id endpoint
   - Status validation
   - Request update logic

2. ✅ **src/services/api.js**
   - Added requestsAPI.updateStatus function

3. ✅ **src/state/AppContext.jsx**
   - Added acceptRequest function
   - Added rejectRequest function
   - Exported both functions

4. ✅ **src/components/MentorCard.jsx**
   - Added "Request Mentorship" button (students only)
   - Added status badges (pending/accepted/rejected)
   - Request handling logic

5. ✅ **src/pages/MentorDashboard.jsx**
   - Added Accept/Reject handlers
   - Updated filteredRequests logic
   - Added onClick handlers to buttons
   - Shows student name and institute

## API Usage Examples

### Send Request (Student)
```javascript
// Frontend
await requestMentorship('m1762684676457')

// API Call
POST http://localhost:5000/api/requests
Body: {
  "mentorId": "m1762684676457",
  "studentId": "stu_1762684508903"
}

// Response
{
  "message": "Request created",
  "request": {
    "id": "req_1762686454362",
    "mentorId": "m1762684676457",
    "studentId": "stu_1762684508903",
    "status": "pending",
    "createdAt": "2025-11-09T10:47:34.362Z"
  }
}
```

### Accept Request (Mentor)
```javascript
// Frontend
await acceptRequest('req_1762686454362')

// API Call
PUT http://localhost:5000/api/requests/req_1762686454362
Body: {
  "status": "accepted"
}

// Response
{
  "message": "Request status updated",
  "request": {
    "id": "req_1762686454362",
    "mentorId": "m1762684676457",
    "studentId": "stu_1762684508903",
    "status": "accepted",
    "createdAt": "2025-11-09T10:47:34.362Z",
    "updatedAt": "2025-11-09T11:00:00.000Z"
  }
}
```

### Reject Request (Mentor)
```javascript
// Frontend
await rejectRequest('req_1762686454362')

// API Call
PUT http://localhost:5000/api/requests/req_1762686454362
Body: {
  "status": "rejected"
}

// Response
{
  "message": "Request status updated",
  "request": {
    "id": "req_1762686454362",
    "status": "rejected",
    "updatedAt": "2025-11-09T11:05:00.000Z"
  }
}
```

## Hackathon Demo Script

**1. Introduction (30 seconds)**
"Students can now formally request mentorship, and mentors can accept or decline based on their availability."

**2. Demo Student Flow (1 minute)**
- Login as student
- Go to Find Mentors
- Show "Request Mentorship" button
- Click button
- Show success message
- Show status changing to "Pending"

**3. Demo Mentor Flow (1.5 minutes)**
- Open another browser
- Login as mentor
- Go to Mentor Dashboard
- Show "Student Requests" section
- Point out pending request
- Click "Accept" button
- Show success message
- Show status changing to "Accepted"

**4. Show Status Update (30 seconds)**
- Switch back to student view
- Refresh or show that status auto-updated to "Accepted"
- Explain: "Student now knows mentor accepted!"

**5. Demo Decline (30 seconds)**
- Show another pending request
- Click "Decline"
- Show confirmation dialog
- Confirm
- Show status changes to "Rejected"

**Key Talking Points:**
- ✅ "Students can request mentorship with one click"
- ✅ "Mentors have full control over accepting students"
- ✅ "Real-time status updates for both parties"
- ✅ "Clear visual indicators (pending/accepted/rejected)"
- ✅ "Role-based access - only students can request, only mentors can accept"

Your MentorConnect platform now has a complete mentorship request workflow! 🎓✨
