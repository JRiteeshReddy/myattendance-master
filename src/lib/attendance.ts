// Attendance calculation utilities

/**
 * Calculate the attendance percentage
 */
export const calculatePercentage = (attended: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((attended / total) * 100);
};

/**
 * Calculate how many classes can be missed while maintaining 75% attendance
 */
export const calculateClassesToMiss = (attended: number, total: number): number => {
  if (total === 0) return 0;
  
  // Calculate the current attendance
  const currentAttendance = attended / total;
  
  // If we're below 75%, we can't miss any classes
  if (currentAttendance < 0.75) return 0;
  
  // Otherwise, calculate how many classes we can miss
  // Formula: (attended - 0.75 * (total + x)) = 0, solve for x
  // This simplifies to: x = (attended / 0.75) - total
  const classesToMiss = Math.floor((attended / 0.75) - total);
  
  return Math.max(0, classesToMiss);
};

/**
 * Calculate how many more consecutive classes need to be attended to reach 75%
 */
export const calculateClassesToAttend = (attended: number, total: number): number => {
  if (total === 0) return 0;
  
  // Calculate the current attendance
  const currentAttendance = attended / total;
  
  // If we're already at or above 75%, we don't need to attend any more
  if (currentAttendance >= 0.75) return 0;
  
  // Otherwise, calculate how many more consecutive classes we need to attend
  // Formula: (attended + x) / (total + x) = 0.75, solve for x
  // This simplifies to: x = (0.75 * total - attended) / (1 - 0.75)
  const classesToAttend = Math.ceil((0.75 * total - attended) / 0.25);
  
  return Math.max(0, classesToAttend);
};

/**
 * Generate a funny and slightly rude message about attendance
 */
export const getAttendanceMessage = (percentage: number): string => {
  const lowMessages = [
    "Bro, your attendance is lower than my phone battery at 2%.",
    "You skipping classes like it's a cardio workout—relax, no one's giving you a medal.",
    "At this point, even the benches forgot how you look.",
    "The professor asked who's missing, and I said 'common sense'—turns out I meant you.",
    "Are you majoring in Houdini? Because you vanish every time there's a class.",
    "Attendance sheet's starting to think you're a fictional character.",
    "NASA called. They wanna study how fast you escape class.",
    "One more absence and they'll name a holiday after you.",
    "Are you allergic to education, or is it just the chairs?",
    "Your attendance is giving 'guest appearance' vibes.",
    "Bro, blink twice if you've forgotten where the classroom is.",
    "Skipping class won't make you mysterious; it just makes you unemployed sooner.",
    "Attendance so low, even AI struggles to predict when you'll show up.",
    "You're missing classes like you're practicing for a disappearing act on India's Got Talent.",
    "Class isn't a buffet, you can't just come once in a while when you feel like it.",
    "Are you secretly the teacher's ex? Why else avoid them this hard?",
    "Your attendance graph looks like a heart rate monitor of a dead person.",
    "The only subject you're passing is bunking techniques.",
    "You have 100% attendance… in the canteen.",
    "Even WiFi connects more often than you do.",
    "Show up to class, or should we start tagging you as 'Missing Person'?",
    "Did you enroll in invisibility studies? Because I can't see you in class.",
    "If bunking was a degree, you'd be valedictorian.",
    "Bro, your attendance percentage and my trust issues are competing.",
    "You skipping more classes than Spotify skips ads.",
    "Hey, at least attend once—so we know you're still alive.",
    "Attendance sheet looks cleaner without your name, but damn, the teachers notice.",
    "You've missed so much, even Google Maps can't redirect you to the syllabus.",
    "Come to class; it's free. Unlike therapy, which you'll need if you fail.",
    "Even ghosts haunt classrooms more often than you."
  ];

  const mediumMessages = [
    "Bro, you attend just enough to keep the teachers confused whether to fail you or not.",
    "Your attendance is like a cliffhanger—no one knows if you'll survive till the end.",
    "You show up just enough to say 'I exist,' but not enough to learn anything.",
    "You're playing Russian Roulette with attendance—one more bunk and boom!",
    "Your attendance isn't low, it's on life support.",
    "75% attendance? That's not consistency, that's luck.",
    "Teachers see your attendance and think you're speedrunning the course.",
    "You're not a regular student, you're a seasonal event.",
    "Your attendance graph looks like Bitcoin—unstable and stressing everyone out.",
    "Bro, your attendance is a thriller movie—keeps everyone on edge till the climax.",
    "You got the teachers praying harder for your attendance than their own salaries.",
    "You're walking the fine line between student and visitor.",
    "Your attendance says 'I'm here for vibes, not degrees'.",
    "You attend like you're collecting limited-edition badges—not for education.",
    "Every class you attend feels like a surprise appearance.",
    "Your attendance is like a power cut—on and off, and unpredictable.",
    "Even the attendance sheet sighs when you show up—'Oh, finally decided to join us?'",
    "You're the human embodiment of bare minimum.",
    "You're not chasing a degree, you're chasing that 0.1% margin to survive.",
    "Your attendance is like WhatsApp blue ticks—seen but no action."
  ];

  const highMessages = [
    "Bro, you attending like there's gold hidden in the classroom.",
    "Your attendance is so high, even the teacher's attendance looks lazy.",
    "Relax, no one's giving a loyalty card for 80%+ attendance.",
    "You attending every class like it's a Netflix series finale.",
    "Are you planning to marry the syllabus or what?",
    "Your attendance is higher than my phone screen time, and that's saying something.",
    "Bro, even chairs feel more rested than you.",
    "You don't need a degree, you need a lifetime achievement award in attending.",
    "You show up more than the WiFi signal.",
    "You attend classes like you're earning attendance cashback.",
    "Your attendance is proof dedication can be unnecessary too.",
    "Teacher sneezes, and you mark your attendance—calm down.",
    "Attendance so high, they might ask you to start teaching soon.",
    "You're basically on payroll the way you show up.",
    "Bro, take a day off, even the attendance sheet needs space.",
    "You have attendance anxiety like people have commitment issues.",
    "Chill bro, syllabus won't vanish if you miss one class.",
    "Even the security guard knows you're always here.",
    "Your attendance is so good, the system thinks you're a bot.",
    "They're gonna put your photo on the attendance app's login screen soon."
  ];

  if (percentage < 70) {
    return lowMessages[Math.floor(Math.random() * lowMessages.length)];
  } else if (percentage < 80) {
    return mediumMessages[Math.floor(Math.random() * mediumMessages.length)];
  } else {
    return highMessages[Math.floor(Math.random() * highMessages.length)];
  }
};
