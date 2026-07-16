export interface TeamMemberQuery {
  isTeamMember(teamId: string, userId: string): Promise<boolean>;
}
