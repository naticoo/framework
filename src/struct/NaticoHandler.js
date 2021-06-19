import { EventEmitter } from "../../deps.ts";

export class NaticoHandler extends EventEmitter {
  client;
  directory;
  modules;
  constructor(client, { directory }) {
    super();
    this.client = client;
    this.directory = directory;
  }

  async load(thing) {
    let mod = await import("file://" + thing);
    mod = new mod.default();

    this.register(mod, thing);

    return mod;
  }
  remove(id) {
    const mod = this.modules.get(id.toString());
    if (!mod) return;
    this.deregister(mod);
    return mod;
  }
  async reload(id) {
    const mod = this.modules.get(id);
    if (!mod) return;
    this.deregister(mod);

    const filepath = mod.filepath;
    const newMod = await this.load(filepath);
    return newMod;
  }
  deregister(mod) {
    this.modules.delete(mod.id);
  }
  async reloadAll() {
    for (const m of Array.from(this.modules.values())) {
      if (m.filepath) await this.reload(m.id);
    }

    return this.modules;
  }
  async loadALL(dirPath) {
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
  register(mod, filepath) {
    mod.filepath = filepath;
    mod.handler = this;
    mod.client = this.client;
    this.modules.set(mod.id, mod);
  }
}
