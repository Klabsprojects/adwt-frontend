import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({ providedIn: 'root' })
export class KeycloakAuthService {
  keycloak = new Keycloak({
    url: 'http://74.208.113.233:8081',
    realm: 'klabs',
    clientId: 'adwt-client'
  });

  init() {
    return this.keycloak.init({
      onLoad: 'check-sso',
      pkceMethod: 'S256'
    });
  }

  login() {
    return this.keycloak.login({
      redirectUri: window.location.origin
    });
  }

  logout() {
    return this.keycloak.logout({
      redirectUri: window.location.origin
    });
  }

  getToken() {
    return this.keycloak.token;
  }

  getProfile() {
    return this.keycloak.loadUserProfile();
  }
}
