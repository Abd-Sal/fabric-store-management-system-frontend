import { Col, Container, Row } from "react-bootstrap"
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../Context/GlobalContext";
import { useNavigate } from "react-router-dom";
import LoadingPartPage from "../Components/LoadingPartPage";
import { LoginImplementations } from "../Code/LoginImplementations";
import Alert from 'react-bootstrap/Alert';
import * as yup from 'yup';
import { OurRoutes } from "../Routes/OurRoutes";

let loginSchema = yup.object().shape({
  username: yup.string().required('اسم المستخدم مطلوب'),
  password: yup.string().required('كلمة المرور مطلوبة')
});

const Login = () => {
  const {authInfo, setAuthInfo, isInitialized, setIsInitialized} = useContext(GlobalContext)
  const [isLoading, setIsLoading] = useState(false);
  const [failer, setFailer] = useState('');
  const navigate = useNavigate();
  const implementations = LoginImplementations;
  const [auth, setAuth] = useState({
    username: '',
    password: ''
  })

  const passwordHandler = (e)=>{
    setAuth({
      ...auth,
      password: e.target.value
    });
  }

  const usernameHandler = (e)=>{
    setAuth({
      ...auth,
      username: e.target.value
    });
  }
  
  const successBehavior = (data)=>{   
    localStorage.setItem('auth', JSON.stringify(data))
    setAuthInfo(data);
    setIsInitialized(true);
  }

  const submitHandler = (e)=>{
    e.preventDefault();
    implementations.SendLogin({
      username: auth.username,
      password: auth.password,
      setLoader: setIsLoading,
      setFailer: setFailer,
      successBehavior
    })
  }

  useEffect(()=>{
    if(isInitialized && authInfo && Object.keys(authInfo).length > 0)
      navigate(OurRoutes.Home, {replace:true})
  }, [authInfo])

  if(!isInitialized)
    return (
      <div className="bg-dark vh-100">
        <Container className="h-100">
          <Row className="h-100">
            <Col md={3}></Col>
            <Col md={6} className="d-flex flex-column justify-content-center align-items-center">
              <div className="w-100 text-white p-3 border border-secondary rounded-2 bg-dark">
                <h2 className="d-flex justify-content-center align-items-center mb-5">تسجبل الدخول</h2>
                {
                  failer && <Alert variant="danger" className="text-center">{failer}</Alert>
                }
                <Form className="h-100 text-white w-100">
                  <Form.Group className="mb-3" controlId="formGroupEmail">
                    <Form.Label>اسم المستخدم</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="ادخل اسم المستخدم"
                      value={auth.username}
                      onChange={usernameHandler}
                      disabled={isLoading}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formGroupPassword">
                    <Form.Label>كلمة المرور</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="ادخل كلمة المرور"
                      value={auth.password}
                      onChange={passwordHandler}
                      disabled={isLoading}
                    />
                  </Form.Group>
                  <div className="w-100 d-flex justify-content-center align-items-center">
                    <Button
                      className="w-50"
                      type="submit"
                      onClick={submitHandler}
                      disabled={isLoading}
                    >
                      {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                    </Button>
                  </div>
                </Form>
              </div>
            </Col>
            <Col md={3}></Col>
          </Row>
        </Container>
      </div>
    )
  return (<LoadingPartPage />);
}

export default Login