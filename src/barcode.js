import React, { useEffect, useState } from "react";
import "./barcode.css"
import axios from "axios";
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import copy from 'clipboard-copy';
import * as XLSX from 'xlsx';
import { LazyLoadImage, LazyLoadComponent } from 'react-lazy-load-image-component';
import CachedIcon from '@mui/icons-material/Cached';
import { useSelector, useDispatch } from 'react-redux';
import Barcode from 'react-jsbarcode';
const Barcode1 = () => {
    const [companyCode, setCompanyCode] = useState(1)
    const [methodCode, setMethodCode] = useState(1)
    const [machineCode, setMechineCode] = useState(1)
    const [BeckmanmethodCode, setBeckmanMethodCode] = useState('002')
    const [BeckmanBottleSize, setBeckmanBottleSize] = useState('01')
    const [BeckmanLotnumber, setBeckmanLotnumber] = useState(0)
    const [BeckmanType, setBeckmanType] = useState('1')
    const [BeckmanMonth, setBeckmanMonth] = useState(1)
    const [BeckmanYear, setBeckmanYear] = useState(0)
    const [BeckmanLot, setBeckmanLot] = useState('0000')
    const [BeckmanNumber, setBeckmanNumber] = useState('0001')
    const [BeckmanminNumber, setBeckmanMinNumber] = useState('0001')
    const [BeckmanmaxNumber, setBeckmanMaxNumber] = useState('0001')
    const [bottleSizeCode, setBottleSizeCode] = useState(1)
    const [reagentType, setReagentType] = useState(0)
    const [expiryYear, setExpiryYear] = useState(0)
    const [expiryMonth, setExpiryMonth] = useState(0)
    const [expiryDay, setExpiryDay] = useState(0)
    const [expiry_Month, setExpiry_Month] = useState(1)
    const [lotNumber, setLotNumber] = useState(1)
    const [sequenceNumber, setSequenceNumber] = useState(0)
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
    const [reloadClicked, setReloadClicked] = useState(false);
    const [selectedTab, setSelectedTab] = useState(1);
    const [changeImage, setChangeImage] = useState("1");
    const [barcode, setBarcode] = useState("001011141000100018")
    const [barcodeInfo, setBarcodeInfo] = useState({})
    const token = localStorage.getItem("token")
    const uid = localStorage.getItem("uid")
    //console.log(token)

    const exportToExcel = async () => {
        try {

            const dataBarcode = {
                CompanyCode: companyCode,
                MethodCode: methodCode,
                BottleSizeCode: bottleSizeCode,
                ReagentTyprCode: reagentTypeCode,
                DayProduce: dayProduce,
                MonthProduce: monthProduce,
                YearProduce: yearProduce,
                ExpiryMonth: expiryMonth,
                ExpiryDay: expiryDay,
                ExpiryYear: expiryYear,
                Expiry_Month: expiry_Month,
                LotNumber: lotNumber,
                MinSequenceNumber: minSequenceNumber,
                MaxSequenceNumber: maxSequenceNumber,
                SequenceNumber: sequenceNumber,
            }
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'x-user-id': uid
                },
            };
            try {
                axios.post("https://barcodeserver-latest-b6nu.onrender.com/barcode/genator", dataBarcode, config)
                    .then((res) => {
                        if (res.data.code === 200) {
                            //setCode(data.data)
                            console.log(res.data.data)
                            if (res.data.data !== null || res.data.data.length != 0) {
                                const data = transformArray(res.data.data);
                                const ws = XLSX.utils.json_to_sheet(data);
                                const wb = XLSX.utils.book_new();
                                XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
                                XLSX.writeFile(wb, `${res.data.methodecode}_${res.data.bottlesize}_${res.data.reagenttype}_${res.data.dayProduce}_from_${res.data.min}_to_${res.data.max}.xlsx`);
                                alert('Export file thành công! Kiểm tra trong thư mục Tải xuống');
                            } else {
                                alert("Có lỗi xảy ra!")
                            }


                        }
                        else if (res.data.code === 204) {
                            alert("Ngày tháng năm không hợp lệ!")
                        }
                    })
                    .catch((err) => {
                        throw err
                    })
            } catch (error) {
                console.error(error)
            }


        } catch (error) {
            console.error('Lỗi khi ghi file:', error);
            alert('Đã xảy ra lỗi khi ghi file Excel!');
        }
    };

