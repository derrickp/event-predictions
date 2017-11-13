

export interface Store<T> {
    create(entity: T): Promise<string>;
    save(entity: T): Promise<void>;
    saveMany(entities: T[]): Promise<void>;
    get(key: string): Promise<T | null>;
    getMany(keys?: string[]): Promise<T[]>;
}