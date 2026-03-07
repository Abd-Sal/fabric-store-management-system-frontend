import { SupplierService } from '../Services/SupplierService'
export const SupplierImplementations = {
    FillSearchAndSort: ({token, setSearchBy, setSortBy, setLoader, setFailer, setDefaultSearchCol, setDefaultSortCol}) => {
        setLoader(true);
        setFailer('');
        SupplierService.EndpointsDetails({token})
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
    FillSupplierTable: ({token, setSuppliers, setLoader, setFailer, filter, setPagination, includeOnlyActive = true}) => {
        setLoader(true);
        setFailer('');
        SupplierService.AllSuppliers({
            token: token,
            page: filter.page,
            pageSize: filter.pageSize,
            Search: filter.search.trim().length > 0 ? filter.search : '',
            SearchColumn: filter.searchBy,
            SortColumn: filter.sortBy,
            SortDir: filter.sortDir,
            includeOnlyActive: includeOnlyActive
        })        
        .then(response => {
            const data = response.data;
            setSuppliers(data.items);
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
                    title: errorData.title || 'فشل في تحميل الموردين',
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
    CreateSupplier: ({token, supplier, setLoader, setFailer, onSuccess}) => {
        setLoader(true);
        setFailer({});
        SupplierService.CreateSupplier({
            token: token,
            name: supplier.name,
            email: supplier.email == '' || supplier.email == null ? null : supplier.email,
            address: supplier.address,
            phone: supplier.phone == '' || supplier.phone == null ? null : supplier.phone 
        })
        .then(response => {
            onSuccess();
        })
        .catch(error => {
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                setFailer({
                    title: errorData.title || 'فشل في اضافة المورد',
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
    SupplierSearchForBill: ({token, search}) => {
        let response = SupplierService.SearchSupplierForBill({
            token: token,
            search: search
        })
        return response;
    },
    SupplierDetails: ({token, id, setSupplierDetails, setLoader, setFailer}) => {
        setLoader(true);
        setFailer(null);
        SupplierService.SupplierByID({
            token: token,
            id: id,
            includeOnlyActive: false,
        })
        .then(response => {
            const data = response.data;
            setSupplierDetails(data);
        })
        .catch(error => {
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                setFailer({
                    title: errorData.title || 'فشل في تحميل معلومات المورد',
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
    SupplierPurchases: ({token, id, setSupplierPurchase, setPagination, filter, setLoader, setFailer}) => {
        setLoader(true)
        setFailer(null)
        SupplierService.SupplierPurchases({
            id: id,
            token: token,
            page: filter.page,
            pageSize: filter.pageSize,
            Search: filter.search,
            From: filter.to && filter.from ? filter.from  : '',
            To: filter.from && filter.to ? filter.to : '',
        })
        .then(response => {
            const data = response.data;
            setSupplierPurchase(data.items);
            setPagination(prev => {
                return {
                    ...prev,
                    pageNumber: data.pageNumber,
                    totalItems: data.totalItems,
                    totalPages: data.totalPages,
                    hasPreviousPage: data.hasPreviousPage,
                    hasNextPage: data.hasNextPage,
                }
            })
        })
        .catch(error => {
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                setFailer({
                    title: errorData.title || 'فشل في تحميل معلومات الفواتير',
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
    ActivateSupplier: ({token, id, setLoader, setFailer, setNeedRefresh}) => {
        setLoader(true);
        setFailer(null);
        SupplierService.ActivateSupplier({
            token: token,
            id: id,
        })
        .then(response => {
            setNeedRefresh(true)
        })
        .catch(error => {
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                setFailer({
                    title: errorData.title || 'فشل في تفعيل المورد',
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
    DeactivateSupplier: ({token, id, setLoader, setFailer, setNeedRefresh}) => {
        setLoader(true);
        setFailer(null);
        SupplierService.DeactivateSupplier({
            token: token,
            id: id,
        })
        .then(response => {
            setNeedRefresh(true)
        })
        .catch(error => {
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                setFailer({
                    title: errorData.title || 'فشل في حظر المورد',
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
    UpdateSupplier: ({token, id, newSupplier, setLoader, setFailer, onSuccess}) => {
        setLoader(true)
        setFailer(null)
        SupplierService.UpdateSupplier({
            id: id,
            token: token,
            name: newSupplier.name,
            address: newSupplier.address == '' || newSupplier.address == null ? null : newSupplier.address,
            email: newSupplier.email == '' || newSupplier.email == null ? null : newSupplier.email,
            phone: newSupplier.phone == '' || newSupplier.phone == null ? null : newSupplier.phone 
        })
        .then(response => {
            onSuccess();
        })
        .catch(error => {
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                setFailer({
                    title: errorData.title || 'فشل في تعديل المورد',
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