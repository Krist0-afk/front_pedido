import { PublicClientApplication, Configuration, AuthenticationResult } from '@azure/msal-browser';
import { environment } from './environment';

class AuthService {
  private msalInstance: PublicClientApplication;

  constructor() {
    const msalConfig: Configuration = {
      auth: {
        ...environment.msalConfig.auth,
        clientId: environment.msalConfig.auth.clientId ?? '',
      },
      cache: {
        cacheLocation: 'sessionStorage',
      }
    };
    
    this.msalInstance = new PublicClientApplication(msalConfig);
    this.msalInstance.initialize().then(() => {
        console.log("MSAL Inicializado correctamente");
    });
  }

  login() {
    this.msalInstance.loginPopup({
      scopes: environment.apiConfig.scopes.filter((scope): scope is string => scope !== undefined)
    }).then((response: AuthenticationResult) => {
      this.msalInstance.setActiveAccount(response.account);
    }).catch((error: any) => {
      console.error("Error en el login: ", error);
    });
  }

  async getToken(): Promise<string | null> {
    const account = this.msalInstance.getActiveAccount();
    if (!account) return null;

    try {
      const response = await this.msalInstance.acquireTokenSilent({
        scopes: environment.apiConfig.scopes.filter((scope): scope is string => scope !== undefined),
        account: account
      });
      return response.accessToken;
    } catch (error) {
      console.warn("Fallo al obtener token silencioso, requiere login interactivo", error);
      return null;
    }
  }
}

export const authService = new AuthService();