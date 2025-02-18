const Keycloak = require("keycloak-connect");
const session = require("express-session");
const memoryStore = new session.MemoryStore();
const kcConfig = {
    clientId: "aby-flix",
    bearerOnly: true,
    serverUrl: "http://localhost:8080",
    realm: "ABY-FLIX",
    realmPublicKey:
        "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvd1sPYkwFJF5eka3MaTqIPwVjJRryp5uS03MV91qGVZjFkphSfW/3cGxa16JOE1pFjRalveWcDjpfK+5JajMw1rpceABTsK1gHuvJOZk6QkiXyhwmDoH0pR5zJCbWgshlE0678+otaAbrxLYXzpsmACbZVCz+YR0eVDrUxUm6VPgNfmvJWzsMvry6/eFVIki5xV/mBzjPNeC6zwVfVK9UZl9TJ1BreF81JMJjc2zz1Jm9PLeyvzvQOBj6tqeDuSIRfsnQlir1cYe8Psta8FJ+1fEImdQuBnNnItkPU6llpfoKnjLW5K+nX1UEsxntcLgdwXGTbaJfGtacSQ/jgMVnQIDAQAB"
};

export const keycloak = new Keycloak({ store: memoryStore }, kcConfig);

