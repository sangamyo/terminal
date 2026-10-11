/**
 * Single source of truth for all portfolio content.
 * Edit this file to update text, links, skills, projects and timeline —
 * the terminal, the HTML panels and the 3D scenes all read from here.
 */

const GITHUB_USER = 'sangamyo'
const GITHUB = `https://github.com/${GITHUB_USER}`

export const profile = {
  name: 'Hari Om Kasaundhan',
  handle: 'hari-om',
  host: 'portfolio',
  role: 'AI Engineer | Software Engineer | Robotics & VLA',
  tagline: "Don't just read my resume. Explore my system.",
  about:
    'AI Engineer and Software Engineer (B.Tech CSE 2026) building Python backends and LLM-powered data systems with FastAPI, PostgreSQL, embeddings and semantic search. Currently a Robotics & AI Intern at Addverb Technologies, building robot-learning (VLA) datasets with LeRobot, MuJoCo and PyTorch.',
  location: 'Greater Noida / Noida, India',
  primaryLanguage: 'Python',
  mainStack: 'Python · FastAPI · PyTorch · PostgreSQL · React',
  currentFocus: 'LLM data tooling & robot-learning (VLA) data',
  status: 'Available immediately — open to AI / Software Engineer roles',
  links: {
    github: GITHUB,
    linkedin: 'https://www.linkedin.com/in/hari-om-kasaundhan-321b0b2a6/',
    email: 'hariomkasaundhan988@gmail.com',
    phone: '+91 90059 79045',
    resume: `${import.meta.env.BASE_URL}resume.pdf`,
  },
  // Optional: a Formspree / Getform / custom endpoint that accepts JSON POSTs.
  // When empty, the contact form falls back to opening the visitor's mail client.
  contactFormEndpoint: '',
}

/* ------------------------------------------------------------------ */
/* Skills                                                              */
/* ------------------------------------------------------------------ */

export const skillCategories = [
  { id: 'ai', label: 'AI / ML', color: '#5cf2c8' },
  { id: 'cv', label: 'Computer Vision', color: '#6cb8ff' },
  { id: 'robotics', label: 'Robotics', color: '#ffb86b' },
  { id: 'software', label: 'Software', color: '#9d8cff' },
  { id: 'web', label: 'Backend & Web', color: '#e58cff' },
]

