export default  {

    oidc:{
        clientId: '0oamtuzsihWwKPoVj5d7',
        issuer: 'https://dev-70903254.okta.com/oauth2/default',
        redirectUri: 'https://localhost:4200/login/callback',
        scopes: ['openid', 'profile', 'email'],
    },
    authParams: {
        ignoreLifetime: true,
   }


}
