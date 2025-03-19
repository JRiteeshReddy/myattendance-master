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
    "Did you forget the university is still in session?",
    "Your attendance is so low, the professor might not recognize you at finals.",
    "I see empty chairs in your future. Many of them.",
    "Paying tuition to NOT attend classes? Bold financial strategy.",
    "Your professor is starting to think you're a myth.",
    "The campus squirrels have seen more lectures than you.",
    "Plot twist: You're supposed to attend the classes you paid for.",
    "Maybe try setting an alarm? Just a thought.",
    "Your attendance is like my motivation to exercise: practically non-existent.",
    "Your chair is getting cold and lonely."
  ];

  const mediumMessages = [
    "Half-attending is like half-reading a book. You miss all the good parts.",
    "You're playing attendance roulette and the odds aren't looking great.",
    "Not terrible, not great. The academic version of 'meh'.",
    "The glass is half full... of absences.",
    "Your attendance is as average as a beige wall.",
    "Showing up is half the battle. You're currently losing.",
    "Your professor knows your name but not your face.",
    "Living life on the attendance edge, I see.",
    "Schrödinger's student: simultaneously in and not in class.",
    "I've seen better attendance at optional meetings."
  ];

  const highMessages = [
    "Wow, you actually go to the classes you paid for. Revolutionary.",
    "Teacher's pet alert! But hey, at least you're learning something.",
    "Front row energy. I respect the commitment.",
    "Your seat has a permanent imprint of your behind by now.",
    "Do you live on campus or just never leave?",
    "The projector misses you when you're gone (which isn't often).",
    "You're the 'actually, I have a question' student, aren't you?",
    "Congratulations on doing the bare minimum required to pass.",
    "Your professor probably uses your name as an example of good attendance.",
    "You've perfected the art of showing up. Now try participating."
  ];

  if (percentage < 60) {
    return lowMessages[Math.floor(Math.random() * lowMessages.length)];
  } else if (percentage < 85) {
    return mediumMessages[Math.floor(Math.random() * mediumMessages.length)];
  } else {
    return highMessages[Math.floor(Math.random() * highMessages.length)];
  }
};
