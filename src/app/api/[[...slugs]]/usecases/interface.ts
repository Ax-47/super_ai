export interface Usecase<I, T> {
  execute(input: I): Promise<T>
}
