import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aksharadeepa.app',
  appName: 'Akshara-Deepa',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    GoogleSignIn: {
      scopes: ['profile', 'email'],
      serverClientId: '252561332006-rv546ijg5ubupaa84qlt0sdu8auitmo8.apps.googleusercontent.com',
    },
  },
};

export default config;
