

export interface Store<T> {
    save(entity: T): Promise<void>;
    save(entities: T[]): Promise<void>;
    get(id: string): Promise<T>;
    get(ids?: string[]): Promise<T[]>;
}