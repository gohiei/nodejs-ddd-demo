/* eslint-disable @typescript-eslint/no-empty-interface */
export interface Input {}
export interface Output {}

export interface UseCase {
  execute(input: Input): Output;
}