// level: 0–100 (self-assessed). context: one line shown in the hover panel.
// projects: ids from the `projects` array below.
export const skills = [
  // AI / ML
  { id: 'py-ai', name: 'Python', category: 'ai', level: 92, context: 'Primary language for backends, data pipelines and ML tooling.', projects: ['datalens', 'ats', 'vla', 'pdfrag'] },
  { id: 'pytorch', name: 'PyTorch', category: 'ai', level: 72, context: 'PyTorch-based VLA training and evaluation pipelines at Addverb.', projects: ['vla'] },
  { id: 'ml', name: 'Machine Learning', category: 'ai', level: 76, context: 'Dataset quality, evaluation and the workflow around models.', projects: ['datalens', 'ats'] },
  { id: 'dl', name: 'Deep Learning', category: 'ai', level: 72, context: 'Neural networks, transformers and embedding models.', projects: ['vla', 'ghibli'] },
  { id: 'genai', name: 'Generative AI', category: 'ai', level: 80, context: 'LLM-powered products: dataset QC, natural-language search, resume analysis.', projects: ['datalens', 'ats', 'pdfrag', 'ragchat'] },
  { id: 'llms', name: 'LLMs', category: 'ai', level: 80, context: 'Gemini / Claude APIs, prompt templates, validated structured output and in-browser models.', projects: ['datalens', 'ats', 'pdfrag', 'ragchat'] },
  { id: 'rag', name: 'RAG', category: 'ai', level: 74, context: 'Hybrid BM25 + vector retrieval, grounded prompts with citations, and answer checks.', projects: ['pdfrag', 'ragchat'] },
  { id: 'embeddings', name: 'Embeddings / Semantic Search', category: 'ai', level: 74, context: 'bge-small embeddings in pgvector with an HNSW index (~6 ms top-25 queries), and in the browser.', projects: ['datalens', 'pdfrag', 'ragchat'] },
  { id: 'hf', name: 'Hugging Face', category: 'ai', level: 74, context: 'Importing instruction / chat datasets and running embedding models.', projects: ['datalens', 'ragchat'] },

  // Computer Vision
  { id: 'opencv', name: 'OpenCV', category: 'cv', level: 75, context: 'Real-time webcam pipelines for hand tracking and face detection.', projects: ['hand', 'face-detect'] },
  { id: 'face', name: 'Face Detection', category: 'cv', level: 72, context: 'Haar cascades and dlib for face tracking.', projects: ['face-detect'] },
  { id: 'objdet', name: 'Object Detection', category: 'cv', level: 65, context: 'Detection and counting in live video feeds.', projects: ['face-detect'] },
  { id: 'mediapipe', name: 'MediaPipe', category: 'cv', level: 70, context: 'Hand landmark tracking for gesture control, in Python and in the browser.', projects: ['hand'] },
  { id: 'imgproc', name: 'Image Processing', category: 'cv', level: 72, context: 'Transforms, filtering and style manipulation.', projects: ['ghibli', 'face-detect'] },

  // Robotics
  { id: 'lerobot', name: 'LeRobot', category: 'robotics', level: 75, context: 'Recording teleoperated manipulation datasets in LeRobot format.', projects: ['vla'] },
  { id: 'mujoco', name: 'MuJoCo', category: 'robotics', level: 65, context: 'Simulation for robotic-manipulation VLA pipelines.', projects: ['vla'] },
  { id: 'il', name: 'Imitation Learning', category: 'robotics', level: 62, context: 'Teleoperated demonstration data for learning manipulation from examples.', projects: ['vla'] },
  { id: 'vla', name: 'VLA', category: 'robotics', level: 68, context: 'Vision-Language-Action datasets and training / evaluation pipelines.', projects: ['vla'] },

  // Software
  { id: 'py-sw', name: 'Python', category: 'software', level: 92, context: 'Backends, automation, desktop apps and scripting.', projects: ['datalens', 'traffic', 'hand', 'assistant'] },
  { id: 'java', name: 'Java', category: 'software', level: 75, context: 'OOP and problem solving — certified by ApnaCollege.', projects: [] },
  { id: 'sql', name: 'SQL', category: 'software', level: 78, context: 'Relational modelling, queries and indexing.', projects: ['datalens'] },
  { id: 'dsa', name: 'Data Structures & Algorithms', category: 'software', level: 78, context: 'Problem-solving practice, tracked with AlgoFlow.', projects: ['algoflow'] },
  { id: 'bash', name: 'Bash', category: 'software', level: 75, context: 'Automating teleoperation and data-collection workflows across machines.', projects: ['vla'] },
  { id: 'pytest', name: 'pytest', category: 'software', level: 76, context: 'Unit and integration tests: 280 in DataLens, plus the Ghibli converter and Jarvis.', projects: ['datalens', 'ghibli', 'assistant'] },
  { id: 'git', name: 'Git', category: 'software', level: 82, context: 'Branching workflows, reviews and versioned experiments.', projects: [] },
  { id: 'docker', name: 'Docker', category: 'software', level: 72, context: 'Containerised FastAPI, PostgreSQL and Redis services.', projects: ['datalens'] },
  { id: 'linux', name: 'Linux', category: 'software', level: 80, context: 'Daily driver for development and robot data collection.', projects: ['vla'] },

  // Backend & web
  { id: 'fastapi', name: 'FastAPI', category: 'web', level: 80, context: 'Typed Python APIs and background data pipelines.', projects: ['datalens'] },
  { id: 'rest', name: 'REST APIs', category: 'web', level: 84, context: 'API design for booking, order-status and data services.', projects: ['datalens', 'algoflow'] },
  { id: 'postgres', name: 'PostgreSQL', category: 'web', level: 78, context: 'Relational storage, indexing and vector search.', projects: ['datalens'] },
  { id: 'pgvector', name: 'pgvector', category: 'web', level: 72, context: 'Embedding storage with an HNSW index for semantic search.', projects: ['datalens'] },
  { id: 'redis', name: 'Redis', category: 'web', level: 70, context: 'Job queue for background dataset import and QC.', projects: ['datalens'] },
  { id: 'mongodb', name: 'MongoDB', category: 'web', level: 82, context: 'Document models, indexing and query optimisation.', projects: ['algoflow'] },
  { id: 'node', name: 'Node.js', category: 'web', level: 82, context: 'MERN backends serving 500+ users at PureWashr.', projects: [] },
  { id: 'express', name: 'Express', category: 'web', level: 82, context: 'REST APIs and 15+ vendor-workflow integrations.', projects: [] },
  { id: 'django', name: 'Django', category: 'web', level: 62, context: 'Batteries-included Python web backends.', projects: [] },
  { id: 'js', name: 'JavaScript', category: 'web', level: 82, context: 'Interactive frontends — including this portfolio.', projects: ['algoflow', 'ghibli', 'ragchat'] },
  { id: 'ts', name: 'TypeScript', category: 'web', level: 70, context: 'Typed React frontends.', projects: ['datalens'] },
  { id: 'react', name: 'React', category: 'web', level: 82, context: 'Component-driven UIs, dashboards and this 3D site.', projects: ['datalens', 'algoflow'] },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'web', level: 72, context: 'Utility-first styling for React and Next.js apps.', projects: [] },
  { id: 'nextjs', name: 'Next.js', category: 'web', level: 76, context: 'Full-stack apps with API routes.', projects: ['algoflow'] },
]

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

