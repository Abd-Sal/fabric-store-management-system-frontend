import { ProductService } from "../Services/ProductService";

export const ProductImplementations = {
    FillSearchAndSort: ({token, setSearchBy, setSortBy, setLoader, setFailer, setDefaultSearchCol, setDefaultSortCol}) => {
        setLoader(true);
        setFailer('');
        ProductService.EndpointsDetails({token})
        .then(response => {
            const data = response.data;
            setSearchBy(data.searchDetails.columns);
            setSortBy(data.sortDetails.columns);
            setDefaultSearchCol(data.searchDetails.default);
            setDefaultSortCol(data.sortDetails.default);
        })
        .catch(error => {
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                setFailer({
                    title: errorData.title || 'فشل في عملية تحميل الفلاتر',
                    errors: errorData.errors || { General: ['حدث خطأ غير متوقع'] }
                });
            } else {
                setFailer({
                    title: 'فشل الاتصال بالخادم',
                    errors: { General: [error.message || 'يرجى المحاولة مرة أخرى'] }
                });
            }
        }).finally(() => {
            setLoader(false);
        });
    },
    FillProductTable: ({token, setProducts, setLoader, setFailer, filter, setPagination}) => {
        setLoader(true);
        setFailer('');
        ProductService.AllProducts({
            token: token,
            page: filter.page,
            pageSize: filter.pageSize,
            Search: filter.search.trim().length > 0 ? filter.search : '',
            SearchColumn: filter.searchBy,
            SortColumn: filter.sortBy,
            SortDir: filter.sortDir,
            From: filter.to && filter.from ? filter.from  : '',
            To: filter.from && filter.to ? filter.to : '',
        })        
        .then(response => {
            const data = response.data;
            setProducts(data.items);
            setPagination({
                pageNumber: data.totalPages < filter.page ? 1 : data.pageNumber,
                totalItems: data.totalItems,
                totalPages: data.totalPages,
                hasPreviousPage: data.hasPreviousPage,
                hasNextPage: data.hasNextPage
            })
        })
        .catch(error => {
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                setFailer({
                    title: errorData.title || 'فشل في تحميل المواد',
                    errors: errorData.errors || { General: ['حدث خطأ غير متوقع'] }
                });
            } else {
                setFailer({
                    title: 'فشل الاتصال بالخادم',
                    errors: { General: [error.message || 'يرجى المحاولة مرة أخرى'] }
                });
            }
        }).finally(() => {
            setLoader(false);
        });
    },
    CreatePorduct: ({token, product, colors, setLoader, setFailer, onSuccess}) => {
        setLoader(true);
        setFailer({});
        let createdCount = 0;
        colors.forEach(color => {
            product.color = color;
            ProductService.CreateProduct({
                token: token,
                name: product.name ? product.name : null,
                code: product.code,
                color: product.color,
                material: product.material ? product.material : null,
                unit: product.unit
            })
            .then(response => {
                createdCount++;
                if (createdCount === colors.length) {
                    onSuccess();
                }
            })
            .catch(error => {
                if (error.response && error.response.data) {
                    const errorData = error.response.data;
                    setFailer({
                        title: errorData.title || 'فشل في إنشاء المنتج',
                        errors: errorData.errors || { General: ['حدث خطأ غير متوقع'] }
                    });
                } else {
                    setFailer({
                        title: 'فشل الاتصال بالخادم',
                        errors: { General: [error.message || 'يرجى المحاولة مرة أخرى'] }
                    });
                }
                setLoader(false);
            }).finally(() => {});
        });
        setLoader(false);
    },
    ProductSearchForBill: ({token, search}) => {
        let response = ProductService.SearchProductForBill({
            token: token,
            search: search
        })
        return response;
    },
    GetProductsByCode: ({token, code, setProducts, setLoader, handleShow}) => {
        setLoader(true);
        ProductService.GetProductsByCode({
            token: token,
            code: code
        })        
        .then(response => {
            const data = response.data;
            setProducts(data);
        })
        .catch(error => {
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                handleShow(errorData.title || 'فشل في تحميل المواد', errorData.errors ? Object.values(errorData.errors).flat().join(' - ') : 'حدث خطأ غير متوقع', 'bg-danger text-white', ()=>{});
            } else {
                handleShow('فشل الاتصال بالخادم', error.message || 'يرجى المحاولة مرة أخرى', 'bg-danger text-white', ()=>{});
            }
        }).finally(() => {
            setLoader(false);
        });
    },
    GetProductsWhichWillRanOut: ({token, setProducts, setLoader, setFailer, filter, setPagination}) => {
        setLoader(true);
        setFailer('');
        ProductService.GetProductsWhichWillRanOut({
            token: token,
            minQuantity: filter.minQuantity,
            page: filter.page,
            pageSize: filter.pageSize
        })
        .then(response => {
            const data = response.data;
            setProducts(data.items);
            setPagination({
                pageNumber: data.totalPages < filter.page ? 1 : data.pageNumber,
                totalItems: data.totalItems,
                totalPages: data.totalPages,
                hasPreviousPage: data.hasPreviousPage,
                hasNextPage: data.hasNextPage
            })
        })
        .catch(error => {
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                setFailer({
                    title: errorData.title || 'فشل في تحميل المواد',
                    errors: errorData.errors || { General: ['حدث خطأ غير متوقع'] }
                });
            } else {
                setFailer({
                    title: 'فشل الاتصال بالخادم',
                    errors: { General: [error.message || 'يرجى المحاولة مرة أخرى'] }
                });
            }
        }).finally(() => {
            setLoader(false);
        });
    },
    GetProductTransactions: ({token, id, setTransactions, setLoader, setFailer, page, pageSize, setPagination}) => {
        setLoader(true);
        setFailer(null);
        ProductService.ProductStockTransactions({
            token: token,
            id: id,
            page: page,
            pageSize: pageSize
        })
        .then(response => {
            const data = response.data;
            setTransactions(data.items);
            setPagination((prev) => {
                return {
                    ...prev,
                    pageNumber: data.totalPages < page ? 1 : data.pageNumber,
                    totalItems: data.totalItems,
                    totalPages: data.totalPages,
                    hasPreviousPage: data.hasPreviousPage,
                    hasNextPage: data.hasNextPage
                }
            })
        })
        .catch(error => {
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                setFailer({
                    title: errorData.title || 'فشل في تحميل معاملات المنتج',
                    errors: errorData.errors || { General: ['حدث خطأ غير متوقع'] }
                });
            } else {
                setFailer({
                    title: 'فشل الاتصال بالخادم',
                    errors: { General: [error.message || 'يرجى المحاولة مرة أخرى'] }
                });
            }
        }).finally(() => {
            setLoader(false);
        });
    },
    ProductDetails: ({token, id, setProductDetails, setLoader, setFailer}) => {
        setLoader(true);
        setFailer(null);
        ProductService.ProductInventory({
            token: token,
            id: id
        })
        .then(response => {
            const data = response.data;
            setProductDetails(data);
        })
        .catch(error => {
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                setFailer({
                    title: errorData.title || 'فشل في تحميل معلومات المادة',
                    errors: errorData.errors || { General: ['حدث خطأ غير متوقع'] }
                });
            } else {
                setFailer({
                    title: 'فشل الاتصال بالخادم',
                    errors: { General: [error.message || 'يرجى المحاولة مرة أخرى'] }
                });
            }
        }).finally(() => {
            setLoader(false);
        });
    },
}