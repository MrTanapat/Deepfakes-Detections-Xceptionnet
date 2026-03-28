export const en = {
  common: {
    login: "Login",
    register: "Register",
    dashboard: "Dashboard",
    detect: "Detect",
    history: "History",
    admin: "Admin",
    logout: "Logout",
    language: "Language",
    upload: "Upload File",
    result: "Result",
    signIn: "Sign in",
    getStarted: "Get started",
  },
  navbar: {
    how: "How",
    features: "Features",
    stats: "Stats",
  },
  hero: {
    badge: "Powered by XceptionNet + Context Expansion",
    titleLine1: "Detect deepfakes",
    titleLine2: "with precision.",
    description:
      "Advanced deepfake detection using deep learning. Upload a photo or video — our AI analyzes facial artifacts invisible to the human eye.",
    startDetection: "Start Detection",
    learnMore: "Learn more",
  },
  home: {
    title: "Welcome",
    subtitle: "Your detection system",
  },
  stats: {
  detectionAccuracy: "Detection Accuracy",
  trainingFrames: "Training Frames",
  manipulationMethods: "Manipulation Methods",
  avgResponseTime: "Avg. Response Time",
},
how: {
  eyebrow: "Process",
  title: "How it works",
  steps: {
    upload: {
      title: "Upload Media",
      desc: "Drag & drop or select your image or video file. We support all major formats up to 500MB.",
    },
    analysis: {
      title: "AI Analysis",
      desc: "XceptionNet scans for facial artifacts using Context Expansion — capturing cues beyond just the face region.",
    },
    results: {
      title: "Get Results",
      desc: "Receive a confidence score with a detailed breakdown of detected manipulation signals.",
    },
  },
},
features: {
  eyebrow: "Capabilities",
  title: "Built for accuracy",
  items: {
    contextExpansion: {
      tag: "Core Tech",
      title: "Context Expansion",
      desc: "Analyzes beyond the face boundary — hair, neck, and edge regions often reveal manipulation artifacts.",
    },
    videoFrameAnalysis: {
      tag: "Video",
      title: "Video Frame Analysis",
      desc: "Intelligently samples frames and aggregates predictions for a robust, reliable result.",
    },
    faceDetectionFirst: {
      tag: "Pipeline",
      title: "Face Detection First",
      desc: "RetinaFace locates and crops faces with 35% context margin before classification.",
    },
    confidenceScoring: {
      tag: "Output",
      title: "Confidence Scoring",
      desc: "Get a percentage score alongside Real/Fake classification.",
    },
    historyTracking: {
      tag: "Account",
      title: "History Tracking",
      desc: "Every analysis is logged to your account. Review past detections and export reports.",
    },
    adminDashboard: {
      tag: "Admin",
      title: "Admin Dashboard",
      desc: "Full admin panel to monitor system usage, manage users, and view statistics.",
    },
  },
},
cta: {
  title: "Ready to verify your media?",
  description:
    "Upload your media and find out in seconds. No account required for your first analysis.",
  button: "Start Detection",
},
footer: {
  project: "Deepfake Detection System — RMUTL Senior Project",
},
auth: {
  tabs: {
    login: "Login",
    register: "Register",
  },
  headings: {
    login: {
      title: "Welcome.",
      description: "Sign in to access your detection history and dashboard.",
    },
    register: {
      title: "Create account.",
      description: "Join and start detecting deepfakes instantly.",
    },
  },
  fields: {
    username: {
      label: "Username",
      placeholder: "your_username",
    },
    email: {
      label: "Email",
      placeholder: "you@example.com",
    },
    password: {
      label: "Password",
      placeholder: "••••••••",
    },
    confirmPassword: {
      label: "Confirm Password",
      placeholder: "••••••••",
    },
  },
  actions: {
    backToHome: "Back to Home",
    forgotPassword: "Forgot password?",
    processing: "Processing...",
    submitLogin: "Sign In",
    submitRegister: "Create Account",
    divider: "or",
    switchToRegisterText: "Don't have an account? ",
    switchToRegisterAction: "Register",
    switchToLoginText: "Already have an account? ",
    switchToLoginAction: "Sign In",
  },
  errors: {
    invalidEmail: "Invalid email address",
    minPassword: "Minimum 8 characters",
    usernameRequired: "Username is required",
    passwordsNotMatch: "Passwords do not match",
  },
  showcase: {
    brand: "Veridex",
    accuracy: "Accuracy",
    engine: "Engine",
    quote: "The boundary between real and synthetic is no longer visible to the naked eye.",
    source: "Veridex Research, 2025",
  },
  auth: {
  errors: {
    invalidEmail: "Invalid email address",
    minPassword: "Minimum 8 characters",
    usernameRequired: "Username is required",
    passwordsNotMatch: "Passwords do not match",
    invalidCredentials: "Invalid email or password",
  },
}
},
} as const;