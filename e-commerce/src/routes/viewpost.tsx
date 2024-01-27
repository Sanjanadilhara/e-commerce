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
import Form from 'react-bootstrap/Form';
import { TbShoppingCartPlus } from "react-icons/tb";
import { Button } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';

function ViewPost(){
    const routeParams = useParams();
    const [post, setPost]=useState({
        _id:undefined,
        title: "loading",
        description: "loading",
        category: "loading",
        images: [],
        price: 0,
        postedBy: "loading"
    });
    const[qty, setQty]=useState(1);
    


    function addToCart(){

        let req=fetch(ComData.ADDR+'/cartitem', {
            credentials: 'include',
            headers: {
              "Content-Type": "application/json",
            },
            method:"POST",
            body:JSON.stringify({item:post._id, quantity:qty})
        }).then((data)=>data.json());    
        toast.promise(req, {
            loading: 'Loading',
            success: (data:any)=>{
              if(!data.success){
                throw data.status;
              }
              return data.status;
            },
            error: (err)=>err.toString(),
          });
    }


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
            <Toaster/>
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

                <Row>
                    <Form.Control
                        style={{width:70}}
                        required
                        type="number"
                        defaultValue="1"
                        onChange={(e)=>setQty(parseInt(e.target.value))}
                    />
                    <Button className='w-auto ms-1' variant="outline-warning" onClick={()=>addToCart()}>Add to Cart<TbShoppingCartPlus className='ms-3'/></Button>
                </Row>

                <p dangerouslySetInnerHTML={{__html:post.description}}></p>
            </Col>

        </Row>
        
        </Container>
        </>

    );
}
export default ViewPost;