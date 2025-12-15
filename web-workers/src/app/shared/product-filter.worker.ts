/// <reference lib="webworker" />


import { Product, ProductFilterCriteria } from '../models/product.model';


addEventListener('message', ({ data }) => {
    const { products, criteria } = data as {
        products: Product[];
        criteria: ProductFilterCriteria;
    };


    const filtered = products.filter(p => {
        const matchesSearch =
            !criteria.search ||
            p.name.toLowerCase().includes(criteria.search.toLowerCase());


        const matchesCategory =
            !criteria.category || p.category === criteria.category;


        const matchesPrice =
            p.price >= criteria.minPrice && p.price <= criteria.maxPrice;


        return matchesSearch && matchesCategory && matchesPrice;
    });


    postMessage(filtered);
});