Technocrats Innovation Challenge - 2k26

a personalised government scheme discovery platform 

Many citizens miss out on government benefits because they don't know which schemes they're eligible for. Scheme Match solves this by creating an intelligent platform that matches users with relevant government schemes based on their profile, income, location, and needs.
The Problem We're Solving

📊 Information Overload: Hundreds of schemes exist but finding the right one is difficult
🔍 Discovery Gap: People don't know what benefits they qualify for
⏰ Time Wasted: Manual searching through government websites takes hours
🚧 Complex Eligibility: Understanding criteria requires reading lengthy documents

Our Solution
A simple, user-friendly platform where anyone can:

Answer a few basic questions about themselves
Get matched with relevant government schemes instantly
See clear eligibility criteria and application steps
Track their application status 
scheme enquiry and complain raising ticket system to build transperancy
document backed by digilocker verification



🏗️ System Architecture
High-Level Design
┌─────────────────────────────────────────────────┐
│          User Interface (React + Vite)          │
│         Hosted on Firebase Hosting              │
└─────────────────┬───────────────────────────────┘
                  │
                  ├─────────────────────────────────┐
                  │                                 │
                  ▼                                 ▼
┌─────────────────────────────┐   ┌──────────────────────────────┐
│   Firebase Services         │   │    n8n Workflows             │
│   - Authentication          │   │    - Scheme Matching         │
│   - Firestore Database      │   │    - Data Processing         │
│   - Cloud Functions         │   │    - Automation Logic        │
│   - Storage                 │   │    - Webhooks                │
└─────────────────────────────┘   └──────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│        Google Cloud Console                     │
│   - Cloud Functions (Serverless)                │
│   - Cloud Storage                               │
│   - APIs & Services                             │
└─────────────────────────────────────────────────┘
Data Flow Architecture
User Fills Form → Submit Profile
        ↓
React App Sends to n8n Webhook
        ↓
n8n Fetches Schemes from Firestore
        ↓
n8n Runs Matching Algorithm
        ↓
Returns Matched Schemes to React
        ↓
Display Results to User
        ↓
User Saves Scheme → Firestore Update
Tech Stack We're Using
Frontend:

React.js / Vite - For building interactive UI
Tailwind CSS - For styling
Firebase SDK - For real-time data and auth

Backend & Automation:

Firebase (Backend-as-a-Service)

Firestore - Real-time NoSQL database
Authentication - User login/signup
Hosting - Frontend deployment


n8n (Workflow Automation)

Automated scheme matching workflows
Data processing pipelines
Integration orchestration


Google Cloud Console

Cloud Functions - Serverless backend logic
Cloud Storage - Document/image storage
APIs & Services management



Deployment:

Frontend: Firebase Hosting
Backend Logic: Google Cloud Functions
Automation: n8n (Self-hosted/Cloud)
Database: Firebase Firestore

📋 24-Hour Hackathon Timeline
Hour 0-2: Planning & Setup ✅

 Finalize project idea and features
 Set up GitHub repository
 Create Firebase project in Google Cloud Console
 Initialize Firestore database
 Set up Vite + React project structure
 Assign team roles and responsibilities

Hour 2-5: Firebase & Database Setup

 Configure Firebase Authentication (Email/Password, Google Sign-in)
 Design Firestore collections structure (schemes, users, matches)
 Set up Firestore security rules
 Populate initial scheme data (15-20 government schemes)
 Create Firebase config file and environment variables
 Test database connection

Hour 5-9: n8n Workflow Automation

 Set up n8n instance (cloud or self-hosted)
 Create workflow for scheme matching logic
 Build automated eligibility checker workflow
 Connect n8n to Firestore via HTTP requests
 Create webhook endpoints for real-time matching
 Test n8n workflows with sample data

Hour 9-13: Frontend Development (Core Pages)

 Create landing page with hero section
 Build multi-step questionnaire form
 Design scheme results/matching page
 Create individual scheme detail view
 Add loading states and animations
 Implement responsive design (mobile-first)

Hour 13-16: Firebase Integration & Authentication

 Integrate Firebase Auth in React app
 Create login/signup pages
 Implement protected routes
 Build user profile page
 Add real-time Firestore data fetching
 Test authentication flow

