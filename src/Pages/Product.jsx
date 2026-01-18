import { Col, Container, Row } from "react-bootstrap"

const Product = () => {
  return (
    <>
      <Container className="text-white">
        <Row>
          <Col lg={12}>
            <h2 className="d-flex justify-content-center p-2 border-1 border-bottom border-gray">واجهةالمنتجات</h2>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Product