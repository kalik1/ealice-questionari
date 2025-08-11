export type EnvT = 'dev' | 'prod';
export type FoldersT = 'src' | 'dist';

export class Config {
  static salt = process.env.SALT || 12;
  static folders: Record<EnvT, FoldersT> = <const>{
    dev: 'src',
    prod: 'dist',
  };

  static getEnv(): EnvT {
    return process.env.NODE_ENV === 'production' ? 'prod' : 'dev';
  }

  static isProd(): boolean {
    return Config.getEnv() === 'prod';
  }

  static isDev(): boolean {
    return !Config.isProd();
  }

  static getFolderForDb(): FoldersT {
    return Config.folders[Config.getEnv()];
  }
}