// visual: which 3D hologram to render (see src/three/projectVisuals.jsx)
// github / live: URL or null (each button only renders when set)
export const projects = [
  {
    id: 'datalens',
    title: 'DataLens',
    short: 'Data-quality platform for LLM fine-tuning datasets.',
    tech: ['Python', 'FastAPI', 'PostgreSQL / pgvector', 'Redis', 'Docker', 'React', 'LLMs', 'Hugging Face'],
    visual: 'data',
    github: `${GITHUB}/datalens`,
    live: 'https://huggingface.co/spaces/sangamyo/datalens',
    details: [
      'Imports Hugging Face instruction / chat datasets and runs 8 quality checks per sample: MinHash/LSH near-duplicates, PII, refusal boilerplate, length outliers and formatting.',
      'Natural-language search where an LLM (Gemini / Claude) outputs a validated filter object — never raw SQL — with a rule-based fallback.',
      'Semantic search with bge-small embeddings in pgvector and an HNSW index (~6 ms top-25 queries); the live demo runs the same model in the browser.',
      'On databricks-dolly-15k (15,011 rows): import ~7 s, QC ~15 s; found 16 exact duplicates, 9 near-duplicates and 8 PII rows. 280 pytest tests.',
    ],
  },
  {
    id: 'pdfrag',
    title: 'PDF RAG Chat',
    short: 'Chatbot that answers questions from the text, tables, charts and images inside PDFs, with page citations.',
    tech: ['Python', 'Groq (Qwen 3.8)', 'PyMuPDF', 'fastembed', 'BM25', 'Streamlit'],
    visual: 'rag',
    github: `${GITHUB}/pdf-rag-chat`,
    live: 'https://pdf-rag-chat-hariom.streamlit.app',
    details: [
      'Extracts body text, tables (as Markdown) and figures from PDFs with PyMuPDF, including vector-drawn charts, which are cropped with their axis labels and captions.',
      'A vision LLM describes every chart and image at ingest, including a table of the data values it reads, so charts become searchable text.',
      'Hybrid retrieval: bge-small embeddings (fastembed / ONNX) plus BM25 keyword search, merged with reciprocal rank fusion.',
      'Streams answers with [p. N] page citations from Groq (Claude optional); ingest is cached by file hash and deployed on Streamlit Cloud.',
    ],
  },
  {
    id: 'ragchat',
    title: 'RAG Chat (in-browser)',
    short: 'Ask questions about your PDFs and notes with cited answers. Retrieval and the LLM both run in your browser.',
    tech: ['JavaScript', 'transformers.js', 'WebLLM', 'WebGPU', 'BM25', 'pdf.js'],
    visual: 'chat',
    github: `${GITHUB}/rag-chat`,
    live: 'https://sangamyo.github.io/rag-chat/',
    details: [
      'Ingests PDFs (pdf.js with page-aware line reconstruction), Markdown and text; overlapping chunks are embedded with bge-small in a Web Worker.',
      'Hybrid retrieval: cosine similarity plus BM25, merged with reciprocal rank fusion, with a relevance cut-off so off-topic questions return "not found".',
      'Answers stream from an in-browser LLM (Qwen2.5 / Llama 3.2 via WebLLM on WebGPU) with clickable [n] citations and a sources panel showing page and match type.',
      'Guard rails: a grounding check withholds answers the sources do not support, plus citation repair and extractive quick answers without a GPU; 17 tests in CI.',
    ],
  },
  {
    id: 'ats',
    title: 'ATS Resume Checker',
    short: 'LLM-powered resume analyser that scores a resume against a job description.',
    tech: ['Python', 'Google Gemini API', 'Streamlit', 'PDF parsing'],
    visual: 'resume',
    github: `${GITHUB}/ATS_RESUME_CHECKER_BY_GOOGLE_GEMiNI`,
    live: 'https://atsresumecheckerbyappgeminigit-uw8c5qferlp44dqjjuas6w.streamlit.app',
    details: [
      'Scores a resume against a job description with the Google Gemini API and reports missing keywords.',
      'Section-level feedback, with prompt templates that return structured JSON output.',
      'Parses uploaded PDF resumes; deployed on Streamlit.',
    ],
  },
  {
    id: 'assistant',
    title: 'AI Desktop Assistant (Jarvis)',
    short: 'Voice assistant you talk or type to, with a live web edition and a Tkinter desktop app.',
    tech: ['Python', 'Tkinter', 'JavaScript', 'Web Speech API', 'Speech Recognition'],
    visual: 'voice',
    github: `${GITHUB}/ai-desktop-assistant`,
    live: 'https://sangamyo.github.io/ai-desktop-assistant/',
    details: [
      'Understands spoken or typed requests: live weather (Open-Meteo), Wikipedia summaries, definitions, a safe calculator, timers and reminders, notes, web and YouTube search.',
      'Desktop app (Tkinter) also launches apps, plays local music and starts hand-gesture control; voice via SpeechRecognition and pyttsx3.',
      'Web edition runs in the browser with the Web Speech API and an animated orb that reacts to your voice.',
      'One skill engine in Python and JavaScript, covered by pytest and node:test suites in CI.',
    ],
  },
  {
    id: 'ghibli',
    title: 'Ghibli Image Converter',
    short: 'Turns photos into a Ghibli-inspired painting in the browser with a pretrained AnimeGANv3 model.',
    tech: ['Python', 'ONNX Runtime', 'WebGPU', 'JavaScript', 'AnimeGANv3'],
    visual: 'style',
    github: `${GITHUB}/ghibli-image-converter`,
    live: 'https://sangamyo.github.io/ghibli-image-converter/',
    details: [
      'Runs the pretrained AnimeGANv3 "Hayao" model (ONNX) from a Python CLI and from a static web app; photos never leave the device.',
      'Pre/post-processing: size cap, multiple-of-8 snapping, [-1, 1] NHWC tensors, EXIF rotation, output restored to the original size.',
      'In-browser inference with ONNX Runtime Web on WebGPU (~0.3–1 s per photo) with a WebAssembly fallback; before/after slider and PNG download.',
      'pytest suite and GitHub Actions CI; deployed on GitHub Pages.',
    ],
  },
  {
    id: 'traffic',
    title: 'SYNCRONET-AI Traffic Signals',
    short: 'Density-based adaptive traffic-signal simulation in Python and Pygame.',
    tech: ['Python', 'Pygame', 'asyncio', 'WebAssembly'],
    visual: 'traffic',
    github: `${GITHUB}/sangamyo-sangamyo-Synchronet-Traffic-Simulation-with-stats`,
    live: 'https://sangamyo.github.io/sangamyo-sangamyo-Synchronet-Traffic-Simulation-with-stats/',
    details: [
      'Simulates a four-way intersection — vehicles, lanes, turns and timed signals — in Python and Pygame.',
      'Density-based adaptive signals: each green phase is lengthened according to the number of vehicles waiting at that signal.',
      'Shows live per-direction vehicle counts and cumulative traffic statistics at the end of a run.',
      'Runs in the browser: a single asyncio loop compiled to WebAssembly with pygbag, deployed to GitHub Pages.',
    ],
  },
  {
    id: 'hand',
    title: 'Hand Gesture Control System',
    short: 'Touchless computer control with hand gestures and voice.',
    tech: ['Python', 'OpenCV', 'MediaPipe', 'PyAutoGUI', 'Speech Recognition'],
    visual: 'hand',
    github: `${GITHUB}/control_with_hand_gesture`,
    live: 'https://sangamyo.github.io/control_with_hand_gesture/',
    details: [
      'Mouse control: the index finger moves the cursor and switching to the middle finger clicks, mapped from a frame in the webcam view with smoothing.',
      'Volume control: the thumb-to-index pinch distance sets the system volume.',
      'Voice assistant for Wikipedia lookups, the time and opening sites, with spoken replies.',
      'Live browser version: the same MediaPipe hand model and gesture rules in JavaScript, running on-device.',
    ],
  },
  {
    id: 'algoflow',
    title: 'AlgoFlow Tracker',
    short: 'Full-stack DSA analytics platform with real-time progress tracking.',
    tech: ['Next.js', 'MongoDB', 'REST APIs', 'Auth'],
    visual: 'algo',
    github: `${GITHUB}/AlgoFlow-tracker`,
    live: 'https://algo-flow-tracker.vercel.app',
    details: [
      'Scalable full-stack platform built with Next.js and MongoDB to track DSA progress.',
      'Real-time analytics dashboards and secure authentication.',
      'Cloud-deployed architecture with optimised REST APIs for high availability.',
    ],
  },
  {
    id: 'vla',
    title: 'Robotics / VLA Work',
    short: 'Teleoperated robot-manipulation datasets and data-collection automation for VLA models at Addverb.',
    tech: ['Python', 'PyTorch', 'LeRobot', 'MuJoCo', 'Bash', 'Linux'],
    visual: 'robot',
    github: null, // internal work at Addverb — no public repo
    live: null,
    details: [
      'Built teleoperated robot-manipulation datasets used to train Vision-Language-Action (VLA) models, recorded in LeRobot dataset format.',
      'Automated teleoperation and data-collection workflows with Bash across remote and local machines, replacing repetitive manual setup and recording steps.',
      'Worked with MuJoCo simulation and PyTorch-based VLA training/evaluation pipelines for robotic manipulation.',
    ],
  },
  {
    id: 'face-detect',
    title: 'Real-Time Face Detection System',
    short: 'Real-time computer vision system for detecting and counting faces.',
    tech: ['Python', 'OpenCV', 'Haar Cascade', 'dlib'],
    visual: 'face',
    github: null, // no public repo
    live: null,
    details: [
      'Processes live webcam frames and draws tracked bounding boxes per face.',
      'Combines Haar cascades for speed with dlib for more robust detection.',
      'Maintains a live face count overlay for monitoring use-cases.',
    ],
  },
]

