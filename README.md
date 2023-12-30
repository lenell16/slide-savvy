# SlideSavvy - ReadMe

## Introduction

SlideSavvy is an RAG app that integrates Google Slides with interactive AI-powered Q&A, leveraging OpenAI's language models and Supabase's `pg_vector`. Developed with Next.js, it provides a responsive and engaging user experience. This guide will walk you through setting up SlideSavvy by cloning the Git repository and configuring the necessary environment variables.

## Key Features

- **AI-Driven Q&A Interaction**: Directly interact with your slides through intelligent, context-aware conversations.
- **Supabase's `pg_vector` for Data Management**: Efficient and secure data handling for real-time interactions.
- **Built Using Next.js**: A modern, scalable web framework for a superior user experience.
- **Seamless Google Slides Integration**: Enhances the familiar interface with advanced AI capabilities.
- **Ideal for Various Use Cases**: Suitable for educational, professional, and personal presentations.

### Setup

1. **Clone the SlideSavvy Repository**:
   - Open your terminal or command prompt.
   - Clone the repository using Git: `git clone git@github.com:lenell16/slide-savvy.git`.
   - Navigate to the cloned directory: `cd SlideSavvy`.

2. **Configure Environment Variables**:
   - Create a `.env.local` file in the root directory.
   - Add the following environment variables:
     ```
     OPENAI_API_KEY=your_openai_api_key
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     ```
   - Replace the placeholders with your actual OpenAI and Supabase credentials.

3. **Install Dependencies**:
   - Run `npm install` or `yarn install` to install required dependencies.

## Running the Application

1. **Start the Application**:
   - Use `npm run dev` or `yarn dev` to start the development server.
   - Visit `http://localhost:3000` in your web browser to access SlideSavvy.

## Usage Tips

- Ensure your questions are clear and relevant to the slide content for effective AI responses.
- Keep your environment variables secure and update them as necessary.
- Utilize the collaborative features for a more interactive and engaging presentation experience.
