import { useState } from 'react'
// import reactLogo from '../assets/react.svg'
// import viteLogo from '/vite.svg'
import Navigation from '../components/navigation.tsx';
// import { ButtonGroup } from 'react-bootstrap';
// import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import Stack from 'react-bootstrap/Stack';
// import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';
// import Modal from 'react-bootstrap/Modal';
import toast, { Toaster } from 'react-hot-toast';
import ComData from '../components/common.tsx';

function Signin() {

    const [validated, setValidated] = useState(false);
    const [userData, setUserData]:[any, any]=useState({});

    const handleSubmit = (event:any) => {
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }
  
      setValidated(true);
    };

    function signin(){
      console.log(userData);
      if(userData?.password==userData?.confPassword){
        let request=fetch(ComData.ADDR+"/signup", {
          method: "POST",
          // mode: "cors", // no-cors, *cors, same-origin
          // credentials: "same-origin",
          credentials: 'include',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData), 
        })
        .then((data)=>data.json());

        toast.promise(request, {
          loading: 'Loading',
          success: (data)=>{
            if(!data.success){
              throw data.status;
            }
            return data.status;
          },
          error: (err)=>err.toString(),
        });
      }
    }

  return (
    <>
    <Navigation></Navigation>

    <Container className='d-flex justify-content-center'>


      
    <Toaster />
    <Card className='m-md-5 text-center' style={{width:500}}>
      <Card.Header as="h5">Signin</Card.Header>
      <Card.Body className=''>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="validationCustom01">
          <Form.Label>First name</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="First name"
            defaultValue=""
            onChange={(e)=>{setUserData({...userData, firstName:e.target.value})}}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="6" controlId="validationCustom02">
          <Form.Label>Last name</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Last name"
            defaultValue=""
            onChange={(e)=>{setUserData({...userData, lastName:e.target.value})}}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row>
        <Form.Group as={Col} md="12" controlId="validationCustomUsername">
          <Form.Label>E-mail</Form.Label>
          <InputGroup hasValidation>
            <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="E-mail"
              aria-describedby="inputGroupPrepend"
              required
              onChange={(e)=>{setUserData({...userData, email:e.target.value})}}
            />
            <Form.Control.Feedback type="invalid">
              Please choose a username.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>

      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} md="12" controlId="validationCustom03">
          <Form.Label>password</Form.Label>
          <Form.Control type="password" placeholder="" required onChange={(e)=>{setUserData({...userData, password:e.target.value})}} />
          <Form.Control.Feedback type="invalid">
            Please provide a valid city.
          </Form.Control.Feedback>
        </Form.Group>
 
        <Form.Group as={Col} md="12" controlId="validationCustom03">
          <Form.Label>confirm password</Form.Label>
          <Form.Control type="password" placeholder="" required onChange={(e)=>{setUserData({...userData, confPassword:e.target.value})}} />
          <Form.Control.Feedback type="invalid">
            Please provide a valid city.
          </Form.Control.Feedback>
        </Form.Group>
 
      </Row>
      <Form.Group className="mb-3">
        <Form.Check
          required
          label="Agree to terms and conditions"
          feedback="You must agree before submitting."
          feedbackType="invalid"
        />
      </Form.Group>
      <Button className='w-100' onClick={()=>signin()}>Sign in</Button>
    </Form>
      </Card.Body>
    </Card>

    </Container>


    </>
  )
}

export default Signin;