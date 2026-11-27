import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'vn.dotquy115.app',
  appName: 'Đột Quỵ 115',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    hostname: 'localhost',
  },
  android: {
    allowMixedContent: false,
    backgroundColor: '#FAF9F6',
  },
};

export default config;
