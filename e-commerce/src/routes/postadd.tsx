import { useState } from 'react'
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
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';

function PostAdd() {

    const [validated, setValidated] = useState(false);

    const handleSubmit = (event:any) => {
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }
  
      setValidated(true);
    };

  return (
    <>
    <Navigation></Navigation>

    <Container className='d-flex justify-content-center'>
    <Card className='m-md-5 text-center' style={{width:600}}>
      <Card.Header as="h5">Create an Advertisement</Card.Header>
      <Card.Body className=''>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="validationCustom01">
          <Form.Label>Item Name</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Item Name"
            defaultValue=""
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="6" controlId="validationCustom01">
        <Form.Label>Category</Form.Label>
        <FloatingLabel controlId="floatingSelect" label="select the category">
      <Form.Select aria-label="Floating label select example">
        <option></option>
        <option value="1">One</option>
        <option value="2">Two</option>
        <option value="3">Three</option>
      </Form.Select>
    </FloatingLabel>
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>

      </Row>
      <Row>
      <Form.Group className="position-relative mb-3">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              required
              name="file"
            
            />
            <Form.Control.Feedback type="invalid" >
                choose a file
            </Form.Control.Feedback>
          </Form.Group>
      </Row>
      <Row>
        <Form.Group as={Col} md="12" controlId="validationCustomUsername">
        
          <InputGroup hasValidation>
          <InputGroup.Text>Description</InputGroup.Text>
            <Form.Control as="textarea" aria-label="description" required/>
            <Form.Control.Feedback type="invalid">
              Please choose a username.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>

      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="validationCustom03">
          <Form.Label>City</Form.Label>
          <Form.Control type="text" placeholder="City" required />
          <Form.Control.Feedback type="invalid">
            Please provide a valid city.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="3" controlId="validationCustom04">
          <Form.Label>State</Form.Label>
          <Form.Control type="text" placeholder="State" required />
          <Form.Control.Feedback type="invalid">
            Please provide a valid state.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="3" controlId="validationCustom05">
          <Form.Label>Zip</Form.Label>
          <Form.Control type="text" placeholder="Zip" required />
          <Form.Control.Feedback type="invalid">
            Please provide a valid zip.
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
      <Button type="submit" className='w-100'>Sign in</Button>
    </Form>
      </Card.Body>
    </Card>

    </Container>


    </>
  )
}

export default PostAdd;