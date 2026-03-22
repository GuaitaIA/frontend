const hostname = globalThis.location?.hostname ?? 'localhost';
const protocol = hostname === 'localhost' || hostname === '127.0.0.1' ? 'http' : globalThis.location?.protocol.replace(':', '') || 'https';
const apiHostname = hostname === 'localhost' ? '127.0.0.1' : hostname;

export const environment = {
  production: true,
  apiHost: `${protocol}://${apiHostname}:9000`,
};
