/**
 * Single source of truth for all portfolio content.
 * Edit this file to update text, links, skills, projects and timeline —
 * the terminal, the HTML panels and the 3D scenes all read from here.
 *
 * Search for "TODO" to find values that still need your real details.
 */

const GITHUB_USER = 'sangamyo'
const GITHUB = `https://github.com/${GITHUB_USER}`

export const profile = {
  name: 'Hariom Kasaundhan',
  handle: 'hariom',
  host: 'portfolio',
  role: 'AI Engineer | Software Developer | Robotics & VLA Enthusiast',
  tagline: "Don't just read my resume. Explore my system.",
  about:
    'AI Engineer and Software Developer passionate about Artificial Intelligence, Generative AI, Computer Vision, Robotics, and Vision-Language-Action systems.',
  location: 'India', // TODO: e.g. "Greater Noida, India"
  primaryLanguage: 'Python',
  mainStack: 'PyTorch · OpenCV · LeRobot · MERN · Next.js',
  currentFocus: 'Vision-Language-Action models & robot learning',
  status: 'Open to AI / Robotics roles',
  links: {
    github: GITHUB,
    linkedin: 'https://www.linkedin.com/in/hari-om-kasaundhan-321b0b2a6/',
    email: 'sangamgupta988@gmail.com',
    phone: '+91 90059 79045',
    resume: `${import.meta.env.BASE_URL}resume.pdf`, // TODO: drop your resume at public/resume.pdf
  },
  // Optional: a Formspree / Getform / custom endpoint that accepts JSON POSTs.
  // When empty, the contact form falls back to opening the visitor's mail client.
  contactFormEndpoint: '',
}

/* ------------------------------------------------------------------ */
/* Skills                                                              */
/* ------------------------------------------------------------------ */

export const skillCategories = [
  { id: 'ai', label: 'AI / ML', color: '#39ff88' },
  { id: 'cv', label: 'Computer Vision', color: '#22e5ff' },
  { id: 'robotics', label: 'Robotics', color: '#c6ff3d' },
  { id: 'software', label: 'Software', color: '#7aa2ff' },
  { id: 'web', label: 'Full-Stack Web', color: '#b18cff' },
]

