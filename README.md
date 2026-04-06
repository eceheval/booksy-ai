# Booksy AI — AI-Powered Bookshelf Scanner & Personalized Recommendation App

Booksy AI is an intelligent web application designed to bridge the gap between physical libraries and digital discovery. By leveraging **Computer Vision (OCR)** and **Vector Search (RAG)**, the system analyzes physical bookshelf photos and provides personalized compatibility scores based on the user's existing collection.

## 1\. Overview

This project goes beyond simple book tracking; it maps a user's reading taste into a mathematical vector space to analyze how well a new book fits their current library.

*   **Shelf Scanning**: Extracts text from spine/cover photos using Google Vision API.
    
*   **Library RAG Workflow**: Utilizes the user's private library as a dynamic knowledge base for real-time analysis.
    
*   **Compatibility Scoring**: Uses OpenAI embeddings and Cosine Similarity to calculate the "vibe" match between books.
    

## 2\. Technologies Used

*   **Frontend**: React.js, Tailwind CSS (Modern & Responsive UI)
    
*   **Backend**: Node.js, Express (RESTful API Architecture)
    
*   **Database**: MongoDB Atlas with Vector Search support
    
*   **AI & Cloud**:
    
    *   **Google Vision API** (OCR)
        
    *   **OpenAI API** (`text-embedding-3-small`)
        
    *   **Multer** (File Handling for uploads)
        

## 3\. Features

✔ **OCR-Based Title Detection**: Automatic identification of book titles and authors from raw images. 
✔ **Vector Search Integration**: Perform k-NN (k-nearest neighbor) searches on MongoDB Atlas for semantic matching.
✔ **Personalized Compatibility Analysis**: Generates a percentage-based score and identifies specific reference books from the user's library. 
✔ **Visual Library Management**: A dedicated dashboard to organize and view your collection.

## 4\. Project Workflow (The Process)

1.  **Data Ingestion**: User uploads a book cover or shelf photo.
    
2.  **Text Extraction**: Google Vision API identifies raw text strings from the image.
    
3.  **Embedding Generation**: The identified book is converted into a 1536-dimensional vector using OpenAI.
    
4.  **RAG & Vector Search**: The system queries the `books` collection, filtered by the user's session data.
    
5.  **Score Calculation**: Similarity is measured between the new book's vector and the existing library vectors.
    
6.  **Response**: The UI displays the match score and the "reason" (e.g., "Matches your interest in _The Hobbit_").
    

## 5\. What I Learned

*   Built a complete API architecture from scratch, managing server-side logic, routing, and database relationships.
    
*   Learned to handle raw image data, process it through OCR services, and transform it into actionable data.
    
*   Gained a deep understanding of semantic search, moving beyond traditional keyword matching to implement a Retrieval-Augmented Generation workflow.
    
*   Learned to integrate and secure multiple third-party AI services within a professional production-style backend.
    

## 6\. Future Work & Enhancements

*   **Favorites Optimization**: Currently, the "Add to Favorites" logic is in its early stages; I plan to fully decouple it from the main library view and refine the data flow.
    
*   **Custom Model Training**: Exploring the possibility of fine-tuning or training a custom embedding model specifically for literary genres to improve recommendation accuracy.
    
*   **Deployment**: Plan to containerize the app with Docker and deploy it for public access.
    
*   **Multi-Book Analysis**: Enhancing the OCR logic to identify and analyze multiple books from a single shelf photo simultaneously.
    

## 7\. How to Run

1.  Clone the repository.
    
2.  Navigate to the `server` directory, run `npm install`, and add your API keys to the `.env` file.
    
3.  Navigate to the `frontend` directory, run `npm install`, and start the app with `npm start`.
    

## 8\. Project Media & Screenshots

![giris](https://github.com/user-attachments/assets/cc6fec4f-fe97-4f09-8fc7-cd91e252a661)

![genre](https://github.com/user-attachments/assets/4c058bef-6da5-4005-8635-eb2a0bd9735f)

### Dashboard Overview

![Ekran görüntüsü 2026-04-06 124452](https://github.com/user-attachments/assets/efe1970f-9571-42f7-a916-f4c07c8b257f)
