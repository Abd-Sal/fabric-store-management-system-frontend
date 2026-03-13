import { useContext, useEffect, useState } from "react"
import { PurchaseImplementations } from "../../Code/PurchaseImplementations"
import { GlobalContext } from "../../Context/GlobalContext"
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import DataViewer from "../../Components/Common/DataViewer"
import PaginationButtons from "../../Components/Common/PaginationButtons"
import { Col, Row } from "react-bootstrap";

const PurchasesForHome = ({customFilter={}, title='', emptyMessage=''}) => {
  const {authInfo} = useContext(GlobalContext)
  const [purchaseLoader, setPurchaseLoader] = useState(false);
  const [purchaseFailer, setPurchaseFailer] = useState({});
  const [purchases, setPurchases] = useState([]);
  const [filter, setFilter] = useState(customFilter)
  const [pagination, setPagination] = useState({
    pageNumber: '',
    totalItems: '',
    totalPages: '',
    hasPreviousPage: '',
    hasNextPage: ''
  })
  const implementations = PurchaseImplementations;

  const fillPurchases = ()=>{
    implementations.FillPurchaseTable({
      token: authInfo.Token,
      setFailer: setPurchaseFailer,
      setLoader: setPurchaseLoader,
      setPurchases: setPurchases,
      filter: filter,
      setPagination: setPagination
    });
  }

  const dataMapper = (purchasesData=[]) => {
    return purchasesData.map((purchase) => ({
      id: purchase.id,
      invoiceNumber: purchase.invoiceNumber,
      productsCount: purchase.productsCount,
      totalAmount: `${purchase.totalAmount}`,
      paidAmount: `${purchase.paidAmount}`,
      status: <div className={`p-2 pt-1 pb-1 text-white fw-bold rounded-4 ${purchase.status == 'Paid' ? 'bg-success' : purchase.status == 'NotCompleted' ? 'bg-warning' : 'bg-danger'}`}>{purchase.status == 'Paid' ? 'مكتمل' : purchase.status == 'NotCompleted' ? 'غير مكتمل' : 'غير مدفوع'}</div>,
      supplierID: purchase.supplierID,
      supplierName: purchase.supplierName,
      createdAt: purchase.createdAt
    }))
  }

  useEffect(() => {
    fillPurchases();
  }, [])

  return (
    <Row className="text-white h-75">
      <Col lg={12}>
        <h2 className="d-flex justify-content-center p-2 border-1 border-bottom border-gray">{title}</h2>
      </Col>
      <Col lg={12}>
        {
          pagination.hasNextPage !== '' && pagination.hasPreviousPage !== '' &&
          !purchaseFailer?
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
          purchaseLoader &&
          <div className="w-100 h-100 d-flex justify-content-center align-items-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        }
        {
          Object.keys(purchaseFailer).length > 0 &&
          <div className="w-100">
            <Alert variant="danger">
              <h5>{purchaseFailer.title || 'فشل'}</h5>
              {
                purchaseFailer.errors && Object.keys(purchaseFailer.errors).length > 0 &&
                <ul className="list-unstyled mb-0 d-flex justify-content-start align-items-center flex-wrap">
                  {
                    Object.keys(purchaseFailer.errors).map((key, index) => (
                      <li key={index} className="w-100">{purchaseFailer.errors[key]}</li>
                    ))
                  }
                </ul>
              }
              <Button onClick={fillPurchases} variant="danger">اعادة المحاولة</Button>
            </Alert>
          </div>
        }
        {
          purchaseFailer === '' && !purchaseLoader && purchases.length === 0 &&
          <Alert variant="warning" className="text-center">
            {emptyMessage}
          </Alert>
        }
        {
          purchaseFailer === '' && !purchaseLoader && purchases.length > 0 &&
          <DataViewer 
            specialStyle="mt-2"
            headData={[
              {
                label: "المعرف",
                value: "id"
              },
              {
                label: "رقم الفاتورة",
                value: "invoiceNumber"
              },
              {
                label: "عدد المواد",
                value: "productsCount", 
              },
              {
                label: "اجمالي المبلغ",
                value: "totalAmount"
              },
              {
                label: "المبلغ المدفوع",
                value: "paidAmount"
              },
              {
                label: "حالة الدفع",
                value: "status"
              },
              {
                label: "معرف المورد",
                value: "supplierID"
              },
              {
                label: "اسم المورد",
                value: "supplierName"
              },
              {
                label: "تاريخ الفاتورة",
                value: "createdAt",
                dataType: 'date',
                dateFormat: 'full'
              },
            ]}
            bodyData={dataMapper(purchases)}
            goToDetails={(e) => {
              const row = e.target.closest('tr');
              if (row) {
                const id = row.id.split('-')[1];
                window.open(`/purchases/${purchases[id].id}/details`, '_blank');
              }
            }}
          />
        }
        {
          pagination.hasNextPage !== '' && pagination.hasPreviousPage !== '' &&
          !purchaseFailer?
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

export default PurchasesForHome