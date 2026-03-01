import axios from 'axios';

export const getBookMetadata = async (searchText: string) => {
  try {
    const cleanQuery = searchText
      .replace(/[^a-zA-Z0-9ğüşıöçĞÜŞİÖÇ ]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2)
      .slice(0, 4)
      .join(' ');

    console.log("🔍 Aranan Metin:", cleanQuery);

    const GOOGLE_KEY = process.env.GOOGLE_BOOKS_API_KEY;

    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(cleanQuery)}&printType=books&maxResults=1&key=${GOOGLE_KEY}`;
    const response = await axios.get(url);

    if (!response.data.items || response.data.items.length === 0) {
      const simpleQuery = cleanQuery.split(' ').slice(0, 3).join(' ');
      const retryUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(simpleQuery)}&printType=books&maxResults=1&key=${GOOGLE_KEY}`;
      const retryResponse = await axios.get(retryUrl);
      
      if (!retryResponse.data.items) return null;
      return formatResult(retryResponse.data.items[0].volumeInfo);
    }

    return formatResult(response.data.items[0].volumeInfo);
  } catch (error) {
    console.error("Google Books API Hatası:", error);
    return null;
  }
};

const formatResult = (info: any) => {
  return {
    title: info.title || "Bilinmeyen Kitap",
    author: info.authors ? info.authors[0] : "Bilinmeyen Yazar",
    genre: info.categories ? info.categories[0] : "Genel",
    language: info.language ? info.language.toUpperCase() : "Bilinmiyor", 
    description: info.description || "Açıklama bulunamadı.",
  };
};