const exportToExcel2 = ()=>{
    const day = `${yearProduce}-${formatNumber(monthProduce)}-${formatNumber(dayProduce)}`
    const arr=[]
   for(let i =parseInt(BeckmanminNumber); i<=parseInt(BeckmanmaxNumber); i++){
    arr.push({bottleLot: i, code:`${BeckmanmethodCode}${BeckmanBottleSize}${reagentTypeCode}${calculateMonthYear(day,BeckmanMonth)}${BeckmanLot}${padToFiveDigits(i)}`})
   }
   const data = transformArray(arr);
   const ws = XLSX.utils.json_to_sheet(data);
   const wb = XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
   XLSX.writeFile(wb, `data.xlsx`);
   alert('Export file thành công! Kiểm tra trong thư mục Tải xuống');
   // console.log(BeckmanmethodCode,BeckmanBottleSize,reagentTypeCode,calculateMonthYear(day,BeckmanMonth),BeckmanLot,`0${BeckmanminNumber}`,`0${BeckmanmaxNumber}`)
}
    
    const handleSubmit1 = ()=>{
        console.log(11111)
        const day = `${yearProduce}-${formatNumber(monthProduce)}-${formatNumber(dayProduce)}`
        setCode(`${BeckmanmethodCode}${BeckmanBottleSize}${reagentTypeCode}${calculateMonthYear(day,BeckmanMonth)}${BeckmanLot}${padToFiveDigits(BeckmanNumber)}`)
        
        setIsExport1(true)
    }

