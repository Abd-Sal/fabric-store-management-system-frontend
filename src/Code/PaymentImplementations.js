import { PaymentService } from '../Services/PaymentService';

export const PaymentImplementations = {
    FillPaymentTable: ({ token, setPayments, setLoader, setFailer, filter, setPagination}) => {
        setLoader(true);
        setFailer('');
        PaymentService.AllPayments({
            token: token,
            From: filter.to && filter.from ? filter.from  : '',
            To: filter.from && filter.to ? filter.to : '',            
            page: filter.page,
            pageSize: filter.pageSize,
            Search: filter.search.trim().length > 0 ? filter.search : '',
        })
        .then(response => {
            const data = response.data;
            setPayments(data.items);
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
}