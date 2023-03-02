export interface DomainEsDbModuleOptions {
  uri: string;
  retryAttempts?: number;
  retryDelay?: number;
  connectionName?: string;
}
