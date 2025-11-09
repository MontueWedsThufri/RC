# Institute-Based Filtering Feature

## Overview
Students and mentors can now only connect with each other if they belong to the same college/institute. This creates an exclusive alumni mentorship network for each educational institution.

## How It Works

### For Students
- Students can only view and connect with mentors from their own institute
- The matching algorithm automatically filters mentors by institute
- If a student doesn't specify an institute, they see all mentors (fallback)

### For Mentors
- Mentors only see mentorship requests from students of their institute
- Example student requests display the mentor's institute name
- If a mentor doesn't specify an institute, they see all requests (fallback)

## Implementation Details

### 1. Matching Algorithm (`src/utils/matching.js`)

```javascript
export function rankMentors(student, mentors){
  // Filter mentors from the same institute first
  const sameInstituteMentors = mentors.filter(m => {
    // If student has no institute, show all mentors
    if (!student.institute || student.institute.trim() === '') return true
    // If mentor has no institute, don't show them
    if (!m.institute || m.institute.trim() === '') return false
    // Case-insensitive comparison of institutes
    return m.institute.toLowerCase().trim() === student.institute.toLowerCase().trim()
  })
  
  return sameInstituteMentors
    .map(m => ({ ...m, _score: scoreMentor(student, m) }))
    .sort((a,b)=> b._score - a._score)
}
```

**Features:**
- Case-insensitive matching
- Trims whitespace to avoid mismatches
- Shows all mentors if student has no institute (backward compatibility)
- Hides mentors without institute from students with institute

### 2. Student Dashboard (`src/pages/StudentDashboard.jsx`)

**Visual Indicators:**
```
Recommended mentors
From BIT Mesra                [View all →]
```

**Empty State:**
```
No mentors from BIT Mesra found yet.
Be the first to invite alumni mentors from your college!
```

### 3. Matching Page (`src/pages/Matching.jsx`)

**Header Message:**
```
Find your mentor
Showing mentors from BIT Mesra
```

**Empty State:**
```
No mentors from your institute match your filters. 
Try clearing filters or check back later for more mentors from BIT Mesra.
```

### 4. Mentor Dashboard (`src/pages/MentorDashboard.jsx`)

**Request Filtering:**
```javascript
const filteredRequests = requests.filter(r => {
  if (!currentMentor || !currentMentor.institute || currentMentor.institute.trim() === '') return true
  const student = students.find(s => s.id === r.studentId)
  if (!student || !student.institute || student.institute.trim() === '') return false
  return student.institute.toLowerCase().trim() === currentMentor.institute.toLowerCase().trim()
})
```

**Visual Indicator:**
```
Mentor Dashboard
Manage your mentorship requests and sessions • BIT Mesra students only
```

**Example Names:**
```
Alex Johnson (BIT Mesra) - Career guidance for SDE roles
Priya Sharma (BIT Mesra) - Resume review and interview prep
```

## User Flow Examples

### Example 1: BIT Mesra Network
1. **Student Registration**: Hriden Singh registers with institute "BIT Mesra"
2. **Mentor Registration**: Aayush Kumar registers with institute "BIT Mesra"
3. **Discovery**: Hriden can see Aayush in the mentor list
4. **Connection**: Hriden sends a mentorship request
5. **Mentor View**: Aayush sees Hriden's request on his dashboard

### Example 2: Different Institutes
1. **Student**: John from "IIT Delhi"
2. **Mentor**: Jane from "BIT Mesra"
3. **Result**: John cannot see Jane, Jane cannot see John's requests
4. **Benefit**: Maintains exclusive alumni networks per institute

### Example 3: No Institute (Fallback)
1. **Student**: Mike (no institute specified)
2. **Result**: Mike sees ALL mentors from all institutes
3. **Mentor**: Sarah (no institute specified)
4. **Result**: Sarah sees ALL student requests

## Benefits

### 1. **Alumni Network Building**
- Strengthens alumni-student connections within each college
- Creates exclusive communities per institute
- Encourages alumni to give back to their alma mater

### 2. **Trust & Credibility**
- Students trust mentors from their own institute
- Shared college experience creates instant connection
- Common background and context

### 3. **Relevance**
- Institute-specific career advice
- Understanding of college curriculum and opportunities
- Network connections relevant to the institute

### 4. **Scalability**
- Can support multiple colleges simultaneously
- Each college maintains its own mentorship network
- Easy to expand to new institutions

## Institute Matching Rules

