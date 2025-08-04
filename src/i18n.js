import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      login: 'Login',
      register: 'Register',
      username: 'Username',
      password: 'Password',
      email: 'Email',
      myFleet: 'My Fleet',
      myProfile: 'My Profile',
      serviceDashboard: 'Service Dashboard'
    }
  },
  tr: {
    translation: {
      login: 'Giriş',
      register: 'Kayıt Ol',
      username: 'Kullanıcı Adı',
      password: 'Şifre',
      email: 'E-posta',
      myFleet: 'Filom',
      myProfile: 'Profilim',
      serviceDashboard: 'Servis Paneli'
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
