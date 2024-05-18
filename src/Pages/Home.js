import React from "react";
import { useNavigate, } from 'react-router-dom';
import "./styles.css"
const Listmachine = [{machineName:"Fruno CA", link:"fruno"}
    ,{machineName:"Beckman coulter AU", link:"beckman"} 
]
const Homepage = ()=>{
    const navigate = useNavigate();
    const onClickPage = (link)=>{
        navigate(`/${link}`)
    }
    return (
        <div className="homepage">
        {Listmachine.map((item, index) => (
            <div key={index} className="select-item" onClick={() => onClickPage(item.link)}>{item.machineName}</div>
        ))}
    </div>   
    )

}   
export default Homepage