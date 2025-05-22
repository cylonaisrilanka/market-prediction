
# FashionFlow AI

## Project Objective

FashionFlow AI is a web application designed to predict market trends for new fashion designs. By leveraging Google Gemini's advanced AI capabilities through Genkit, the application analyzes fashion designs based on images and contextual details (such as target demographics, location, and gender). It provides designers and fashion professionals with:

*   A predicted market trend for their uploaded design.
*   A detailed analysis of factors influencing the trend.
*   An outlook on how similar items or categories are performing in the market.
*   A 5-month simulated sales forecast visualization for the uploaded item and similar items.
*   Actionable suggestions to potentially improve the design's sales performance.

The goal is to offer valuable, data-informed insights to aid in decision-making within the fashion industry.

## Tech Stack

*   **Framework:** Next.js (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **UI Components:** ShadCN UI
*   **AI Integration:** Genkit with Google Gemini
*   **Authentication:** Firebase Authentication (Email/Password)
*   **Charting:** Recharts (via ShadCN UI Charts)

## Running the Project Locally

To get FashionFlow AI running on your local machine, follow these steps:

### Prerequisites

*   **Node.js:** Version 18 or higher is recommended. You can download it from [nodejs.org](https://nodejs.org/).
*   **npm** (Node Package Manager): This usually comes bundled with Node.js. Alternatively, you can use **yarn**.
*   **Git:** Required for cloning the repository if you haven't already.
*   **Genkit CLI:** Install globally if you don't have it:
    ```bash
    npm install -g genkit-cli
    ```
*   **Firebase CLI (Optional but Recommended):** Useful for Firebase-related tasks, though not strictly necessary to run the app if backend services are mocked or handled via Genkit flows.
    ```bash
    npm install -g firebase-tools
    ```

### Setup Instructions

1.  **Clone the Repository (if applicable):**
    If you have the project on a Git hosting service (like GitHub), clone it:
    ```bash
    # Replace <repository-url> with the actual URL of your Git repository
    # git clone <repository-url>
    # cd your-project-directory-name
    ```
    If you already have the project files, navigate to the project's root directory in your terminal.

2.  **Install Project Dependencies:**
    Open your terminal in the project's root directory (where `package.json` is located) and run:
    ```bash
    npm install
    ```
    (Or if you prefer Yarn: `yarn install`)
    This command reads the `package.json` file and installs all the necessary libraries and packages for the project.

3.  **Set Up Environment Variables:**
    *   In the root directory of your project, create a new file named exactly `.env`. **This file is crucial for storing API keys and other sensitive configuration.**
    *   Copy the following structure into your `.env` file:

        ```env
        # Genkit - Google Generative AI
        # You need to create an API key from Google AI Studio (https://aistudio.google.com/app/apikey)
        # or enable the "Generative Language API" (Vertex AI Gemini API) in your Google Cloud project and create an API key there.
        GOOGLE_GENAI_API_KEY="YOUR_GOOGLE_GENAI_API_KEY_HERE"

        # Firebase Authentication (Get these from your Firebase project settings)
        # Go to Firebase Console > Project settings > General > Your apps > SDK setup and configuration
        NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_FIREBASE_API_KEY_HERE"
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_FIREBASE_AUTH_DOMAIN_HERE"
        NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_FIREBASE_PROJECT_ID_HERE"
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_FIREBASE_STORAGE_BUCKET_HERE"
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_FIREBASE_MESSAGING_SENDER_ID_HERE"
        NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_FIREBASE_APP_ID_HERE"
        NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="YOUR_FIREBASE_MEASUREMENT_ID_HERE" # Often optional, for Google Analytics for Firebase
        ```
    *   **Replace ALL placeholder values** (e.g., `"YOUR_GOOGLE_GENAI_API_KEY_HERE"`, `"YOUR_FIREBASE_API_KEY_HERE"`) with your actual API keys and Firebase project configuration details.
        *   **Google GenAI API Key:**
            *   Obtain from [Google AI Studio](https://aistudio.google.com/app/apikey).
            *   Or, if using Google Cloud, enable the "Generative Language API" (Vertex AI Gemini API) in your Google Cloud project and create an API key there with permissions for this API.
        *   **Firebase Credentials:**
            1.  Go to the [Firebase Console](https://console.firebase.google.com/).
            2.  Select your project.
            3.  Click the gear icon (⚙️) next to "Project Overview" and choose "Project settings".
            4.  Under the "General" tab, scroll down to "Your apps".
            5.  If you haven't registered a web app, click "Add app" and select the Web icon (`</>`). Follow the registration steps.
            6.  Select your web app. Under "SDK setup and configuration", choose the "Config" option. This will display the `firebaseConfig` object with the values you need.
    *   **Important:**
        *   Ensure the variable names in your `.env` file (e.g., `GOOGLE_GENAI_API_KEY`, `NEXT_PUBLIC_FIREBASE_API_KEY`) exactly match those in the example.
        *   Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser-side code by Next.js. The `GOOGLE_GENAI_API_KEY` is used server-side by Genkit and does not need this prefix.
        *   Make sure the **Email/Password sign-in method is enabled** in your Firebase project: Firebase Console > Authentication (under Build) > Sign-in method tab > Enable "Email/Password".

4.  **Run the Development Servers:**
    You'll typically need to run two development servers in separate terminal windows/tabs:

    *   **Next.js Application (Frontend):**
        ```bash
        npm run dev
        ```
        This usually starts your Next.js application on `http://localhost:9002` (or another port if 9002 is occupied). The terminal will show the exact address.

    *   **Genkit AI Flows (Backend AI Logic):**
        ```bash
        npm run genkit:dev
        ```
        This starts the Genkit development server, typically on `http://localhost:4000`. This allows the Next.js app to make calls to your AI flows. You can also use `npm run genkit:watch`, which will automatically reload Genkit flows if their source files change.

    **Crucial:** After setting or changing anything in the `.env` file, you **MUST restart BOTH development servers** for the changes to take effect.

5.  **Access the Application:**
    Open your web browser and navigate to `http://localhost:9002` (or the port your Next.js app is running on, as indicated in the terminal output).

You should now be able to use the FashionFlow AI application locally, sign up for an account, log in, and use the trend prediction tool.

### Troubleshooting Common Issues

*   **`auth/invalid-api-key` (Firebase):** Double-check all `NEXT_PUBLIC_FIREBASE_...` values in `.env` against your Firebase project settings and ensure you've restarted `npm run dev`.
*   **`GOOGLE_GENAI_API_KEY` error (Genkit):** Ensure `GOOGLE_GENAI_API_KEY` in `.env` is correct and you've restarted `npm run genkit:dev` and `npm run dev`.
*   **`auth/operation-not-allowed` (Firebase):** Make sure the Email/Password sign-in method is enabled in your Firebase project's Authentication settings.
*   **Port Conflicts:** If `localhost:9002` or `localhost:4000` are in use, the servers might start on different ports. Check the terminal output for the correct URLs.
```