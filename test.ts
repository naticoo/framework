class Test {
  public bb = "test";
}
const test = new Test();
let fake = test;
let clone = Object.assign(Object.create(Object.getPrototypeOf(test)), test);
clone.bb = "ae";
console.log(test, clone);
