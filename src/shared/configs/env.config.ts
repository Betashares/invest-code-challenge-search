import path from 'path';

/**
 * Access to environment configs with defaults. Both can be overridden when starting the server, e.g.
 * PORT=3000 INSTRUMENTS_FILE=path/to/instruments.json npm start
 */

export interface EnvVarsConfig {
  port: number;
  instrumentsFile: string;
}

export const envConfig: EnvVarsConfig = {
  // 8787 is the port the real Search API worker serves on in local development.
  port: Number(process.env.PORT ?? 8787),
  instrumentsFile: path.resolve(
    process.env.INSTRUMENTS_FILE ?? 'data/instruments.json',
  ),
};
