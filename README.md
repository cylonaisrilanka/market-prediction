
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
*   **Charting:** Recharts

## Running the Project Locally

To get FashionFlow AI running on your local machine, follow these steps:

### Prerequisites

*   **Node.js:** Version 18 or higher is recommended. Download from [nodejs.org](https://nodejs.org/).
*   **npm** (usually comes with Node.js) or **yarn**.
*   **Git** (for cloning the repository if you haven't already).
*   **Genkit CLI:** Install globally if you haven't:
    ```bash
    npm install -g genkit-cli
    ```
*   **Firebase CLI (Optional but Recommended for Firebase projects):**
    ```bash
    npm install -g firebase-tools
    ```

### Setup Instructions

1.  **Clone the Repository (if you haven't already):**
    ```bash
    # Replace <repository-url> with the actual URL of your Git repository
    # git clone <repository-url>
    # cd your-project-directory-name
    ```
    (If you are already in the project directory, you can skip this step)

2.  **Install Dependencies:**
    Open your terminal in the project's root directory and run:
    ```bash
    npm install
    ```
    (or `yarn install` if you prefer Yarn)

3.  **Set Up Environment Variables:**
    *   In the root directory of your project, create a new file named exactly `.env`.
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
        NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="YOUR_FIREBASE_MEASUREMENT_ID_HERE" # Often optional
        ```
    *   **Replace ALL placeholder values** (e.g., `"YOUR_GOOGLE_GENAI_API_KEY_HERE"`, `"YOUR_FIREBASE_API_KEY_HERE"`) with your actual API keys and Firebase project configuration details.
        *   **Google GenAI API Key:** Obtain from [Google AI Studio](https://aistudio.google.com/app/apikey) or your Google Cloud Console (Vertex AI Gemini API).
        *   **Firebase Credentials:** Find these in your Firebase project settings (Project settings > General tab > Your apps section > select your web app > SDK setup and configuration).
    *   **Important:** Ensure Email/Password sign-in method is enabled in your Firebase project (Firebase Console > Authentication > Sign-in method tab).

4.  **Run the Development Servers:**
    You'll typically need to run two development servers in separate terminal windows/tabs:

    *   **Next.js Application:**
        ```bash
        npm run dev
        ```
        This will usually start your Next.js application on `http://localhost:9002` (or another port if 9002 is occupied).

    *   **Genkit AI Flows:**
        ```bash
        npm run genkit:dev
        ```
        This starts the Genkit development server, typically on `http://localhost:4000`. This allows the Next.js app to make calls to your AI flows. You can also use `npm run genkit:watch` which will auto-reload Genkit flows when their source files change.

5.  **Access the Application:**
    Open your web browser and navigate to `http://localhost:9002` (or the port your Next.js app is running on, as indicated in the terminal output).

You should now be able to use the FashionFlow AI application locally, sign up, log in, and use the prediction tool.
