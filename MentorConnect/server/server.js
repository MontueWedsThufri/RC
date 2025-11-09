const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Data file paths
const DATA_DIR = path.join(__dirname, 'data');
const STUDENTS_FILE = path.join(DATA_DIR, 'students.json');
const MENTORS_FILE = path.join(DATA_DIR, 'mentors.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
const GOALS_FILE = path.join(DATA_DIR, 'goals.json');
const REQUESTS_FILE = path.join(DATA_DIR, 'requests.json');
const RATINGS_FILE = path.join(DATA_DIR, 'ratings.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Initialize data files
async function initializeDataFiles() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    const files = [
      { path: STUDENTS_FILE, data: [] },
      { path: MENTORS_FILE, data: [] },
      { path: MESSAGES_FILE, data: [] },
      { path: GOALS_FILE, data: [] },
      { path: REQUESTS_FILE, data: [] },
      { path: RATINGS_FILE, data: [] },
      { path: SESSIONS_FILE, data: [] }
    ];

    for (const file of files) {
      try {
        await fs.access(file.path);
      } catch {
        await fs.writeFile(file.path, JSON.stringify(file.data, null, 2));
      }
    }
    console.log('Data files initialized');
  } catch (error) {
    console.error('Error initializing data files:', error);
  }
}

// Helper functions
async function readJSON(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeJSON(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// ============ STUDENT ROUTES ============

// Get all students
app.get('/api/students', async (req, res) => {
  try {
    const students = await readJSON(STUDENTS_FILE);
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Register student
app.post('/api/students/register', async (req, res) => {
  try {
    const students = await readJSON(STUDENTS_FILE);
    const { name, email, institute, interests, skills, goals } = req.body;

    // Check if email exists
    if (students.find(s => s.email === email)) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const newStudent = {
      id: 'stu_' + Date.now(),
      name,
      email,
      institute: institute || '',
      interests: interests || [],
      skills: skills || [],
      goals: goals || [],
      createdAt: new Date().toISOString()
    };

    students.push(newStudent);
    await writeJSON(STUDENTS_FILE, students);

    res.status(201).json({ message: 'Student registered successfully', student: newStudent });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register student' });
  }
});

// Student login
app.post('/api/students/login', async (req, res) => {
  try {
    const students = await readJSON(STUDENTS_FILE);
    const { studentId } = req.body;

    const student = students.find(s => s.id === studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ message: 'Login successful', student });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Delete student
app.delete('/api/students/:id', async (req, res) => {
  try {
    const students = await readJSON(STUDENTS_FILE);
    const { id } = req.params;

    const index = students.findIndex(s => s.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Student not found' });
    }

    students.splice(index, 1);
    await writeJSON(STUDENTS_FILE, students);

    res.json({ message: 'Student profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

// ============ MENTOR ROUTES ============

// Get all mentors
app.get('/api/mentors', async (req, res) => {
  try {
    const mentors = await readJSON(MENTORS_FILE);
    res.json(mentors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch mentors' });
  }
});

// Register mentor
app.post('/api/mentors/register', async (req, res) => {
  try {
    const mentors = await readJSON(MENTORS_FILE);
    const { name, email, institute, title, background, skills, interests, bio, availability } = req.body;

    // Check if email exists
    if (mentors.find(m => m.email === email)) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const newMentor = {
      id: 'm' + Date.now(),
      name,
      email,
      institute: institute || '',
      title,
      background,
      skills: skills || [],
      interests: interests || [],
      bio,
      availability,
      rating: 0,
      createdAt: new Date().toISOString()
    };

    mentors.push(newMentor);
    await writeJSON(MENTORS_FILE, mentors);

    res.status(201).json({ message: 'Mentor registered successfully', mentor: newMentor });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register mentor' });
  }
});

// Mentor login
app.post('/api/mentors/login', async (req, res) => {
  try {
    const mentors = await readJSON(MENTORS_FILE);
    const { mentorId } = req.body;

    const mentor = mentors.find(m => m.id === mentorId);
    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found' });
    }

    res.json({ message: 'Login successful', mentor });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Delete mentor
app.delete('/api/mentors/:id', async (req, res) => {
  try {
    const mentors = await readJSON(MENTORS_FILE);
    const { id } = req.params;

    const index = mentors.findIndex(m => m.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Mentor not found' });
    }

    mentors.splice(index, 1);
    await writeJSON(MENTORS_FILE, mentors);

    res.json({ message: 'Mentor profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete mentor' });
  }
});

// ============ MESSAGES ROUTES ============

// Get messages
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await readJSON(MESSAGES_FILE);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send message
app.post('/api/messages', async (req, res) => {
  try {
    const messages = await readJSON(MESSAGES_FILE);
    const students = await readJSON(STUDENTS_FILE);
    const mentors = await readJSON(MENTORS_FILE);
    const { from, to, text } = req.body;

    // Find sender and receiver
    const allUsers = [...students, ...mentors];
    const sender = allUsers.find(u => u.id === from);
    const receiver = allUsers.find(u => u.id === to);

    if (!sender || !receiver) {
      return res.status(404).json({ error: 'Sender or receiver not found' });
    }

    // Check if both are from the same institute (case-insensitive)
    if (sender.institute && receiver.institute) {
      const senderInstitute = sender.institute.toLowerCase().trim();
      const receiverInstitute = receiver.institute.toLowerCase().trim();
      
      if (senderInstitute !== receiverInstitute) {
        return res.status(403).json({ 
          error: 'Cannot send messages to users from different institutes',
          message: `You can only message users from ${sender.institute}`
        });
      }
    }

    const newMessage = {
      id: Date.now().toString(),
      threadId: [from, to].sort().join('-'),
      from,
      to,
      text,
      ts: new Date().toISOString()
    };

    messages.push(newMessage);
    await writeJSON(MESSAGES_FILE, messages);

    res.status(201).json({ message: 'Message sent', data: newMessage });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

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

// ============ GOALS ROUTES ============

// Get goals
app.get('/api/goals', async (req, res) => {
  try {
    const goals = await readJSON(GOALS_FILE);
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
});

// Add goal
app.post('/api/goals', async (req, res) => {
  try {
    const goals = await readJSON(GOALS_FILE);
    const { title, userId } = req.body;

    const newGoal = {
      id: 'g' + Date.now(),
      title,
      userId,
      progress: 0,
      milestones: [],
      createdAt: new Date().toISOString()
    };

    goals.push(newGoal);
    await writeJSON(GOALS_FILE, goals);

    res.status(201).json({ message: 'Goal added', goal: newGoal });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add goal' });
  }
});

// Update goal
app.put('/api/goals/:id', async (req, res) => {
  try {
    const goals = await readJSON(GOALS_FILE);
    const { id } = req.params;
    const updates = req.body;

    const index = goals.findIndex(g => g.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    goals[index] = { ...goals[index], ...updates };
    await writeJSON(GOALS_FILE, goals);

    res.json({ message: 'Goal updated', goal: goals[index] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update goal' });
  }
});

// Delete goal
app.delete('/api/goals/:id', async (req, res) => {
  try {
    const goals = await readJSON(GOALS_FILE);
    const { id } = req.params;

    const index = goals.findIndex(g => g.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    goals.splice(index, 1);
    await writeJSON(GOALS_FILE, goals);

    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete goal' });
  }
});

// ============ REQUESTS ROUTES ============

// Get requests
app.get('/api/requests', async (req, res) => {
  try {
    const requests = await readJSON(REQUESTS_FILE);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// Create request
app.post('/api/requests', async (req, res) => {
  try {
    const requests = await readJSON(REQUESTS_FILE);
    const { mentorId, studentId } = req.body;

    const newRequest = {
      id: 'req_' + Date.now(),
      mentorId,
      studentId,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    requests.push(newRequest);
    await writeJSON(REQUESTS_FILE, requests);

    res.status(201).json({ message: 'Request created', request: newRequest });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create request' });
  }
});

// Update request status (accept/reject)
app.put('/api/requests/:id', async (req, res) => {
  try {
    const requests = await readJSON(REQUESTS_FILE);
    const { id } = req.params;
    const { status } = req.body;

    const index = requests.findIndex(r => r.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be pending, accepted, or rejected' });
    }

    requests[index] = { 
      ...requests[index], 
      status,
      updatedAt: new Date().toISOString()
    };
    
    await writeJSON(REQUESTS_FILE, requests);

    res.json({ message: 'Request status updated', request: requests[index] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update request' });
  }
});

// ============ RATINGS ROUTES ============

// Get all ratings
app.get('/api/ratings', async (req, res) => {
  try {
    const ratings = await readJSON(RATINGS_FILE);
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
});

// Submit a rating
app.post('/api/ratings', async (req, res) => {
  try {
    const ratings = await readJSON(RATINGS_FILE);
    const { fromId, toId, rating, comment, fromRole, toRole } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if rating already exists
    const existingIndex = ratings.findIndex(
      r => r.fromId === fromId && r.toId === toId
    );

    const newRating = {
      id: existingIndex !== -1 ? ratings[existingIndex].id : 'rating_' + Date.now(),
      fromId,
      toId,
      fromRole,
      toRole,
      rating: Number(rating),
      comment: comment || '',
      createdAt: existingIndex !== -1 ? ratings[existingIndex].createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (existingIndex !== -1) {
      // Update existing rating
      ratings[existingIndex] = newRating;
    } else {
      // Add new rating
      ratings.push(newRating);
    }

    await writeJSON(RATINGS_FILE, ratings);

    res.status(201).json({ message: 'Rating submitted', rating: newRating });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit rating' });
  }
});

// ============ SESSIONS ROUTES ============

// Get all scheduled sessions
app.get('/api/sessions', async (req, res) => {
  try {
    const sessions = await readJSON(SESSIONS_FILE);
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Schedule a new session (mentor only)
app.post('/api/sessions', async (req, res) => {
  try {
    const sessions = await readJSON(SESSIONS_FILE);
    const mentors = await readJSON(MENTORS_FILE);
    const students = await readJSON(STUDENTS_FILE);
    const requests = await readJSON(REQUESTS_FILE);

    const { mentorId, studentId, scheduledAt, topic, duration, meetingLink, notes } = req.body;

    if (!mentorId || !studentId || !scheduledAt) {
      return res.status(400).json({ error: 'mentorId, studentId, and scheduledAt are required' });
    }

    const mentor = mentors.find(m => m.id === mentorId);
    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found' });
    }

    const student = students.find(s => s.id === studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const hasAcceptedRequest = requests.some(r => r.mentorId === mentorId && r.studentId === studentId && r.status === 'accepted');
    if (!hasAcceptedRequest) {
      return res.status(400).json({ error: 'No accepted mentorship request found for this mentor and student' });
    }

    const date = new Date(scheduledAt);
    if (Number.isNaN(date.getTime())) {
      return res.status(400).json({ error: 'Invalid scheduledAt timestamp' });
    }

    const session = {
      id: 'session_' + Date.now(),
      mentorId,
      studentId,
      scheduledAt: date.toISOString(),
      topic: topic || 'Mentorship Session',
      duration: duration ? Number(duration) : 60,
      meetingLink: meetingLink || '',
      notes: notes || '',
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    sessions.push(session);
    await writeJSON(SESSIONS_FILE, sessions);

    res.status(201).json({ message: 'Session scheduled', session });
  } catch (error) {
    res.status(500).json({ error: 'Failed to schedule session' });
  }
});

// ============ AI ASSISTANT ROUTES ============

app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, history = [], threadId, userId } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: 'AI assistant is not configured. Please set OPENAI_API_KEY.' });
    }

    const conversation = [
      {
        role: 'system',
        content:
          'You are MentorConnect AI Assistant, a helpful career mentor who gives concise, actionable advice. Provide structured guidance, share relevant resources, and keep responses under 250 words. When referring to actions, mention the MentorConnect platform when appropriate.'
      },
      ...history.slice(-10),
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: conversation,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', errorText);
      return res.status(500).json({ error: 'Failed to generate AI response' });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(500).json({ error: 'AI response was empty' });
    }

    res.json({
      reply,
      threadId,
      userId,
      messageId: data.id || `ai_${Date.now()}`,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to process AI chat:', error);
    res.status(500).json({ error: 'Failed to contact AI assistant' });
  }
});

// Initialize and start server
initializeDataFiles().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📁 Data stored in: ${DATA_DIR}`);
  });
});
