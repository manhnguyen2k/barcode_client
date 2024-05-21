import React, { useEffect, useState } from "react";
import "../barcode.css"
import axios from "axios";
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import copy from 'clipboard-copy';
import * as XLSX from 'xlsx';
import { LazyLoadImage, LazyLoadComponent } from 'react-lazy-load-image-component';
import CachedIcon from '@mui/icons-material/Cached';
import { useSelector, useDispatch } from 'react-redux';
import Barcode from 'react-jsbarcode';
import { useNavigate } from 'react-router-dom';
import { colors } from "@mui/material";
const Beckman = () => {
    const [companyCode, setCompanyCode] = useState(1)
    const [BeckmanCode,setBeckmancode] = useState()
    const [methodCode, setMethodCode] = useState(1)
    const [machineCode, setMechineCode] = useState(1)
    const [BeckmanmethodCode, setBeckmanMethodCode] = useState('002')
    const [BeckmanBottleSize, setBeckmanBottleSize] = useState('03')
    const [BeckmanLotnumber, setBeckmanLotnumber] = useState(0)
    const [BeckmanType, setBeckmanType] = useState('1')
    const [BeckmanMonth, setBeckmanMonth] = useState(1)
    const [BeckmanYear, setBeckmanYear] = useState(0)
    const [BeckmanLot, setBeckmanLot] = useState('0001')
    const [BeckmanNumber, setBeckmanNumber] = useState('0001')
    const [BeckmanminNumber, setBeckmanMinNumber] = useState('0001')
    const [BeckmanmaxNumber, setBeckmanMaxNumber] = useState('0001')
    const [reagentTypeCode, setReagentTypeCode] = useState(1)
    const [dayProduce, setDayProduce] = useState("")
    const [monthProduce, setMonthProduce] = useState("")
    const [yearProduce, setYearProduce] = useState("")
    const [selectExpiryType, setSelectExpiryType] = useState("1")
    const [minSequenceNumber, setMinSequenceNumber] = useState(1)
    const [maxSequenceNumber, setMaxSequenceNumber] = useState(minSequenceNumber)
    const [minSequenceNumber_once, setMinSequenceNumber_once] = useState(1)
    const [maxSequenceNumber_once, setMaxSequenceNumber_once] = useState(1)
    const [code, setCode] = useState({})
    const [dataExel, setDataExel] = useState([])
    const [isCopy, setIsCopy] = useState(false);
    const [isExport, setIsExport] = useState(false);
    const [isExport1, setIsExport1] = useState(false);
    const [error, setError] = useState(false);
    const [error1, setError1] = useState(false);
    const [selectedTab, setSelectedTab] = useState(1);
    const [changeImage, setChangeImage] = useState("1");
    const [barcode, setBarcode] = useState("00203105260001000013")
    const [barcodeInfo, setBarcodeInfo] = useState({})
    const token = localStorage.getItem("token")
    const uid = localStorage.getItem("uid")
    //console.log(token)

    

const exportToExcel2 = ()=>{
    if(BeckmanLot.length!=4){
        alert("Lot number gồm đủ 4 chữ số!")
        return
    }
    console.log(BeckmanminNumber, BeckmanmaxNumber);
    if (BeckmanminNumber.length > 5 || BeckmanmaxNumber.length > 5) {
      //  console.log(BeckmanminNumber, BeckmanmaxNumber);
        alert("Số SEQ tối đa gồm 5 chữ số!");
        return;
    }
    if (parseInt(BeckmanminNumber) >  parseInt(BeckmanmaxNumber)) {
        //  console.log(BeckmanminNumber, BeckmanmaxNumber);
          alert("Số bắt đầu phải nhỏ hơn số kết thúc");
          return;
      }
    const day = `${yearProduce}-${formatNumber(monthProduce)}-${formatNumber(dayProduce)}`
   
    const uncheck = `${BeckmanmethodCode}${BeckmanBottleSize}${reagentTypeCode}${calculateMonthYear(day,BeckmanMonth)}${BeckmanLot}`
    const minSEQ = parseInt(convertToFiveDigitString(BeckmanminNumber))
    const maxSEQ = parseInt(convertToFiveDigitString(BeckmanmaxNumber))
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'x-user-id': uid
        },
    };
    const dataUncheck = {
        uncheckcode: uncheck,
        minSEQ: minSEQ,
        maxSEQ: maxSEQ
    }
    axios.post('https://barcodeserver-latest-b6nu.onrender.com/barcode/beckman_genator', dataUncheck, config)
    .then((res)=>{
        //console.log(res)
    
    
        const data = transformArray(res.data.checkedcodes);
   const ws = XLSX.utils.json_to_sheet(data);
   const wb = XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
   XLSX.writeFile(wb, `Beckman.xlsx`);
   alert('Export file thành công! Kiểm tra trong thư mục Tải xuống');
    })
    .catch((err)=>{
        console.error(err)
    })
   
   // console.log(BeckmanmethodCode,BeckmanBottleSize,reagentTypeCode,calculateMonthYear(day,BeckmanMonth),BeckmanLot,`0${BeckmanminNumber}`,`0${BeckmanmaxNumber}`)
}
    
    const handleSubmit1 = async()=>{
        if(parseInt(dayProduce)>31 || parseInt(dayProduce)<1 || parseInt(monthProduce)>12||parseInt(monthProduce)<1 || parseInt(yearProduce)<2010 || parseInt(yearProduce)>2150){
            alert("Thời gian không hợp lệ!")
            return
        }
        if(BeckmanLot.length!=4){
            alert("Lot number phải đủ 4 chữ số!")
            return
        }
      if(!validateString(BeckmanNumber)){
        alert("SEQ không hợp lệ")
        return
      }
      //console.log()
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'x-user-id': uid
            },
        };
        const day = `${yearProduce}-${formatNumber(monthProduce)}-${formatNumber(dayProduce)}`
       // alert(day)
      
       const uncheckcode = `${BeckmanmethodCode}${BeckmanBottleSize}${reagentTypeCode}${calculateMonthYear(day,BeckmanMonth)}${BeckmanLot}`
     //  console.log(uncheckcode)
        const minSEQ = parseInt(convertToFiveDigitString(BeckmanNumber))
        const maxSEQ = parseInt(convertToFiveDigitString(BeckmanNumber))
        const data = {
            uncheckcode: uncheckcode,
            minSEQ: minSEQ,
            maxSEQ: maxSEQ
        }
        axios.post('https://barcodeserver-latest-b6nu.onrender.com/barcode/beckman_genator', data, config)
        .then((res)=>{
           // console.log(res)
            setBeckmancode(res.data.checkedcodes[0].code)
            setIsExport1(true)
        })
        .catch((err)=>{
            console.error(err)
        })

    }



    

    const handleSetToday = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        //  const formattedDate = `${year}-${month}-${day}`;
        setDayProduce(day)
        setMonthProduce(month)
        setYearProduce(year)
    }
    const handleCopy = (input) => {
        copy(input);
        setIsCopy(true);
    }

    const handleMinChange = (e) => {
        const newMin = parseInt(e.target.value);


        setMinSequenceNumber(newMin);
        if (newMin > maxSequenceNumber) {
            setMaxSequenceNumber(newMin);
        }


    };
  
    const transformArray = (inputArray) => {
        return inputArray.map((code, index) => ({
            "Số thứ tự lọ": code.bottleLot,
            "Bar Code": code.code
        }));
    };
  
   
    useEffect(() => {
        switch (BeckmanmethodCode) {
            case "002":
                setBeckmanMonth(24)
                break;
            case "007":
                setBeckmanMonth(18)
                break;
            case "006":
                setBeckmanMonth(18)
                break;
            case "219":
                setBeckmanMonth(24)
                break;
    
            case "009":
                setBeckmanMonth(18)
                break;
            case "034":
                setBeckmanMonth(18)
                break;
            case "098":
                setBeckmanMonth(24)
                break;
            case "032":
                setBeckmanMonth(24)
                break;
            case "004":
                setBeckmanMonth(18)
                break;
            case "079":
                setBeckmanMonth(12)
                break;
            case "155":
                setBeckmanMonth(18)
                break;
            case "047":
                setBeckmanMonth(12)
                break;
            case "011":
                setBeckmanMonth(18)
                break;
            case "020":
                setBeckmanMonth(18)
                break;
            case "021":
                setBeckmanMonth(12)
                break;
            case "087":
                setBeckmanMonth(18)
                break;
            case "026":
                setBeckmanMonth(18)
                break;
            case "083":
                setBeckmanMonth(18)
                break;
            case "012":
                setBeckmanMonth(18)
                break;
            case "016":
                setBeckmanMonth(18)
                break;
            case "118":
                setBeckmanMonth(18)
                break;
            
            default:
                setBeckmanMonth(24)

        }
    }, [BeckmanmethodCode])
  

    const handleReload = (id, item) => {
        // console.log(id)
         const element = document.getElementById(id)
 
         element.innerHTML = '  <img style="width: 250px; height: 60px;" alt="Barcode Generator TEC-IT -' + item + '" src="https://barcode.tec-it.com/barcode.ashx?data=' + item + '&code=Code25IL" style= "maxWidth: 250px" /> '
 
         // console.log('  <img alt="Barcode Generator TEC-IT -' + item + ' src="https://barcode.tec-it.com/barcode.ashx?data=' + item + '&code=Code25IL" style= "maxWidth: 250px" /> ')
         // console.log(`https://barcode.tec-it.com/barcode.ashx?data=${item}&code=Code25IL`)
         //  element.src = `https://barcode.tec-it.com/barcode.ashx?data=${item}&code=Code25IL`
     }

    useEffect(()=>{
        handleSetToday()
    },[])


    const handleRead = async () => {
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'x-user-id': uid
            },
        };
        if (barcode.length != 20) {
            alert("Mã vạch phải đủ 18 kí tự!")
            return
        }
        try {
            const data = await axios.get(`https://barcodeserver-latest-b6nu.onrender.com/barcode/read_beckman?code=${barcode}`, config)
            // console.log(data)
            if (data.status===200 && data.data.info_code.length!=0) {
                // console.log(data.data.methodcode)
                setBarcodeInfo({
                    chemicalCode  : data.data.info_code.chemicalCode,
                    bottleSize: data.data.info_code.bottleSize,
                    typeCode: data.data.info_code.typeCode,
                    month: data.data.info_code.month,
                    year: data.data.info_code.year,
                    lotNumber: data.data.info_code.lotNumber,
                    SEQ: data.data.info_code.SEQ
                })
            }
            // console.log(barcodeInfo.methodcode)
        } catch (error) {
            console.error(error)
        }

    }
    useEffect(()=>{
        if(parseInt(BeckmanNumber)>32999){
            setError(true)
        }else{
            setError(false)
        }
    },[BeckmanNumber])
    useEffect(()=>{
        if(parseInt(BeckmanmaxNumber)>32999||parseInt(BeckmanminNumber)>32999){
            setError1(true)
        }else{
            setError1(false)
        }
    },[BeckmanmaxNumber,BeckmanminNumber])
    return (
        <div className="container">
            <div style={{margin: "10px"}}>
            <span style={{ fontWeight: "bold", fontSize: "1.5rem" }}>Beckman coulter AU</span>
                
            </div>
            <div className={`tab_container`}>
                <div onClick={() => setSelectedTab(1)} className={`tab_container-item ${selectedTab == 1 && "active"}`}>Tạo mã lẻ</div>
                <div onClick={() => setSelectedTab(2)} className={`tab_container-item ${selectedTab == 2 && "active"}`}>Tạo nhiều mã</div>
                <div onClick={() => setSelectedTab(3)} className={`tab_container-item ${selectedTab == 3 && "active"}`}>Đọc</div>
            </div>
            {selectedTab == 1 &&
                <div className="container_barcode">
                   
                    {/*
                        <div className="barcode_item">
                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Company Code (Không đổi)</span>
                        <input type="text" value={companyCode} onChange={(e) => setCompanyCode(e.target.value)}></input>
                    </div>
                    */}

<div className="barcode_item">
                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Method (Loại hóa chất)</span>
                       
                       
                            <select value={BeckmanmethodCode} onChange={(e) => setBeckmanMethodCode(e.target.value)}>
                            <option value={'002'}>ALB</option>
                            <option value={'034'}>UN</option>
                            <option value={'007'}>ALT</option>
                            <option value={'009'}>AST</option>
                            <option value={'098'}>UA</option>
                            <option value={'032'}>TP</option>
                            <option value={'219'}>HbA1c</option>
                            <option value={'004'}>ALP</option>
                            <option value={'006'}>AMY</option>
                            <option value={'079'}>CK</option>
                            <option value={'155'}>CK-MB</option>
                            <option value={'078'}>CRE</option>
                            <option value={'047'}>CRP</option>
                            <option value={'011'}>DBIL</option>
                            <option value={'020'}>GGT</option>
                            <option value={'021'}>GLU</option>
                            <option value={'087'}>HDL</option>
                            <option value={'026'}>LDH</option>
                            <option value={'083'}>LDL</option>
                            <option value={'012'}>TBIL</option>
                            <option value={'016'}>TC</option>
                            <option value={'118'}>TG</option>
                            

                        </select>

                        
                        
                        
                        <span >Code  : {BeckmanmethodCode}  </span>
                        <span >Tháng hết hạn của {getMethodName(BeckmanmethodCode)} : {BeckmanMonth} tháng!</span>

                   
                    </div>
                    <div className="barcode_item">
                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Bottle size ( Kích cỡ lọ)</span>
                       
                       
                             <select value={BeckmanBottleSize} onChange={(e) => setBeckmanBottleSize(e.target.value)}>
                            
                            <option value={'03'}>70ml</option>
                            <option value={'05'}>20ml</option>
                        </select>
                       
                    </div>
                    <div className="barcode_item">
                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Reagent type (Loại thuốc thử)</span>
                        <select value={reagentTypeCode} onChange={(e) => setReagentTypeCode(e.target.value)}>
                            <option value={1}>R1</option>
                            <option value={2}>R2</option>
                        </select>
                    </div>
                    {/**  <div className="barcode_item" style={{ display: "none" }}>

                    <select value={selectExpiryType} onChange={(e) => setSelectExpiryType(e.target.value)}>
                        <option value={1}>Thời gian chính xác</option>
                        <option value={2}>Từ thời gian sản xuất</option>
                    </select>
                </div> */}



                    <div className="barcode_item">
                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Ngày sản xuất:</span>
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", }}>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span>Ngày sản xuất</span>
                                <input style={{ width: "100px" }} type="number" min={1} max={31} value={dayProduce} onChange={(e) => setDayProduce(e.target.value)}></input>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span>Tháng sản xuất</span> 
                                <input style={{ width: "100px" }} type="number" min={1} max={12} value={monthProduce} onChange={(e) => setMonthProduce(e.target.value)}></input>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span>Năm sản xuất</span>
                                <input style={{ width: "100px" }} type="number" min={2000}  value={yearProduce} onChange={(e) => setYearProduce(e.target.value)}></input>
                            </div>
                            <button onClick={handleSetToday} style={{ "width": "70px", }}>Hôm nay</button>
                        </div>
                    </div>


                    <div className="barcode_item">
                       
                       
                        
                            <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Lot Number (4 chữ số cuối cùng của lot)</span>
                        <input type="text" value={BeckmanLot} onChange={(e) => setBeckmanLot(e.target.value)}></input>
                     
                       
                    </div>
                    <div className="barcode_item">
                      
                       
                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Số SEQ:
                        </span>
                        <input type="text" required min={0} value={BeckmanNumber} onChange={(e)=>setBeckmanNumber(e.target.value)}></input>
                        {!error&& <span >SEQ: {convertToFiveDigitString(BeckmanNumber)}-{reverseConvert(convertToFiveDigitString(BeckmanNumber))} </span>}
                        {error&& <span style={{color:"red"}}> Bạn đang nhập số SEQ lớn hơn 32999!</span>}
                        {/**
                         *  <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", }}>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span>Min Sequence Number (Bắt đầu từ)</span>
                                <input style={{ width: "100px" }} type="number" min={0} value={minSequenceNumber} onChange={handleMinChange}></input>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span>Max Sequence Number (Kết thúc)</span>
                                <input style={{ width: "100px" }} type="number" min={0} value={maxSequenceNumber} onChange={handleMaxChange}></input>
                            </div>
                        </div>
                         */}

                    </div>
                    <div className="barcode_item" style={{ "width": "150px", "margin": "auto", }}>
                       
                       
                         <button style={{ marginBottom: "10px" }} onClick={handleSubmit1}>Tạo mã Benckman</button>
                        
                        {/** 
                        * {isExport && <button onClick={exportToExcel}>Xuất File Exels</button>}
                       */}


                    </div>
                    
                        <div className="barcode_item barcode_render_contain" style={{ "margin": "auto" }} >
                        {isExport1 &&
                            <select style={{ width: "100px", marginBottom: "10px" }} value={changeImage} onChange={(e) => setChangeImage(e.target.value)}>
                                <option value={1}>Js Barcode </option>
                                <option value={2}>Tec-it</option>
                            </select>}

                        {isExport1 &&
                            <div  className="barcode_render">
                                <div className="barcode_render_img" >
                                    <LazyLoadComponent delayTime={200}>

                                        {/**
                     * 
                     */}
                                        {changeImage == "2" ? (
                                            <div style={{ width: '250px', height: "60px" }} >
                                                <div id={`img_code_beckman`}>
                                                    <img
                                                        alt={`Barcode Generator TEC-IT - ${BeckmanCode}`}
                                                        src={`https://barcode.tec-it.com/barcode.ashx?data=${BeckmanCode}&code=Code25IL`}
                                                        style={{ "maxWidth": "250px", height: "60px" }}

                                                    />
                                                </div>


                                                <p style={{ margin: "0 0 0 0" }}>
                                                    <span class="tooltip1" data-tooltip="Reload Codebar Image" data-tooltip-pos="up" data-tooltip-length="medium"> <CachedIcon style={{ cursor: "pointer" }} onClick={() => handleReload(`img_code_beckman`, BeckmanCode)} /></span>
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="jsbarcode" >
                                                <Barcode value={BeckmanCode} options={{format: 'itf', height: "80px", width: "3px" }} renderer="image" />

                                            </div>

                                        )
                                        }




                                    </LazyLoadComponent>
                                    <div style={{ display: "flex", flexDirection: "row", marginTop: "10px" }}>
                                        <p>{BeckmanCode}</p>

                                        <p>
                                            <span class="tooltip1" data-tooltip="Copy Number Code " data-tooltip-pos="up" data-tooltip-length="medium"> <ContentPasteIcon onClick={() => handleCopy(BeckmanCode)} style={{ cursor: "pointer" }} /></span>

                                        </p>
                                    </div>

                                </div>
                                {/*
                                    <div>
                                    <ul className="barcode_render_detail" style={{ marginBottom: "0", fontSize: "14px" }}>
                                        <li><span>Company Code: </span>{extractSubstring(item, 0, 2)}</li>
                                        <li><span>Method:</span> {getMethodNameByCode(extractSubstring(item, 3, 4))}</li>
                                        <li><span>Bottle Size:</span> {getBottleSizeNameByCode(extractSubstring(item, 5, 5))}</li>
                                        <li><span>Reagent Type:</span> {getReagentTypeNameByCode(extractSubstring(item, 6, 6))}</li>
                                        <li><span>Day Expiry(d/m/y):</span> {convertDateStringToCustomFormat(code?.date)}</li>
                                        <li><span>Lot Number:</span> {extractSubstring(item, 10, 12)} </li>
                                        <li><span>Bottle Sequence Number:</span> {extractSubstring(item, 13, 16)}</li>
                                    </ul>
                                </div>
                                */}

                            </div>
            }
                        
                    </div>
                       

                  
                </div>
            }
            {selectedTab == 2 &&
                <div className="container_barcode">
                    {/*
                    <div className="barcode_item">
                    <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Company Code (Không đổi)</span>
                    <input type="text" value={companyCode} onChange={(e) => setCompanyCode(e.target.value)}></input>
                </div>
                */}
                    

                    
                    <div className="barcode_item">
                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Method (Loại hóa chất)</span>
                       
                    
                            <select value={BeckmanmethodCode} onChange={(e) => setBeckmanMethodCode(e.target.value)}>
                            <option value={'002'}>ALB</option>
                            <option value={'034'}>UN</option>
                            <option value={'007'}>ALT</option>
                            <option value={'009'}>AST</option>
                            <option value={'098'}>UA</option>
                            <option value={'032'}>TP</option>
                            <option value={'219'}>HbA1c</option>
                            <option value={'004'}>ALP</option>
                            <option value={'006'}>AMY</option>
                            <option value={'079'}>CK</option>
                            <option value={'155'}>CK-MB</option>
                            <option value={'078'}>CRE</option>
                            <option value={'047'}>CRP</option>
                            <option value={'011'}>DBIL</option>
                            <option value={'020'}>GGT</option>
                            <option value={'021'}>GLU</option>
                            <option value={'087'}>HDL</option>
                            <option value={'026'}>LDH</option>
                            <option value={'083'}>LDL</option>
                            <option value={'012'}>TBIL</option>
                            <option value={'016'}>TC</option>
                            <option value={'118'}>TG</option>
                            

                        </select>

                        
                      
                        <span >Code  : {BeckmanmethodCode}  </span>
                        <span >Tháng hết hạn của {getMethodName(BeckmanmethodCode)} : {BeckmanMonth} tháng!</span>

                       
                    </div>
                    <div className="barcode_item">
                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Bottle size ( Kích cỡ lọ)</span>
                       
                       
                             <select value={BeckmanBottleSize} onChange={(e) => setBeckmanBottleSize(e.target.value)}>
                          
                            <option value={'03'}>70ml</option>
                            <option value={'05'}>20ml</option>
                        </select>
                        
                    </div>
                    <div className="barcode_item">
                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Reagent type (Loại thuốc thử)</span>
                        <select value={reagentTypeCode} onChange={(e) => setReagentTypeCode(e.target.value)}>
                            <option value={1}>R1</option>
                            <option value={2}>R2</option>
                        </select>
                    </div>
                    {/**  <div className="barcode_item" style={{ display: "none" }}>

                    <select value={selectExpiryType} onChange={(e) => setSelectExpiryType(e.target.value)}>
                        <option value={1}>Thời gian chính xác</option>
                        <option value={2}>Từ thời gian sản xuất</option>
                    </select>
                </div> */}



                    <div className="barcode_item">
                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Ngày sản xuất:</span>
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", }}>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span>Ngày sản xuất</span>
                                <input style={{ width: "100px" }} type="number" min={1} max={31} value={dayProduce} onChange={(e) => setDayProduce(e.target.value)}></input>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span>Tháng sản xuất</span>
                                <input style={{ width: "100px" }} type="number" min={1} max={12} value={monthProduce} onChange={(e) => setMonthProduce(e.target.value)}></input>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span>Năm sản xuất</span>
                                <input style={{ width: "100px" }} type="number" min={2000} value={yearProduce} onChange={(e) => setYearProduce(e.target.value)}></input>
                            </div>
                            <button onClick={handleSetToday} style={{ "width": "70px", }}>Hôm nay</button>
                        </div>
                    </div>


                    <div className="barcode_item">
                       
                    
                        
                            <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Lot Number (4 chữ số cuối cùng của lot)</span>
                        <input type="text" value={BeckmanLot} onChange={(e) => setBeckmanLot(e.target.value)}></input>
                      
                       
                    </div>
                    <div className="barcode_item">
                        
                      
                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Số SEQ:
                        </span>
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", }}>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span>Bắt đầu từ</span>
                                <input style={{ width: "100px" }} type="text" min={0} value={BeckmanminNumber} onChange={(e)=>setBeckmanMinNumber(e.target.value)}></input>
                               {!error1&& <span >SEQ: {convertToFiveDigitString(BeckmanminNumber)} - {reverseConvert(convertToFiveDigitString(BeckmanminNumber))} </span>} 
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span>Kết thúc</span>
                                <input style={{ width: "100px" }} type="text" min={0} value={BeckmanmaxNumber} onChange={(e)=>setBeckmanMaxNumber(e.target.value)}></input>
                                {!error1&& <span >SEQ: {convertToFiveDigitString(BeckmanmaxNumber)} - {reverseConvert(convertToFiveDigitString(BeckmanmaxNumber))} </span>}
                            </div>
                         
                        </div>
                        {error1&& <span style={{color:"red"}}> Bạn đang nhập số SEQ lớn hơn 32999!</span>}
                     
                        {/**<input type="number" min={0} value={minSequenceNumber} onChange={handleMinchange_once}></input> */}
                        {/**
                     * 
                     */}

                    </div>
                    <div className="barcode_item" style={{ "width": "150px", "margin": "auto", }}>
                     
                        <button onClick={exportToExcel2}>Xuất File Exels</button>
                       
                        {/** 
                    * {isExport && }
                   */}

                        {/*  */}
                    </div>



                </div>
            }
           {selectedTab == 3 &&
                <div className="container_barcode">
                    <div className="barcode_item">
                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Nhập số mã vạch để trích xuất thông tin</span>
                        <input type="text" value={barcode} onChange={(e) => setBarcode(e.target.value)}></input>
                    </div>
                    <button onClick={() => handleRead()} style={{ "width": "70px", }}>Đọc</button>
                    {barcodeInfo.SEQ  &&
                        <ul className="barcode_render_detail" style={{ marginBottom: "0", fontSize: "14px" }}>
                            <li><span>Mã hóa chất: </span>{barcodeInfo.chemicalCode}</li>
                            <li><span>Kích thước lọ:</span> {barcodeInfo.bottleSize}</li>
                            <li><span>Loại mã:</span> {barcodeInfo.typeCode}</li>
                            <li><span>Tháng hết hạn:</span> { `${barcodeInfo.month} - 20${barcodeInfo.year}`} </li>
                            <li><span>Số Lot:</span> {barcodeInfo.lotNumber} </li>
                            <li><span>Số SEQ:</span>  {`${convertSEQ(barcodeInfo.SEQ)} - ${barcodeInfo.SEQ}`}</li>
                        </ul>}

                </div>
            }
           


        </div>
    )
}

