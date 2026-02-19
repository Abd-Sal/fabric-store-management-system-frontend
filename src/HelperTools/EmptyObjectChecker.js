export const EmptyObjectChecker = function (obj) {
    if (typeof obj !== 'object')
        throw new Error(`${typeof obj} cannot convert to object:(`)
    return obj === null || Object.keys(obj).length === 0;
}