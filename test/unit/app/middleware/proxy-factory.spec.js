const rewire = require('rewire');
const {
  assert, expect,
} = require('chai');
const proxyFactory = rewire('../../../../app/middleware/proxy-factory')

proxyFactory.__set__('fs', {readFileSync: () => 'foo'}) 

const mockGuidLookupConfig = (guidLookupConfig) => {
  proxyFactory.__set__('guidLookup', guidLookupConfig)
}

const mockCognitoConfig = (cognitoConfig) => {
  proxyFactory.__set__('cognito', cognitoConfig)
}

describe('Proxy factory', () => {
  it('should export an object with functions for creating proxies', () => {
    assert.typeOf(proxyFactory, 'object');
    assert.typeOf(proxyFactory.getPrivateProxyTunnel, 'function');
    assert.typeOf(proxyFactory.getPublicProxyTunnel, 'function');
  });

  describe('getPrivateProxyTunnel', () => {
    it('should return a private proxy tunnel if guidLookup.proxy is enabled', () => {
      mockGuidLookupConfig({
        proxyEnabled: true,
        proxy: 'https://foo/bar'
      })
      const privateProxyTunnel = proxyFactory.getPrivateProxyTunnel();
      expect(privateProxyTunnel).to.not.be.null
    });

    it('should return null if guidLookup.proxy is disabled', () => {
      mockGuidLookupConfig({
        proxyEnabled: false,
      })
      const privateProxyTunnel = proxyFactory.getPrivateProxyTunnel();
      expect(privateProxyTunnel).to.be.null
    });
  })

  describe('getPublicProxyTunnel', () => {
    it('should return a public proxy tunnel if cognito.proxy is enabled', () => {
      mockCognitoConfig({
        proxy: 'https://foo/bar'
      })
      const publicProxyTunnel = proxyFactory.getPublicProxyTunnel();
      expect(publicProxyTunnel).to.not.be.null
    });

    it('should return null if cognito.proxy is disabled', () => {
      mockCognitoConfig({
        proxy: null,
      })
      const publicProxyTunnel = proxyFactory.getPublicProxyTunnel();
      expect(publicProxyTunnel).to.be.null
    });
  })
})