export async function daemonMain(_args: string[]): Promise<void> {
  throw new Error('Daemon feature is not available in external builds');
}
