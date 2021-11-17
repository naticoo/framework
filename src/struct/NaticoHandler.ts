// deno-lint-ignore-file
import { EventEmitter } from "../../deps.ts";
import { NaticoClient } from "./NaticoClient.ts";

export class NaticoHandler<T extends NaticoClient> extends EventEmitter {
  client: T;
  directory: any;
  modules: any;
  constructor(client: any, { directory }: any) {
    super();
    this.client = client;
    this.directory = directory;
  }

  async load(thing: any) {
    let mod = await import("file://" + thing);
    mod = new mod.default();

    this.register(mod, thing);

    return mod;
  }
  remove(id: any) {
    const mod = this.modules.get(id.toString());
    if (!mod) return;
    this.deregister(mod);
    return mod;
  }
  async reload(id: any) {
    const mod = this.modules.get(id);
    if (!mod) return;
    this.deregister(mod);

    const filepath = mod.filepath;
    const newMod = await this.load(filepath);
    return newMod;
  }
  deregister(mod: any) {
    this.modules.delete(mod.id);
  }
  async reloadAll() {
    for (const m of Array.from(this.modules.values()) as any[]) {
      if (m.filepath) await this.reload(m.id);
    }

    return this.modules;
  }
  async loadALL(dirPath?: any) {
    dirPath = await Deno.realPath(dirPath || this.directory);
    const entries = Deno.readDir(dirPath);
    for await (const entry of entries) {
      if (entry.isFile) {
        await this.load(`${dirPath}/${entry.name}`);
        continue;
      }

      await this.loadALL(`${dirPath}/${entry.name}`);
    }
  }
  register(mod: any, filepath: any) {
    mod.filepath = filepath;
    mod.handler = this;
    mod.client = this.client;
    this.modules.set(mod.id, mod);
  }
}
