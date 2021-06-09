import { Collection } from "../../../deps.ts";
import { NaticoClient, NaticoHandler, NaticoTask } from "../mod.ts";
export class NaticoTaskHandler extends NaticoHandler {
  declare modules: Collection<string, NaticoTask>;
  directory: string;

  constructor(client: NaticoClient, { directory }: { directory: string }) {
    super(client, {
      directory,
    });
    this.directory = directory;
    this.modules = new Collection();
  }
  register(task: NaticoTask, filepath: string) {
    if (task.runOnStart) task.exec();
    if (task.delay) {
      setInterval(() => {
        task.exec();
      }, Number(task.delay));
    }
    return super.register(task, filepath);
  }
}