/* ------------------------------------------------------------------ */
/* Experience timeline                                                 */
/* ------------------------------------------------------------------ */

// Oldest first: the 3D timeline runs left → right in this order.
export const timeline = [
  {
    id: 'freelance',
    kind: 'work',
    company: 'Freelance',
    role: 'Software Developer',
    duration: 'Jun 2023 – Feb 2024',
    responsibilities: [
      'Built JWT-based authentication, admin dashboards and automation scripts for client projects (Node.js, Express, MongoDB).',
      'Reduced API response time by 50% by caching frequently read endpoints.',
    ],
    tech: ['Node.js', 'Express', 'MongoDB', 'JWT'],
    achievements: ['50% faster API responses through endpoint caching.'],
  },
  {
    id: 'purewashr',
    kind: 'work',
    company: 'PureWashr',
    role: 'Full Stack Developer Intern',
    duration: 'Mar 2024 – Feb 2025',
    responsibilities: [
      'Built a MERN platform (MongoDB, Express, React, Node.js) with real-time scheduling and order tracking for a Startup India recognised startup, serving 500+ active users.',
      'Designed REST APIs and integrated 15+ vendor workflows for booking, pickup and order-status updates.',
      'Reduced API latency by 40% through MongoDB query optimisation, indexing and leaner API responses.',
    ],
    tech: ['MongoDB', 'Express', 'React', 'Node.js', 'REST APIs'],
    achievements: ['Platform serving 500+ active users.', '15+ vendor workflows integrated.', '40% lower API latency.'],
  },
  {
    id: 'addverb',
    kind: 'work',
    company: 'Addverb Technologies',
    role: 'Robotics & AI Intern · Advanced Robotics, CEO Office',
    duration: 'May 2026 – Present',
    responsibilities: [
      'Built teleoperated robot-manipulation datasets used to train Vision-Language-Action (VLA) models, recorded in LeRobot dataset format.',
      'Automated teleoperation and data-collection workflows with Bash across remote and local machines, replacing repetitive manual setup and recording steps.',
      'Worked with MuJoCo simulation and PyTorch-based VLA training/evaluation pipelines for robotic manipulation.',
    ],
    tech: ['Python', 'PyTorch', 'LeRobot', 'MuJoCo', 'Bash', 'Linux'],
    achievements: ['Robot-manipulation datasets in LeRobot format, used to train VLA models.', 'Automated data collection across remote and local machines.'],
  },
  {
    id: 'now',
    kind: 'milestone',
    company: 'Now',
    role: 'Open to work',
    duration: '2026 →',
    responsibilities: ['Building LLM data tooling (DataLens), RAG apps and robot-learning (VLA) data.'],
    tech: ['Python', 'FastAPI', 'LLMs', 'LeRobot'],
    achievements: ['Available immediately — open to AI Engineer, Software Engineer and ML roles.'],
  },
]

