import { useContext, useEffect, useState } from "react"
import { ProductImplementations } from "../../Code/ProductImplementations"
import { GlobalContext } from "../../Context/GlobalContext"
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import DataViewer from "../../Components/Common/DataViewer"
import PaginationButtons from "../../Components/Common/PaginationButtons"
import { Col, Row } from "react-bootstrap";

const ProductQuantitiesBeforeRanout = ({title='', emptyMessage=''}) => {
  const {authInfo} = useContext(GlobalContext)
  const [productLoader, setProductLoader] = useState(false);
  const [productFailer, setProductFailer] = useState({});
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState({
    page: 1,
    pageSize: 10,
    minQuantity: 10
  })
  const [pagination, setPagination] = useState({
    pageNumber: '',
    totalItems: '',
    totalPages: '',
    hasPreviousPage: '',
    hasNextPage: ''
  })
  const implementations = ProductImplementations;

  const fillProducts = ()=>{
    implementations.GetProductsWhichWillRanOut({
      token: authInfo.Token,
      setFailer: setProductFailer,
      setLoader: setProductLoader,
      filter: filter,
      setPagination: setPagination,
      setProducts: setProducts,
    });
  }

  const dataMapper = () => {
    return products.map(item => ({
      id: item.product.id,
      productCode: item.product.productCode,
      currentQuantity: <div className="fw-bold bg-danger text-white">{item.currentQuantity} {item.product.unit}</div>,
      lastUnitCost: item.lastUnitCost,
      name: Object.hasOwn(item.product, 'name') ? item.product.name : '---',
      code: item.product.code,
      color: item.product.color,
      unit: item.product.unit,
      material: Object.hasOwn(item.product, 'material') ? item.product.material : '---',
      createdAt: item.product.createdAt,
      lastUpdateAt: Object.hasOwn(item, 'lastUpdateAt') ?  item.lastUpdateAt : '---',
    }))
  }

  useEffect(() => {
    fillProducts();
  }, [])

  return (
    <Row className="text-white h-75">
      <Col lg={12}>
        <h2 className="d-flex justify-content-center p-2 border-1 border-bottom border-gray">{title}</h2>
      </Col>
      <Col lg={12}>
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
            {emptyMessage}
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
                label: "الكمية المتوفرة",
                value: "currentQuantity"
              },
              {
                label: "س.ر.م",
                value: "lastUnitCost"
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
              },
              {
                label: "تاريخ الاضافة",
                value: "lastUpdateAt",
                dataType: 'date',
                dateFormat: 'full'
              }
            ]}
            bodyData={dataMapper()}
            goToDetails={(e) => {
              const row = e.target.closest('tr');
              if (row) {
                const id = row.id.split('-')[1];
                window.open(`/products/${products[id].product.id}/details`, '_blank');
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
  )
}

export default ProductQuantitiesBeforeRanout