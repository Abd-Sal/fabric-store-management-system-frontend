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
                    title: errorData.title || 'فشل في عملية البحث عن المواد',
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