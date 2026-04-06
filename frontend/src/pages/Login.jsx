import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import vitrayGorsel from '../assets/vitrayli.jpg';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/users/login', { email });
      
      if (response.data.status === "success") {
        onLogin(response.data.user); 
      }
    } catch (error) {
      console.error("Giriş hatası:", error);
      alert("Backend bağlantı hatası! Lütfen Node.js server'ın (Port: 5000) çalıştığından emin ol.");
    }
  };

  return (
    <div style={{ 
      height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundImage: `linear-gradient(rgba(15, 10, 25, 0.75), rgba(15, 10, 25, 0.75)), url(${vitrayGorsel})`,
      backgroundSize: '30%', 
      backgroundRepeat: 'repeat',
      backgroundPosition: 'center'
    }}>
      <div className="glass-panel" style={{ width: '90%', maxWidth: '600px', padding: '40px', textAlign: 'center' }}>
        <div className="flex justify-center mb-4">
          <Sparkles size={60} color="#f472b6" />
        </div>
        
        <h1 style={{ fontSize: '3.5rem', color: '#f472b6', marginBottom: '10px', letterSpacing: '8px', fontWeight: '900' }}>
          BOOKSY AI
        </h1>
        
        <p style={{ fontSize: '1.4rem', marginBottom: '30px', color: '#fce7f3' }}>
          Kişisel kitap dedektifin seni bekliyor.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input 
            type="email" 
            placeholder="E-posta adresini gir..." 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            style={{ 
              width: '100%', padding: '18px', fontSize: '1.2rem', borderRadius: '15px', 
              backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', border: '2px solid #ec4899',
              textAlign: 'center'
            }}
            required
          />
          <button 
            type="submit" 
            style={{ 
              width: '100%', padding: '20px', fontSize: '1.5rem', 
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', 
              borderRadius: '15px', border: 'none', color: 'white', fontWeight: 'bold', 
              cursor: 'pointer', transition: '0.3s' 
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            KÜTÜPHANEME GİR
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;