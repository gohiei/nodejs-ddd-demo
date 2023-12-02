export enum UseCaseResult {
  OK = 'ok',
  FAIL = 'error',
}

export interface Input {}
export interface Output {}

export interface UseCase {
  execute(input: Input): Output | Promise<Output>;
}
