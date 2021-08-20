export const secretKey = () => {
     return Math.floor(Math.random() * 100000) + "" + new Date().getTime()
}
export class Bus {
     constructor() {
          this.callbacks = {};
     }
     $on(name, fn) {
          this.callbacks[name] = this.callbacks[name] || [];
          this.callbacks[name].push(fn);
     }
     $emit(name, args) {
          if (this.callbacks[name]) {
               this.callbacks[name].forEach((cb) => cb(args));
          }
     }
}  