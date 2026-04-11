# Module Mate — System Overview
### Presentation Document

---

## 1. What Is Module Mate?

Module Mate is a **web-based academic chatbot** designed to help students navigate their module information quickly and easily. Instead of digging through course portals, emails, or printed schedules, students can simply type a question and get an instant, formatted answer.

It is built specifically for **CSC2001 — Introduction to Software Engineering**, but the architecture is designed to be reusable for any module by updating a single data file.

---

## 2. Problem It Solves

Students often struggle to find quick answers to common academic questions:

- "When is my next test and what chapters does it cover?"
- "What assignments do I have and when are they due?"
- "How do I contact my lecturer?"
- "What is the exam date and venue?"

Module Mate answers all of these instantly, in a conversational interface that feels familiar and easy to use.

---

## 3. Core Features

| Feature | Description |
|---|---|
| **Test Information** | Lists all class tests with dates and chapters covered |
| **Exam Information** | Shows the final exam date, venue, and scope |
| **Assignment Tracker** | Displays all assignments with due dates and descriptions |
| **Chapter / Syllabus Overview** | Lists all 8 chapters in the module |
| **Lecturer Contact** | Provides name, email, office location, and office hours |
| **Study Tips** | Delivers 6 evidence-based study techniques |
| **Mark Calculator** | Calculates the average of marks typed by the student |
| **Quick Suggestions** | One-click buttons for the most common questions |
| **Chat History** | Conversation is saved in the browser and restored on return |
| **Clear Chat** | Students can reset the conversation at any time |

---

## 4. How the Chatbot Works

The chatbot uses a **keyword-matching rule engine** — no external AI API is required.

### Flow:
1. Student types a message (or clicks a quick suggestion button)
2. The input is converted to lowercase and checked against a list of keyword rules
3. The first matching rule triggers a response function
4. A simulated typing delay (800–1400ms) is applied to feel natural
5. The formatted response is displayed in the chat

### Keyword Categories:
- `test`, `class test`, `next test` → returns test schedule
- `exam`, `final exam`, `exam date` → returns exam details
- `chapter`, `syllabus`, `topic` → returns full chapter list
- `assignment`, `deadline`, `due date` → returns assignment list
- `lecturer`, `email`, `office`, `contact` → returns lecturer info
- `study`, `tips`, `advice`, `prepare` → returns study tips
- `average`, `calculate`, `marks` → extracts numbers and computes average
- `hello`, `hi`, `hey` → greeting response
- `help`, `what can you do` → lists all capabilities
- No match → friendly fallback message with suggestions

---

## 5. Mark Calculator (Special Feature)

The chatbot can extract numbers from natural language input and calculate an average.

**Example input:** `"Calculate my average: 70, 80, 90"`

**Output:**
```
Marks: 70, 80, 90
Average: (70 + 80 + 90) ÷ 3 = 80.0%
```

If fewer than 2 numbers are provided, it prompts the student with the correct format.

---

## 6. User Interface

The UI is a full-screen chat layout with four zones:

```
┌─────────────────────────────────────┐
│  HEADER — Logo, module name, clear  │
├─────────────────────────────────────┤
│                                     │
│  MESSAGE AREA — scrollable chat     │
│  (welcome screen on first load)     │
│                                     │
├─────────────────────────────────────┤
│  QUICK SUGGESTIONS — scrollable row │
├─────────────────────────────────────┤
│  INPUT BAR — text field + send btn  │
└─────────────────────────────────────┘
```

- Bot messages appear on the **left** with a graduation cap avatar
- User messages appear on the **right** with a user avatar
- A **typing indicator** (3 bouncing dots) shows while the bot "thinks"
- Messages support **bold** and *italic* markdown formatting
- The interface is fully **responsive** (works on mobile and desktop)

---

## 7. Data Layer

All module information lives in a single file: `src/lib/chatbot-data.ts`

This includes:
- Module name and code
- Lecturer details
- Test dates and chapters
- Exam date, venue, and scope
- Assignment names, due dates, and descriptions
- Chapter list
- Study tips
- Quick suggestion buttons

**To adapt this system for a different module**, only this one file needs to be updated — no other code changes are required.

---

## 8. Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 |
| **Language** | TypeScript |
| **Routing** | TanStack Router |
| **Styling** | Tailwind CSS v4 |
| **UI Components** | Radix UI + shadcn/ui |
| **Build Tool** | Vite |
| **Persistence** | Browser localStorage |
| **Hosting** | Netlify (static deployment) |

No backend, no database, no API keys — the entire system runs in the browser.

---

## 9. Chat History Persistence

The conversation is automatically saved to `localStorage` under the key `module-assistant-history`. When the student closes and reopens the browser, their previous conversation is restored. They can clear it at any time using the trash icon in the header.

---

## 10. Deployment

The app is deployed as a **static single-page application (SPA)** on Netlify.

- Build command: `npm run build`
- Output directory: `dist/`
- All routes redirect to `index.html` (handled by `netlify.toml`)
- No server required — fully CDN-hosted

---

## 11. Limitations & Future Improvements

**Current limitations:**
- Keyword matching is exact — it won't understand paraphrased questions it hasn't seen before
- Data is hardcoded — requires a code update to change module info

**Possible future improvements:**
- Admin panel to update module data without touching code
- Support for multiple modules with a module selector
- Integration with a real AI model (e.g. Amazon Bedrock) for open-ended questions
- Push notifications for upcoming test/assignment deadlines
- Dark mode toggle

---

## 12. Summary

Module Mate is a lightweight, fast, and easy-to-use study companion that puts all critical module information at a student's fingertips. It requires no login, no internet connection to function (after load), and no technical knowledge to use — just type a question and get an answer.
