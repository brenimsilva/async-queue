const elements = {
    btnExecuteQueue: document.getElementById("btn-queue-submit") as HTMLButtonElement,
    btnNextTask: document.getElementById("btn-queue-next") as HTMLButtonElement,
    taskMessagesContainer: document.getElementById("task-messages") as HTMLDivElement,
    taskNextContainer: document.getElementById("task-container-next") as HTMLDivElement,
    taskContainer: document.getElementById("task-container-queue") as HTMLDivElement,
    btnSubmit: document.getElementById("btn-submit") as HTMLButtonElement,
    taskTextInput: document.getElementById("inp-task-text") as HTMLInputElement,
    taskDelayInput: document.getElementById("inp-task-delay") as HTMLInputElement,
    taskNameInput: document.getElementById("inp-task-name") as HTMLInputElement,
    timer: document.querySelector(".inner-timer") as HTMLDivElement,
}


type Task = {
    task: () => Promise<any>
    delay: number;
    resolve: (value: any) => void;
    reject: (value: any) => void;
    taskName: string;
}

class AsyncQueue {
    public queue: Task[]
    private _isProcessing: boolean 
    constructor(){
        this.queue = [];
        this._isProcessing = false;
    }

    enqueue() {
        const taskElement = this.createTask()
        return new Promise((resolve,reject) => {
            this.queue.push({
                resolve,
                reject,
                task: taskElement.cb,
                taskName: taskElement.taskName,
                delay: taskElement.delay,
            });
            this._refreshQueue();
        })
    }

    private _refreshQueue() {
        elements.taskContainer.innerHTML = "";
        this.queue.forEach((t) => {
            const p = document.createElement("p");
            p.innerText = `${t.taskName}()`
            elements.taskContainer.appendChild(p);
        })
    }

    async dequeue() {
        if(this.queue.length <= 0) return console.error("Sem Tasks para remover da fila");
        const {task,resolve,reject,taskName, delay} = this.queue.shift()!;
        this._refreshQueue();
        const p = document.createElement("p");
        p.innerText = `${taskName}()`;
        elements.taskNextContainer.appendChild(p);
        this._fillDelayBar(delay);
        try {
            const result = await task();
            elements.taskMessagesContainer.innerText = result;
            resolve(result)
            elements.taskNextContainer.innerHTML = ""
        }
        catch(error) {
            reject(error);
        }
    }

    private _fillDelayBar(delay: number) {
        let fill = 0;
        const interval = setInterval(() => {
            fill += ((1/delay) * 1);
            elements.timer.style.width = `${fill}%`
        }, 10)
        setTimeout(() => {
            clearInterval(interval);
            elements.timer.style.width = `0%`;
        }, delay * 1000)
    }

    createTask() : {delay: number,taskName: string, cb: () => Promise<any>} {
        const taskName = elements.taskNameInput.value;
        const taskText = elements.taskTextInput.value;
        const taskDelay = Number(elements.taskDelayInput.value);
        elements.taskNameInput.value = ""
        elements.taskTextInput.value = ""
        elements.taskDelayInput.value = ''
        return {
            taskName: taskName,
            delay: taskDelay,
            cb: () => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(taskText)
                    },taskDelay * 1000)
                })
            }
        }

    }

    async processQueue() {
        if(this._isProcessing) return;

        this._isProcessing = true;

        while(this.queue.length > 0) {
            await this.dequeue();
        }

        this._isProcessing = false;
    }
}

const q = new AsyncQueue();

elements.btnSubmit.addEventListener("click", (e) => {
    e.preventDefault();
    q.enqueue();
})

elements.btnNextTask.addEventListener("click", async (e) => {
    e.preventDefault();
    const res = q.dequeue();
})


elements.btnExecuteQueue.addEventListener("click", (e) => {
    e.preventDefault();
    q.processQueue();
})
