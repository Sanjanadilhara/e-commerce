import { useEffect, useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import Navigation from '../components/navigation.tsx';
import { ButtonGroup, useAccordionButton } from 'react-bootstrap';
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
import Image from 'react-bootstrap/Image';




function PostAdd() {

    const [validated, setValidated] = useState(false);
    const [postData, setPostdata]=useState({});
    const [temImg, setTemImg]=useState({});
    const [imageArray, setImageArray]=useState([]);

    useEffect(()=>{
      let temArr=[];
      for (var i = 0; i < temImg.length; i++) {
        temArr.push(temImg[i]);
      }
      
      setImageArray(temArr);
    }, [temImg]);



    useEffect(()=>{
      console.log(postData);
    }, [postData]);

    const handleSubmit = (event:any) => {
      const form = event.currentTarget;
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
      if (form.checkValidity() === false) {
      }
      else{
        let formData=new FormData();
        formData.append("jsonData", JSON.stringify(postData));
  
        imageArray.forEach((item)=>{
          formData.append("images", item);
        });
        // formData.append("images", imageArray[0]);
        // formData.append("images", imageArray[1]);
  
        console.log(formData);
  
        fetch("http://localhost:80/post-add", {
          method: "POST",
          credentials: 'include',
          body: formData ,
        
        }) 
        .then((data)=>data.json())
        .then((res)=>{
          console.log(res);
        })
        .catch((err)=>{
          console.log(err);
        });
        
      }



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
            onChange={(e)=>{setPostdata({...postData, title:e.target.value})}}
            defaultValue=""
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="6" controlId="validationCustom01">
        <Form.Label>Category</Form.Label>
        <FloatingLabel controlId="floatingSelect" label="select the category">
      <Form.Select aria-label="Floating label select example"
      onChange={(e)=>{setPostdata({...postData, category:e.target.value})}}
      >
        <option></option>
        <option value="1">One</option>
        <option value="2">Two</option>
        <option value="3">Three</option>
      </Form.Select>
    </FloatingLabel>
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>

      </Row>
      <Container className='d-flex flex-wrap'>
      {imageArray.map((val, index)=>(
        <Image src={URL.createObjectURL(val)}  width={100} height={100} className='m-2' rounded style={{objectFit:'cover'}} />
      ))}
 
   
      </Container>
      <Row>
      <Form.Group className="position-relative mb-3">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              required
              multiple
              accept='.jpg, .jpeg, .png'
              name="file"
              onChange={(e)=>{setTemImg(e.target.files)}}
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
            <Form.Control as="textarea" aria-label="description"  
              onChange={(e)=>{setPostdata({...postData, description:e.target.value})}} required/>
            <Form.Control.Feedback type="invalid">
              Please choose a username.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>

      </Row>
      {/* <Row className="mb-3">
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
      </Row> */}
        <Form.Group as={Col} md="6" controlId="validationCustom01">
          <Form.Label>Item price</Form.Label>
          <Form.Control
            required
            type="number"
            placeholder="Rs."
            onChange={(e)=>{setPostdata({...postData, price:parseFloat(e.target.value)})}}
            defaultValue=""
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
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