// level: 0–100 (self-assessed). context: one line shown in the hover panel.
// projects: ids from the `projects` array below.
export const skills = [
  // AI / ML
  { id: 'py-ai', name: 'Python', category: 'ai', level: 92, context: 'Primary language for models, data pipelines and tooling.', projects: ['face-detect', 'ats', 'vla'] },
  { id: 'pytorch', name: 'PyTorch', category: 'ai', level: 82, context: 'Training and fine-tuning vision and policy networks.', projects: ['ghibli', 'vla'] },
  { id: 'tensorflow', name: 'TensorFlow', category: 'ai', level: 65, context: 'Classical deep learning workflows and model export.', projects: [] },
  { id: 'ml', name: 'Machine Learning', category: 'ai', level: 82, context: 'Supervised learning, evaluation and feature engineering.', projects: ['ats'] },
  { id: 'dl', name: 'Deep Learning', category: 'ai', level: 80, context: 'CNNs, transformers and generative architectures.', projects: ['ghibli', 'vla'] },
  { id: 'genai', name: 'Generative AI', category: 'ai', level: 82, context: 'LLM-powered apps and image generation pipelines.', projects: ['ats', 'ghibli'] },
  { id: 'llms', name: 'LLMs', category: 'ai', level: 78, context: 'Prompting, tool use and structured output for real products.', projects: ['ats'] },
  { id: 'rag', name: 'RAG', category: 'ai', level: 72, context: 'Retrieval pipelines over documents with embeddings.', projects: ['ats'] },
  { id: 'finetune', name: 'Fine-tuning', category: 'ai', level: 68, context: 'Adapting pretrained models to domain-specific data.', projects: ['vla'] },

  // Computer Vision
  { id: 'opencv', name: 'OpenCV', category: 'cv', level: 88, context: 'Real-time video pipelines, filtering and geometry.', projects: ['face-detect', 'traffic'] },
  { id: 'yolo', name: 'YOLO', category: 'cv', level: 80, context: 'Real-time object detection for vehicles and scenes.', projects: ['traffic'] },
  { id: 'face', name: 'Face Detection', category: 'cv', level: 85, context: 'Haar cascades and dlib landmarks for face tracking.', projects: ['face-detect'] },
  { id: 'objdet', name: 'Object Detection', category: 'cv', level: 80, context: 'Detection, counting and tracking in live feeds.', projects: ['traffic', 'face-detect'] },
  { id: 'imgproc', name: 'Image Processing', category: 'cv', level: 84, context: 'Transforms, augmentation and style manipulation.', projects: ['ghibli', 'face-detect'] },

  // Robotics
  { id: 'ros', name: 'ROS', category: 'robotics', level: 62, context: 'Nodes, topics and robot integration basics.', projects: ['vla'] },
  { id: 'lerobot', name: 'LeRobot', category: 'robotics', level: 75, context: 'Dataset recording, training and evaluating robot policies.', projects: ['vla'] },
  { id: 'mujoco', name: 'MuJoCo', category: 'robotics', level: 70, context: 'Physics simulation for manipulation experiments.', projects: ['vla'] },
  { id: 'il', name: 'Imitation Learning', category: 'robotics', level: 72, context: 'Learning policies from teleoperated demonstrations.', projects: ['vla'] },
  { id: 'rl', name: 'Reinforcement Learning', category: 'robotics', level: 62, context: 'Reward-driven policy learning in simulation.', projects: ['vla'] },
  { id: 'diffusion', name: 'Diffusion Policy', category: 'robotics', level: 65, context: 'Diffusion-based action generation for manipulation.', projects: ['vla'] },
  { id: 'vla', name: 'VLA', category: 'robotics', level: 70, context: 'Vision-Language-Action models that map instructions to motion.', projects: ['vla'] },

  // Software
  { id: 'py-sw', name: 'Python', category: 'software', level: 92, context: 'Backends, automation, desktop apps and scripting.', projects: ['assistant', 'traffic', 'hand'] },
  { id: 'java', name: 'Java', category: 'software', level: 80, context: 'OOP and problem solving — certified by ApnaCollege.', projects: [] },
  { id: 'cpp', name: 'C++', category: 'software', level: 68, context: 'Performance-sensitive code and robotics tooling.', projects: [] },
  { id: 'sql', name: 'SQL', category: 'software', level: 78, context: 'Relational modelling and query optimisation.', projects: [] },
  { id: 'git', name: 'Git', category: 'software', level: 85, context: 'Branching workflows, reviews and versioned experiments.', projects: [] },
  { id: 'docker', name: 'Docker', category: 'software', level: 70, context: 'Reproducible environments for training and deployment.', projects: [] },
  { id: 'linux', name: 'Linux', category: 'software', level: 82, context: 'Daily driver for development, GPUs and robots.', projects: ['vla'] },

  // Full-stack web
  { id: 'js', name: 'JavaScript', category: 'web', level: 85, context: 'Interactive frontends — including this portfolio.', projects: ['algoflow'] },
  { id: 'react', name: 'React', category: 'web', level: 84, context: 'Component-driven UIs, dashboards and this 3D site.', projects: ['algoflow'] },
  { id: 'nextjs', name: 'Next.js', category: 'web', level: 80, context: 'Full-stack apps with SSR and API routes.', projects: ['algoflow'] },
  { id: 'node', name: 'Node.js', category: 'web', level: 82, context: 'MERN backends serving 500+ users at PureWashr.', projects: [] },
  { id: 'express', name: 'Express', category: 'web', level: 82, context: 'RESTful APIs and vendor-workflow integrations.', projects: [] },
  { id: 'fastapi', name: 'FastAPI', category: 'web', level: 76, context: 'Serving ML models behind clean, typed APIs.', projects: ['ats'] },
  { id: 'django', name: 'Django', category: 'web', level: 68, context: 'Batteries-included Python web backends.', projects: [] },
  { id: 'mongodb', name: 'MongoDB', category: 'web', level: 82, context: 'Document data models for real-time products.', projects: ['algoflow'] },
  { id: 'postgres', name: 'PostgreSQL', category: 'web', level: 72, context: 'Relational storage for transactional systems.', projects: [] },
]

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

