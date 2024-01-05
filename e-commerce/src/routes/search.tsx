import Navigation from '../components/navigation.tsx';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import AdvCard from '../components/advCard.tsx';
import { useState } from 'react'
import ComData from '../components/common.tsx';
import {SearchPost} from '../components/interfaces.tsx'


function Search(){
    const [posts, setPosts]:[any, any]=useState([{}]);
    const [qry, setQry]=useState('');

    function search(){
        console.log(ComData.ADDR+"/search/"+qry);
        fetch(ComData.ADDR+"/search/"+qry, {
            method: "GET",
            credentials: 'include',
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((data)=>data.json())
          .then((data)=>{
              if(data?.success===true){
                  setPosts(data.posts);
                  console.log("post set");
                  console.log(data.post);
              }
              else{
                console.log("error fetching")
                setPosts([]);
              }
          });
    }
    

    return(
        <>
        <Navigation></Navigation>
        <Container className='mt-3'>

        <Container className='mt-5'>
        <Container className='d-flex justify-content-center' >
        <Form.Control  placeholder="type what you looking for..." style={{width:600}}  onChange={(e)=>setQry(e.target.value)}/>
        <Button variant="secondary" className='ms-3' onClick={()=>search()}>Search</Button>
        </Container>
        </Container>
        <div className='d-flex flex-wrap mt-5'>
            {
                    posts[0]?.title===undefined?
                    "No Results":
                    posts.map((item:SearchPost)=>(
                        <AdvCard image={ComData.ADDR+"/images/"+item.images[0]}  title={item.title} price={item.price}/>
                    ))
        
            }
        </div>

        </Container>
        </>
    );
}
export default Search;