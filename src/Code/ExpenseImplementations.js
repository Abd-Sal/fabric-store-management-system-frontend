import { ExpenseService } from '../Services/ExpenseService';

export const ExpenseImplementations = {
    FillSearchAndSort: ({ token, setSearchBy, setSortBy, setLoader, setFailer, setDefaultSearchCol, setDefaultSortCol }) => {
        setLoader(true);
        setFailer('');
        ExpenseService.EndpointsDetails({ token })
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
    FillExpenseTable: ({ token, setExpenses, setLoader, setFailer, filter, setPagination}) => {
        setLoader(true);
        setFailer('');
        ExpenseService.AllExpenses({
            token: token,
            page: filter.page,
            pageSize: filter.pageSize,
            Search: filter.search.trim().length > 0 ? filter.search : '',
            SearchColumn: filter.searchBy,
            SortColumn: filter.sortBy,
            SortDir: filter.sortDir,
        })
            .then(response => {
                const data = response.data;
                setExpenses(data.items);
                setPagination({
                    pageNumber: data.totalPages < filter.page ? 1 : data.pageNumber,
                    totalItems: data.totalItems,
                    totalPages: data.totalPages,
                    hasPreviousPage: data.hasPreviousPage,
                    hasNextPage: data.hasNextPage
                });
            })
            .catch(error => {
                if (error.response && error.response.data) {
                    const errorData = error.response.data;
                    setFailer({
                        title: errorData.title || 'فشل في تحميل المصروفات',
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
    CreateExpense: ({ token, expenseReq, setLoader, setFailer, onSuccess}) => {
        setLoader(true);
        setFailer({});
        ExpenseService.CreateExpense({
            token: token,
            reqBody: expenseReq,
        })
            .then(response => {
                onSuccess();
            })
            .catch(error => {
                if (error.response && error.response.data) {
                    const errorData = error.response.data;
                    setFailer({
                        title: errorData.title || 'فشل في اضافة المصروفات',
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
    ExpenseDetails: ({token, id, setExpenseDetails, setLoader, setFailer}) => {
        setLoader(true);
        setFailer(null);
        ExpenseService.ExpenseByID({
            token: token,
            id: id,
        })
        .then(response => {
            const data = response.data;
            setExpenseDetails(data);
        })
        .catch(error => {
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                setFailer({
                    title: errorData.title || 'فشل في تحميل معلومات عملية الصرف',
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
    RemoveExpense: ({token, id, setLoader, setFailer, onSuccess}) => {
        setLoader(true)
        setFailer(null)
        ExpenseService.DeleteExpense({
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
}