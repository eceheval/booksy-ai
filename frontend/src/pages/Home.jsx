import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Camera, Sparkles, Loader2 } from 'lucide-react';
import kediliMasa from '../assets/kedili_masa.jpg';
import yildizli from '../assets/yildizli.jpg'; 

const Home = ({ user }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [scanResults, setScanResults] = useState(null); 
  const [libraryBooks, setLibraryBooks] = useState([]); 
  const [statusMsg, setStatusMsg] = useState("");
  const fileInputRef = useRef(null);

  const fetchLibrary = async () => {
    if (!user?.email) return;
    try {
      const res = await axios.get(`http://localhost:5000/books?email=${user.email}`, { withCredentials: true });
      setLibraryBooks(res.data);
    } catch (err) { console.error("Kütüphane yüklenemedi."); }
  };

  useEffect(() => { fetchLibrary(); }, [user.email]);

  const handleSaveToLibrary = async () => {
    if (!file || !user?.email) return;
    setIsSaving(true);
    const formData = new FormData();
    formData.append('cover', file);
    formData.append('userEmail', user.email);
    formData.append('userId', user.email);

    try {
      await axios.post('http://localhost:5000/books', formData, { withCredentials: true });
      setStatusMsg("Kitap kütüphanene eklendi!");
      fetchLibrary(); 
      setFile(null); setSelectedImage(null);
    } catch (error) {
      alert("Hata oluştu.");
    } finally { setIsSaving(false); }
  };

  const handleAnalyzeClick = async () => {
    if (!file || !user?.email) return;
    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append('cover', file);
    formData.append('userEmail', user.email);
    formData.append('userGenres', JSON.stringify(user.genres || [])); 

    try {
      const res = await axios.post('http://localhost:5000/books/scan', formData, { withCredentials: true });
      setScanResults(res.data.results);
    } catch (error) {
      alert("Dedektif şu an meşgul, sonra tekrar dene!");
    } finally { setIsAnalyzing(false); }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      
      <div style={{ 
        flex: 1, 
        padding: '40px', 
        textAlign: 'center', 
        overflowY: 'auto',
        backgroundImage: `url(${yildizli})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRight: '2px solid #f472b6'
      }}>
        <h1 style={{ letterSpacing: '5px', fontWeight: '900', color: '#f472b6', marginBottom: '30px', textShadow: '2px 2px 4px #000' }}>KÜTÜPHANEM</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '15px' }}>
          {libraryBooks.map((book) => (
            <div key={book._id} style={{ borderRadius: '8px', overflow: 'hidden', border: '2px solid rgba(244,114,182,0.5)', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
              <img src={`http://localhost:5000/uploads/covers/${book.coverImage}`} style={{ width: '100%', height: '150px', objectFit: 'cover' }} alt="cover" />
            </div>
          ))}
        </div>
      </div>

      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundImage: `linear-gradient(rgba(15,10,25,0.7), rgba(15,10,25,0.7)), url(${kediliMasa})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        padding: '20px' 
      }}>
        
        {!scanResults ? (
          <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ 
              width: '100%', height: '400px', border: '4px dashed #f472b6', borderRadius: '30px', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', overflow: 'hidden' 
            }}>
              {selectedImage ? <img src={selectedImage} style={{ height: '100%', width: '100%', objectFit: 'contain' }} /> : <Camera size={60} color="#f472b6" />}
            </div>

            <input type="file" ref={fileInputRef} hidden onChange={(e) => {
              if (e.target.files[0]) {
                setFile(e.target.files[0]);
                setSelectedImage(URL.createObjectURL(e.target.files[0]));
                setStatusMsg("");
              }
            }} />

            <button onClick={() => fileInputRef.current.click()} style={{ padding: '15px', borderRadius: '12px', background: '#333', color: 'white', fontWeight: 'bold', cursor: 'pointer', border: '1px solid #444' }}>
              FOTOĞRAF SEÇ
            </button>

            {selectedImage && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button onClick={handleSaveToLibrary} disabled={isSaving} style={{ padding: '20px', borderRadius: '12px', background: '#ec4899', color: 'white', fontWeight: 'bold', cursor: 'pointer', border: 'none' }}>
                  {isSaving ? <Loader2 className="animate-spin mx-auto" /> : "KÜTÜPHANEME EKLE 📚"}
                </button>
                <button onClick={handleAnalyzeClick} disabled={isAnalyzing} style={{ padding: '20px', borderRadius: '12px', background: 'linear-gradient(to right, #8b5cf6, #d946ef)', color: 'white', fontWeight: 'bold', cursor: 'pointer', border: 'none' }}>
                  {isAnalyzing ? <Loader2 className="animate-spin mx-auto" /> : "ZEVKİME UYGUN MU? ✨"}
                </button>
              </div>
            )}
            {statusMsg && <p style={{ color: '#10b981', marginTop: '10px', textAlign: 'center', fontWeight: 'bold' }}>{statusMsg}</p>}
          </div>
        ) : (
          <div style={{ padding: '40px', background: 'rgba(15,10,25,0.95)', border: '2px solid #f472b6', borderRadius: '30px', textAlign: 'center', maxWidth: '400px', boxShadow: '0 0 30px rgba(244,114,182,0.3)' }}>
            <h2 style={{ color: '#f472b6', marginBottom: '10px' }}>DEDEKTİF ANALİZİ</h2>
            <div style={{ fontSize: '5rem', fontWeight: '900', color: '#f472b6' }}>
              %{ (scanResults[0]?.matchScore * 100).toFixed(0) }
            </div>
            <p style={{ color: 'white', margin: '20px 0', fontSize: '1.1rem' }}>{scanResults[0]?.reason}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
               <button onClick={handleSaveToLibrary} style={{ padding: '15px', background: '#ec4899', color: 'white', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', border: 'none' }}>FAVORİLERİME EKLE</button>
               <button onClick={() => {setScanResults(null); setSelectedImage(null); setFile(null);}} style={{ padding: '10px', background: 'transparent', color: 'white', border: '1px solid #444', borderRadius: '12px', cursor: 'pointer' }}>KAPAT</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;