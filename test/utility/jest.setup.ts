import {
  createTestingModule,
  closeTestingModule,
} from './create-testing-module';

beforeAll(async () => {
  await createTestingModule();
});

afterAll(async () => {
  await closeTestingModule();
});
