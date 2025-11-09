export function scoreMentor(student, mentor){
  let score = 0
  const skillOverlap = mentor.skills.filter(s => student.skills.includes(s)).length
  const interestOverlap = mentor.interests.filter(i => student.interests.includes(i)).length
  if (mentor.background?.toLowerCase().includes('iit') || mentor.background?.toLowerCase().includes('iim')) score += 1
  score += skillOverlap * 3
  score += interestOverlap * 2
  score += mentor.rating
  return score
}

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
