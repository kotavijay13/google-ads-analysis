
export interface GoogleAdsAccount {
  id: string;
  name: string;
}

export interface GoogleAdsIntegrationState {
  loading: boolean;
  refreshing: boolean;
  accounts: GoogleAdsAccount[];
  connected: boolean;
  configError: string | null;
  selectedAccount: string | null;
}
