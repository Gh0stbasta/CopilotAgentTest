export interface Todo {
    id?: number;
    title: string;
    completed: boolean;
}
declare class Database {
    private db;
    constructor();
    private initTables;
    getAllTodos(): Promise<Todo[]>;
    createTodo(title: string, completed?: boolean): Promise<Todo>;
    updateTodo(id: number, title?: string, completed?: boolean): Promise<Todo | null>;
    deleteTodo(id: number): Promise<boolean>;
    close(): void;
}
export default Database;
//# sourceMappingURL=database.d.ts.map