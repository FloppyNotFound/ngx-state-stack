export interface AppState {
  routePath: string;
  cache(...params: any[]): void;
}
