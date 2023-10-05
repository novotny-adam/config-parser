import { Configuration } from '../src/index';
const config = new Configuration('test/samples/sample1.conf');
const config2 = new Configuration('test/samples/sample2.conf');

describe('index', () => {
  it('Should provide configuration', () => {
    expect(config).toBeDefined();
  });
  it('Should get inforamtion from config', () => {
    expect(config.get('test-of-api.api.baseUrl')).toEqual('http://localhost:8080');
    expect(config.get('test-of-api.api.host')).toEqual('127.0.0.1');
    expect(config.get('test-of-api.api.testUrl')).toEqual('http://localhost:4566/000000000000/testing-url');
    expect(config.get('test-of-api.api.equals_url')).toEqual(
      'jdbc:postgresql://localhost:5432/test-application?schema=test_schema',
    );
    expect(config.get('test-of-api.api.zeroNumber')).toEqual(0);
  });
  it('Should return correct data types', () => {
    expect(typeof config.get('test-of-api.api.baseUrl')).toBe('string');
    expect(typeof config.get('test-of-api.api.duration')).toBe('string');
    expect(typeof config.get('test-of-api.api.host')).toBe('string');
    expect(typeof config.get('test-of-api.api.port')).toBe('number');
    expect(typeof config.get('test-of-api.api.apiIds')).toBe('object');
    expect(typeof config.get('test-of-api.api')).toBe('object');
    expect(typeof config.get('test-of-api.api.zeroNumber')).toBe('number');
  });
  it('Should return information, if configuration file has value or not', () => {
    expect(config.has('test-of-api.api.baseUrl')).toBeTruthy();
    expect(config.has('test-of-api.api')).toBeTruthy();
    expect(config.has('test-of-api.db')).toBeFalsy();
    expect(config.has('test-of-api.duration')).toBeFalsy();
    expect(config.has('test-of-api.api.zeroNumber')).toBeTruthy();
  });
});

describe('Testing of enviromental value duplicates', () => {
  it('Should return non-enviromental value from confing when it is first', () => {
    const nonEnviromentalIp = config2.get('test-duplicates.testing.ip');
    expect(nonEnviromentalIp).toBeDefined();
    expect(nonEnviromentalIp).toEqual(98);
    expect(typeof nonEnviromentalIp).toBe('number');
  });
  it('Should return non-enviromental value from confing when it is second', () => {
    const nonEnviromentalPort = config2.get('test-duplicates.web.port');
    expect(nonEnviromentalPort).toBeDefined();
    expect(nonEnviromentalPort).toEqual(8080);
    expect(typeof nonEnviromentalPort).toBe('number');
  });

  it('Should return enviromental value from confing when it is first', () => {
    const enviromentalPort = config2.get('test-duplicates.web.port', true);
    expect(enviromentalPort).toBeDefined();
    expect(enviromentalPort).toEqual('${?PORT_ENV_VARIABLE}');
    expect(typeof enviromentalPort).toBe('string');
  });
  it('Should return enviromental value from confing when it is second', () => {
    const enviromentalIp = config2.get('test-duplicates.api.ip', true);
    expect(enviromentalIp).toBeDefined();
    expect(enviromentalIp).toEqual('${?IP_ENV_VARIABLE}');
    expect(typeof enviromentalIp).toBe('string');
  });
});

describe('Negative scenarios', () => {
  it('Should throw an error if the value for the path is not defined', () => {
    expect(() => {
      config2.get('nonExistentPath');
    }).toThrow("No value exists for path: 'nonExistentPath'.");
  });
  it('Should throw an error if the value for the path is not defined', () => {
    expect(() => {
      config2.get('test-duplicates.configuration.description', true);
    }).toThrow(
      "'test-duplicates.configuration.description' exists without environment duplicity. Remove the 'env' parameter.",
    );
  });
});