// visual: which 3D hologram to render (see src/three/projectVisuals.jsx)
// live: URL or null (the Live Demo button only renders when set)
export const projects = [
  {
    id: 'face-detect',
    title: 'Real-Time Face Detection System',
    short: 'Real-time computer vision system for detecting and counting faces.',
    tech: ['Python', 'OpenCV', 'Haar Cascade', 'dlib'],
    visual: 'face',
    github: GITHUB, // TODO: link the repo once it's public
    live: null,
    details: [
      'Processes live webcam frames and draws tracked bounding boxes per face.',
      'Combines Haar cascades for speed with dlib for more robust detection.',
      'Maintains a live face count overlay for monitoring use-cases.',
    ],
  },
  {
    id: 'traffic',
    title: 'AI Traffic Signal System (SYNCRONET-AI)',
    short: 'Intelligent traffic intersection simulation using computer vision and adaptive signal logic.',
    tech: ['Python', 'OpenCV', 'YOLO', 'Pygame'],
    visual: 'traffic',
    github: `${GITHUB}/sangamyo-sangamyo-Synchronet-Traffic-Simulation-with-stats`,
    live: null,
    details: [
      'Adaptive traffic control driven by vehicle-density algorithms and real-time signal optimisation.',
      'Detects and counts vehicles per lane, adapting green-light timing instead of fixed cycles.',
      'Smart-traffic environment simulated in Python and Pygame to reduce congestion and improve flow.',
    ],
  },
  {
    id: 'ats',
    title: 'ATS Resume Checker',
    short: 'AI-powered resume analysis and job-description matching system.',
    tech: ['Python', 'Google Gemini', 'Streamlit', 'Generative AI'],
    visual: 'resume',
    github: `${GITHUB}/ats-resume-checker-by-google-gemini`,
    live: 'https://ats-resume-checker-by-google-gemini.vercel.app',
    details: [
      'ATS scoring, keyword optimisation and semantic evaluation powered by the Google Gemini API.',
      'Compares a resume against a target job description and surfaces missing keywords.',
      'Interactive Streamlit interface delivering real-time, actionable feedback.',
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
    id: 'hand',
    title: 'Hand Gesture Control System',
    short: 'Touchless computer control with hand gestures and voice.',
    tech: ['Python', 'OpenCV', 'MediaPipe', 'Speech Recognition'],
    visual: 'hand',
    github: `${GITHUB}/control_with_hand_gesture`,
    live: null,
    details: [
      'Computer-vision control system built with OpenCV and MediaPipe hand tracking.',
      'Gesture-driven screen control plus voice-controlled volume.',
      'Multimodal, touchless input that improves usability and accessibility.',
    ],
  },
  {
    id: 'assistant',
    title: 'AI Desktop Assistant',
    short: 'Voice-controlled desktop assistant.',
    tech: ['Python', 'PyQt', 'Tkinter', 'Speech Recognition'],
    visual: 'voice',
    github: GITHUB, // TODO: link the repo once it's public
    live: null,
    details: [
      'Listens for voice commands and maps them to desktop actions.',
      'GUI front-ends built with PyQt and Tkinter.',
      'Handles app launching, web search and everyday automation tasks.',
    ],
  },
  {
    id: 'ghibli',
    title: 'Ghibli Image Converter',
    short: 'AI-based image style transformation project.',
    tech: ['Python', 'PyTorch', 'Computer Vision'],
    visual: 'style',
    github: GITHUB, // TODO: link the repo once it's public
    live: null,
    details: [
      'Transforms photographs into a Ghibli-inspired illustrated style.',
      'Built on PyTorch image-to-image models.',
      'Pre- and post-processing pipeline to preserve structure and detail.',
    ],
  },
  {
    id: 'vla',
    title: 'Robotics / VLA Work',
    short: 'Robotics data collection, simulation, imitation learning, and VLA experimentation.',
    tech: ['LeRobot', 'PyTorch', 'MuJoCo', 'Vision-Language-Action'],
    visual: 'robot',
    github: GITHUB, // TODO: link the repo once it's public
    live: null,
    details: [
      'Collects teleoperated demonstration datasets with LeRobot.',
      'Trains imitation-learning and diffusion policies, evaluated in MuJoCo.',
      'Experiments with Vision-Language-Action models conditioned on instructions.',
    ],
  },
]

/* ------------------------------------------------------------------ */
/* Experience timeline                                                 */
/* ------------------------------------------------------------------ */

export const timeline = [
  {
    id: 'freelance',
    kind: 'work',
    company: 'Freelance',
    role: 'Software Developer',
    duration: 'Jun 2023 – Feb 2024',
    responsibilities: [
      'Built production-grade authentication systems, dashboards and automation tools for multiple client-style projects.',
      'Optimised backend logic and added caching strategies.',
    ],
    tech: ['JavaScript', 'Node.js', 'React', 'MongoDB', 'JWT / OAuth'],
    achievements: ['Reduced API response time by 50%.'],
  },
  {
    id: 'purewashr',
    kind: 'work',
    company: 'PureWashr',
    role: 'Full Stack Developer Intern',
    duration: 'Sep 2024 – Feb 2025',
    responsibilities: [
      'Architected and deployed a scalable MERN platform with real-time scheduling and order tracking.',
      'Engineered RESTful APIs and integrated 15+ vendor workflows.',
      'Optimised backend performance through query optimisation and efficient API design.',
    ],
    tech: ['MongoDB', 'Express', 'React', 'Node.js', 'REST APIs'],
    achievements: [
      'Platform serving 500+ active users.',
      'Reduced latency by 40%.',
      'Helped secure INR 1L+ funding and Startup India recognition.',
    ],
  },
  {
    id: 'addverb',
    kind: 'work',
    company: 'Addverb Technologies',
    role: 'Robotics & AI Intern',
    duration: 'May 2026 – Nov 2026',
    responsibilities: [
      "Working in the CEO Office's Advanced Robotics department on VLA (Vision-Language-Action) data collection for robotic manipulation models.",
      'Contributing to teleoperation pipelines and automation workflows for data collection across remote and local machines.',
      'Supporting development of AI-driven robotic systems to advance autonomous manipulation.',
    ],
    tech: ['Python', 'LeRobot', 'Teleoperation', 'VLA', 'Linux'],
    achievements: ['Building the data foundation for next-generation robot manipulation models.'],
  },
  {
    id: 'now',
    kind: 'milestone',
    company: 'Now',
    role: 'Building intelligent embodied systems',
    duration: '2026 →',
    responsibilities: ['Exploring Vision-Language-Action models and robot foundation models.'],
    tech: ['VLA', 'Diffusion Policy', 'LeRobot'],
    achievements: ['Open to AI / Robotics / Full-Stack engineering roles.'],
  },
]

/* ------------------------------------------------------------------ */
/* Education                                                           */
/* ------------------------------------------------------------------ */

export const education = {
  degree: 'B.Tech — Computer Science Engineering',
  school: 'GL Bajaj Institute of Technology and Management',
  university: 'Dr. A.P.J. Abdul Kalam Technical University',
  years: '2023 – 2026',
  previous: [
    { degree: 'Polytechnic Diploma — Computer Science', school: 'Board of Technical Education, Uttar Pradesh', years: '2020 – 2023' },
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
  { label: 'LLMs', view: 'projects', focus: 'ats' },
  { label: 'ROBOTICS', view: 'experience', focus: 'addverb' },
  { label: 'VLA', view: 'projects', focus: 'vla' },
  { label: 'DEEP LEARNING', view: 'skills', focus: 'ai' },
  { label: 'SOFTWARE ENGINEERING', view: 'projects', focus: 'algoflow' },
]

export const getProject = (id) => projects.find((p) => p.id === id)
export const getCategory = (id) => skillCategories.find((c) => c.id === id)
