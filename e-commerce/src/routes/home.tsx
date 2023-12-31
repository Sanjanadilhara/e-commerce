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
import Modal from 'react-bootstrap/Modal';

function Home() {
  const [user, setUser] = useState({name:undefined});

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(()=>{
    onStart();
  }, []);
  

  function onStart(){
    fetch("http://localhost:80/", {
      method: "GET",
      // mode: "cors", // no-cors, *cors, same-origin
      // credentials: "same-origin",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      }, 
    })
    .then((data)=>data.json())
    .then((data)=>{
      console.log(data);
      setUser(data);   
    }).catch((err)=>{

    });
  }


  return (
    <>
    <Navigation></Navigation>



    <Container className='mt-5'>
    <Container className='d-flex justify-content-center' >
      <Form.Control  placeholder="type what you looking for..." style={{width:600}}/>
      <Button variant="secondary" className='ms-3'>Search</Button>
    </Container>
    </Container>
    <Container className='mt-5'>
      <div className='lead'>Categories</div>
    <Row >
      <Col className='col-12 col-md-6 p-0'>
    <ListGroup>
      <ListGroup.Item>Electronics</ListGroup.Item>
      <ListGroup.Item>Mobile phones</ListGroup.Item>
      <ListGroup.Item>Laptops</ListGroup.Item>
      <ListGroup.Item>Houses</ListGroup.Item>
      <ListGroup.Item>Vehicles</ListGroup.Item>
      <ListGroup.Item>Vehicles</ListGroup.Item>
    </ListGroup>
      </Col>
      <Col className='col-12 col-md-6 p-0'>
    <ListGroup>
      <ListGroup.Item>Electronics</ListGroup.Item>
      <ListGroup.Item>Mobile phones</ListGroup.Item>
      <ListGroup.Item>Laptops</ListGroup.Item>
      <ListGroup.Item>Houses</ListGroup.Item>
      <ListGroup.Item>Vehicles</ListGroup.Item>
      <ListGroup.Item>Vehicles</ListGroup.Item>
    </ListGroup>
      </Col>

    </Row>
    </Container>
    </>
  )
}

export default Home