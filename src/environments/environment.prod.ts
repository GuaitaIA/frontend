const hostname = globalThis.location?.hostname ?? 'localhost';
const protocol = hostname === 'localhost' || hostname === '127.0.0.1' ? 'http' : globalThis.location?.protocol.replace(':', '') || 'https';

export const environment = {
  production: true,
  apiHost: `${protocol}://${hostname}:9000`,
};
