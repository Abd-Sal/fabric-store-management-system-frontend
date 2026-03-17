import { useContext, useEffect, useState } from "react"
import { GlobalContext } from "../../Context/GlobalContext"
import { NavLink, useNavigate, useParams} from "react-router-dom"
import { ExpenseImplementations } from "../../Code/ExpenseImplementations"
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { Col, Container, Pagination, Row } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import { EmptyObjectChecker } from "../../HelperTools/EmptyObjectChecker";
import ConfirmationExpenseModal from "../../Components/Expense/ConfirmationExpenseModal";
import { OurRoutes } from "../../Routes/OurRoutes"

const ExpenseDetails = () => {
    const {authInfo} = useContext(GlobalContext)
    const { expenseId } = useParams();
    const [expenseDetails, setExpenseDetails] = useState(null);
    const [expenseLoader, setExpenseLoader] = useState(false);
    const [expenseFailer, setExpenseFailer] = useState({});
    const navigate = useNavigate();

    const expenseImplemetations = ExpenseImplementations;
    
    const getExpenseDetails = () => {
        expenseImplemetations.ExpenseDetails({
            token: authInfo.Token,
            id: expenseId,
            setExpenseDetails: setExpenseDetails,
            setLoader: setExpenseLoader,
            setFailer: setExpenseFailer
        })
    }

    const checkDateWithLocaleString = (createdAt) => {               
        const createdDate = new Date(createdAt + 'Z');
        const nowDate = new Date();
        const diffInMs = nowDate - createdDate;
        const diffInDays = Math.round(diffInMs / (24 * 60 * 60 * 1000));
        const isWithin3Days = diffInDays <= 3 && diffInDays >= 0;
        return isWithin3Days;
    }

    useEffect(()=>{
        if(expenseId){
            getExpenseDetails();
        }
    }, [expenseId])

    return (
        <Container className="text-white">
            {/* Expense Details */}
            <Row>
                <Col lg={12}>
                {
                    expenseLoader &&
                    <div className="w-100 h-100 d-flex justify-content-center align-items-center">
                        <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                }
                </Col>
                <Col lg={12}>
                {
                    expenseFailer != null &&
                    Object.keys(expenseFailer).length > 0 &&
                    <div className="w-100">
                        <Alert variant="danger">
                        <h5>{expenseFailer.title || 'فشل'}</h5>
                        {
                            expenseFailer.errors && Object.keys(expenseFailer.errors).length > 0 &&
                            <ul className="list-unstyled mb-0 d-flex justify-content-start align-items-center flex-wrap">
                            {
                                Object.keys(expenseFailer.errors).map((key, index) => (
                                <li key={index} className="w-100">{expenseFailer.errors[key]}</li>
                                ))
                            }
                            </ul>
                        }
                        <Button onClick={getExpenseDetails} variant="danger">اعادة المحاولة</Button>
                        </Alert>
                    </div>
                }
                </Col>
                <Col lg={12}>
                {
                    !EmptyObjectChecker(expenseDetails) &&
                    <div className="bg-secondary d-flex flex-column justify-content-between align-items-center gap-2 rounded-3 border border-2 border-white p-3">
                        <div>
                            <h2>تفاصيل عملية الصرف</h2>
                        </div>
                        <div className="w-100 d-flex flex-wrap justify-content-start align-items-center gap-3">
                            {
                                checkDateWithLocaleString(expenseDetails.createdAt) &&
                                <ConfirmationExpenseModal 
                                    btnStyle={'danger'}
                                    bodyTitle={'هل انت متأكد انك تريد حذف هذه العملية ؟'}
                                    btnTitle={'حذف العملية'}
                                    id={expenseDetails.id}
                                    token={authInfo.Token}
                                    specialBehavior={()=> navigate(`${OurRoutes.Expenses.Show}`, {replace:true})}
                                    requestSender={expenseImplemetations.RemoveExpense}
                                    title={'هل انت متأكد'}
                                />
                            }
                        </div>
                        <div className="py-2 expense-details-hover border-bottom w-100 d-flex flex-wrap text-breal justify-content-between align-items-center gap-2">
                            <strong>معرف العملية الصرفية : </strong>
                            <strong>{expenseDetails.id}</strong>
                        </div>
                        <div className="py-2 expense-details-hover border-bottom w-100 d-flex flex-wrap text-breal justify-content-between align-items-center gap-2">
                            <strong>الوصف التوضيحي : </strong>
                            <strong>{expenseDetails.message}</strong>
                        </div>
                        <div className="py-2 expense-details-hover border-bottom w-100 d-flex flex-wrap text-breal justify-content-between align-items-center gap-2">
                            <strong>سعر الدولار : </strong>
                            <strong>{parseFloat(expenseDetails.dollarPriceInSyr).toFixed(3)} SYR</strong>
                        </div>
                        <div className="py-2 expense-details-hover border-bottom w-100 d-flex flex-wrap text-breal justify-content-between align-items-center gap-2">
                            <strong>القيمة المدفوعة بالليرة السورية الجديدة: </strong>
                            <strong>{parseFloat(expenseDetails.syrianAmount).toFixed(3)} SYP</strong>
                        </div>
                        <div className="py-2 expense-details-hover border-bottom w-100 d-flex flex-wrap text-breal justify-content-between align-items-center gap-2">
                            <strong>القيمة المدفوعة بالدولار : </strong>
                            <strong>{parseFloat(expenseDetails.dollarAmount).toFixed(3)} $</strong>
                        </div>
                        <div className="py-2 expense-details-hover border-bottom w-100 d-flex flex-wrap text-breal justify-content-between align-items-center gap-2">
                            <strong>تاريخ الدفع : </strong>
                            <strong>{new Date(expenseDetails.createdAt + 'Z').toLocaleString() || 'غير متوفر'}</strong>
                        </div>
                    </div>
                }
                </Col>
            </Row>
        </Container>
    )
}

export default ExpenseDetails