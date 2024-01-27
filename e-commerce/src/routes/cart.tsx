import { Row,
        Col, 
        Container,
        Image,
        Card,
        CardBody,
        Button} from "react-bootstrap";
import Navigation from "../components/navigation";
import { useEffect, useState } from 'react'
import ComData from "../components/common";
// import { json } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import Spinner from 'react-bootstrap/Spinner';
import { FaCcVisa, FaCcMastercard, FaCcAmex} from "react-icons/fa6";

export default function Cart(){
    const [cartData, setCartData]:[any, any]=useState(null);
    const [loadData, setLoadData]=useState(true);
    
    useEffect(()=>{
        getCart();
    }, [loadData]);


    function getCart(){
        fetch(ComData.ADDR+'/cart', {
            method:'GET',
            credentials: 'include',
            headers: {
              "Content-Type": "application/json",
            },
        })
        .then((data)=>data.json())
        .then((data)=>{
            setCartData(data);
        }).catch(()=>{});
    }

    function deleteItem(id:string){
        fetch(ComData.ADDR+'/cartitem', {
            method:'DELETE',
            credentials: 'include',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({item:id}), 
        })
        .then((data)=>data.json())
        .then((data)=>{
            setCartData(data);
        }).catch(()=>{});
        setLoadData(!loadData);

    }

    return(
        <>
        <Navigation></Navigation>
        <Container>
        <Row className="p-3">
        <Col className="col-12 col-md-10 col-lg-8">
            <Row className="border-bottom bg-body-tertiary" >
            <Col className="p-2 col-3"></Col>
            <Col className="p-2 col-4" >Item</Col>
            <Col className="p-2 col-2 overflow-hidden" >Quantity</Col>
            <Col className="p-2 col-3">price</Col>
            </Row>
            {
                cartData===null? <Spinner animation="border"/>:
                cartData?.items===undefined?"No items":
                cartData.items.map((element:any)=>(        
                    <Row className="align-items-center border-bottom">
                    <Col className="p-2 d-flex justify-content-center col-3 overflow-hidden"><Image height={75} src={ComData.ADDR+'/images/'+element.postImage}/></Col>
                    <Col className="p-2 col-4"><p className="clamp-text">{element.postTitle}</p></Col>
                    <Col className="p-2 col-2">{element.quantity}</Col>
                    <Col className="p-2 col-3 position-relative">{"Rs. "+element.price}<RxCross2 onClick={()=>deleteItem(element._id)} style={{backgroundColor:'white',padding:1, color:"red", position:"absolute", right:5, top:'40%'}}/></Col>
                    </Row>
                ))
            }
            <Row className="align-items-center ">
                <Col className="p-2 d-flex justify-content-center col-3"></Col>
                <Col className="p-2 col-4"></Col>
                <Col className="p-2 bg-body-tertiary col-2">total</Col>
                <Col className="p-2 bg-body-tertiary col-3 overflow-hidden">Rs. {cartData===null||cartData?.total===undefined?"0":cartData.total}</Col>
            </Row>
            </Col>
        <Col className="col-12 col-md-2 col-lg-4">
            <Card>
                <CardBody>
                <h5>total: Rs. {cartData===null||cartData?.total===undefined?"0":cartData.total}</h5>
                <Row className="my-3">
                    <div className="w-auto"><FaCcVisa size={30}/></div>
                    <div className="w-auto"><FaCcMastercard size={30}/></div>
                    <div className="w-auto"><FaCcAmex size={30}/></div>
                </Row>
                {
                cartData?.total===undefined?
                <Button variant="outline-warning" className="w-100 mt-1"  disabled>Check Out</Button>:
                <Button variant="outline-warning" className="w-100 mt-1" href="/checkout" >Check Out</Button>
                }
                </CardBody>
            </Card>
        </Col>
        </Row>
        </Container>
        </>

    );
}