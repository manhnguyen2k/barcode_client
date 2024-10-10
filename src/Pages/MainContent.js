import React from "react";
import { useState, useEffect } from "react";
import Fruno from "../Screens/Fruno";
import Beckman from "../Screens/Beckman";
import Fruno_new from "../Screens/Fruno_new";
const MainContent = () => {
    const [selectedMachine, setSelectedMachine] = useState("fruno_new");
    useEffect(() => { console.log(selectedMachine)  }, [selectedMachine]);
    return (
        <div>
            <div >
                <span style={{fontSize: "24px", fontWeight:"bold"}}>Loại máy:  </span>
            <select style={{width:"200",padding:"10px",marginTop:"20px", marginBottom:"20px", fontSize: "24px" }} value={selectedMachine} onChange={(e) => setSelectedMachine(e.target.value)}>
                <option value={"fruno_new"}>Fruno mới</option>
                <option value={"fruno_old"}>Fruno cũ</option>
                <option value={"beckman"}>Beckman</option>
            </select>
            </div>
           
            {selectedMachine === "fruno_new" && <Fruno_new />}
            {selectedMachine === "fruno_old" && <Fruno />}
            {selectedMachine === "beckman" && <Beckman />}
        </div>
    )
}

export default MainContent