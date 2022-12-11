export const TODO_AMOUNT: bigint = BigInt("100000000000000000000000"); // 0.1 NEAR


export class addTodo {
    title: string;
    task: string;
    deadline: number;
    completed: boolean;
    accountId: any;
}

export class updateTodo {
    index: number;
    title: string;
    task: string;
    deadline: number;
    completed: boolean;
    accountId: any;
}