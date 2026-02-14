import { Col, Container, Row } from "react-bootstrap"
import ProductsViewer from "../Components/Product/ProductsViewer"
import CreateProductModal from "../Components/Product/CreateProductModal"
import PaginationFilterationSortingSearching from "../Components/PaginationFilterationSortingSearching"
import { use, useContext, useEffect, useState } from "react"
import { ProductImplementations } from "../Code/ProductImplementations"
import { GlobalContext } from "../Context/GlobalContext"
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import PaginationButtons from "../Components/PaginationButtons"

const Product = () => {
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

  const fillProducts = ()=>{
    implementations.FillProductTable({
      token: authInfo.Token,
      setFailer: setProductFailer,
      setLoader: setProductLoader,
      setProducts: setProducts,
      filter: filter,
      setPagination: setPagination
    });
  }

  useEffect(() => {
        const timer = setTimeout(() => {
          if(!finishInitializeFilter){
            if(filter.searchBy && filter.sortBy){
              setPagination({
                pageNumber: '',
                totalItems: '',
                totalPages: '',
                hasPreviousPage: '',
                hasNextPage: ''
              })
              setFinishInitializeFilter(true);
            } 
          }else
            fillProducts();
        }, 500);
        return () => clearTimeout(timer);
  }, [filter])

  useEffect(() => {
    if (!finishInitializeFilter) return;
    fillProducts();
  }, [finishInitializeFilter])

  useEffect(() => {
    if (defaultSearchCol.value && filter.searchBy === '') {
      setFilter(prev => ({
        ...prev,
        searchBy: defaultSearchCol.value,
      }));
    }
    if(defaultSortCol.value && filter.sortBy === ''){
      setFilter(prev => ({
        ...prev,
        sortBy: defaultSortCol.value,
        sortDir: 'desc'
      }));
    }
  }, [{defaultSearchCol, defaultSortCol}]);

  // fill endpoint details
  useEffect(()=>{
    if(searchBy.length > 0 && sortBy.length > 0) return;
    fillEndpointDetails();
  }, [])

  useEffect(()=>{
    if(!addedProduct) return;
    fillTableProducts();
    setAddedProduct(false);
  }, [addedProduct])

  return (
    <>
      <Container fluid className="text-white">
        <Row>
          <Col lg={12}>
            <h2 className="d-flex justify-content-center p-2 border-1 border-bottom border-gray">واجهةالمنتجات</h2>
          </Col>
        </Row>
        <Row>
          {/* Product Form */}
          <Col lg={12}>
            <CreateProductModal 
              token={authInfo.Token}
              implementationsCreateProduct={implementations.CreatePorduct}
              addedProduct={addedProduct}
              setAddedProduct={setAddedProduct}
            />
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            {
              pagination.hasNextPage !== '' && pagination.hasPreviousPage !== '' &&
              !productFailer?
                <Row>
                  <Col lg={3}>
                    <div className="p-3 rounded border bg-success w-100 d-flex flex-wrap justify-content-center align-items-center gap-3">
                      <p className="mb-0"><strong>الصفحة:</strong> {pagination.pageNumber}</p>
                      <p className="mb-0"><strong>عدد الصفحات:</strong> {pagination.totalPages}</p>
                      <p className="mb-0"><strong>عدد العناصر:</strong> {pagination.totalItems}</p>
                    </div>
                  </Col>
                  <Col lg={9}>
                      <PaginationButtons
                        filter={filter}
                        pagination={pagination}
                        setFilter={setFilter}
                      />
                  </Col>
                </Row>
                :
                ''
            }          
          </Col>
          {/* Filteration */}
          <Col lg={3}>
            {
              isLoading &&
              <div className="w-100 h-100 d-flex justify-content-center align-items-center">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            }
            {
              Object.keys(failer).length > 0 &&
              <div className="w-100">
                <Alert variant="danger">
                  <h5>{failer.title || 'فشل'}</h5>
                  {
                    failer.errors && Object.keys(failer.errors).length > 0 &&
                    <ul className="list-unstyled mb-0 d-flex justify-content-start align-items-center flex-wrap">
                      {
                        Object.keys(failer.errors).map((key, index) => (
                          <li key={index} className="w-100">{failer.errors[key]}</li>
                        ))
                      }
                    </ul>
                  }
                <Button onClick={fillEndpointDetails} variant="danger">اعادة المحاولة</Button>
                </Alert>
              </div>
            }
            {
              Object.keys(failer).length === 0 && !isLoading && (searchBy.length === 0 || sortBy.length === 0) &&
              <Alert variant="warning" className="text-center">
                لا توجد تفاصيل نقاط نهاية للبحث والترتيب، يرجى المحاولة مرة أخرى.
              </Alert>
            }
            {
              Object.keys(failer).length === 0 && !isLoading && searchBy.length > 0 && sortBy.length > 0 &&
              <PaginationFilterationSortingSearching 
                searchBy={searchBy}
                sortBy={sortBy}
                defaultSearchCol={defaultSearchCol}
                defaultSortCol={defaultSortCol}
                filter={filter}
                setFilter={setFilter}
              />
            }
          </Col>
          {/* Products Table */}
          <Col lg={9}>
            {
              productLoader &&
              <div className="w-100 h-100 d-flex justify-content-center align-items-center">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            }
            {
              Object.keys(productFailer).length > 0 &&
              <div className="w-100">
                <Alert variant="danger">
                  <h5>{productFailer.title || 'فشل'}</h5>
                  {
                    productFailer.errors && Object.keys(productFailer.errors).length > 0 &&
                    <ul className="list-unstyled mb-0 d-flex justify-content-start align-items-center flex-wrap">
                      {
                        Object.keys(productFailer.errors).map((key, index) => (
                          <li key={index} className="w-100">{productFailer.errors[key]}</li>
                        ))
                      }
                    </ul>
                  }
                  <Button onClick={fillProducts} variant="danger">اعادة المحاولة</Button>
                </Alert>
              </div>
            }
            {
              productFailer === '' && !productLoader && products.length === 0 &&
              <Alert variant="warning" className="text-center">
                لا توجد منتجات لعرضها.
              </Alert>
            }
            {
              productFailer === '' && !productLoader && products.length > 0 &&
              <ProductsViewer
                products={products}
              />
            }
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Product