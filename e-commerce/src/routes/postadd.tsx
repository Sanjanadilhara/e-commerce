import { useEffect, useState } from 'react'
// import reactLogo from '../assets/react.svg'
// import viteLogo from '/vite.svg'
import Navigation from '../components/navigation.tsx';
// import { ButtonGroup, useAccordionButton } from 'react-bootstrap';
// import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import Stack from 'react-bootstrap/Stack';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Card from 'react-bootstrap/Card';
// import InputGroup from 'react-bootstrap/InputGroup';
// import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';
import toast, { Toaster } from 'react-hot-toast';
import ComData from '../components/common.tsx';
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css'



function PostAdd() {

    const [validated, setValidated] = useState(false);
    const [postData, setPostdata]=useState({});
    const [temImg, setTemImg]:[any, any]=useState({});
    const [imageArray, setImageArray]:[any, any]=useState([]);
    const [postAddSuccess, setPostAddSuccess]=useState(false);
    // const [convertedText, setConvertedText] = useState("Some default content");


    useEffect(()=>{console.log(postData)},[postData]);


    useEffect(()=>{
      let temArr=[];
      for (var i = 0; i < temImg.length; i++) {
        temArr.push(temImg[i]);
      }
      
      setImageArray(temArr);
    }, [temImg]);


    const handleSubmit = (event:any) => {
      const form = event.currentTarget;
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
      if(!postAddSuccess){
        
        if (form.checkValidity() === false) {
        }
        else{
          let formData=new FormData();
          formData.append("jsonData", JSON.stringify(postData));
    
          imageArray.forEach((item:any)=>{
            formData.append("images", item);
          });
          // formData.append("images", imageArray[0]);
          // formData.append("images", imageArray[1]);
    
          console.log(formData);
    
          let request=fetch(ComData.ADDR+"/post-add", {
            method: "POST",
            credentials: 'include',
            body: formData ,
          
          }).then((data)=>data.json());
  
          toast.promise(request, {
            loading: 'Loading',
            success: (data)=>{
              if(!data.success){
                throw data.status;
              }
              setPostAddSuccess(true);
              setTimeout(()=>{window.location.href = "/post/"+data.id}, 300);
              return data.status;
            },
            error: (err)=>err.toString(),
          });
          
        }
      }
      else{
        toast("post already added");
      }



    };

  return (
    <>
    <Navigation></Navigation>

    <Container className='d-flex justify-content-center'>

    <Toaster />


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
      onChange={(e)=>{setPostdata({...postData, category:parseInt(e.target.value)})}}
      >
        <option></option>
        <option value={1}>One</option>
        <option value={2}>Two</option>
        <option value={3}>Three</option>
      </Form.Select>
    </FloatingLabel>
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>

      </Row>
      <Container className='d-flex flex-wrap'>
      {imageArray.map((val:any)=>(
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
              onChange={(e:any)=>{setTemImg(e.target.files)}}
            />
            <Form.Control.Feedback type="invalid" >
                choose a file
            </Form.Control.Feedback>
          </Form.Group>
      </Row>
      {/* <Row>
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

      </Row> */}
      <Row style={{height:'auto'}}>
      <Form.Group as={Col} md="12" controlId="validationCustomUsername" >
        
        <Form.Label>Item Description</Form.Label>
      <ReactQuill
        theme='snow'
        onChange={(e)=>{setPostdata({...postData, description:e})}}
        className='w-100'
       style={{height:300}}
      />
        <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
        </Form.Group>
      </Row >
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
        <Row className='mt-5 pt-2'>
        <Form.Group as={Col} md="6" controlId="validationCustom01">
          <Form.Label>Item Price</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Rs."
            onChange={(e)=>{setPostdata({...postData, price:parseFloat(e.target.value)})}}
            defaultValue=""
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
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


      <Button type="submit" className='w-100'>Submit</Button>
    </Form>
      </Card.Body>
    </Card>

    </Container>


    </>
  )
}

export default PostAdd;