useEffect(()=>{
    console.log(code)
},[code])

    const handleSubmit = async () => {
        const err_arr = []
        if (companyCode == 0) {
            err_arr.push("Company Code")
        }
        if (dayProduce == 0) {
            err_arr.push("Day Produce")
        }
        if (monthProduce == 0) {
            err_arr.push("Month Produce")
        }
        if (yearProduce == 0) {
            err_arr.push("Year Produce")
        }
        if (expiry_Month == 0) {
            err_arr.push("Expiry Month")
        }
        if (minSequenceNumber == 0) {
            err_arr.push("Min Sequence Number")
        }

        if (err_arr.length > 0) {
            const errorMessage = "Nhập đầy đủ thông tin sau: " + err_arr.join(', ');
            alert(errorMessage);
            return
        }

        const dataBarcode = {
            CompanyCode: companyCode,
            MethodCode: methodCode,
            BottleSizeCode: bottleSizeCode,
            ReagentTyprCode: reagentTypeCode,
            DayProduce: dayProduce,
            MonthProduce: monthProduce,
            YearProduce: yearProduce,
            ExpiryMonth: expiryMonth,
            ExpiryDay: expiryDay,
            ExpiryYear: expiryYear,
            Expiry_Month: expiry_Month,
            LotNumber: lotNumber,
            MinSequenceNumber: minSequenceNumber_once,
            MaxSequenceNumber: maxSequenceNumber_once,
            SequenceNumber: sequenceNumber,
        }
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'x-user-id': uid
            },
        };
        try {
            const data = await axios.post("https://barcodeserver-latest-b6nu.onrender.com/barcode/genator", dataBarcode, config)
            // console.log(data.data)

            if (data.data) {
                if (data.data.code === 200) {
                    setCode(data.data)
                    // setDataExel(data.data.data)
                    if (data.data.data.length > 0) {
                        setIsExport(true)
                    }

                }
                else if (data.data.code === 204) {
                    alert("Ngày tháng năm không hợp lệ!")
                }
            }
        } catch (error) {

        }

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
    const handleMinchange_once = (e) => {
        const newMin = parseInt(e.target.value);
        setMinSequenceNumber_once(newMin);
        setMaxSequenceNumber_once(newMin)
    }
    const handleMaxChange = (e) => {
        const newMax = parseInt(e.target.value);
        setMaxSequenceNumber(newMax);
    };
    const transformArray = (inputArray) => {
        return inputArray.map((code, index) => ({
            "Số thứ tự lọ": code.bottleLot,
            "Bar Code": code.code
        }));
    };
    const handleReload = (id, item) => {
        console.log(id)
        const element = document.getElementById(id)

        element.innerHTML = '  <img style="width: 250px; height: 60px;" alt="Barcode Generator TEC-IT -' + item + '" src="https://barcode.tec-it.com/barcode.ashx?data=' + item + '&code=Code25IL" style= "maxWidth: 250px" /> '

        // console.log('  <img alt="Barcode Generator TEC-IT -' + item + ' src="https://barcode.tec-it.com/barcode.ashx?data=' + item + '&code=Code25IL" style= "maxWidth: 250px" /> ')
        // console.log(`https://barcode.tec-it.com/barcode.ashx?data=${item}&code=Code25IL`)
        //  element.src = `https://barcode.tec-it.com/barcode.ashx?data=${item}&code=Code25IL`
    }
    useEffect(() => {
        // Gọi hàm handleSetToday khi component được mount
        handleSetToday();
    }, []); // Dấu ngoặc vuông rỗng đảm bảo useEffect chỉ chạy một lần sau khi component được mount

    const handleRead = async () => {
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'x-user-id': uid
            },
        };
        if (barcode.length != 18) {
            alert("Mã vạch phải đủ 18 kí tự!")
            return
        }
        try {
            const data = await axios.get(`https://barcodeserver-latest-b6nu.onrender.com/barcode/read?code=${barcode}`, config)
            // console.log(data)
            if (data.data) {
                // console.log(data.data.methodcode)
                setBarcodeInfo({
                    companycode: data.data.companycode,
                    methodcode: data.data.methodecode,
                    bottlesize: data.data.bottlesize,
                    reagenttype: data.data.reagenttype,
                    lotnumber: data.data.lotnumber,
                    bottlesequence: data.data.bottlesequence,
                    date: data.data.date
                })
            }
            // console.log(barcodeInfo.methodcode)
        } catch (error) {
            console.error(error)
        }

    }
    useEffect(() => {
        switch (methodCode) {
            case "1":
                setExpiry_Month(24)
                break;
            case "20":
                setExpiry_Month(18)
                break;
            case "5":
                setExpiry_Month(18)
                break;

            case "19":
                setExpiry_Month(18)
                break;
            case "62":
                setExpiry_Month(18)
                break;
            case "63":
                setExpiry_Month(18)
                break;
            case "10":
                setExpiry_Month(18)
                break;
            case "13":
                setExpiry_Month(18)
                break;
            case "35":
                setExpiry_Month(18)
                break;
            case "36":
                setExpiry_Month(12)
                break;
            case "16":
                setExpiry_Month(18)
                break;
            case "11":
                setExpiry_Month(18)
                break;
            case "12":
                setExpiry_Month(18)
                break;
            case "30":
                setExpiry_Month(18)
                break;
            case "29":
                setExpiry_Month(24)
                break;
            case "32":
                setExpiry_Month(24)
                break;
            case "31":
                setExpiry_Month(18)
                break;
            case "37":
                setExpiry_Month(24)
                break;
            case "2":
                setExpiry_Month(18)
                break;
            case "14":
                setExpiry_Month(12)
                break;
            case "18":
                setExpiry_Month(12)
                break;
            case "25":
                setExpiry_Month(18)
                break;
            default:
                setExpiry_Month(24)

        }
    }, [methodCode])
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
    useEffect(()=>{
        console.log(BeckmanmethodCode)
    },[BeckmanmethodCode])
    return (
        <div className="container">
            <div >
                <a href='https://www.tec-it.com' title='Barcode Software by TEC-IT' target='_blank'>

                </a>
            </div>
            <div className={`tab_container`}>
                <div onClick={() => setSelectedTab(1)} className={`tab_container-item ${selectedTab == 1 && "active"}`}>Tạo mã lẻ</div>
                <div onClick={() => setSelectedTab(2)} className={`tab_container-item ${selectedTab == 2 && "active"}`}>Tạo nhiều mã</div>
                <div onClick={() => setSelectedTab(3)} className={`tab_container-item ${selectedTab == 3 && "active"}`}>Đọc</div>
               
            </div>
            {selectedTab == 1 &&
                <div className="container_barcode">
                     <div className="barcode_item">
                     <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Loại máy</span>
                         <select value={machineCode} onChange={(e) => setMechineCode(e.target.value)}>
                              <option value={1}>Furuno CA</option>
                            <option value={2}>Beckman coulter AU</option>
                           
                         
                         </select>
                     </div>
                    {/*
                        <div className="barcode_item">
                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Company Code (Không đổi)</span>
                        <input type="text" value={companyCode} onChange={(e) => setCompanyCode(e.target.value)}></input>
                    </div>
                    */}

<div className="barcode_item">
                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Method (Loại hóa chất)</span>
                        {machineCode ==1 && 
                        <select value={methodCode} onChange={(e) => setMethodCode(e.target.value)}>
                            <option value={1}>ALB (Albumin)</option>
                            <option value={20}>ALT (GPT)</option>
                            <option value={5}>AMY (alpha - Amylase)</option>
                            <option value={19}>AST (GOT)</option>
                            <option value={6}>BIL-D (Bilirubin Direct)</option>
                            <option value={7}>BIL-T (Bilirubin Total)</option>
                            <option value={10}>TC (Total Cholesterol)</option>
                            <option value={13}>CK-MB</option>
                            <option value={35}>CRE (Creatinine)</option>
                            <option value={36}>CRP</option>
                            <option value={16}>GGT</option>
                            <option value={11}>HDL-C (HDL-Cholesterol)</option>
                            <option value={12}>LDL-C (LDL - Cholesterol)</option>
                            <option value={30}>TG (Total Triglycerides)</option>
                            <option value={29}>TP (Total Protein)</option>
                            <option value={32}>UA (Uric Acid)</option>
                            <option value={31}>UN (Urea)</option>
                            <option value={37}>HbA1c</option>
                            <option value={2}>ALP</option>
                            <option value={14}>CK</option>
                            <option value={18}>GLU (Glucose)</option>
                            <option value={25}>LDH</option>

                        </select>}
                        {machineCode ==2 &&
                            <select value={BeckmanmethodCode} onChange={(e) => setBeckmanMethodCode(e.target.value)}>
                            <option value={'002'}>ALB</option>
                            <option value={'034'}>UN</option>
                            <option value={'007'}>ALT</option>
                            <option value={'009'}>AST</option>
                            <option value={'098'}>UA</option>
                            <option value={'032'}>TP</option>
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

                        }
                         {machineCode ==1 &&
                        <>
                        <span >Code  : {formatNumber(methodCode)}  </span>
                        <span >Tháng hết hạn của {getMethodNameByValue(methodCode)} : {expiry_Month} tháng!</span>

                        </>
                           

                        }
                         {machineCode ==2 &&
                        <>
                        <span >Code  : {BeckmanmethodCode}  </span>
                        <span >Tháng hết hạn của {getMethodName(BeckmanmethodCode)} : {BeckmanMonth} tháng!</span>

                        </>
                           

                        }
                    </div>
                    <div className="barcode_item">
                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Bottle size ( Kích cỡ lọ)</span>
                        {machineCode==1&&
                        <select value={bottleSizeCode} onChange={(e) => setBottleSizeCode(e.target.value)}>
                            <option value={1}>20ml (square)</option>
                            <option value={3}>70ml</option>
                        </select>}
                        {machineCode==2 &&
                             <select value={BeckmanBottleSize} onChange={(e) => setBeckmanBottleSize(e.target.value)}>
                            <option value={'01'}>30ml</option>
                            <option value={'03'}>70ml</option>
                            <option value={'05'}>20ml</option>
                        </select>
                        }
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
                                <input style={{ width: "100px" }} type="number" value={dayProduce} onChange={(e) => setDayProduce(e.target.value)}></input>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span>Tháng sản xuất</span>
                                <input style={{ width: "100px" }} type="number" value={monthProduce} onChange={(e) => setMonthProduce(e.target.value)}></input>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span>Năm sản xuất</span>
                                <input style={{ width: "100px" }} type="number" value={yearProduce} onChange={(e) => setYearProduce(e.target.value)}></input>
                            </div>
                            <button onClick={handleSetToday} style={{ "width": "70px", }}>Hôm nay</button>
                        </div>
                    </div>


                    <div className="barcode_item">
                        {machineCode==1&&<>
                            <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Lot Number (3 chữ số cuối cùng của lot)</span>
                        <input type="text" value={lotNumber} onChange={(e) => setLotNumber(e.target.value)}></input>
                        </>}
                        {machineCode==2&&<>
                        
                            <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Lot Number (4 chữ số cuối cùng của lot)</span>
                        <input type="text" value={BeckmanLot} onChange={(e) => setBeckmanLot(e.target.value)}></input>
                        </>}
                       
                    </div>
                    <div className="barcode_item">
                       {machineCode==1&&<>
                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Số thứ tự lọ:
                        </span>
                        <input type="number" required min={0} value={minSequenceNumber_once} onChange={handleMinchange_once}></input>
                       </>}
                       {machineCode==2&&<>
                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Số SEQ:
                        </span>
                        <input type="number" required min={0} value={BeckmanNumber} onChange={(e)=>setBeckmanNumber(e.target.value)}></input>
                       </>}
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
                        {
                        machineCode==1&&
                         <button style={{ marginBottom: "10px" }} onClick={handleSubmit}>Tạo mã</button>
                        }
                        {machineCode==2&&
                         <button style={{ marginBottom: "10px" }} onClick={handleSubmit1}>Tạo mã</button>}
                       

                        {/** 
                        * {isExport && <button onClick={exportToExcel}>Xuất File Exels</button>}
                       */}


                    </div>
                    {isExport &&
                        <div className="barcode_item" >
                            <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Ngày hết hạn ước tính (ngày-tháng-năm): {convertDateStringToCustomFormat(code?.date)}</span>
                        </div>}
                        {isExport1 &&
                        <div className="barcode_item" >
                            <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Mã code: {code}</span>
                        </div>}

                    <div className="barcode_item barcode_render_contain" style={{ "margin": "auto" }} >
                        {isExport &&
                            <select style={{ width: "100px", marginBottom: "10px" }} value={changeImage} onChange={(e) => setChangeImage(e.target.value)}>
                                <option value={1}>Js Barcode </option>
                                <option value={2}>Tec-it</option>
                            </select>}

                        {code?.data?.length !== 0 && code?.data?.map((item, index) => (
                            <div key={index} className="barcode_render">
                                <div className="barcode_render_img" >
                                    <LazyLoadComponent delayTime={200}>

                                        {/**
                     * 
                     */}
                                        {changeImage == "2" ? (
                                            <div style={{ width: '250px', height: "60px" }} >
                                                <div id={`img_code_${index}`}>
                                                    <img
                                                        alt={`Barcode Generator TEC-IT - ${item}`}
                                                        src={`https://barcode.tec-it.com/barcode.ashx?data=${item.code}&code=Code25IL`}
                                                        style={{ "width": "250px", height: "60px" }}

                                                    />
                                                </div>


                                                <p style={{ margin: "0 0 0 0" }}>
                                                    <span class="tooltip1" data-tooltip="Reload Codebar Image" data-tooltip-pos="up" data-tooltip-length="medium"> <CachedIcon style={{ cursor: "pointer" }} onClick={() => handleReload(`img_code_${index}`, item.code)} /></span>
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="jsbarcode" >
                                                <Barcode value={item.code} options={{ format: 'itf', height: "80px", width: "3px" }} renderer="image" />

                                            </div>

                                        )
                                        }




                                    </LazyLoadComponent>
                                    <div style={{ display: "flex", flexDirection: "row", marginTop: "10px" }}>
                                        <p>{item.code}</p>

                                        <p>
                                            <span class="tooltip1" data-tooltip="Copy Number Code " data-tooltip-pos="up" data-tooltip-length="medium"> <ContentPasteIcon onClick={() => handleCopy(item.code)} style={{ cursor: "pointer" }} /></span>

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
                        ))}
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
                     <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Loại máy</span>
                         <select value={machineCode} onChange={(e) => setMechineCode(e.target.value)}>
                              <option value={1}>Furuno CA</option>
                            <option value={2}>Beckman coulter AU</option>
                           
                         
                         </select>
                     </div>


                    
                    <div className="barcode_item">
                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Method (Loại hóa chất)</span>
                        {machineCode ==1 && 
                        <select value={methodCode} onChange={(e) => setMethodCode(e.target.value)}>
                            <option value={1}>ALB (Albumin)</option>
                            <option value={20}>ALT (GPT)</option>
                            <option value={5}>AMY (alpha - Amylase)</option>
                            <option value={19}>AST (GOT)</option>
                            <option value={6}>BIL-D (Bilirubin Direct)</option>
                            <option value={7}>BIL-T (Bilirubin Total)</option>
                            <option value={10}>TC (Total Cholesterol)</option>
                            <option value={13}>CK-MB</option>
                            <option value={35}>CRE (Creatinine)</option>
                            <option value={36}>CRP</option>
                            <option value={16}>GGT</option>
                            <option value={11}>HDL-C (HDL-Cholesterol)</option>
                            <option value={12}>LDL-C (LDL - Cholesterol)</option>
                            <option value={30}>TG (Total Triglycerides)</option>
                            <option value={29}>TP (Total Protein)</option>
                            <option value={32}>UA (Uric Acid)</option>
                            <option value={31}>UN (Urea)</option>
                            <option value={37}>HbA1c</option>
                            <option value={2}>ALP</option>
                            <option value={14}>CK</option>
                            <option value={18}>GLU (Glucose)</option>
                            <option value={25}>LDH</option>

                        </select>}
                        {machineCode ==2 &&
                            <select value={BeckmanmethodCode} onChange={(e) => setBeckmanMethodCode(e.target.value)}>
                            <option value={'002'}>ALB</option>
                            <option value={'034'}>UN</option>
                            <option value={'007'}>ALT</option>
                            <option value={'009'}>AST</option>
                            <option value={'098'}>UA</option>
                            <option value={'032'}>TP</option>
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

                        }
                         {machineCode ==1 &&
                        <>
                        <span >Code  : {formatNumber(methodCode)}  </span>
                        <span >Tháng hết hạn của {getMethodNameByValue(methodCode)} : {expiry_Month} tháng!</span>

                        </>
                           

                        }
                         {machineCode ==2 &&
                        <>
                        <span >Code  : {BeckmanmethodCode}  </span>
                        <span >Tháng hết hạn của {getMethodName(BeckmanmethodCode)} : {BeckmanMonth} tháng!</span>

                        </>
                           

                        }
                    </div>
                    <div className="barcode_item">
                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Bottle size ( Kích cỡ lọ)</span>
                        {machineCode==1&&
                        <select value={bottleSizeCode} onChange={(e) => setBottleSizeCode(e.target.value)}>
                            <option value={1}>20ml (square)</option>
                            <option value={3}>70ml</option>
                        </select>}
                        {machineCode==2 &&
                             <select value={BeckmanBottleSize} onChange={(e) => setBeckmanBottleSize(e.target.value)}>
                            <option value={'01'}>30ml</option>
                            <option value={'03'}>70ml</option>
                            <option value={'05'}>20ml</option>
                        </select>
                        }
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
                                <input style={{ width: "100px" }} type="number" value={dayProduce} onChange={(e) => setDayProduce(e.target.value)}></input>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span>Tháng sản xuất</span>
                                <input style={{ width: "100px" }} type="number" value={monthProduce} onChange={(e) => setMonthProduce(e.target.value)}></input>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span>Năm sản xuất</span>
                                <input style={{ width: "100px" }} type="number" value={yearProduce} onChange={(e) => setYearProduce(e.target.value)}></input>
                            </div>
                            <button onClick={handleSetToday} style={{ "width": "70px", }}>Hôm nay</button>
                        </div>
                    </div>


                    <div className="barcode_item">
                        {machineCode==1&&<>
                            <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Lot Number (3 chữ số cuối cùng của lot)</span>
                        <input type="text" value={lotNumber} onChange={(e) => setLotNumber(e.target.value)}></input>
                        </>}
                        {machineCode==2&&<>
                        
                            <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Lot Number (4 chữ số cuối cùng của lot)</span>
                        <input type="text" value={BeckmanLot} onChange={(e) => setBeckmanLot(e.target.value)}></input>
                        </>}
                       
                    </div>
                    <div className="barcode_item">
                        {machineCode ==1&&<>
                            <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Số thứ tự lọ:
                        </span>
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", }}>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span>Bắt đầu từ</span>
                                <input style={{ width: "100px" }} type="number" min={0} value={minSequenceNumber} onChange={handleMinChange}></input>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span>Kết thúc</span>
                                <input style={{ width: "100px" }} type="number" min={0} value={maxSequenceNumber} onChange={handleMaxChange}></input>
                            </div>
                        </div>
                        </>}
                       {machineCode==2 &&<>
                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Số SEQ:
                        </span>
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", }}>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span>Bắt đầu từ</span>
                                <input style={{ width: "100px" }} type="number" min={0} value={BeckmanminNumber} onChange={(e)=>setBeckmanMinNumber(e.target.value)}></input>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span>Kết thúc</span>
                                <input style={{ width: "100px" }} type="number" min={0} value={BeckmanmaxNumber} onChange={(e)=>setBeckmanMaxNumber(e.target.value)}></input>
                            </div>
                        </div>

                       </>}
                        {/**<input type="number" min={0} value={minSequenceNumber} onChange={handleMinchange_once}></input> */}
                        {/**
                     * 
                     */}

                    </div>
                    <div className="barcode_item" style={{ "width": "150px", "margin": "auto", }}>
                        {machineCode==1&& <button onClick={exportToExcel}>Xuất File Exels</button>}
                       
                        {machineCode==2&& <button onClick={exportToExcel2}>Xuất File Exels</button>}
                       
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
                    {barcodeInfo != null &&
                        <ul className="barcode_render_detail" style={{ marginBottom: "0", fontSize: "14px" }}>
                            <li><span>Company Code: </span>{barcodeInfo.companycode}</li>
                            <li><span>Method:</span> {barcodeInfo.methodcode}</li>
                            <li><span>Bottle Size:</span> {barcodeInfo.bottlesize}</li>
                            <li><span>Reagent Type:</span> {barcodeInfo.reagenttype}</li>
                            <li><span>Day Expiry(d/m/y):</span> {barcodeInfo.date != null && convertDateStringToCustomFormat(barcodeInfo.date)} </li>
                            <li><span>Lot Number:</span> {barcodeInfo.lotnumber} </li>
                            <li><span>Bottle Sequence Number:</span> {barcodeInfo.bottlesequence}</li>
                        </ul>}

                </div>
            }

           


        </div>
    )
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
   
       // Định dạng tháng để có hai chữ số
       const formattedMonth = newMonth < 10 ? '0' + newMonth : newMonth;
   
       // Định dạng ngày để có hai chữ số
       const formattedYear = newYear.toString().slice(-2);
       // Trả về chuỗi dạng "DD/MM/YYYY"
       return `${formattedMonth}${formattedYear}`;
   
}

