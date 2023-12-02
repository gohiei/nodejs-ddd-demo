import validator from 'validator';

export function requireEmail(email: string, error: Error) {
  const ok = validator.isEmail(email);

  if (!ok) {
    throw error;
  }
}

export function requireNotEmpty(text: string, error: Error) {
  const strText = typeof text === 'string' ? text : '';
  const notOk = validator.isEmpty(strText, { ignore_whitespace: true });

  if (notOk) {
    throw error;
  }
}

export function requireArrayAndGreaterThan(
  nums: Array<any>,
  target: number,
  error: Error,
) {
  requireGreaterThan(nums.length, target, error);
}

export function requireDefined(target: any, error: Error) {
  if (target === undefined || target === null) {
    throw error;
  }
}

export function requireGreaterThan(num: number, target: number, error: Error) {
  const ok = num > target;

  if (!ok) {
    throw error;
  }
}

export function requireTrue(target: any, error: Error) {
  const ok = !!target;

  if (!ok) {
    throw error;
  }
}

export function requireFalse(target: any, error: Error) {
  requireTrue(!target, error);
}

export function requireDate(target: string, error: Error) {
  requireNotEmpty(target, error);

  const ok = validator.isDate(target);

  if (!ok) {
    throw error;
  }
}
