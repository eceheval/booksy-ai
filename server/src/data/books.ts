export interface Book {
  id: string;
  title: string;
  author: string;
  genre?: string;
  language?: string;
  createdAt?: string;

  // ilerisi için
  coverImage?: string;      // foto / url / base64
  embeddingReady?: boolean; // recommendation için
}

export const books: Book[] = [];
