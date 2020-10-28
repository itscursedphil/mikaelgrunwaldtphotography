// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNodeConfig = require('next-plugin-node-config');

module.exports = withNodeConfig({
  nodeConfigServerKey: 'server',
  nodeConfigPublicKey: 'public',
});
