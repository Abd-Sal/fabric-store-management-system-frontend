import { Col, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

const PaginationButtons = ({pagination, filter, setFilter, isLoading=false}) => {
    const handleNext = () =>{
        let next = parseInt(filter.page)+1
        if(pagination.hasNextPage && next <= pagination.totalPages){
            setFilter({
                ...filter,
                page: next
            })
        }
    }

    const handlePrev = () =>{
        let prev = parseInt(filter.page)-1
        if(pagination.hasPreviousPage && prev >= 0){
            setFilter({
                ...filter,
                page: prev
            })
        }
    }

    return (
        <Row>
            <Col xs={4} className='d-flex justify-content-start align-items-center'>
                <Button
                    variant={pagination.hasPreviousPage? `primary` : 'dark'}
                    onClick={handlePrev}
                    disabled={!pagination.hasPreviousPage || isLoading}
                >السابق</Button>
            </Col>
            <Col xs={4} className='d-flex justify-content-center align-items-center'>
                <div>{pagination.pageNumber}/{pagination.totalPages}</div>
            </Col>
            <Col xs={4} className='d-flex justify-content-end align-items-center'>
                <Button
                    variant={pagination.hasNextPage ? `primary` : 'dark'}
                    onClick={handleNext}
                    disabled={!pagination.hasNextPage || isLoading}
                >التالي</Button>
            </Col>
        </Row>
    )
}

export default PaginationButtons