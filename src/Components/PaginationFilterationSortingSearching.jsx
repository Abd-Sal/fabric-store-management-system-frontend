import * as Yup from 'yup';

const PaginationFilterationSortingSearching = ({searchBy, sortBy, defaultSearchCol, defaultSortCol, filter, setFilter, pagination}) => {

    let filterSchema = Yup.object().shape({
        search: Yup
            .string()
            .max(100, "يجب أن يكون الحقل أقل من 100 حرف"),
        searchBy: Yup
            .string()
            .oneOf(searchBy.map(col => col.value), "الحقل غير مسموح به"),
        sortBy: Yup
            .string()
            .oneOf(sortBy.map(col => col.value), "الحقل غير مسموح به"),
        sortDir: Yup
            .string()
            .oneOf(["asc", "desc"], "الحقل غير مسموح به"),
        from: Yup
            .date()
            .nullable(),
        to: Yup
            .date()
            .nullable(),
        pageSize: Yup
            .number()
            .oneOf([5, 10, 20, 50, 100], "الحقل غير مسموح به")
    });

    const handleSearch = (e) => {
        if(filterSchema.fields.search.isValidSync(e.currentTarget.value)){
            setFilter({
                ...filter,
                search: e.currentTarget.value
            })
        }
    }

    const handleSearchBy = (e) => {
        if(filterSchema.fields.searchBy.isValidSync(e.currentTarget.value)){
            setFilter({
                ...filter,
                searchBy: e.currentTarget.value
            })
        }
    }

    const handleSortBy = (e) => {
        if(filterSchema.fields.sortBy.isValidSync(e.currentTarget.value)){
            setFilter({
                ...filter,
                sortBy: e.currentTarget.value
            })
        }
    }

    const handleSortDir = (e) => {
        if(filterSchema.fields.sortDir.isValidSync(e.currentTarget.value)){
            setFilter({
                ...filter,
                sortDir: e.currentTarget.value
            })
        }
    }

    const handleFrom = (e) => {
        if(filterSchema.fields.from.isValidSync(e.currentTarget.value)){
            setFilter({
                ...filter,
                from: new Date(e.currentTarget.value).toISOString().split('T')[0],
            })
        }
    }

    const handleTo = (e) => {
        if(filterSchema.fields.to.isValidSync(e.currentTarget.value)){
            setFilter({
                ...filter,
                to: new Date(e.currentTarget.value).toISOString().split('T')[0]
            })
        }
    }

    const handlePagSize = (e) => {
        if(filterSchema.fields.pageSize.isValidSync(e.currentTarget.value)){
            setFilter({
                ...filter,
                pageSize: e.currentTarget.value
            })
        }
    }

    return (
    <div className="p-3 border-1 border-danger rounded">
        <form className="d-flex flex-column gap-3">
            {/* Search Field */}
            <div className="form-group">
                <label htmlFor="search">بحث</label>
                <input
                    type="text"
                    name="search"
                    id="search"
                    className="form-control"
                    placeholder="ابحث عن منتج..."
                    onChange={handleSearch}
                    value={filter.search}
                />
            </div>
            
            {/* Search By Select */}
            <div className="form-group">
                <label htmlFor="pageSize">بحث حسب</label>
                <select
                    name="searchBy"
                    id="searchBy"
                    className="form-select"
                    onChange={handleSearchBy}
                    value={filter.searchBy ? filter.searchBy : defaultSearchCol.value}
                >
                    {
                        searchBy.map((option, index) => (
                            <option key={index} value={option.value}>{option.label}</option>
                        ))
                    }
                </select>
            </div>

            {/* Page Size Select */}
            <div className="form-group">
                <label htmlFor="pageSize">عدد العناصر في الصفحة</label>
                <select
                    name="pageSize"
                    id="pageSize"
                    className="form-select"
                    onChange={handlePagSize}
                    value={filter.pageSize}
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
            </div>
 
            {/* Sort By Select */}
            <div className="form-group">
                <label htmlFor="sortBy">ترتيب حسب</label>
                <select
                    name="sortBy"
                    id="sortBy"
                    className="form-select"
                    value={filter.sortBy ? filter.sortBy : defaultSortCol.value}
                    onChange={handleSortBy}
                >
                    {
                        sortBy.map((option, index) => (
                            <option key={index} value={option.value}>{option.label}</option>
                        ))
                    }
                </select>
            </div>

            {/* Sort Direction Select */}
            <div className="form-group">
                <label htmlFor="sortDirection">اتجاه الترتيب</label>
                <select
                    name="sortDirection"
                    id="sortDirection"
                    className="form-select"
                    value={filter.sortDir || 'desc'}
                    onChange={handleSortDir}
                >
                    <option value="desc">تنازلي</option>
                    <option value="asc">تصاعدي</option>
                </select>
            </div>

            {/* Date Range From*/}
            <div className="form-group">
                <label>من</label>
                <input
                    type="date"
                    name="fromDate"
                    id="fromDate"
                    className="form-control"
                    min={"2025-01-01"}
                    onChange={handleFrom}
                    value={filter.from}
                />
            </div>

            {/* Date Range To*/}
            <div className="form-group">
                <label>الى</label>
                <input
                    type="date"
                    name="toDate"
                    id="toDate"
                    className="form-control"
                    min={"2025-01-01"}
                    onChange={handleTo}
                    value={filter.to}
                />
            </div>
        </form>
    </div>
  )
}

export default PaginationFilterationSortingSearching