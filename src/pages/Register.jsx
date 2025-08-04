import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { useTranslation } from 'react-i18next';

export default function Register() {
  const { role } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/register/${role}`, form);
      navigate(`/login/${role}`);
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">{t('register')} {role}</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          name="username"
          placeholder={t('username')}
          value={form.username}
          onChange={handleChange}
          className="border p-2"
        />
        <input
          name="email"
          placeholder={t('email')}
          value={form.email}
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
        <button type="submit" className="bg-green-500 text-white p-2">
          {t('register')}
        </button>
      </form>
    </div>
  );
}
