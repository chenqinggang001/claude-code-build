export async function environmentRunnerMain(_args: string[]): Promise<void> {
  throw new Error('Environment runner feature is not available in external builds');
}