function convertToFiveDigitString(inputString) {
    const alphabet = 'abcdefghiklmnopqrstvxyz';
    const ALPHABET = 'ABCDEFGHIKLMNOPQRSTVXYZ';
    const allLetters = alphabet + ALPHABET;
    let result = '';

    // Kiểm tra nếu chuỗi có chữ cái đầu tiên
    if (allLetters.includes(inputString[0])) {
        // Lấy chữ cái đầu tiên và chuyển nó thành số
        let letter = inputString[0];
        let letterNumber = alphabet.indexOf(letter.toLowerCase()) + 10;
        let numberPart = inputString.slice(1);

        // Xử lý các trường hợp số phía sau chữ cái
        if (numberPart === '') {
            result = `${letterNumber}000`;
        } else if (numberPart.length <= 3) {
            result = `${letterNumber}${numberPart.padStart(3, '0')}`;
        }
    } else {
        // Không có chữ cái đầu tiên, chỉ có số
        let numberPart = inputString;
        let letterNumber = 0;

        if (numberPart.length <= 3) {
            letterNumber = 0;
        } else if (numberPart.length === 4) {
            letterNumber = numberPart[0];
            numberPart = numberPart.slice(1);
        } else if (numberPart.length === 5) {
            letterNumber = parseInt(numberPart.slice(0, 2));
            numberPart = numberPart.slice(2);

            // Kiểm tra nếu số quá lớn
            if (letterNumber > 32) {

                letterNumber = 32;
            }
        }

        result = `${letterNumber.toString().padStart(2, '0')}${numberPart.padStart(3, '0')}`;
    }

    return result.padStart(5, '0');
}
function reverseConvert(fiveDigitString) {
   // console.log(fiveDigitString)
    const letterMappings = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
        'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'v', 'x', 'y', 'z'
    ];

    let letterIndex = parseInt(fiveDigitString.slice(0, 2));
    let numberPart = fiveDigitString.slice(2);

    if (letterIndex >= 10 && letterIndex <= 35) {
        let letter = letterMappings[letterIndex].toUpperCase();
        return `${letter}${numberPart}`;
    } 
        return fiveDigitString;
    
  
}
function convertSEQ(seq) {
   if(!seq){
    return 
   }
    const seqCharMap = {
        "0": "0", "1": "1", "2": "2", "3": "3", "4": "4",
        "5": "5", "6": "6", "7": "7", "8": "8", "9": "9",
        "A": "10", "B": "11", "C": "12", "D": "13", "E": "14",
        "F": "15", "G": "16", "H": "17", "I": "18", "K": "19",
        "L": "20", "M": "21", "N": "22", "O": "23", "P": "24",
        "Q": "25", "R": "26", "S": "27", "T": "28", "V": "29",
        "X": "30", "Y": "31", "Z": "32"
    };

    if (seq.length === 5 && /^\d+$/.test(seq)) {
        // If the input is already 5 digits
        return seq;
    } else if (seq.length === 4 && /^[A-Z]\d{3}$/.test(seq)) {
        // If the input is in the format 1 letter followed by 3 digits
        const firstChar = seq.charAt(0);
        const mappedNumber = seqCharMap[firstChar];
        const remainingDigits = seq.slice(1);
        return mappedNumber + remainingDigits;
    } else {
        throw new Error("Invalid SEQ format");
    }
}