/* ------------------------------------------------------------------ */
/* Education                                                           */
/* ------------------------------------------------------------------ */

export const education = {
  degree: 'B.Tech — Computer Science & Engineering (lateral entry)',
  school: 'G L Bajaj Institute of Technology & Management, Greater Noida',
  university: 'Dr. A.P.J. Abdul Kalam Technical University (AKTU)',
  years: '2023 – 2026',
  grade: 'CGPA 7.8/10',
  previous: [
    { degree: 'Diploma — Computer Science', school: 'Government Polytechnic Deeh, Unnao (BTEUP)', years: '2020 – 2023', grade: '71%' },
  ],
  certifications: [
    { name: 'Java & Problem Solving', issuer: 'ApnaCollege', badge: 'JV' },
    { name: 'Python Certification', issuer: 'Infosys Springboard', badge: 'PY' },
    { name: 'Programming in C', issuer: 'Infosys Springboard', badge: 'C' },
  ],
}

/* ------------------------------------------------------------------ */
/* AI Core orbit domains → where clicking them takes the camera        */
/* ------------------------------------------------------------------ */

export const domains = [
  { label: 'PYTHON', view: 'skills', focus: 'software' },
  { label: 'AI / ML', view: 'skills', focus: 'ai' },
  { label: 'COMPUTER VISION', view: 'skills', focus: 'cv' },
  { label: 'LLMs', view: 'projects', focus: 'datalens' },
  { label: 'ROBOTICS', view: 'experience', focus: 'addverb' },
  { label: 'VLA', view: 'projects', focus: 'vla' },
  { label: 'DEEP LEARNING', view: 'skills', focus: 'ai' },
  { label: 'SOFTWARE ENGINEERING', view: 'projects', focus: 'algoflow' },
]

export const getProject = (id) => projects.find((p) => p.id === id)
export const getCategory = (id) => skillCategories.find((c) => c.id === id)
