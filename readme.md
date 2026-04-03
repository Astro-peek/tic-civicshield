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

 Finalize project idea
 Set up GitHub repository
 Create project structure
 Assign team roles
 Set up development environment

Hour 2-6: Database & Backend Foundation

 Design database schema
 Set up MongoDB and create collections
 Populate initial scheme data (10-15 schemes)
 Build basic Express server
 Create API endpoints for schemes

Hour 6-10: Core Matching Logic

 Develop matching algorithm
 Create user profile API
 Implement eligibility checking logic
 Test matching accuracy
 Add filtering and sorting

Hour 10-14: Frontend Development

 Create landing page
 Build user questionnaire form
 Design results display page
 Create scheme detail view
 Add responsive design

Hour 14-18: Integration & Features

 Connect frontend to backend
 Implement user authentication
 Add search and filter options
 Create user dashboard
 Test all user flows

Hour 18-22: Polish & Testing

 Fix bugs and errors
 Improve UI/UX
 Add loading states and error handling
 Test on different devices
 Optimize performance

Hour 22-24: Deployment & Documentation

 Deploy backend to cloud
 Deploy frontend to hosting
 Record demo video
 Complete README documentation
 Prepare presentation slides


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