function validateString(inputString) {
    if(inputString.length>5){
        return false;
    }
    // Kiểm tra xem chuỗi có chứa ký tự không hợp lệ hay không
    if (!/^[0-9A-Za-z]*$/.test(inputString)) {
        return false;
    }

    // Tìm tất cả các chữ cái trong chuỗi
    const letters = inputString.match(/[A-Za-z]/g);

    // Kiểm tra số lượng chữ cái
    if (letters && letters.length > 1) {
        return false;
    }

    // Kiểm tra nếu tồn tại duy nhất một chữ cái, nó phải đứng ở đầu
    if (letters && letters.length === 1) {
        if (inputString[0] !== letters[0]) {
            return false;
        }
    }

    // Nếu chuỗi hợp lệ
    return true;
}

function calculateMonthYear(startDate, months) {
    // Chuyển đổi ngày bắt đầu thành đối tượng Date
       // Chuyển đổi ngày bắt đầu thành đối tượng Date
       const date = new Date(startDate);

       // Kiểm tra xem ngày bắt đầu có hợp lệ hay không
       if (isNaN(date.getTime())) {
           throw new Error('Ngày bắt đầu không hợp lệ');
       }
   
       // Thêm số tháng vào ngày bắt đầu
       date.setMonth(date.getMonth() + months);
   
       // Lấy ngày mới
       const newDay = date.getDate();
       const newMonth = date.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0, nên cần cộng thêm 1
       const newYear = date.getFullYear();
       console.log(newYear)
       // Định dạng tháng để có hai chữ số
       const formattedMonth = newMonth < 10 ? '0' + newMonth : newMonth;
   
       // Định dạng ngày để có hai chữ số
       const formattedYear = newYear.toString().slice(-2);
       console.log(formattedYear)
       // Trả về chuỗi dạng "DD/MM/YYYY"
       return `${formattedMonth}${formattedYear}`;
   
}


