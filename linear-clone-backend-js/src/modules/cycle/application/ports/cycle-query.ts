export interface CycleQuery {
  findById(id: string): Promise<{ id: string; teamId: string; status: string } | null>;
  isActive(id: string): Promise<boolean>;
}
