export interface ConnectorTextBlock {
  type: 'connector_text';
  text: string;
}

export function isConnectorTextBlock(_block: unknown): _block is ConnectorTextBlock {
  return false;
}
