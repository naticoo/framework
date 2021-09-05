import { NaticoTask, applyOptions, NaticoTaskOptions } from "../../deps.ts";
@applyOptions<NaticoTaskOptions>({
  id: "say hello",
  delay: 600000, //10 minutes this function runs every 10 minutes
  runOnStart: true, //run it when the client is ready
})
export default class invite extends NaticoTask {
  exec() {
    console.log("Hello");
  }
}
