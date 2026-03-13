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
                amount: parseFloat(request.price).toFixed(2),
                paidAmount: parseFloat(paidForThisItem).toFixed(2)
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
                    let errorMessage = 'حدث خطأ أثناء إنشاء الكاتالوغ';                    
                    if (Object.hasOwn(errorData, 'errors')) {
                        if (Array.isArray(errorData.errors)) {
                            errorMessage = errorData.errors.flat(Infinity).join(' ');
                        } else if (typeof errorData.errors === 'object' && errorData.errors !== null) {
                            errorMessage = Object.values(errorData.errors).flat().join(' ');
                        } else {
                            errorMessage = String(errorData.errors);
                        }
                    }
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
    CatalogDetails: ({token, id, setCatalogDetails, setLoader, setFailer}) => {
        setLoader(true)
        setFailer(null)
        CatalogService.CatalogByID({
            token: token,
            id: id
        })
        .then(response => {
            const data = response.data;
            setCatalogDetails(data);
        })
        .catch(error => {
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                setFailer({
                    title: errorData.title || 'فشل في تحميل معلومات الكاتالوغ',
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
    PayCatalog: ({token, id, paidAmount, setLoader, setFailer, onSuccess}) => {
        setLoader(true)
        setFailer(null)
        CatalogService.PayPurchaseCatalog({
            id: id,
            token: token,
            paidAmount: paidAmount
        })
        .then(response => {
            onSuccess()
        })
        .catch(error => {
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                setFailer({
                    title: errorData.title || 'فشل في تحميل معلومات الفاتورة',
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
    AssignCatalog: ({token, catalogID, customerID, setLoader, setFailer, onSuccess}) => {
        setLoader(true)
        setFailer(null)
        CatalogService.AssingCatalog({
            catalogID: catalogID,
            customerID: customerID,
            token: token,
        })
        .then(response => {
            onSuccess()
        })
        .catch(error => {
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                setFailer({
                    title: errorData.title || 'فشل في عملية الاعارة',
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
    ReturnCatalog: ({token, id, setLoader, setFailer, onSuccess}) => {
        setLoader(true)
        setFailer(null)
        CatalogService.ReturnCatalog({
            token: token,
            id: id
        })
        .then(response => {
            onSuccess()
        })
        .catch(error => {
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                setFailer({
                    title: errorData.title || 'فشل في عملية الاستعادة',
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
    DestroyCatalog: ({token, id, setLoader, setFailer, onSuccess}) => {
        setLoader(true)
        setFailer(null)
        CatalogService.DestroyCatalog({
            token: token,
            id: id
        })
        .then(response => {
            onSuccess()
        })
        .catch(error => {
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                setFailer({
                    title: errorData.title || 'فشل في عملية الاتلاف',
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
    RemoveCatalog: ({token, id, setLoader, setFailer, onSuccess}) => {
        setLoader(true)
        setFailer(null)
        CatalogService.DeleteCatalog({
            token: token,
            id: id
        })
        .then(response => {
            onSuccess()
        })
        .catch(error => {
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                setFailer({
                    title: errorData.title || 'فشل في عملية الحذف',
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
    FillAssignedCatalogsTable: ({token, setAssingedCatalogs, setLoader, setFailer, filter, setPagination}) => {
        setLoader(true);
        setFailer('');
        CatalogService.AllAssignedCatalogs({
            token: token,
            page: filter.page,
            pageSize: filter.pageSize,
            Search: filter.search.trim().length > 0 ? filter.search : '',
            SearchColumn: filter.searchBy,
            SortColumn: filter.sortBy,
            SortDir: filter.sortDir,
            From: filter.to && filter.from ? filter.from  : '',
            To: filter.from && filter.to ? filter.to : '',
            includeReturned: filter.includeReturned
        })        
        .then(response => {
            const data = response.data;
            setAssingedCatalogs(data.items);
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
                    title: errorData.title || 'فشل في تحميل الحجوزات',
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
    AssignedCatalogsDetails: ({token, setAssignedCatalogs, setLoader, setFailer, catalogID}) => {
        setLoader(true)
        setFailer(null)
        CatalogService.AllAssignedCatalogs({
            token: token,
            Search: catalogID,
            SearchColumn: 'catalogid'
        })
        .then(response => {
            const data = response.data;
            if(Array.isArray(data.items) && data.items.length > 0)
                setAssignedCatalogs(data.items[0]);
        })
        .catch(error => {
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                setFailer({
                    title: errorData.title || 'فشل في تحميل معلومات الكاتالوغ',
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
    AssingedCatalogsFillSearchAndSort: ({token, setSearchBy, setSortBy, setLoader, setFailer, setDefaultSearchCol, setDefaultSortCol}) => {
        setLoader(true);
        setFailer('');
        CatalogService.AssignedCatalogsEndpointsDetails({
            token: token
        })
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
    GetCustomersWhoHasCatalogsAndNotBuyByMonthNumber: ({token, setCustomers, setPagination, month, filter, setLoader, setFailer}) => {
        setLoader(true);
        setFailer('');
        CatalogService.GetCustomersWhoHasCatalogsAndNotBuyByMonthNumber({
            token: token,
            month: month,
            page: filter.page,
            pageSize: filter.pageSize
        })
        .then(response => {
            const data = response.data;
            setCustomers(data.items);
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
                    title: errorData.title || 'فشل في عملية العملاء',
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
    }
}
