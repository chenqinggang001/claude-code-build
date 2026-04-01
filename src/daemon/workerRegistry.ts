export async function runDaemonWorker(_kind: string): Promise<void> {
  throw new Error('Daemon feature is not available in external builds');
}
