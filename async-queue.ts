type Task = {
    task: () => Promise<any>
    resolve: (value: any) => void;
    reject: (value: any) => void;
    taskName: string;
}
class AsyncQueue {
    private queue: Task[]
    private isProcessing: boolean 
    constructor(){
        this.queue = [];
        this.isProcessing = false;
    }

    enqueue(task: () => Promise<any>, taskName: string) {
        return new Promise((resolve,reject) => {
            this.queue.push({task,resolve,reject, taskName});
        })
    }

    async processQueue() {
        if(this.isProcessing) return;

        this.isProcessing = true;

        while(this.queue.length > 0) {
            console.log(this.queue);
            const {task,resolve,reject} = this.queue.shift()!;
            try{
                console.log("resolvendo task")
                const result = await task();
               resolve(result);
            }
            catch(error) {
                reject(error);
            }
        }

        this.isProcessing = false;
    }
}

const q = new AsyncQueue();

q.enqueue(t1, "Task 1").then(resolve => console.log(resolve));
q.enqueue(t2, "Task 2").then(resolve => console.log(resolve));
q.enqueue(t3, "Task 3").then(resolve => console.log(resolve));



function t1() {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Timeout T1")
            resolve("Resultado do resolve da T1")
        },1000)
    })
}
function t2() {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Timeout T2")
            resolve("Resultado do resolve da T2")
        },1000)
    })
}
function t3() {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Timeout T3")
            resolve("Resultado do resolve da T3")
        },1000)
    })
}
