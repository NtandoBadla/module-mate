# 🎓 Module Mate

**Module Mate** is a lightweight, web-based academic chatbot that helps students quickly access important module information through a simple conversational interface. Instead of searching through learning management systems, emails, or course documents, students can ask questions in natural language and receive instant, well-formatted responses.

The application is currently configured for **CSC2001 – Introduction to Software Engineering**, but its modular design allows it to be adapted for any course by updating a single data file.

---

## 📖 Overview

Module Mate serves as a digital study companion, providing students with immediate access to essential academic information such as:

* 📅 Test schedules
* 📝 Assignment deadlines
* 🎯 Exam information
* 📚 Module chapters
* 👨‍🏫 Lecturer contact details
* 💡 Study tips
* 🧮 Mark average calculator

The chatbot operates entirely in the browser without requiring a backend server, database, or external AI services.

---

## ✨ Features

* 📅 **Test Information** – View upcoming class tests, dates, and covered chapters.
* 🎓 **Exam Information** – Access final exam date, venue, and syllabus.
* 📝 **Assignment Tracker** – Keep track of assignment deadlines and descriptions.
* 📚 **Chapter Overview** – Browse all module chapters.
* 👨‍🏫 **Lecturer Information** – View lecturer contact details, office location, and office hours.
* 💡 **Study Tips** – Receive evidence-based study techniques.
* 🧮 **Mark Calculator** – Calculate average marks directly within the chat.
* ⚡ **Quick Suggestions** – Frequently asked questions available with one click.
* 💬 **Persistent Chat History** – Conversations are automatically saved.
* 🗑️ **Clear Chat** – Reset the conversation at any time.
* 📱 **Responsive Design** – Optimized for desktop, tablet, and mobile devices.

---

## 🚀 Live Demo



```text
https://module-mate.netlify.app
```

---

## 📸 Screenshots

Include screenshots of:

* Welcome Screen
* Chat Interface
* Test Information
* Assignment Tracker
* Lecturer Information
* Mark Calculator
* Mobile View

---

## 🏗️ How It Works

Module Mate uses a **keyword-based rule engine** instead of artificial intelligence.

### Workflow

```text
Student Message
      │
      ▼
Convert Input to Lowercase
      │
      ▼
Keyword Matching
      │
      ▼
Matching Response Function
      │
      ▼
Typing Animation
      │
      ▼
Formatted Chat Response
```

The chatbot recognizes keywords and responds with relevant information instantly, creating a fast and reliable user experience.

---

## 🔍 Supported Topics

The chatbot can answer questions about:

* Test schedules
* Final examinations
* Assignments
* Chapters and syllabus
* Lecturer information
* Office hours
* Study tips
* Average mark calculations
* General greetings
* Help and supported commands

If no matching keywords are found, Module Mate provides a friendly fallback response with suggested questions.

---

## 🧮 Mark Calculator

Module Mate can extract numbers from natural language and calculate the average mark.

### Example

**Input**

```text
Calculate my average: 70, 80, 90
```

**Output**

```text
Marks: 70, 80, 90

Average:
(70 + 80 + 90) ÷ 3 = 80.0%
```

If fewer than two marks are provided, the chatbot prompts the user with the correct input format.

---

## 🎨 User Interface

The application consists of four main sections:

```text
┌─────────────────────────────────────┐
│ Header                              │
├─────────────────────────────────────┤
│                                     │
│ Chat Messages                       │
│                                     │
├─────────────────────────────────────┤
│ Quick Suggestions                   │
├─────────────────────────────────────┤
│ Message Input                       │
└─────────────────────────────────────┘
```

### Interface Features

* Graduation cap avatar for chatbot messages
* User avatar for student messages
* Typing indicator animation
* Markdown support (bold and italic text)
* Scrollable chat history
* Responsive layout for all screen sizes

---

## 📂 Project Structure

```text
src/
│
├── components/
├── lib/
│   └── chatbot-data.ts
├── routes/
├── hooks/
├── App.tsx
└── main.tsx
```

The chatbot content is stored in:

```text
src/lib/chatbot-data.ts
```

Updating this file allows the chatbot to support a completely different module without changing the application logic.

---

## 🛠️ Technology Stack

| Layer         | Technology           |
| ------------- | -------------------- |
| Framework     | React 19             |
| Language      | TypeScript           |
| Routing       | TanStack Router      |
| Styling       | Tailwind CSS v4      |
| UI Components | Radix UI + shadcn/ui |
| Build Tool    | Vite                 |
| Storage       | Browser localStorage |
| Hosting       | Netlify              |

---

## 💾 Chat History

Module Mate automatically stores conversations using **Browser localStorage**.

Features include:

* Automatic conversation saving
* Session restoration after reopening the browser
* One-click chat clearing

No user account or login is required.

---

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/NtandoBadla/module-mate.git
```

Navigate into the project:

```bash
cd module-mate
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

---

## 🌐 Deployment

Module Mate is designed for static deployment on **Netlify**.

### Build Settings

```text
Build Command:
npm run build

Publish Directory:
dist/
```

The application uses a single-page application (SPA) configuration with routing handled through `netlify.toml`.

No backend server or database is required.

---

## 🔮 Future Improvements

Planned enhancements include:

* Admin dashboard for managing module information
* Multi-module support
* AI-powered conversational responses
* Push notifications for tests and assignments
* Dark mode
* Calendar integration
* Student authentication
* Analytics dashboard

---

## ⚠️ Current Limitations

* Uses keyword matching rather than natural language understanding.
* Module information is currently hardcoded.
* New modules require updating the data file.

---

## 👨‍💻 Author

**Ntando Badla** , **Anita Lotterning** *and* **Semoshwe Mapokgole**

Software Developers

### Technologies

* React
* TypeScript
* Java
* Laravel
* MySQL
* Tailwind CSS
* REST APIs

**GitHub:** [https://github.com/NtandoBadla](https://github.com/NtandoBadla/module-mate)



---

## 📄 License

This project is licensed under the **MIT License**.

---

## ⭐ Support

If you found this project useful, consider giving it a **⭐ Star** on GitHub. It helps others discover the project and supports future development.
