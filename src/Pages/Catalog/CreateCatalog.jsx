import { Col, Container, Row } from "react-bootstrap"
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { GlobalContext } from "../../Context/GlobalContext"
import { useContext, useState } from "react";
import CutCatalog from "../../Components/Catalog/CutCatalog";
import GiftCatalog from "../../Components/Catalog/GiftCatalog";
import PurchaseCatalog from "../../Components/Catalog/PurchaseCatalog";

const CreateCatalog = () => {
  const {authInfo} = useContext(GlobalContext)
  const [selectedMode, setSelectedMode] = useState('1')

  const handleChangeSelectedMode = (e) => {
    setSelectedMode(e.currentTarget.value)
  }

  return (
    <Container className="text-white">
      <Row>
        <Col lg={12}>
          <h2 className="d-flex justify-content-center p-2 border-1 border-bottom border-gray">انشاء كاتالوغ</h2>
        </Col>
      </Row>
      <Row>
        <Col lg={3}></Col>
        <Col lg={6} className="mb-4">
          <div className="group-control">
            <label htmlFor="create-catalog-type">نوع عملية</label>
            <select
              name="create-catalog-type"
              id="create-catalog-type"
              className="form-select"
              value={selectedMode}
              onChange={handleChangeSelectedMode}
            >
              <option value="1">قص من المخزن</option>
              <option value="2">كاتالوغ هدية</option>
              <option value="3">شراء كاتالوغ</option>
            </select>
          </div>
        </Col>
        <Col lg={3}></Col>
        <Col lg={3}></Col>
        <Col lg={6}>
          {
            selectedMode === '1' ?
            <CutCatalog /> : selectedMode === '2' ?
            <GiftCatalog /> : <PurchaseCatalog />
          }
        </Col>
      </Row>
    </Container>
  )
}

export default CreateCatalog