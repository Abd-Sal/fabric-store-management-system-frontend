import { Container, Col, Row } from "react-bootstrap"
import ProductQuantitiesBeforeRanout from "../../Components/Home/ProductQuantitiesBeforeRanout"
import CatalogForCustomerWhoNotBuy from "../../Components/Home/CatalogForCustomerWhoNotBuy"
import SalesForHome from "../../Components/Home/SalesForHome"
import PurchasesForHome from "../../Components/Home/PurchasesForHome"
import { CurrentDate } from "../../HelperTools/CurrentDate"

const Home = () => {
  return (
    <Container >
      <Row>
        <Col lg={12} className="py-3">
          <SalesForHome 
            title={`فواتير مبيعات اليوم ${CurrentDate()}`}
            emptyMessage={`لا توجد فواتير مبيعات لعرضها.`}
            customFilter={{
              search: '',
              searchBy: '',
              sortBy: 'createdat',
              sortDir: 'desc',
              page: 1,
              pageSize: 50,
              from: `${CurrentDate()}`,
              to: `${CurrentDate()}`,
              }
            }
          />
        </Col>
        <Col lg={12} className="py-3">
          <PurchasesForHome
            title={`فواتير مشتريات اليوم ${CurrentDate()}`}
            emptyMessage={`لا توجد فواتير غير مدفوعة لعرضها.`}
            customFilter={{
                search: '',
                searchBy: '',
                sortBy: 'createdat',
                sortDir: 'desc',
                page: 1,
                pageSize: 50,
                from: `${CurrentDate()}`,
                to: `${CurrentDate()}`,
              }
            }
          />
        </Col>
        <Col lg={12} className="py-3">
          <SalesForHome
            title={`فواتير مبيعات الغير مدفوعة`}
            emptyMessage={`لا توجد فواتير غير مدفوعة لعرضها.`}
            customFilter={{
              search: 'unpaid-notcompleted',
              searchBy: 'status',
              sortBy: 'createdat',
              sortDir: 'desc',
              page: 1,
              pageSize: 50,
              from: ``,
              to: ``,
              }
            }
          />
        </Col>
        <Col lg={12} className="py-3">
          <PurchasesForHome
            title={`فواتير مشتريات الغير مدفوعة`}
            emptyMessage={`لا توجد فواتير غير مدفوعة لعرضها.`}
            customFilter={{
              search: 'unpaid-notcompleted',
              searchBy: 'status',
              sortBy: 'createdat',
              sortDir: 'desc',
              page: 1,
              pageSize: 50,
              from: ``,
              to: ``,
              }
            }
          />
        </Col>
        <Col lg={12} className="py-3">
          <CatalogForCustomerWhoNotBuy
            title="الزبائن الذين لديهم كاتالوغات ولم يقومو بالشراء منذ شهر او أكثر"
            emptyMessage="لا يوجد زبائن للعرض"
          />
        </Col>
        <Col lg={12} className="py-3">
          <ProductQuantitiesBeforeRanout 
            title="البضائع التي على وشك النفاذ (الكمية اقل من 10 متر)"
            emptyMessage="لا يوجد بضائع للعرض"
          />
        </Col>
      </Row>
    </Container>
  )
}

export default Home