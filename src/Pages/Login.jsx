import { Col, Container, Row } from "react-bootstrap"
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const Login = () => {
  return (
    <div className="bg-dark vh-100">
      <Container className="h-100">
        <Row className="h-100">
          <Col md={3}></Col>
          <Col md={6} className="d-flex flex-column justify-content-center align-items-center">
            <div className="w-100 text-white p-3 border border-secondary rounded-2 bg-dark">
              <h2 className="d-flex justify-content-center align-items-center mb-5">تسجبل الدخول</h2>
              <Form className="h-100 text-white w-100">
                <Form.Group className="mb-3" controlId="formGroupEmail">
                  <Form.Label>اسم المستخدم</Form.Label>
                  <Form.Control type="text" placeholder="ادخل اسم المستخدم" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGroupPassword">
                  <Form.Label>كلمة المرور</Form.Label>
                  <Form.Control type="password" placeholder="ادخل كلمة المرور" />
                </Form.Group>
                <div className="w-100 d-flex justify-content-center align-items-center">
                  <Button className="w-50" type="submit">تسجيل الدخول</Button>
                </div>
              </Form>
            </div>
          </Col>
          <Col md={3}></Col>
        </Row>
      </Container>
    </div>
  )
}

export default Login