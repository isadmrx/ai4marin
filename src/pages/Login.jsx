import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const { role } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form, setForm] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const params = new URLSearchParams();
      params.append('username', form.username);
      params.append('password', form.password);
      const res = await api.post('/login', params);
      localStorage.setItem('token', res.data.access_token);
      if (role === 'shipowner') navigate('/owner/dashboard');
      if (role === 'crew') navigate('/crew/dashboard');
      if (role === 'vendor') navigate('/vendor/dashboard');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">{t('login')} {role}</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          name="username"
          placeholder={t('username')}
          value={form.username}
          onChange={handleChange}
          className="border p-2"
        />
        <input
          type="password"
          name="password"
          placeholder={t('password')}
          value={form.password}
          onChange={handleChange}
          className="border p-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          {t('login')}
        </button>
      </form>
    </div>
  );
}