function padToFiveDigits(number) {
    // Chuyển đổi số thành chuỗi
    let numberStr = number.toString();

    // Kiểm tra độ dài của chuỗi và thêm số 0 vào đầu chuỗi cho đến khi độ dài đạt 5
    while (numberStr.length < 5) {
        numberStr = '0' + numberStr;
    }

    return numberStr;
}
function formatNumber(num) {
    if (num >= 1 && num <= 9) {
        return "0" + num;
    } else {
        return num.toString();
    }
}

function getMethodNameByCode(code) {
    const methodOptions = [
        { value: 1, label: 'ALB (Albumin)' },
        { value: 20, label: 'ALTGPT (ALT)' },
        { value: 5, label: 'AMY_IF (Amylase)' },
        { value: 19, label: 'ASTGOT (AST)' },
        { value: 48, label: 'BIL-Dv' },
        { value: 49, label: 'BIL-Tv' },
        { value: 10, label: 'TC-CHO (Total Cholesterol)' },
        { value: 13, label: 'CK-MB' },
        { value: 15, label: 'CRE_Ja' },
        { value: 36, label: 'CRP' },
        { value: 8, label: 'Ca_A3' },
        { value: 16, label: 'GGT' },
        { value: 17, label: 'GNU_HK' },
        { value: 11, label: 'HDL-C (HDL-Cholesterol)' },
        { value: 12, label: 'LDN-C (LDL-Cholesterol)' },
        { value: 30, label: 'TG (Total Triglycerides)' },
        { value: 29, label: 'TP (Total Protein)' },
        { value: 32, label: 'UA (Uric Acid)' },
        { value: 31, label: 'UREA (Urea)' },
        { value: 37, label: 'HbA1c' },
        { value: 2, label: 'ALP' },
        { value: 14, label: 'CK' },
        { value: 35, label: 'CRE (Creatinine)' },
        { value: 6, label: 'BIL-D (Bilirubin Direct)' },
        { value: 18, label: 'GLU (Glucose)' },
        { value: 25, label: 'LDH (Lactate Dehydrogenase)' },
        { value: 7, label: 'BIL-T (Bilirubin Total)' },
    ];

    const selectedMethod = methodOptions.find(method => method.value.toString() === code.toString());
    //  console.log(selectedMethod)
    return selectedMethod ? selectedMethod.label : null;
}

const beckmanMethodMap = {
    '002': 'ALB',
    '034': 'UN',
    '007': 'ALT',
    '009': 'AST',
    '098': 'UA',
    '032': 'TP',
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
export default Barcode1