function formatNumber(num) {
    const paNum = parseInt(num)
    if (paNum >= 1 && paNum <= 9) {
        return "0" + paNum;
    } else {
        return paNum.toString();
    }
}


const beckmanMethodMap = {
    '002': 'ALB',
    '034': 'UN',
    '007': 'ALT',
    '009': 'AST',
    '098': 'UA',
    '032': 'TP',
    '219': 'HbA1c',
    '004': 'ALP',
    '006': 'AMY',
    '079': 'CK',
    '155': 'CK-MB',
    '078': 'CRE',
    '047': 'CRP',
    '011': 'DBIL',
    '020': 'GGT',
    '021': 'GLU',
    '087': 'HDL',
    '026': 'LDH',
    '083': 'LDL',
    '012': 'TBIL',
    '016': 'TC',
    '118': 'TG'
};

// Hàm nhận vào một chuỗi giá trị và trả về tên tương ứng
function getMethodName(value) {
    return beckmanMethodMap[value] || 'Không tìm thấy tên tương ứng';
}
function convertDateStringToCustomFormat(dateString) {
    const originalDate = new Date(dateString);

    // Kiểm tra xem chuỗi ngày hợp lệ hay không
    if (isNaN(originalDate.getTime())) {
        return "Ngày không hợp lệ";
    }

    const day = originalDate.getDate();
    const month = originalDate.getMonth() + 1; // Tháng bắt đầu từ 0
    const year = originalDate.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;

    return formattedDate;
}
function getMethodNameByValue(value) {
    const valueInt = parseInt(value)
    const methodOptions = [
        { value: 1, label: 'ALB (Albumin)' },
        { value: 20, label: 'ALT (GPT)' },
        { value: 5, label: 'AMY (alpha - Amylase)' },
        { value: 19, label: 'AST (GOT)' },
        { value: 6, label: 'BIL-D (Bilirubin Direct)' },
        { value: 7, label: 'BIL-T (Bilirubin Total)' },
        { value: 10, label: 'TC (Total Cholesterol)' },
        { value: 13, label: 'CK-MB' },
        { value: 35, label: 'CRE (Creatinine)' },
        { value: 36, label: 'CRP' },
        { value: 16, label: 'GGT' },
        { value: 11, label: 'HDL-C (HDL-Cholesterol)' },
        { value: 12, label: 'LDL-C (LDL - Cholesterol)' },
        { value: 30, label: 'TG (Total Triglycerides)' },
        { value: 29, label: 'TP (Total Protein)' },
        { value: 32, label: 'UA (Uric Acid)' },
        { value: 31, label: 'UN (Urea)' },
        { value: 37, label: 'HbA1c' },
        { value: 2, label: 'ALP' },
        { value: 14, label: 'CK' },
        { value: 18, label: 'GLU (Glucose)' },
        { value: 25, label: 'LDH' },
    ];

    const selectedMethod = methodOptions.find(method => method.value === valueInt);

    return selectedMethod ? selectedMethod.label : null;
}
function GET_CHECK_BIT_Beckman(  num_string_GS1_128)
        {
            // num = "0011331335208123121";
        let num = num_string_GS1_128;
      
         let MAX_N =20-1;//19

            if (num.length >= MAX_N)
            {

                let N =[] ;


                let count_add = 0;
                for (let i = 0; i < num.length; i++)
                {
                  
                   
                       let so= parseInt( num[i]);
                        if( !isNaN(so)){
                           N[count_add] = so;

                             count_add++;
                        if (count_add >= MAX_N)
                        {
                            break;
                        }
                        }
                      
                    
                }




                if (count_add == MAX_N)
                {
                    let OK__ = true;
                    for (let i = 0; i < MAX_N; i++)
                    {
                        if (N[i] < 0 || N[i] > 9)
                        {
                            OK__ = false; break;
                        }

                    }
                    if (OK__)
                    {






   // // Chuyển chuỗi nhập vào thành mảng các chữ số
   // const digits = barcode.split('').map(Number);
    
    // Biến tổng
    let sum = 0;
    
    // Trọng số bắt đầu từ 3 và 1 xen kẽ từ phải qua trái
    for (let i = N.length - 1; i >= 0; i--) {
        const weight = (i % 2 === 0) ? 3 : 1;
        sum += N[i] * weight;
    }
    
    // Tính toán check digit
    const checkDigit = (10 - (sum % 10)) % 10;
    
    return checkDigit;

                    



                    }

                }



            }
            return -1;
        }
const BeckmanPage = ()=>{
    const navigate = useNavigate()
    return (
        <>
        <button onClick={()=>{navigate('/fruno')}}>Đổi máy</button>
            <Beckman/>
            
        </>
    )
}
export default BeckmanPage