export interface Task {
    id: number;
    description: string;
    timeSpent: number;
    isDone: boolean;
    started: boolean;
    progressBar: string;
}