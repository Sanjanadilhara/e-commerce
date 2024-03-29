import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
// import NavDropdown from 'react-bootstrap/NavDropdown';
import Image from 'react-bootstrap/Image';
import { Button } from 'react-bootstrap';
import { useEffect, useState } from 'react'
import ComData from './common.tsx';
import { BsCart4 } from "react-icons/bs";

function Navigation(){
  const [user, setUser] = useState({firstName:undefined, lastName:undefined});


  useEffect(()=>{
    onStart();
  }, []);
  

  function onStart(){
    fetch(ComData.ADDR+"/", {
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
    })
    // .catch((err)=>{

    // });
  }



    return (
        <Navbar collapseOnSelect expand="lg" className="text-white" style={{backgroundColor:"#006dc8"}}>
        <Container>
          <Navbar.Brand className='text-white' href="/">e-commerce site</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#features" className='h-auto text-center text-white'>Latest Adds</Nav.Link>
              <Button variant="outline-warning" href='/postadd'>Post Advertisement</Button>

              {/* <NavDropdown title="Dropdown" id="collapsible-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                  Separated link
                </NavDropdown.Item>
              </NavDropdown> */}


            </Nav>
            <Nav>
              <Nav.Link href='/cart'>
              <BsCart4 style={{color:'white'}} href='./cart' className='me-4 w-100' size={28} />
              </Nav.Link>
            </Nav>
            <Nav>
              <div className='d-flex justify-content-center mt-md-0 mt-3 align-items-center'>
            <Image src="./src/components/avt.png" roundedCircle style={{height:30, width:30}} className='text-white' />
              {(user?.firstName===undefined)?<Nav.Link className='text-white' href="/login">Login</Nav.Link>:<Nav.Link className='text-white'>{user.firstName+" "+user.lastName}</Nav.Link>}
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    )
}

export default Navigation;