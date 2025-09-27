export interface ServerConfig {
  gameMode: string;
  upgradesFever: boolean;
  ctfExtraSpawns: boolean;
}
export interface BotsConfig {
  botCount: number;
  botCharacter: string;
  noIdle: boolean;
}
export type Config = ServerConfig & BotsConfig;