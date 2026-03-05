import { CatalogService } from "../Services/CatalogService";

export const CatalogImplementations = {
    FillSearchAndSort: ({token, setSearchBy, setSortBy, setLoader, setFailer, setDefaultSearchCol, setDefaultSortCol}) => {
        setLoader(true);
        setFailer('');
        CatalogService.EndpointsDetails({token})
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
    FillCatalogsTable: ({token, setCatalogs, setLoader, setFailer, filter, setPagination}) => {
        setLoader(true);
        setFailer('');
        CatalogService.AllCatalogs({
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
            setCatalogs(data.items);
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
    CreateCatalogOfStock: ({token, request, setLoader, handleShow, catalogCount}) => {
        let successCount = 0;
        setLoader(true);
        for (let index = 0; index < catalogCount; index++) {
            CatalogService.CreateCatalogOfStock({
                token: token,
                description: request.description,
                items: request.items
            })
            .then(response => {
                if(successCount == catalogCount - 1)
                    handleShow('نجاح', 'تم إنشاء الكاتالوغ بنجاح', 'text-white bg-success', () => {})
                else
                    successCount++;
            })
            .catch(error => {
                if (error.response && error.response.data) {
                    const errorData = error.response.data;
                    handleShow('خطأ', Object.hasOwn(errorData, 'errors') ?
                                     (Array.isArray(errorData.errors) ? errorData.errors.flat(Infinity).join(' ') : errorData.errors) : 'حدث خطأ أثناء إنشاء الكاتالوغ' , 'text-white bg-danger', () => {})
                    setLoader(false);
                    return;
                } else {
                    handleShow('خطأ', 'فشل الاتصال بالخادم. يرجى المحاولة مرة أخرى.', 'text-white bg-danger', () => {})
                    setLoader(false);
                    return;
                }
            }).finally(() => {
                if(successCount == catalogCount - 1)
                    setLoader(false);
            });
        }
    },
    CreateCatalogBySupplier: ({token, request, setLoader, handleShow, catalogCount}) => {
        let successCount = 0;
        setLoader(true);
        for (let index = 0; index < catalogCount; index++) {
            CatalogService.CreateCatalogOfSupplier({
                token: token,
                supplierID: request.supplierID,
                description: request.description,
                items: request.items
            })
            .then(response => {
                if(successCount == catalogCount - 1)
                    handleShow('نجاح', 'تم إنشاء الكاتالوغ بنجاح', 'text-white bg-success', () => {})
                else
                    successCount++;
            })
            .catch(error => {
                if (error.response && error.response.data) {
                    const errorData = error.response.data;
                    handleShow('خطأ', Object.hasOwn(errorData, 'errors') ?
                                     (Array.isArray(errorData.errors) ? errorData.errors.flat(Infinity).join(' ') : errorData.errors) : 'حدث خطأ أثناء إنشاء الكاتالوغ' , 'text-white bg-danger', () => {})
                    setLoader(false);
                    return;
                } else {
                    handleShow('خطأ', 'فشل الاتصال بالخادم. يرجى المحاولة مرة أخرى.', 'text-white bg-danger', () => {})
                    setLoader(false);
                    return;
                }
            }).finally(() => {
                if(successCount == catalogCount - 1)
                    setLoader(false);
            });
        }
    },
    PurchaseCatalog: ({token, request, setLoader, handleShow, catalogCount}) => {
        let successCount = 0;
        setLoader(true);
        let remainingPaidAmount = parseFloat(request.paidAmount);
        let price = parseFloat(request.price);
        for (let index = 0; index < catalogCount; index++) {
            let paidForThisItem;
            if (remainingPaidAmount >= price) {
                paidForThisItem = price;
                remainingPaidAmount -= price;
            } else if (remainingPaidAmount > 0) {
                paidForThisItem = remainingPaidAmount;
                remainingPaidAmount = 0;
            } else {
                paidForThisItem = 0;
            }
            CatalogService.PurchaseCatalog({
                token: token,
                supplierID: request.supplierID,
                description: request.description,
                items: request.items,
                amount: request.price,
                paidAmount: paidForThisItem
            })
            .then(response => {
                if(successCount == catalogCount - 1)
                    handleShow('نجاح', 'تم إنشاء الكاتالوغ بنجاح', 'text-white bg-success', () => {})
                else
                    successCount++;
            })
            .catch(error => {
                if (error.response && error.response.data) {
                    const errorData = error.response.data;
                    handleShow('خطأ', Object.hasOwn(errorData, 'errors') ?
                                     (Array.isArray(errorData.errors) ? errorData.errors.flat(Infinity).join(' ') : errorData.errors) : 'حدث خطأ أثناء إنشاء الكاتالوغ' , 'text-white bg-danger', () => {})
                    setLoader(false);
                    return;
                } else {
                    handleShow('خطأ', 'فشل الاتصال بالخادم. يرجى المحاولة مرة أخرى.', 'text-white bg-danger', () => {})
                    setLoader(false);
                    return;
                }
            }).finally(() => {
                if(successCount == catalogCount - 1)
                    setLoader(false);
            });
        }
    }
}
