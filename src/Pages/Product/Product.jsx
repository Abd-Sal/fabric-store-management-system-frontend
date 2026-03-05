import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { Col, Container, Row } from "react-bootstrap"
import { useContext, useEffect, useState } from "react"
import CreateProductModal from "../../Components/Product/CreateProductModal"
import PaginationFilterationSortingSearching from "../../Components/Common/PaginationFilterationSortingSearching"
import { ProductImplementations } from "../../Code/ProductImplementations"
import { GlobalContext } from "../../Context/GlobalContext"
import PaginationButtons from "../../Components/Common/PaginationButtons"
import DataViewer from "../../Components/Common/DataViewer"

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
    fillProducts();
    setAddedProduct(false);
  }, [addedProduct])

  return (
    <>
      <Container fluid className="text-white">
        <Row>
          <Col lg={12}>
            <h2 className="d-flex justify-content-center p-2 border-1 border-bottom border-gray">واجهة المنتجات</h2>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            {
              pagination.hasNextPage !== '' && pagination.hasPreviousPage !== '' &&
              !productFailer?
                <Row>
                  <Col lg={3}>
                    <CreateProductModal 
                      token={authInfo.Token}
                      implementationsCreateProduct={implementations.CreatePorduct}
                      addedProduct={addedProduct}
                      setAddedProduct={setAddedProduct}
                      SpecialStyling="w-100 p-3"
                    />
                  </Col>
                  <Col lg={9}>
                      <PaginationButtons
                        filter={filter}
                        pagination={pagination}
                        setFilter={setFilter}
                      />
                    <div className="p-2 mt-2 rounded border bg-primary w-100 d-flex flex-wrap justify-content-start align-items-center gap-3">
                      <p className="mb-0"><strong>الصفحة:</strong> {pagination.pageNumber}</p>
                      <p className="mb-0"><strong>عدد الصفحات:</strong> {pagination.totalPages}</p>
                      <p className="mb-0"><strong>عدد العناصر:</strong> {pagination.totalItems}</p>
                    </div>
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
              <DataViewer 
                specialStyle="mt-2"
                headData={[
                  {
                    label: "المعرف",
                    value: "id"
                  },
                  {
                    label: "كود كامل",
                    value: "productCode"
                  },
                  {
                    label: "اسم المادة",
                    value: "name", 
                  },
                  {
                    label: "كود المادة",
                    value: "code"
                  },
                  {
                    label: "لون المادة",
                    value: "color"
                  },
                  {
                    label: "وحدة القياس",
                    value: "unit"
                  },
                  {
                    label: "مادة المنتج",
                    value: "material"
                  },
                  {
                    label: "تاريخ الاضافة",
                    value: "createdAt",
                    dataType: 'date',
                    dateFormat: 'full'
                  }
                ]}
                bodyData={products}
                goToDetails={(e) => {
                  const row = e.target.closest('tr');
                  if (row) {
                    const id = row.id.split('-')[1];
                    window.open(`/products/${products[id].id}/details`, '_blank');
                  }
                }}
              />
            }
            {
              pagination.hasNextPage !== '' && pagination.hasPreviousPage !== '' &&
              !productFailer?
                <Row>
                  <Col lg={12}>
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
        </Row>
      </Container>
    </>
  )
}

export default Product