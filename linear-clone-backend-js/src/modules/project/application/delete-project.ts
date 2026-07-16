import { ProjectHardDeleteNotAllowedError } from '../domain/errors';

export class DeleteProject {
  async execute(_id: string, _userId: string): Promise<void> {
    throw new ProjectHardDeleteNotAllowedError();
  }
}