| Student Institute | Mentor Institute | Match? | Reason |
|-------------------|------------------|--------|---------|
| BIT Mesra | BIT Mesra | ✅ Yes | Exact match |
| bit mesra | BIT MESRA | ✅ Yes | Case-insensitive |
| BIT Mesra | IIT Delhi | ❌ No | Different institutes |
| BIT Mesra | (empty) | ❌ No | Mentor has no institute |
| (empty) | BIT Mesra | ✅ Yes | Fallback: show all |
| (empty) | (empty) | ✅ Yes | Fallback: show all |

## Data Structure

### Student Profile
```json
{
  "id": "stu_1762682290488",
  "name": "Hriden Singh",
  "email": "btech15026.25@bitmesra.ac.in",
  "institute": "BIT Mesra",
  "interests": ["AI"],
  "skills": ["DSA"],
  "goals": ["billionaire"],
  "createdAt": "2025-11-09T09:58:10.488Z"
}
```

### Mentor Profile
```json
{
  "id": "m1762681776311",
  "name": "Aayush Kumar",
  "email": "ayushkkk@gmail.com",
  "institute": "BIT Mesra",
  "title": "Software Engineer",
  "background": "BIT Mesra",
  "skills": ["React"],
  "interests": ["EdTech"],
  "bio": "Passionate about mentoring",
  "availability": "2 hrs/week",
  "rating": 0,
  "createdAt": "2025-11-09T09:49:36.311Z"
}
```

## Testing the Feature

### Test Case 1: Same Institute
1. Register student with institute "BIT Mesra"
2. Register mentor with institute "BIT Mesra"
3. Login as student → Should see the mentor
4. Login as mentor → Should see student's request (if sent)

### Test Case 2: Different Institutes
1. Register student with institute "IIT Delhi"
2. Register mentor with institute "BIT Mesra"
3. Login as student → Should NOT see the mentor
4. Send request from different student with BIT Mesra
5. Login as mentor → Should only see BIT Mesra student's request

### Test Case 3: Case Insensitivity
1. Student enters "bit mesra"
2. Mentor enters "BIT Mesra"
3. Result: They should still match

## UI/UX Enhancements

### Visual Indicators
- ✅ Institute name shown below student name on dashboard
- ✅ "From [Institute]" label under "Recommended mentors"
- ✅ "Showing mentors from [Institute]" on matching page
- ✅ "[Institute] students only" on mentor dashboard
- ✅ Institute shown in example student names for mentors

### Empty States
- Helpful messages when no matches found
- Encouragement to invite alumni from their college
- Clear explanation of institute-based filtering

## Future Enhancements

### 1. Multi-Institute Support
- Allow mentors to support multiple institutes
- Select primary and secondary institutes

### 2. Institute Verification
- Email domain verification (@bitmesra.ac.in)
- Admin approval for institutes
- Institute badges for verified accounts

### 3. Institute Statistics
- Show number of mentors per institute
- Display active connections per institute
- Institute leaderboards

### 4. Institute-Specific Features
- Institute-specific events
- Institute-specific resources
- Institute alumni directory

### 5. Cross-Institute Networking (Optional)
- Allow students to opt-in for cross-institute mentorship
- Special "guest mentor" programs
- Inter-college collaboration features

## Configuration

### Enable/Disable Institute Filtering
To disable institute filtering (show all mentors to all students), modify `src/utils/matching.js`:

```javascript
export function rankMentors(student, mentors){
  // Uncomment to disable filtering:
  // return mentors
  //   .map(m => ({ ...m, _score: scoreMentor(student, m) }))
  //   .sort((a,b)=> b._score - a._score)
  
  // Current: Filter by institute
  const sameInstituteMentors = mentors.filter(m => {
    if (!student.institute || student.institute.trim() === '') return true
    if (!m.institute || m.institute.trim() === '') return false
    return m.institute.toLowerCase().trim() === student.institute.toLowerCase().trim()
  })
  
  return sameInstituteMentors
    .map(m => ({ ...m, _score: scoreMentor(student, m) }))
    .sort((a,b)=> b._score - a._score)
}
```

## Hackathon Demo Points

**Show the judges:**
1. ✅ "Institute-based exclusive networks"
2. ✅ "Alumni can mentor only their college students"
3. ✅ "Builds trust through shared institutional background"
4. ✅ "Scalable to support multiple colleges"
5. ✅ Demo: Register two users from same institute → they match
6. ✅ Demo: Register two users from different institutes → they don't match

**Key Selling Points:**
- Creates exclusive alumni communities
- Strengthens college networks
- Increases mentor-student trust
- Scalable platform for multiple institutions
- Smart filtering with fallback support

This feature transforms MentorConnect into a multi-college platform where each institution maintains its own mentorship ecosystem! 🎓
