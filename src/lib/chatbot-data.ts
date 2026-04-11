export interface ModuleInfo {
  name: string;
  code: string;
  lecturer: { name: string; email: string; office: string; hours: string };
  tests: { name: string; date: string; chapters: string[] }[];
  exam: { date: string; chapters: string[]; venue: string };
  assignments: { name: string; due: string; description: string }[];
  chapters: { number: number; title: string }[];
  studyTips: string[];
}

export const moduleData: ModuleInfo = {
  name: "Introduction to Software Engineering",
  code: "CSC2001",
  lecturer: {
    name: "Dr. Sarah Mitchell",
    email: "s.mitchell@university.ac.za",
    office: "IT Building, Room 4.12",
    hours: "Tuesdays & Thursdays, 10:00 – 12:00",
  },
  tests: [
    {
      name: "Class Test 1",
      date: "28 April 2026",
      chapters: ["Chapter 1: Introduction to SE", "Chapter 2: Software Processes", "Chapter 3: Agile Development"],
    },
    {
      name: "Class Test 2",
      date: "2 June 2026",
      chapters: ["Chapter 4: Requirements Engineering", "Chapter 5: System Modelling", "Chapter 6: Design Patterns"],
    },
  ],
  exam: {
    date: "15 November 2026",
    chapters: ["All chapters (1–8)"],
    venue: "Great Hall, Main Campus",
  },
  assignments: [
    { name: "Assignment 1", due: "5 May 2026", description: "UML Use Case Diagrams for a library system" },
    { name: "Assignment 2", due: "16 June 2026", description: "Group project: Build a prototype using Agile methodology" },
    { name: "Assignment 3", due: "1 September 2026", description: "Design patterns implementation in Java/Python" },
  ],
  chapters: [
    { number: 1, title: "Introduction to Software Engineering" },
    { number: 2, title: "Software Processes" },
    { number: 3, title: "Agile Development" },
    { number: 4, title: "Requirements Engineering" },
    { number: 5, title: "System Modelling" },
    { number: 6, title: "Design Patterns" },
    { number: 7, title: "Software Testing" },
    { number: 8, title: "Software Evolution" },
  ],
  studyTips: [
    "Use **active recall** — test yourself instead of passively re-reading notes.",
    "Practice with **past exam papers** under timed conditions.",
    "Study in **25-minute focused sessions** (Pomodoro technique) with 5-minute breaks.",
    "Create **mind maps** to connect concepts across chapters.",
    "Form a **study group** to discuss difficult topics and quiz each other.",
    "Review lecture slides **within 24 hours** of each class for better retention.",
  ],
};

interface KeywordRule {
  keywords: string[];
  respond: (input: string) => string;
}

function extractNumbers(input: string): number[] {
  return (input.match(/\d+(\.\d+)?/g) || []).map(Number);
}

export function getResponse(input: string): string {
  const lower = input.toLowerCase().trim();
  const d = moduleData;

  const rules: KeywordRule[] = [
    {
      keywords: ["test", "upcoming test", "next test", "class test"],
      respond: () => {
        const testList = d.tests
          .map((t) => `📝 **${t.name}** — ${t.date}\n   Covers: ${t.chapters.join(", ")}`)
          .join("\n\n");
        return `Here are your upcoming tests for **${d.code}**:\n\n${testList}\n\nMake sure to review your notes and past papers!`;
      },
    },
    {
      keywords: ["exam", "final exam", "exam date","June exam"],
      respond: () =>
        `📋 **Final Exam** for ${d.code}\n\n📅 Date: **${d.exam.date}**\n📍 Venue: ${d.exam.venue}\n📚 Covers: ${d.exam.chapters.join(", ")}\n\nStart revising early and use past papers for practice!`,
    },
    {
      keywords: ["chapter", "topic", "what to study", "focus", "syllabus", "scope"],
      respond: () => {
        const list = d.chapters.map((c) => `  ${c.number}. ${c.title}`).join("\n");
        return `📖 **Chapters for ${d.code}**:\n\n${list}\n\nFocus on chapters covered in your next test!`;
      },
    },
    {
      keywords: ["assignment", "deadline", "submission", "due date"],
      respond: () => {
        const list = d.assignments
          .map((a) => `📌 **${a.name}** — Due: ${a.due}\n   ${a.description}`)
          .join("\n\n");
        return `Here are your assignments for **${d.code}**:\n\n${list}\n\nSubmit before the deadline to avoid penalties!`;
      },
    },
    {
      keywords: ["lecturer", "teacher", "professor", "contact", "email", "office"],
      respond: () =>
        `👩‍🏫 **Lecturer**: ${d.lecturer.name}\n\n📧 Email: ${d.lecturer.email}\n🏢 Office: ${d.lecturer.office}\n🕐 Office Hours: ${d.lecturer.hours}`,
    },
    {
      keywords: ["study", "tips", "how to study", "advice", "prepare"],
      respond: () => {
        const tips = d.studyTips.map((t, i) => `${i + 1}. ${t}`).join("\n");
        return `💡 **Study Tips for ${d.code}**:\n\n${tips}`;
      },
    },
    {
      keywords: ["average", "calculate", "marks", "mark"],
      respond: (input) => {
        const nums = extractNumbers(input);
        if (nums.length >= 2) {
          const avg = (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1);
          return `🧮 **Calculation**:\n\nMarks: ${nums.join(", ")}\nAverage: (${nums.join(" + ")}) ÷ ${nums.length} = **${avg}%**`;
        }
        return `🧮 To calculate your average, provide your marks like:\n\n*"Calculate my average: 70, 80, 90"*\n\nI'll do the math for you!`;
      },
    },
    {
      keywords: ["hello", "hi", "hey", "greet"],
      respond: () =>
        `👋 Hey there! I'm your **${d.code} Module Assistant**.\n\nI can help you with tests, assignments, chapters, study tips, and more. What would you like to know?`,
    },
    {
      keywords: ["thank", "thanks", "appreciate"],
      respond: () => `You're welcome! 😊 Good luck with your studies. Feel free to ask if you need anything else!`,
    },
    {
      keywords: ["help", "what can you do", "commands"],
      respond: () =>
        `🤖 I can help you with:\n\n• 📝 **Tests & Exams** — dates and chapters\n• 📌 **Assignments** — deadlines and descriptions\n• 📖 **Chapters** — full syllabus overview\n• 👩‍🏫 **Lecturer** — contact & office hours\n• 💡 **Study Tips** — proven techniques\n• 🧮 **Averages** — calculate your marks\n\nJust ask away!`,
    },
  ];

  for (const rule of rules) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule.respond(lower);
    }
  }

  return `🤔 Sorry, I don't understand that yet.\n\nTry asking about **tests**, **assignments**, **chapters**, **study tips**, or **lecturer info**.\n\nOr type **"help"** to see everything I can do!`;
}

export const quickSuggestions = [
  { label: "📝 Upcoming Tests", message: "When is my next test?" },
  { label: "📌 Assignments", message: "What assignments do I have?" },
  { label: "💡 Study Tips", message: "Give me some study tips" },
  { label: "📖 Chapters", message: "What chapters should I study?" },
  { label: "👩‍🏫 Lecturer Info", message: "Who is my lecturer?" },
  { label: "📋 Exam Info", message: "When is the final exam?" },
];
