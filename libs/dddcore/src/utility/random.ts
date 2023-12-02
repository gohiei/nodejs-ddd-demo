import { generate } from 'randomstring';

export function randomString(length: number): Promise<string> {
  return new Promise((resolve, reject) => {
    generate(length, (err, generatedString) => {
      /* istanbul ignore next */
      if (err) {
        reject(err);
      } else {
        resolve(generatedString);
      }
    });
  });
}
