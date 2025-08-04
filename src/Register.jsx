import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({ email: '', password: '', role: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Kayıt başarısız');

      const loginRes = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      if (!loginRes.ok) throw new Error('Giriş başarısız');

      const { token, user } = await loginRes.json();
      if (token) localStorage.setItem('token', token);

      if (user?.role === 'shipowner') {
        navigate('/owner/dashboard');
      } else {
        navigate(`/${user?.role}/dashboard`);
      }
    } catch (err) {
      setError(err.message || 'Beklenmeyen bir hata oluştu');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="E-posta"
      />
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Şifre"
      />
      <input
        name="role"
        value={form.role}
        onChange={handleChange}
        placeholder="Rol"
      />
      <button type="submit">Kayıt Ol</button>
      {error && <p>{error}</p>}
    </form>
  );
}

export default Register;
