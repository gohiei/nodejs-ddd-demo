import { Exception } from '../error';
import {
  requireArrayAndGreaterThan,
  requireDate,
  requireDefined,
  requireEmail,
  requireGreaterThan,
  requireNotEmpty,
  requireTrue,
} from './require';

describe('requireEmail', () => {
  describe('When email is valid', () => {
    it('should be ok', () => {
      const email = 'tester@example.com';

      requireEmail(email, new Error('Invalid email'));
    });
  });

  describe('When email is invalid', () => {
    it('should return error', (done) => {
      const email = 'xxxxx-asd';

      try {
        requireEmail(email, Exception.New('X000123', 'Invalid email'));
      } catch (err) {
        expect(err).toBeInstanceOf(Exception);
        expect(err.code).toBe('X000123');
        expect(err.message).toBe('Invalid email');
        done();
      }
    });
  });
});

describe('requireNotEmpty', () => {
  describe('When text is valid', () => {
    it('should be ok', () => {
      const text = 'tester@example.com';

      requireNotEmpty(text, new Error('Invalid text'));
    });
  });

  describe('When text is invalid', () => {
    it('should return error', (done) => {
      const text = null;

      try {
        requireNotEmpty(text, Exception.New('T000123', 'Invalid string'));
      } catch (err) {
        expect(err).toBeInstanceOf(Exception);
        expect(err.code).toBe('T000123');
        expect(err.message).toBe('Invalid string');
        done();
      }
    });
  });
});

describe('requireArrayAndGreaterThan', () => {
  describe('When nums is valid', () => {
    it('should be ok', () => {
      const nums = [1, 2, 3];
      requireArrayAndGreaterThan(
        nums,
        1,
        Exception.New('R0001', 'Invalid nums'),
      );
    });
  });

  describe('When nums is valid', () => {
    it('should be ok', () => {
      const nums = [1, 2, 3];
      requireArrayAndGreaterThan(
        nums,
        1,
        Exception.New('R0001', 'Invalid nums'),
      );
    });
  });

  describe('When # of nums is not greater than target', () => {
    it('should return error', (done) => {
      const nums = [1, 2, 3];

      try {
        requireArrayAndGreaterThan(
          nums,
          3,
          Exception.New('R0001', 'Invalid nums'),
        );
      } catch (err) {
        expect(err.code).toBe('R0001');
        done();
      }
    });
  });
});

describe('requireDefined', () => {
  describe('When target is defined', () => {
    it('should be ok', () => {
      const target = 'ok';

      requireDefined(target, new Error('Invalid target'));
    });
  });

  describe('When target is undefined', () => {
    it('should return error', (done) => {
      const target = undefined;

      try {
        requireDefined(target, new Error('Invalid target'));
      } catch (err) {
        done();
      }
    });
  });

  describe('When target is null', () => {
    it('should return error', (done) => {
      const target = null;

      try {
        requireDefined(target, new Error('Invalid target'));
      } catch (err) {
        done();
      }
    });
  });
});

describe('requireGreaterThan', () => {
  it('should be ok', (done) => {
    const error = new Error('invalid requireGreaterThan');

    requireGreaterThan(20, 10, error);

    try {
      requireGreaterThan(11, 12, error);
    } catch (err) {
      expect(err.message).toBe('invalid requireGreaterThan');
      done();
    }
  });
});

describe('requireTrue', () => {
  it('should be ok', (done) => {
    const error = new Error('invalid requireTrue');

    requireTrue(true, error);

    try {
      requireTrue(false, error);
    } catch (err) {
      expect(err.message).toBe('invalid requireTrue');
      done();
    }
  });
});

describe('requireDate', () => {
  it('should be ok', (done) => {
    const error = new Error('invalid requireDate');

    requireDate('2023-10-11', error);

    try {
      requireDate('this is not a date', error);
    } catch (err) {
      expect(err.message).toBe('invalid requireDate');
      done();
    }
  });
});
