import { useEffect, useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import Navigation from '../components/navigation';
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


      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>



    <Container className='mt-5'>
    <Stack direction="horizontal" gap={3} className='justify-content-center'>
      <Form.Control className="w-50" placeholder="type what you looking for..." />
      <Button variant="secondary">Search</Button>
    </Stack>
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