import { SaleService } from '../Services/SaleService'

export const SaleImplementations = {
    FillSearchAndSort: ({ token, setSearchBy, setSortBy, setLoader, setFailer, setDefaultSearchCol, setDefaultSortCol }) => {
        setLoader(true);
        setFailer('');
        SaleService.EndpointsDetails({ token })
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
    FillSaleTable: ({token, setSales, setLoader, setFailer, filter, setPagination})=>{
        setLoader(true);
        setFailer('');
        SaleService.AllSales({
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
            setSales(data.items);
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
    CreateSale: ({token, bill, onSuccess, setLoader, setFailer}) => {
        setLoader(true);
        setFailer('');
        SaleService.CreateSale({
            token: token,
            discount: bill.discount,
            customerID: bill.customerID,
            paidAmount: bill.paidAmount,
            saleItems: bill.saleItems
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
    }
}