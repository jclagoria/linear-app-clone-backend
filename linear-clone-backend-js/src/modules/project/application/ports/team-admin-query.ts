export interface TeamAdminQuery {
  isTeamAdmin(teamId: string, userId: string): Promise<boolean>;
}
