// type getProductById = (productArray: any, id: string) => Promise<any>;

export const getProduct = async (productArray: any, id: string) => productArray.find(elem => id === elem.id);