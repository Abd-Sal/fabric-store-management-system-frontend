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
            address: customer.address,
            email: customer.email == '' || customer.email == null ? null : customer.email,
            phone: customer.phone == '' || customer.phone == null ? null : customer.phone 
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
    },
    CustomerSearchForBill: ({token, search}) => {
        let response = CustomerService.SearchCustomerForBill({
            token: token,
            search: search
        })
        return response;
    },
    CustomerDetails: ({token, id, setCustomerDetails, setLoader, setFailer}) => {
        setLoader(true);
        setFailer(null);
        CustomerService.CustomerByID({
            token: token,
            id: id,
            includeOnlyActive: false
        })
        .then(response => {
            const data = response.data;
            setCustomerDetails(data);
        })
        .catch(error => {
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                setFailer({
                    title: errorData.title || 'فشل في تحميل معلومات العميل',
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
    CustomerSales: ({token, id, setCustomerSales, setPagination, filter, setLoader, setFailer}) => {
        setLoader(true)
        setFailer(null)
        CustomerService.CustomerSales({
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
            setCustomerSales(data.items);
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
    CustomerCatalogs: ({token, id, setCustomerCatalogs, setPagination, filter, setLoader, setFailer}) => {
        setLoader(true)
        setFailer(null)
        CustomerService.CustomerCatalogs({
            id: id,
            token: token,
            page: filter.page,
            pageSize: filter.pageSize,
            Search: filter.search,
            From: filter.to && filter.from ? filter.from  : '',
            To: filter.from && filter.to ? filter.to : '',
            includeReturned: filter.includeReturned
        })
        .then(response => {
            const data = response.data;
            setCustomerCatalogs(data.items);
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
                    title: errorData.title || 'فشل في تحميل معلومات الكاتالوغات',
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
    ActivateCustomer: ({token, id, setLoader, setFailer, setNeedRefresh}) => {
        setLoader(true);
        setFailer(null);
        CustomerService.ActivateCustomer({
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
                    title: errorData.title || 'فشل في تفعيل العميل',
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
    DeactivateCustomer: ({token, id, setLoader, setFailer, setNeedRefresh}) => {
        setLoader(true);
        setFailer(null);
        CustomerService.DeactivateCustomer({
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
                    title: errorData.title || 'فشل في حظر العميل',
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
    UpdateCustomer: ({token, id, newCustomer, setLoader, setFailer, onSuccess}) => {
        setLoader(true)
        setFailer(null)
        CustomerService.UpdateCustomer({
            id: id,
            token: token,
            firstName: newCustomer.firstName,
            lastName: newCustomer.lastName,
            address: newCustomer.address == '' || newCustomer.address == null ? null : newCustomer.address,
            email: newCustomer.email == '' || newCustomer.email == null ? null : newCustomer.email,
            phone: newCustomer.phone == '' || newCustomer.phone == null ? null : newCustomer.phone 
        })
        .then(response => {
            onSuccess();
        })
        .catch(error => {
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                setFailer({
                    title: errorData.title || 'فشل في تعديل العميل',
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
