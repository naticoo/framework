import { NaticoClient } from "../NaticoClient.ts";
import { NaticoHandler } from "../NaticoHandler.ts";
import { NaticoTask } from "./Task.ts";
import { Collection } from "../../../deps.ts";
import { TaskHandlerEvents } from "../../util/Constants.ts";
export class NaticoTaskHandler<T extends NaticoClient> extends NaticoHandler<T> {
  declare modules: Collection<string, NaticoTask>;
  directory: string;

  constructor(client: T, { directory }: { directory: string }) {
    super(client, {
      directory,
    });
    this.directory = directory;
    this.modules = new Collection();
  }

  register(task: NaticoTask, filepath: string) {
    task.client = this.client;
    if (task.runOnStart) {
      try {
        task.exec();
      } catch (e) {
        this.emit(TaskHandlerEvents.TASKERROR, task, e);
      }
    }
    if (task.delay) {
      const delay = typeof task.delay == "function" ? task.delay(this.client) : task.delay;
      setInterval(() => {
        try {
          task.exec();
        } catch (e) {
          this.emit(TaskHandlerEvents.TASKERROR, task, e);
        }
      }, delay);
    }
    return super.register(task, filepath);
  }
}
