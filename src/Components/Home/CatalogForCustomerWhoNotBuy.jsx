import { useContext, useEffect, useState } from "react"
import { CatalogImplementations } from "../../Code/CatalogImplementations"
import { GlobalContext } from "../../Context/GlobalContext"
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import DataViewer from "../../Components/Common/DataViewer"
import PaginationButtons from "../../Components/Common/PaginationButtons"
import { Col, Row } from "react-bootstrap";

const CatalogForCustomerWhoNotBuy = ({title='', emptyMessage=''}) => {
  const {authInfo} = useContext(GlobalContext)
  const [customerLoader, setCustomerLoader] = useState(false);
  const [customerFailer, setCustomerFailer] = useState({});
  const [customers, setCustomers] = useState([]);
  const [filter, setFilter] = useState({
    page: 1,
    pageSize: 10
  })
  const [pagination, setPagination] = useState({
    pageNumber: '',
    totalItems: '',
    totalPages: '',
    hasPreviousPage: '',
    hasNextPage: ''
  })
  const implementations = CatalogImplementations;

  const fillCustomers = ()=>{
    implementations.GetCustomersWhoHasCatalogsAndNotBuyByMonthNumber({
      token: authInfo.Token,
      setFailer: setCustomerFailer,
      setLoader: setCustomerLoader,
      month: 1,
      setCustomers: setCustomers,
      filter: filter,
      setPagination: setPagination
    });
  }

  useEffect(() => {
    fillCustomers();
  }, [])

  return (
    <Row className="text-white h-75">
      <Col lg={12}>
        <h2 className="d-flex justify-content-center p-2 border-1 border-bottom border-gray">{title}</h2>
      </Col>
      <Col lg={12}>
        {
          pagination.hasNextPage !== '' && pagination.hasPreviousPage !== '' &&
          !customerFailer?
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
          customerLoader &&
          <div className="w-100 h-100 d-flex justify-content-center align-items-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        }
        {
          Object.keys(customerFailer).length > 0 &&
          <div className="w-100">
            <Alert variant="danger">
              <h5>{customerFailer.title || 'فشل'}</h5>
              {
                customerFailer.errors && Object.keys(customerFailer.errors).length > 0 &&
                <ul className="list-unstyled mb-0 d-flex justify-content-start align-items-center flex-wrap">
                  {
                    Object.keys(customerFailer.errors).map((key, index) => (
                      <li key={index} className="w-100">{customerFailer.errors[key]}</li>
                    ))
                  }
                </ul>
              }
              <Button onClick={fillCustomers} variant="danger">اعادة المحاولة</Button>
            </Alert>
          </div>
        }
        {
          customerFailer === '' && !customerLoader && customers.length === 0 &&
          <Alert variant="warning" className="text-center">
            {emptyMessage}
          </Alert>
        }
        {
          customerFailer === '' && !customerLoader && customers.length > 0 &&
          <DataViewer 
            specialStyle="mt-2"
            headData={[
              {
                label: "المعرف",
                value: "id",
              },
              {
                label: "الاسم",
                value: "firstName",
              },
              {
                label: "اسم العائلة",
                value: "lastName",
              },
              {
                label: "البريد الالكتروني",
                value: "email",
              },
              {
                label: "رقم الهاتف",
                value: "phone",
              },
              {
                label: "العنوان",
                value: "address",
              },
              {
                label: "الحالة",
                value: "isActive",
                dataType: 'bool'
              },
              {
                label: "تاريخ الاضافة",
                value: "joinDate",
                dataType: 'date',
                dateFormat: 'full'
              },
            ]}
            bodyData={customers}
            goToDetails={(e) => {
              const row = e.target.closest('tr')
              if(row){
                const id = row.id.split('-')[1];
                window.open(`/customers/${customers[id].id}/details`, '_blank')
              }
            }}
          />
        }
        {
          pagination.hasNextPage !== '' && pagination.hasPreviousPage !== '' &&
          !customerFailer?
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

export default CatalogForCustomerWhoNotBuy