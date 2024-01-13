import Navigation from '../components/navigation.tsx';
import { useEffect  , useState } from 'react'
import Container from 'react-bootstrap/Container';
import { useParams } from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import ComData from '../components/common.tsx';


function ViewPost(){
    const routeParams = useParams();
    const [post, setPost]=useState({
        title: "loading",
        description: "loading",
        category: "loading",
        images: [],
        price: 0,
        postedBy: "loading"
    });
    

    useEffect(()=>{
        fetch(ComData.ADDR+"/post/"+routeParams.id, {
          method: "GET",
          credentials: 'include',
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((data)=>data.json())
        .then((data)=>{
            if(data?.success===false){
                setPost({...post, title:data.status})
            }
            else{
                setPost(data);
            }
        });

    }, []);


    return (
        <>
        <Navigation></Navigation>
        <Container className='mt-3'>
        <Row>

            <Col md='4'>
                <div className='d-flex flex-wrap justify-content-center align-item-stretch border'>
                {
                    post.images.map((img, index)=>(
                        
                        index==0?
                        <Zoom><Image src={`${ComData.ADDR}/images/${img}`}  className='object-fit-cover col-12 border border-2' /></Zoom>
                        :
                        <div className='border border-2 col-4 bg-dark d-flex align-content-center flex-wrap'><Zoom><Image src={`${ComData.ADDR}/images/${img}`} className='col-12' /></Zoom></div>
                        

                    ))
                }
                </div>

            </Col>
            <Col md='8' className='mt-3'>
                <h4>{post.title}</h4>
                <br/>
                <h5 className='text-danger'>{"Rs. "+post.price}</h5>
                <p dangerouslySetInnerHTML={{__html:post.description}}></p>
            </Col>

        </Row>
        
        </Container>
        </>

    );
}
export default ViewPost;