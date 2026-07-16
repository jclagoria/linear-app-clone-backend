export interface OnlineStatus {
  setOnline(userId: string): Promise<void>;
  setOffline(userId: string): Promise<void>;
  isOnline(userId: string): Promise<boolean>;
}
