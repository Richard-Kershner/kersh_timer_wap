import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.richardkershner.kersh_timer',
  appName: 'kersh_timer',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
