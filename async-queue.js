"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class AsyncQueue {
    constructor() {
        this.queue = [];
        this.isProcessing = false;
    }
    enqueue(task, taskName) {
        return new Promise((resolve, reject) => {
            this.queue.push({ task, resolve, reject, taskName });
        });
    }
    processQueue() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isProcessing)
                return;
            this.isProcessing = true;
            while (this.queue.length > 0) {
                console.log(this.queue);
                const { task, resolve, reject } = this.queue.shift();
                try {
                    console.log("resolvendo task");
                    const result = yield task();
                    resolve(result);
                }
                catch (error) {
                    reject(error);
                }
            }
            this.isProcessing = false;
        });
    }
}
const q = new AsyncQueue();
q.enqueue(t1, "Task 1").then(resolve => console.log(resolve));
q.enqueue(t2, "Task 2").then(resolve => console.log(resolve));
q.enqueue(t3, "Task 3").then(resolve => console.log(resolve));
function t1() {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Timeout T1");
            resolve("Resultado do resolve da T1");
        }, 1000);
    });
}
function t2() {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Timeout T2");
            resolve("Resultado do resolve da T2");
        }, 1000);
    });
}
function t3() {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Timeout T3");
            resolve("Resultado do resolve da T3");
        }, 1000);
    });
}
