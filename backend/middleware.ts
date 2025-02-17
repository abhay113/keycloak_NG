const Keycloak = require("keycloak-connect");
const session = require("express-session");
const memoryStore = new session.MemoryStore();
const kcConfig = {
    clientId: "aby-flix",
    bearerOnly: true,
    serverUrl: "http://localhost:8080",
    realm: "master",
    realmPublicKey:
        "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAybGRbeHZ9+084IffccgfqEmxMI3gQ42QBG5oKs+Ef4lzYf6dxjnykHT+hTDoopqcRYJ47xYGvPK+uBQNYjBhthAfSMF5vmd9iLMYPydlmsNRW9J6lNzBu1kXK5qBGVHE82ViQPeOQSB2KhiDSWAFYYGiFFT68TvCC9RjwV/rvbzyYGXSWMuCJSwlesCBKDYhCYGpuvhTUFqMvNt+FANUxJCB7QXxlZqSrEo++NsWCEGOdFBc7lrspIHP6N48dQwFqZcl9x0NWSt4hOtto1PnON5gj6OThRz9F8pyVkZL5KUU15wifw8VzfPKHe6+UPJqb7RZuxcEhh6vDTrGX5YdowIDAQAB"
};

export const keycloak = new Keycloak({ store: memoryStore }, kcConfig);

