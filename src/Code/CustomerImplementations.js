import { CustomerService } from '../Services/CustomerService';

export const CustomerImplementations = {
    FillSearchAndSort: ({ token, setSearchBy, setSortBy, setLoader, setFailer, setDefaultSearchCol, setDefaultSortCol }) => {
        setLoader(true);
        setFailer('');
        CustomerService.EndpointsDetails({ token })
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
    FillCustomerTable: ({ token, setCustomers, setLoader, setFailer, filter, setPagination, includeOnlyActive = true}) => {
        setLoader(true);
        setFailer('');
        CustomerService.AllCustomers({
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
                setCustomers(data.items);
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
                        title: errorData.title || 'فشل في تحميل الزبائن',
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
    CreateCustomer: ({ token, customer, setLoader, setFailer, onSuccess }) => {
        setLoader(true);
        setFailer({});
        CustomerService.CreateCustomer({
            token: token,
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            address: customer.address,
            phone: customer.phone
        })
            .then(response => {
                onSuccess();
            })
            .catch(error => {
                if (error.response && error.response.data) {
                    const errorData = error.response.data;
                    setFailer({
                        title: errorData.title || 'فشل في اضافة الزبائن',
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
};
