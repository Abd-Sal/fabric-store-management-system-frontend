import Button from 'react-bootstrap/Button';

const PaginationButtons = ({pagination, filter, setFilter}) => {
    const handleNext = () =>{
        if(pagination.hasNextPage){
            setFilter({
                ...filter,
                page: parseInt(filter.page)+1
            })
        }
    }

    const handlePrev = () =>{
        if(pagination.hasPreviousPage){
            setFilter({
                ...filter,
                page: parseInt(filter.page)-1
            })
        }
    }

    return (
    <div className="w-100 d-flex justify-content-between align-items-center">
        <Button
            variant={pagination.hasPreviousPage ? `primary` : 'dark'}
            onClick={handlePrev}
            disabled={!pagination.hasPreviousPage}
        >السابق</Button>
        <div>{pagination.pageNumber}</div>
        <Button
            variant={pagination.hasNextPage ? `primary` : 'dark'}
            onClick={handleNext}
            disabled={!pagination.hasNextPage}
        >التالي</Button>
    </div>
  )
}

export default PaginationButtons