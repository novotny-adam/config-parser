import { Configuration } from '../src/index';
const config = new Configuration('test/samples/sample1.conf');

describe('index', () => {
  it('Should provide configuration', () => {
    expect(config).toBeDefined();
  });
  it('Should get inforamtion from config', () => {
    expect(config.get('test-of-api.api.baseUrl')).toEqual('http://localhost:8080');
    expect(config.get('test-of-api.api.host')).toEqual('127.0.0.1');
    expect(config.get('test-of-api.api.testUrl')).toEqual('http://localhost:4566/000000000000/testing-url');
  });
  it('Should return correct data types', () => {
    expect(typeof config.get('test-of-api.api.baseUrl')).toBe('string');
    expect(typeof config.get('test-of-api.api.duration')).toBe('string');
    expect(typeof config.get('test-of-api.api.host')).toBe('string');
    expect(typeof config.get('test-of-api.api.port')).toBe('number');
    expect(typeof config.get('test-of-api.api.apiIds')).toBe('object');
    expect(typeof config.get('test-of-api.api')).toBe('object');
  });
  it('Should return information, if configuration file has value or not', () => {
    expect(config.has('test-of-api.api.baseUrl')).toBeTruthy();
    expect(config.has('test-of-api.api')).toBeTruthy();
    expect(config.has('test-of-api.db')).toBeFalsy();
    expect(config.has('test-of-api.duration')).toBeFalsy();
  });
});
