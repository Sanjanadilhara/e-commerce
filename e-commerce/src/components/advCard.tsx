import Image from 'react-bootstrap/Image';
// import ComData from './common';
import '../App.css'
import {advCardProps} from './interfaces'


function AdvCard(props:advCardProps){
    return (
        <div className='col-12 col-md-4 col-lg-2 p-3 adv-item'>
            <Image height={200} className='w-100 object-fit-cover' src={props.image} />
            <p className='clamp-text'>{props.title}</p>
            <h5 className='text-danger'>Rs. {props.price}</h5>
        </div>

    );
}
export default AdvCard;