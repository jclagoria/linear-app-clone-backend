import { Label, NewLabel } from '../../domain/label';
import { IssueLabel, NewIssueLabel } from '../../domain/issue-label';

export interface LabelRepository {
  findById(id: string): Promise<Label | null>;
  findByName(name: string): Promise<Label | null>;
  findAll(): Promise<Label[]>;
  findByIssueId(issueId: string): Promise<Label[]>;
  create(label: NewLabel): Promise<Label>;
  update(id: string, data: Partial<Omit<Label, 'id' | 'createdAt'>>): Promise<Label>;
  softDelete(id: string): Promise<void>;
  attachToIssue(issueId: string, labelId: string): Promise<IssueLabel>;
  detachFromIssue(issueId: string, labelId: string): Promise<void>;
  isAttached(issueId: string, labelId: string): Promise<boolean>;
}
