# Booksy AI – Book Discovery App

An AI-powered web application designed to analyze bookshelf images and provide personalized book recommendations based on user library preferences.

## Key Features
- **Shelf Scanning:** Automated book title extraction from bookshelf photos using **Google Vision API**.
- **Intelligent Matching:** Personalized recommendations powered by **OpenAI "text-embedding-3-small"** and **MongoDB Vector Search**.
- **Metadata Integration:** Seamlessly fetching book details (author, genre, description) via **Google Books API**.
- **Personal Library:** Dedicated user space to add, delete, and search books with high-fidelity metadata.
- **Mobile-First Design:** Optimized for capturing and uploading photos directly from a smartphone.

## Tech Stack
- **Backend:** Node.js, Express, TypeScript
- **Database:** MongoDB Atlas (with Vector Search Indexing)
- **AI Services:** Google Cloud Vision (OCR), OpenAI Embedding API
- **File Handling:** Multer (with secure image filtering and size limits)
- **Deployment:** Vercel (Ready for serverless deployment)

## Project Structure
- `server/`: Express + TypeScript backend (AI Pipeline)
- `frontend/`: React-based mobile-friendly UI (In Progress)

## Getting Started
1. Navigate to the `server` directory and run `npm install`.
2. Configure your `.env` file with required API keys:
   - `OPENAI_API_KEY`
   - `GOOGLE_BOOKS_API_KEY`
   - `MONGO_URI`
3. Place your `vision_key.json` in the server root.
4. Run `npm run dev` to start the development server.

## 🛡️ Security Best Practices
- Environment variables for sensitive API keys.
- Strictly defined `.gitignore` to prevent credential leaks.
- Middleware-level file validation (type and size) for image uploads.