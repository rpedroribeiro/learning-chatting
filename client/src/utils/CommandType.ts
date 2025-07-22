export const CommandType = {
  CommandBot: 'CommandBot',
  Ping: 'Ping'
} as const;
export type CommandType = typeof CommandType[keyof typeof CommandType]