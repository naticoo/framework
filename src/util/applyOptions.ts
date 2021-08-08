export const applyOptions =
  <T extends any>(options: T) =>
  (Module: any): any => {
    //@ts-ignore -
    return class extends Module {
      constructor() {
        super();
        Object.assign(this, options);
      }
    };
  };