Hour 16-19: Core Features & Matching Logic

 Implement client-side matching algorithm
 Connect to n8n workflows via webhooks
 Add search and filter functionality
 Create "Save Scheme" feature with Firestore
 Build user dashboard with saved schemes
 Add match percentage calculation

Hour 19-21: Google Cloud Functions (If Needed)

 Create Cloud Function for complex matching logic
 Set up Cloud Function triggers (Firestore/HTTP)
 Deploy functions to Google Cloud
 Test serverless functions
 Optimize for performance

Hour 21-23: Testing, Polish & Bug Fixes

 Fix all critical bugs
 Improve UI/UX based on user flow testing
 Add error handling and validation
 Test on multiple devices and browsers
 Optimize load times and performance
 Add analytics (Firebase Analytics)

Hour 23-24: Deployment & Final Documentation

 Deploy frontend to Firebase Hosting
 Verify all n8n workflows are running
 Test production build thoroughly
 Record 2-3 minute demo video
 Update README with screenshots and demo link
 Prepare presentation slides
 Final GitHub commit and push


🎨 Key Features
1. Smart Questionnaire
Simple form asking:

Age, Gender, Location
Income level
Occupation/Student status
Category (SC/ST/OBC/General)
Specific needs (education, health, business, etc.)

2. Intelligent Matching
Algorithm that:

Matches user profile with scheme eligibility criteria
Calculates match percentage
Prioritizes most relevant schemes
Shows why user qualifies

3. Scheme Information
Each scheme shows:

Name and description
Benefits offered
Eligibility criteria
Required documents
Application process
Official website link

4. User Dashboard

View matched schemes
Save schemes for later
Track application status
Update profile information

5. Search & Filter

Search schemes by name
Filter by category (education, health, agriculture, etc.)
Filter by benefit type
Sort by relevance

javascript{
  id: "scheme_001", // Document ID
  name: "PM-KISAN Samman Nidhi",
  category: "agriculture", // "education", "health", "agriculture", "business", etc.
  description: "Income support to farmer families",
  benefits: "₹6000 per year in 3 installments",
  eligibility: {
    minAge: 18,
    maxAge: null,
    gender: ["all"],
    income: {
      max: null,
      min: null
    },
    category: ["all"], // ["SC", "ST", "OBC", "General", "all"]
    states: ["all"], // or specific states
    occupation: ["farmer", "agriculture"],
    landOwnership: true
  },
  documents: [
    "Aadhaar Card",
    "Bank Account Details",
    "Land Ownership Papers"
  ],
  applicationProcess: "Apply through PM-KISAN portal or local agriculture office",
  officialLink: "https://pmkisan.gov.in/",
  matchScore: 0, // calculated dynamically
  createdAt: Timestamp,
  updatedAt: Timestamp
}
users Collection
javascript{
  uid: "firebase_user_id", // Document ID (from Firebase Auth)
  email: "user@example.com",
  displayName: "User Name",
  profile: {
    age: 25,
    gender: "male", // "male", "female", "other"
    state: "Madhya Pradesh",
    district: "Indore",
    income: 150000, // annual income
    category: "General", // "SC", "ST", "OBC", "General"
    occupation: "student", // "student", "farmer", "business", "employed", "unemployed"
    education: "graduate",
    maritalStatus: "single",
    hasDisability: false,
    interests: ["education", "health"] // what schemes they're looking for
  },
  savedSchemes: [
    "scheme_001",
    "scheme_005"
  ], // Array of scheme IDs
  appliedSchemes: [
    {
      schemeId: "scheme_001",
      appliedOn: Timestamp,
      status: "pending" // "pending", "approved", "rejected"
    }
  ],
  createdAt: Timestamp,
  lastLogin: Timestamp
}
matches Collection (Optional - for caching)
javascript{
  id: "match_uid_timestamp", // Document ID
  userId: "firebase_user_id",
  schemes: [
    {
      schemeId: "scheme_001",
      matchScore: 95,
      matchedCriteria: ["age", "occupation", "state"],
      eligibleFor: true
    }
  ],
  generatedAt: Timestamp,
  expiresAt: Timestamp // cache for 24 hours
}

