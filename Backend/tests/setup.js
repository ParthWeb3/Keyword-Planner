const { setupServer } = require('msw/node');
const { handlers } = require('./mocks/handlers');

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close()); 