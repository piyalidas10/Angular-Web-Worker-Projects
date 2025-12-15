export interface Product {
id: number;
name: string;
category: string;
price: number;
}


export interface ProductFilterCriteria {
search: string;
category: string;
minPrice: number;
maxPrice: number;
}