import { Row,
        Col, 
        Container,
        Image } from "react-bootstrap";
import Navigation from "../components/navigation";



export default function Cart(){
    return(
        <>
        <Navigation></Navigation>

        <Container className="mt-3 w-auto" style={{maxWidth:800}}>
            <Row className="border-bottom bg-body-tertiary" >
            <Col className="p-2"></Col>
            <Col className="p-2">Item</Col>
            <Col className="p-2">Quantity</Col>
            <Col className="p-2">price</Col>
            </Row>
            <Row className="align-items-center border-bottom">
                <Col className="p-2 d-flex justify-content-center"><Image height={75} src="./dist/vite.svg"/></Col>
                <Col className="p-2">Dell 3511</Col>
                <Col className="p-2">1</Col>
                <Col className="p-2">255000.00</Col>
            </Row>
            <Row className="align-items-center">
                <Col className="p-2 d-flex justify-content-center"></Col>
                <Col className="p-2"></Col>
                <Col className="p-2"></Col>
                <Col className="p-2">total: 255000.00</Col>
            </Row>
        </Container>
        </>

    );
}