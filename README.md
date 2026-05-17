# 💸 SpendWise - Premium Personal Expense Tracker

SpendWise is a sophisticated, high-performance personal finance tracking application. Designed with a premium aesthetic and seamless user experience, it empowers users to manage their daily expenses, track financial goals, and monitor their financial habits effectively. 

This repository contains the complete frontend codebase built with React Native and Expo, fully integrated with a Firebase backend architecture.

---

## 🛠️ Technology Stack

SpendWise leverages a modern, robust, and scalable technology stack:

**Frontend Ecosystem**
* **Framework:** [React Native](https://reactnative.dev/)
* **Build Tool:** [Expo](https://expo.dev/)
* **Routing/Navigation:** [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
* **Styling:** Custom Vanilla/React Native Stylesheets with a Premium Design System
* **Icons:** `@expo/vector-icons`

**Backend & Database Services**
* **Database:** [Firebase Firestore](https://firebase.google.com/docs/firestore) (Real-time NoSQL database)
* **Authentication:** [Firebase Authentication](https://firebase.google.com/docs/auth) (Email/Password & Google Sign-In via `@react-native-google-signin/google-signin`)

**State Management & Utilities**
* **State Management:** React Context API
* **Local Storage:** `@react-native-async-storage/async-storage` (For offline persistence and session caching)
* **Date Handling:** `@react-native-community/datetimepicker`

---

## 📋 Prerequisites: What You Need to Install

Before running this project, ensure you have the following installed on your machine:

1. **[Node.js](https://nodejs.org/en/)** (v18.0.0 or higher) - Includes `npm` (Node Package Manager).
2. **[Git](https://git-scm.com/)** - For cloning the repository.
3. **[Expo CLI](https://docs.expo.dev/get-started/installation/)** - Install globally using `npm install -g expo-cli`.
4. **Expo Go App** - Download the Expo Go app on your physical iOS or Android device to preview the app, OR install Android Studio / Xcode to run an emulator.
5. **Firebase Account** - A free account at [Firebase Console](https://console.firebase.google.com/) to host your backend database and authentication.

---

## 🚀 Setup & Installation Guide

Follow these steps to get your development environment up and running:

### 1. Clone the Repository & Install Dependencies
```bash
# Navigate to the project directory
cd ExpenseTrackerApp

# Install all required npm packages
npm install
```

### 2. Configure Firebase Environment Variables
For security reasons, the backend credentials are not included in this repository. You must connect your own Firebase project.

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Enable **Firestore Database** and **Firebase Authentication** (Enable Email/Password and Google Sign-In providers).
3. Register a "Web App" and an "Android App" within your Firebase project.
4. Rename or create a `.env` file in the root of the project and update the placeholder values with your Firebase Web App configuration:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id_here
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_google_web_client_id
```

### 3. Update Android/iOS Configuration files
1. From your Firebase console (under the Android App settings), download the `google-services.json` file.
2. Place this file in the root of the `ExpenseTrackerApp` directory (replacing the placeholder file currently there).

### 4. Start the Application!
```bash
npx expo start
```
* A QR code will appear in your terminal. 
* Scan the QR code with your mobile device's camera (iOS) or the Expo Go app (Android) to load the app directly on your phone.

---

## 📖 How to Use the App

Once you have the app running, here is a quick overview of how to navigate and use the features:

### 1. Onboarding & Authentication
* **Sign Up / Login:** Upon launching, you will be greeted by a premium onboarding flow. Users can securely create an account using their Email and Password, or use the 1-click Google Sign-in.
* **Session Persistence:** Once logged in, the session is saved securely. Users do not need to log in every time they open the app.

### 2. Dashboard (Home Tab)
* **Overview:** The main dashboard provides a beautifully crafted summary of your current finances, displaying total expenses for the selected period.
* **Recent Transactions:** Scroll down to see a list of your most recent transactions, categorized with distinct icons and colors for quick visual parsing.

### 3. Adding an Expense
* **The '+' Button:** Tap the prominent add button on the navigation bar or dashboard.
* **Input Details:** Enter the amount, select a relevant category (e.g., Food, Transport, Entertainment), add a quick description, and pick the date using the native date picker.
* **Save:** Upon saving, the transaction instantly syncs to the Firebase Firestore backend and updates your dashboard in real-time.

### 4. Settings & More (More Tab)
* Navigate to the **More** tab to access account settings.
* Here you can view your profile details and securely **Log Out** of the application.

---

## 📁 Project Architecture Overview

```text
ExpenseTrackerApp/
├── app/               # Expo Router pages (Screens and layout definitions)
├── assets/            # Static assets (images, icons, fonts)
├── src/
│   ├── components/    # Reusable UI components (Buttons, Cards, Inputs)
│   ├── config/        # Configuration files (Firebase initialization)
│   ├── constants/     # Global constants (Colors, Theme, Styling tokens)
│   ├── context/       # React Context API (Global state management)
│   ├── hooks/         # Custom React hooks
│   └── utils/         # Helper functions and logic
├── .env               # Environment variables (Firebase keys)
├── app.json           # Expo app configuration
└── package.json       # Project dependencies and scripts
```

---

## 📄 Licensing & Handoff

This codebase is provided as a complete, standalone product. As the buyer, you are free to modify, rebrand, and deploy this application as you see fit. Ensure that you update all bundle identifiers (like `com.spendwise.app` in `app.json`) to match your own developer accounts prior to submitting to the Apple App Store or Google Play Store.
