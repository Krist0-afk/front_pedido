declare global {
  interface ImportMeta {
    readonly env: Record<string, string | undefined>;
  }
}

export const environment = {
  production: false,
  msalConfig: {
    auth: {
      clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
      authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID}`,
      redirectUri: 'http://localhost:4200/', // Ajusta el puerto si usas otro en desarrollo
    }
  },
  apiConfig: {
    scopes: [import.meta.env.VITE_AZURE_SCOPE],
    uri: 'http://localhost:8080/api' // Esta será la ruta de tu API Gateway o backend local
  }
};