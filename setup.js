const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

global.confirm = jest.fn();

// Mock setTimeout to prevent Jest from hanging
global.setTimeout = jest.fn((fn) => fn());
global.clearTimeout = jest.fn();