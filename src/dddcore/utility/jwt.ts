import * as jwt from 'jsonwebtoken';

export function VerifyJwt<T>(token: string, key: string): [T, Error] {
  try {
    const result = jwt.verify(token, key, {
      alogorithms: ['HS256', 'HS384', 'HS512'],
    });

    if (!result.exp) {
      return [null, new Error('Invalid exp')];
    }

    if (!result.iat) {
      return [null, new Error('Invalid iat')];
    }

    return [result, null];
  } catch (err) {
    return [null, err];
  }
}
