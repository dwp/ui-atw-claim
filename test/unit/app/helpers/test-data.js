const sign = require('jwt-encode');

const testGuid = 'SOMEGUID';

const jwt = sign({
  at_hash: 'T-sQZdjwM_sscqXpo6vINg',
  sub: 'abofu856@example.com',
  auditTrackingId: 'edfba9ec-47a5-4137-9227-68f733d701c9-28986',
  iss: 'https://forgerock.local.lvh.me/am/oauth2/realms/root/realms/Citizens/realms/WEB',
  tokenName: 'id_token',
  aud: 'RMD-WEB',
  c_hash: '_thV6BlF81bJEZ9N6dDr-w',
  acr: 'Auth-Level-Medium',
  'org.forgerock.openidconnect.ops': 'NW6MDOkGgBASwPsuDSTYxKWUJBc',
  s_hash: 'a7XkGSpoxgtHdt-fmF3tmQ',
  azp: 'RMD-WEB',
  auth_time: 1637673521,
  guid: testGuid,
  realm: '/Citizens/WEB',
  exp: 1637673641,
  tokenType: 'JWTToken',
  iat: 1637673521,
}, 'secret');

module.exports = {
  jwt,
  testGuid,
}
