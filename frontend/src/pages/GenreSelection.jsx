import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import yildizliArkaPlan from '../assets/yildizli.jpg';

const GenreSelection = ({ user, onComplete }) => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const navigate = useNavigate();

  const genres = [
    { id: 'fantastik', label: 'FANTASTİK', icon: '🪄' },
    { id: 'romantik', label: 'ROMANTİK', icon: '💖' },
    { id: 'bilim-kurgu', label: 'BİLİM KURGU', icon: '🚀' },
    { id: 'gizem', label: 'GİZEM', icon: '🔍' },
    { id: 'korku', label: 'KORKU', icon: '💀' },
    { id: 'klasik', label: 'KLASİK', icon: '📜' }
  ];

  const toggleGenre = (id) => {
    setSelectedGenres(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (selectedGenres.length === 0) {
      alert("Lütfen en az bir tür seç!");
      return;
    }

    if (!user || !user.email) {
      console.error("Hata: Kullanıcı bilgisi eksik!", user);
      alert("Oturum bilgisi alınamadı. Lütfen giriş sayfasına dönüp tekrar deneyin.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/users/update-genres', { 
        email: user.email, 
        genres: selectedGenres 
      }, { 
        withCredentials: true 
      });
      
      if (response.data.status === "success") {
        onComplete(selectedGenres); 
        navigate('/'); 
      }
    } catch (error) {
      console.error("Kayıt hatası detayı:", error.response?.data || error.message);
      
      const errorMsg = error.response?.data?.message || "Lütfen sunucunun (Port: 5000) açık olduğundan emin ol.";
      alert("Türler kaydedilemedi! " + errorMsg);
    }
  };

  return (
    <div style={{ 
      height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      backgroundImage: `linear-gradient(rgba(15, 10, 25, 0.85), rgba(15, 10, 25, 0.85)), url(${yildizliArkaPlan})`,
      backgroundSize: '400px', 
      backgroundRepeat: 'repeat'
    }}>
      <div className="glass-panel" style={{ width: '90%', maxWidth: '500px', padding: '30px', textAlign: 'center' }}>
        <h1 style={{ color: '#f472b6', fontSize: '2rem', marginBottom: '8px', letterSpacing: '3px', fontWeight: '900' }}>
          RUH HALİNİ SEÇ
        </h1>
        <p style={{ color: '#fce7f3', fontSize: '0.9rem', marginBottom: '25px', opacity: 0.8 }}>
          Sana en uygun kitapları bulmamıza yardımcı ol.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {genres.map((genre) => (
            <div 
              key={genre.id}
              onClick={() => toggleGenre(genre.id)}
              style={{ 
                padding: '15px', borderRadius: '12px', cursor: 'pointer', transition: '0.2s',
                border: selectedGenres.includes(genre.id) ? '2px solid #f472b6' : '1px solid rgba(255,255,255,0.1)',
                background: selectedGenres.includes(genre.id) ? 'rgba(244, 114, 182, 0.15)' : 'rgba(0,0,0,0.4)',
                transform: selectedGenres.includes(genre.id) ? 'scale(1.02)' : 'scale(1)'
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>{genre.icon}</div>
              <div style={{ fontWeight: 'bold', color: 'white', fontSize: '0.75rem', letterSpacing: '1px' }}>{genre.label}</div>
            </div>
          ))}
        </div>

        <button 
          onClick={handleSave}
          style={{ 
            width: '100%', padding: '15px', fontSize: '1.1rem', 
            background: 'linear-gradient(to right, #ec4899, #8b5cf6)', 
            borderRadius: '12px', border: 'none', color: 'white', fontWeight: 'bold', 
            cursor: 'pointer', boxShadow: '0 4px 15px rgba(236, 72, 153, 0.3)'
          }}
        >
          KÜTÜPHANEMİ HAZIRLA 
        </button>
      </div>
    </div>
  );
};

export default GenreSelection;