import React, { useEffect, useState } from "react";
import "../barcode.css"
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import copy from 'clipboard-copy';
import * as XLSX from 'xlsx';
import { LazyLoadComponent } from 'react-lazy-load-image-component';
import CachedIcon from '@mui/icons-material/Cached';
import { useNavigate } from "react-router-dom";
import Barcode from 'react-jsbarcode';
import { FrunoGenator, FrunoRead } from "../api/fruno.api";
import { ClipLoader } from 'react-spinners';
import "../Pages/styles.css"
const Fruno = () => {
    const [companyCode, setCompanyCode] = useState(1)
    const [methodCode, setMethodCode] = useState(1)
    const [machineCode, setMechineCode] = useState(1)
    const [bottleSizeCode, setBottleSizeCode] = useState(1)
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
    const [minSequenceNumber, setMinSequenceNumber] = useState(1)
    const [maxSequenceNumber, setMaxSequenceNumber] = useState(minSequenceNumber)
    const [minSequenceNumber_once, setMinSequenceNumber_once] = useState("1")
    const [maxSequenceNumber_once, setMaxSequenceNumber_once] = useState("1")
    const [code, setCode] = useState({})
    const [isCopy, setIsCopy] = useState(false);
    const [isExport, setIsExport] = useState(false);
    const [selectedTab, setSelectedTab] = useState(1);
    const [changeImage, setChangeImage] = useState("1");
    const [barcode, setBarcode] = useState("001011141000100018")
    const [barcodeInfo, setBarcodeInfo] = useState({})
    const [error,setError]= useState(false)
    const [error1,setError1]= useState(false)
    const [loading, setLoading] = useState(false);
    //console.log(token)

    const exportToExcel = async () => {
        try {
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
            if (maxSequenceNumber == 0) {
                err_arr.push("Max Sequence Number")
            }
            if (lotNumber == 0) {
                err_arr.push("Lot Number")
            }
            if (lotNumber >999 ) {
                alert("Lot number tối đa có 3 số!");
                return
            }
            if (err_arr.length > 0) {
                const errorMessage = "Nhập đầy đủ thông tin sau: " + err_arr.join(', ');
                alert(errorMessage);
                return
            }
            if(parseInt(minSequenceNumber)>parseInt(maxSequenceNumber)){
                alert("Số bắt đầu không được lớn hơn số kết thúc");
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
                MinSequenceNumber: minSequenceNumber,
                MaxSequenceNumber: maxSequenceNumber,
                SequenceNumber: sequenceNumber,
            }
           // console.log(dataBarcode)
            setLoading(true)
            const res = await FrunoGenator(dataBarcode)
            setLoading(false)
            if (res.data.code === 200) {
                //setCode(data.data)
                //  console.log(res.data.data)
                if (res.data.data !== null || res.data.data.length != 0) {
                    const data = transformArray(res.data.data);
                    const ws = XLSX.utils.json_to_sheet(data);
                    const wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
                    XLSX.writeFile(wb, `${res.data.methodecode}_${res.data.bottlesize}_${res.data.reagenttype}_${res.data.dayProduce}_from_${res.data.min}_to_${res.data.max}.xlsx`);
                    setTimeout(() => {
                        alert('Export file thành công! Kiểm tra trong thư mục Tải xuống');
                      }, 500); 
                } else {
                    setLoading(false)
                    alert("Có lỗi xảy ra!")
                }
            }
            else if (res.data.code === 204) {
                alert("Ngày tháng năm không hợp lệ!")
            }





        } catch (error) {
           // console.error('Lỗi khi ghi file:', error);
            alert('Đã xảy ra lỗi khi ghi file Excel!');
        }
    };


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
        if (minSequenceNumber_once == 0) {
            err_arr.push("Min Sequence Number")
        }
        if (lotNumber == 0) {
            err_arr.push("Lot Number")
        }

        if (err_arr.length > 0) {
            const errorMessage = "Nhập đầy đủ thông tin sau: " + err_arr.join(', ');
            alert(errorMessage);
            return
        }
        
        if(parseInt(lotNumber)>999){
            alert("Lot Number tối đa gồm 3 chữ số");
            return;
        }
        const numericPattern = /^[0-9]+$/;
        if (!numericPattern.test(lotNumber)) {
            alert("Mã vạch không bao gồm ký tự chữ!")
            return 
        }
        if (!numericPattern.test(minSequenceNumber_once)) {
            alert("Mã vạch không bao gồm ký tự chữ!")
            return 
        } 
        if(parseInt(minSequenceNumber_once)>9999){
            alert("Số thứ tự lộ tối đa gồm 4 chữ số");
            return;
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
        //console.log(dataBarcode)
        try {
            setLoading(true)
            setIsExport(false)
            const data = await FrunoGenator(dataBarcode)
            // console.log(data.data)
            setLoading(false)
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
            setLoading(false)
            console.error(error)
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
       
        setMinSequenceNumber(e.target.value);
      


    };
    const handleMinchange_once = (e) => {
       // const newMin = parseInt(e.target.value);
        setMinSequenceNumber_once(e.target.value);
        setMaxSequenceNumber_once(e.target.value)
    }
    useEffect(()=>{
        if(parseInt(minSequenceNumber_once)>9999||parseInt(maxSequenceNumber_once)>9999){
            setError(true)
        }else{
            setError(false)
        }
    },[minSequenceNumber_once,maxSequenceNumber_once])
    useEffect(()=>{
        if(parseInt(minSequenceNumber)>9999||parseInt(maxSequenceNumber)>9999){
            setError1(true)
        }else{
            setError1(false)
        }
    },[minSequenceNumber,maxSequenceNumber])
    const handleMaxChange = (e) => {
        setMaxSequenceNumber(e.target.value);
    };
    const transformArray = (inputArray) => {
        return inputArray.map((code, index) => ({
            "Số thứ tự lọ": code.bottleLot,
            "Bar Code": code.code
        }));
    };
    const handleReload = (id, item) => {
        // console.log(id)
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
        const numericPattern = /^[0-9]+$/;
        if (!numericPattern.test(barcode)) {
            alert("Mã vạch không bao gồm ký tự chữ!")
            return 
        } 
        if (barcode.length != 18) {
            alert("Mã vạch phải đủ 18 kí tự!")
            return
        }

        try {
            setLoading(true)
            const data = await FrunoRead(barcode)
            setLoading(false)
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
            setLoading(false)
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

    return (
    <div className="main_contain">
    <div className={`tab_container`} >
                <div onClick={() => setSelectedTab(1)} className={`tab_container-item ${selectedTab == 1 && "active"}`}>Tạo mã lẻ</div>
                <div onClick={() => setSelectedTab(2)} className={`tab_container-item ${selectedTab == 2 && "active"}`}>Tạo nhiều mã</div>
                <div onClick={() => setSelectedTab(3)} className={`tab_container-item ${selectedTab == 3 && "active"}`}>Đọc</div>

            </div>
        <div className="container">
            <div style={{ margin: "10px" }} >
                <a href='https://www.tec-it.com' title='Barcode Software by TEC-IT' target='_blank'>

                </a>
              
            </div>
            
            {selectedTab == 1 &&
                <div className="container_barcode">

                    <div className="barcode_item">
                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Method (Loại hóa chất)</span>

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

                        </select>

                        <>
                            <span >Code  : {formatNumber(methodCode)}  </span>
                            <span >Tháng hết hạn của {getMethodNameByValue(methodCode)} : {expiry_Month} tháng!</span>

                        </>




                    </div>
                    <div className="barcode_item">
                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Bottle size ( Kích cỡ lọ)</span>

                        <select value={bottleSizeCode} onChange={(e) => setBottleSizeCode(e.target.value)}>
                            <option value={1}>20ml (square)</option>
                            <option value={3}>70ml</option>
                        </select>

                    </div>
                    <div className="barcode_item">
                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Reagent type (Loại thuốc thử)</span>
                        <select value={reagentTypeCode} onChange={(e) => setReagentTypeCode(e.target.value)}>
                            <option value={1}>R1</option>
                            <option value={2}>R2</option>
                        </select>
                    </div>


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

                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Lot Number (3 chữ số cuối cùng của lot)</span>
                        <input type="number" value={lotNumber} onChange={(e) => setLotNumber(e.target.value)}></input>
                    </div>
                    <div className="barcode_item">

                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Số thứ tự lọ:
                        </span>
                        <input type="number" required  value={minSequenceNumber_once} onChange={handleMinchange_once}></input>
                        {error && <span style={{ color: "red" }}> Bạn đang nhập số thứ tự lọ lớn hơn 4 chữ số!</span>}

                    </div>
                    {!error&&
                     <div className={`barcode_item sumbit_contain button-container login-form ${loading ? 'loading' : ''}`} style={{ "width": "150px", "margin": "auto", }}>

                     <div className="button_submit" style={{ width:"100%" }} onClick={handleSubmit}>Tạo mã</div>
                     {loading && 
                 <div className="loading-overlay">
                     <ClipLoader color="#000" loading={loading} size={50} />
                 </div>
             }
                 </div>
                    }
                   

                    {isExport &&
                        <div className="barcode_item" >
                            <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Ngày hết hạn ước tính (ngày-tháng-năm): {convertDateStringToCustomFormat(code?.date)}</span>
                        </div>}


                    <div className="barcode_item barcode_render_contain" style={{ "margin": "auto" }} >
                        {isExport &&
                            <select style={{ width: "100px", marginBottom: "10px" }} value={changeImage} onChange={(e) => setChangeImage(e.target.value)}>
                                <option value={1}>Js Barcode </option>
                                <option value={2}>Tec-it</option>
                            </select>}

                        {isExport&&code?.data?.length !== 0 && machineCode == 1 && code?.data?.map((item, index) => (
                            <div key={index} className="barcode_render">
                                <div className="barcode_render_img" >
                                    <LazyLoadComponent delayTime={200}>
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
                            </div>
                        ))}
                    </div>
                </div>
            }
            {selectedTab == 2 &&
                <div className="container_barcode">
                    <div className="barcode_item">
                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Method (Loại hóa chất)</span>

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

                        </select>



                        <span >Code  : {formatNumber(methodCode)}  </span>
                        <span >Tháng hết hạn của {getMethodNameByValue(methodCode)} : {expiry_Month} tháng!</span>






                    </div>
                    <div className="barcode_item">
                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Bottle size ( Kích cỡ lọ)</span>

                        <select value={bottleSizeCode} onChange={(e) => setBottleSizeCode(e.target.value)}>
                            <option value={1}>20ml (square)</option>
                            <option value={3}>70ml</option>
                        </select>

                    </div>
                    <div className="barcode_item">
                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Reagent type (Loại thuốc thử)</span>
                        <select value={reagentTypeCode} onChange={(e) => setReagentTypeCode(e.target.value)}>
                            <option value={1}>R1</option>
                            <option value={2}>R2</option>
                        </select>
                    </div>

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

                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Lot Number (3 chữ số cuối cùng của lot)</span>
                        <input type="number" value={lotNumber} onChange={(e) => setLotNumber(e.target.value)}></input>



                    </div>
                    <div className="barcode_item">

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
                        {error1 && <span style={{ color: "red" }}> Bạn đang nhập số thứ tự lọ lớn hơn 4 chữ số!</span>}
                    </div>
                    {!error1&&
                     <div className={`barcode_item sumbit_contain button-container login-form ${loading ? 'loading' : ''}`} style={{ "width": "150px", "margin": "auto", }}>
                     <div style={{ "width": "100%", }} onClick={exportToExcel}>Xuất File Exels</div>
                     {loading && 
              <div className="loading-overlay">
                  <ClipLoader color="#000" loading={loading} size={50} />
              </div>
          }
                 </div>}
                   



                </div>
            }
            {selectedTab == 3 &&
                <div className="container_barcode">
                    <div className="barcode_item">
                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Nhập số mã vạch để trích xuất thông tin</span>
                        <input type="text" value={barcode} onChange={(e) => setBarcode(e.target.value)}></input>
                    </div>
                    <div className={`barcode_item sumbit_contain button-container login-form ${loading ? 'loading' : ''}`} >
                        <div onClick={() => handleRead()} style={{ "width": "100%", }}>Đọc</div>
                        {loading && 
               <div className="loading-overlay">
                   <ClipLoader color="#000" loading={loading} size={50} />
               </div>
           }
                    </div>
                    
                    {!loading&&barcodeInfo.bottlesequence  &&
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
        </div>
    )
}



function formatNumber(num) {
    const paNum = parseInt(num)
    if (paNum >= 1 && paNum <= 9) {
        return "0" + paNum;
    } else {
        return paNum.toString();
    }
}


// Hàm nhận vào một chuỗi giá trị và trả về tên tương ứng

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
const FrunoPage = () => {
    const navigate = useNavigate()
    return (
        <div style={{display:"flex", flexDirection:'column', marginBottom:"10px"}}>  
        <span style={{ fontWeight: "bold", fontSize: "1.5rem", marginBottom:"10px" }}>Fruno CA</span>
            <button style={{width:"80px", height:"30px", margin:"auto", marginBottom:"20px"}} onClick={() => { navigate('/beckman') }}>Đổi máy</button>
            <Fruno />

        </div>
    )
}
export default FrunoPage