import { Col, Container, Row } from "react-bootstrap"
import CreateProductModal from "../Components/Product/CreateProductModal"
import PaginationFilterationSortingSearching from "../Components/PaginationFilterationSortingSearching"
import { use, useContext, useEffect, useState } from "react"
import { ProductImplementations } from "../Code/ProductImplementations"
import { GlobalContext } from "../Context/GlobalContext"
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import PaginationButtons from "../Components/PaginationButtons"
import DataViewer from "../Components/DataViewer"

const Suppliers = () => {
  const {authInfo} = useContext(GlobalContext)
  const [isLoading, setIsLoading] = useState(false);
  const [failer, setFailer] = useState({});
  const [searchBy, setSearchBy] = useState([]);
  const [sortBy, setSortBy] = useState([]);
  const [defaultSearchCol, setDefaultSearchCol] = useState({});
  const [defaultSortCol, setDefaultSortCol] = useState({});
  const [products, setProducts] = useState([]);
  const [productLoader, setProductLoader] = useState(false);
  const [productFailer, setProductFailer] = useState({});
  const [filter, setFilter] = useState({
    search: '',
    searchBy: defaultSearchCol.value || '',
    sortBy: defaultSortCol.value || '',
    sortDir: 'desc',
    page: 1,
    pageSize: 50,
    from: '',
    to: '',
  })
  const [pagination, setPagination] = useState({
    pageNumber: '',
    totalItems: '',
    totalPages: '',
    hasPreviousPage: '',
    hasNextPage: ''
  })
  const [finishInitializeFilter, setFinishInitializeFilter] = useState(false);

  const [addedProduct, setAddedProduct] = useState(false);
  const implementations = ProductImplementations;

    const fillEndpointDetails = ()=>{  
      implementations.FillSearchAndSort({
        token: authInfo.Token,
        setLoader: setIsLoading,
        setFailer: setFailer,
        setSearchBy: setSearchBy,
        setSortBy: setSortBy,
        setDefaultSearchCol: setDefaultSearchCol,
        setDefaultSortCol: setDefaultSortCol
      });
    }


  return (
    <Container fluid>
      <Row>
        <Col lg={12}>
          <h2 className="text-white d-flex justify-content-center p-2 border-1 border-bottom border-gray">واجهةالموردين</h2>
        </Col>
      </Row>
    </Container>
  )
}

export default Suppliers