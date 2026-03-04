export type CollectionModel<K extends string | number, T> = {
    order: K[],
    entities: Record<K, T>
}

export const getInitialCollectionModel = (): CollectionModel<any, any> => ({
    order: [],
    entities: {}
})

export const normalizeCollection = <K extends string | number, T>
        (elements: T[], getKeyForElement: (element: T) => K): CollectionModel<K, T> => {
    const collection: CollectionModel<K, T> = getInitialCollectionModel();

    elements.forEach(el => {
        const id: K = getKeyForElement(el);
        collection.order.push(id);
        collection.entities[id] = el;
    })

    console.log(collection);

    return collection;
}

export const linearizeCollection = <K extends string | number, T>
        (collection: CollectionModel<K, T>): T[] => {

    return collection.order.map(id => collection.entities[id]);
}
