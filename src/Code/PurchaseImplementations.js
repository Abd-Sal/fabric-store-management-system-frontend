import { PurchaseService } from '../Services/PurchaseService'

export const PurchaseImplementations = {
    FillSearchAndSort: ({ token, setSearchBy, setSortBy, setLoader, setFailer, setDefaultSearchCol, setDefaultSortCol }) => {
        setLoader(true);
        setFailer('');
        PurchaseService.EndpointsDetails({ token })
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
    FillPurchaseTable: ({token, setPurchases, setLoader, setFailer, filter, setPagination})=>{
        setLoader(true);
        setFailer('');
        PurchaseService.AllPurchase({
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
            setPurchases(data.items);
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
                    title: errorData.title || 'فشل في تحميل الفواتير',
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
    CreatePurchase: ({token, bill, onSuccess, setLoader, setFailer}) => {
        setLoader(true);
        setFailer('');
        PurchaseService.CreatePurchase({
            token: token,
            supplierID: bill.supplierID,
            paidAmount: bill.paidAmount,
            purchaseItems: bill.purchaseItems
        })
        .then(response => {
            const data = response.data;
            onSuccess();
        })
        .catch(error => {
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                setFailer({
                    title: errorData.title || 'فشل في حفظ الفاتورة',
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
    PurchaseDetails: ({token, id, setPurchaseDetails, setLoader, setFailer}) => {
        setLoader(true)
        setFailer(null)
        PurchaseService.PurchaseByID({
            token: token,
            id: id
        })
        .then(response => {
            const data = response.data;
            setPurchaseDetails(data);
        })
        .catch(error => {
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                setFailer({
                    title: errorData.title || 'فشل في تحميل معلومات المخزون',
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
    PayPurchase: ({token, id, paidAmount, setLoader, setFailer, onSuccess}) => {
        setLoader(true)
        setFailer(null)
        PurchaseService.PayPurchase({
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
                    title: errorData.title || 'فشل في تحميل معلومات المخزون',
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