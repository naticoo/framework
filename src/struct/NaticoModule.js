export class NaticoModule {
  handler;
  client;
  id;
  filepath;
  constructor(id) {
    this.id = id;
    this.filepath;
    this.handler;
  }

  reload() {
    return this.handler.reload(this.id);
  }

  remove() {
    return this.handler.remove(this.id);
  }

  toString() {
    return this.id;
  }
  exec(...args) {
    throw new Error(`NO_EXEC ${this.id}`);
  }
}
