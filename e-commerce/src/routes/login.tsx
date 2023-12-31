
import { useEffect, useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import Navigation from '../components/navigation.tsx';
import { ButtonGroup } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Card from 'react-bootstrap/Card';

import Modal from 'react-bootstrap/Modal';

function Login() {
    const [userData, setUserData]=useState({email:"", password:""});


    useEffect(()=>{
      console.log(userData);
    }, [userData]);

    function onLoginClicked(){
        fetch("http://localhost:80/login", {
          method: "POST",
          // mode: "cors", // no-cors, *cors, same-origin
          // credentials: "same-origin",
          credentials: 'include',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData), 
        })
        .then((data)=>data.json())
        .then((data)=>{
          if(data.status==-1){
            alert("no user exist");
          }
          else if(data.status==-2){
            alert("wrong password");
          }
          else{
            window.location.href="http://localhost:5173/"
          }
        }).catch((err)=>{
    
        });
      }

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
    <Navigation showLogin={handleShow}></Navigation>

    <Container className='d-flex justify-content-center'>
    <Card className='m-md-5 text-center' style={{width:500}}>
      <Card.Header as="h5">Login</Card.Header>
      <Card.Body className=''>
        <FloatingLabel
            controlId="floatingInput"
            label="Email address"
            className="mb-3"
        >
            <Form.Control type="email" placeholder="name@example.com" onChange={(e)=>setUserData({...userData, email:e.target.value})} />
        </FloatingLabel>
        <FloatingLabel controlId="floatingPassword" label="Password">
            <Form.Control type="password" placeholder="Password"  onChange={(e)=>setUserData({...userData, password:e.target.value})}/>
        </FloatingLabel>
        <Button variant="primary" className='mt-3 w-100' onClick={onLoginClicked}>Login</Button>

        <div className='w-100 text-end mt-3'><a href="./signin">don't have an account</a></div>
      </Card.Body>
    </Card>

    </Container>


    </>
  )
}

export default Login;