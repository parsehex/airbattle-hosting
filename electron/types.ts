export interface ServerConfig {
  gameMode: string;
  upgradesFever: boolean;
  ctfExtraSpawns: boolean;
}
export interface BotsConfig {
  botCount: number;
  botCharacter: string;
}
export type Config = ServerConfig & BotsConfig;