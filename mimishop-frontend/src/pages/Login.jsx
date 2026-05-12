import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Login() {
  const { login, showToast } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ usuario: '', password: '' });

  async function handleSubmit() {
    try {
      
      const res = await fetch('https://mimishop-backend.onrender.com/api/users/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Credenciales incorrectas');
      const data = await res.json();
      console.log('RESPUESTA DEL BACKEND:', data);

      login(data.usuario, data.token);  // ← este era el bug
      navigate('/');
    } catch (e) {
      showToast(e.message, 'error');
    }
  }

  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#0f1117' }}>
      <div style={{ background:'#161b27', border:'1px solid #1e2a3a', borderRadius:14, padding:32, width:340 }}>
        <h2 style={{ color:'#60a5fa', marginBottom:24, fontSize:20 }}>⚡ CRM Login</h2>
        <div className="field">
          <label>Usuario</label>
          <input value={form.usuario} onChange={e => setForm(f => ({...f, usuario: e.target.value}))} />
        </div>
        <div className="field">
          <label>Contraseña</label>
          <input type="password" value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        </div>
        <button className="btn btn-primary" style={{ width:'100%', marginTop:8 }} onClick={handleSubmit}>
          Entrar
        </button>
      </div>
    </div>
  );
}
