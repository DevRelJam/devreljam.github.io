export async function loadConfig() {
  const response = await fetch('data/config.json', { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Config load failed: ${response.status}`);
  }
  return response.json();
}
