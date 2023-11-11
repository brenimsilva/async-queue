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
const elements = {
    btnExecuteQueue: document.getElementById("btn-queue-submit"),
    btnNextTask: document.getElementById("btn-queue-next"),
    taskMessagesContainer: document.getElementById("task-messages"),
    taskNextContainer: document.getElementById("task-container-next"),
    taskContainer: document.getElementById("task-container-queue"),
    btnSubmit: document.getElementById("btn-submit"),
    taskTextInput: document.getElementById("inp-task-text"),
    taskDelayInput: document.getElementById("inp-task-delay"),
    taskNameInput: document.getElementById("inp-task-name"),
    timer: document.querySelector(".inner-timer"),
};
class AsyncQueue {
    constructor() {
        this.queue = [];
        this._isProcessing = false;
    }
    enqueue() {
        const taskElement = this.createTask();
        return new Promise((resolve, reject) => {
            this.queue.push({
                resolve,
                reject,
                task: taskElement.cb,
                taskName: taskElement.taskName,
                delay: taskElement.delay,
            });
            this._refreshQueue();
        });
    }
    _refreshQueue() {
        elements.taskContainer.innerHTML = "";
        this.queue.forEach((t) => {
            const p = document.createElement("p");
            p.innerText = `${t.taskName.replace(" ", "_")}()`;
            elements.taskContainer.appendChild(p);
        });
    }
    dequeue() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.queue.length <= 0)
                return console.error("Sem Tasks para remover da fila");
            const { task, resolve, reject, taskName, delay } = this.queue.shift();
            this._refreshQueue();
            const p = document.createElement("p");
            p.innerText = `${taskName}()`;
            elements.taskNextContainer.appendChild(p);
            this._fillDelayBar(delay);
            try {
                const result = yield task();
                elements.taskMessagesContainer.innerText = result;
                resolve(result);
                elements.taskNextContainer.innerHTML = "";
            }
            catch (error) {
                reject(error);
            }
        });
    }
    _fillDelayBar(delay) {
        let fill = 0;
        const interval = setInterval(() => {
            fill += ((1 / delay) * 1);
            elements.timer.style.width = `${fill}%`;
        }, 10);
        setTimeout(() => {
            clearInterval(interval);
            elements.timer.style.width = `0%`;
        }, delay * 1000);
    }
    createTask() {
        const taskName = elements.taskNameInput.value;
        const taskText = elements.taskTextInput.value;
        const taskDelay = Number(elements.taskDelayInput.value);
        elements.taskNameInput.value = "";
        elements.taskTextInput.value = "";
        elements.taskDelayInput.value = '';
        return {
            taskName: taskName,
            delay: taskDelay,
            cb: () => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(taskText);
                    }, taskDelay * 1000);
                });
            }
        };
    }
    processQueue() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._isProcessing)
                return;
            this._isProcessing = true;
            while (this.queue.length > 0) {
                yield this.dequeue();
            }
            this._isProcessing = false;
        });
    }
}
const q = new AsyncQueue();
elements.btnSubmit.addEventListener("click", (e) => {
    e.preventDefault();
    q.enqueue();
});
elements.btnNextTask.addEventListener("click", (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    const res = q.dequeue();
}));
elements.btnExecuteQueue.addEventListener("click", (e) => {
    e.preventDefault();
    q.processQueue();
});
