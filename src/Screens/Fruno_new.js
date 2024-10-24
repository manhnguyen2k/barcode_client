import React, { useEffect, useState } from "react";
import "../barcode.css"
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import copy from 'clipboard-copy';
import * as XLSX from 'xlsx';
import { LazyLoadComponent } from 'react-lazy-load-image-component';
import CachedIcon from '@mui/icons-material/Cached';
import { useNavigate } from "react-router-dom";
import Barcode from 'react-jsbarcode';
import { FrunoGenator_new, FrunoRead_new } from "../api/fruno.api";
import { ClipLoader } from 'react-spinners';
import "../Pages/styles.css"
const Fruno_new = () => {
    const [companyCode, setCompanyCode] = useState(84)
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
    const [maxSequenceNumber, setMaxSequenceNumber] = useState(minSequenceNumber+200)
    const [minSequenceNumber_once, setMinSequenceNumber_once] = useState("1")
    const [maxSequenceNumber_once, setMaxSequenceNumber_once] = useState("1")
    const [code, setCode] = useState({})
    const [isCopy, setIsCopy] = useState(false);
    const [isExport, setIsExport] = useState(false);
    const [selectedTab, setSelectedTab] = useState(1);
    const [changeImage, setChangeImage] = useState("1");
    const [barcode, setBarcode] = useState("084013164200101018")
    const [barcodeInfo, setBarcodeInfo] = useState({})
    const [error, setError] = useState(false)
    const [error1, setError1] = useState(false)
    const [loading, setLoading] = useState(false);
    const [so_thu_tu_lo_lon, setSo_thu_tu_lo_lon] = useState("1");
    const [so_thu_tu_lo_nho, setSo_thu_tu_lo_nho] = useState("1");
    const [errSothutu, setErrSothutu] = useState(false)
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
            if (lotNumber > 999) {
                alert("Lot number tối đa có 3 số!");
                return
            }
            if (err_arr.length > 0) {
                const errorMessage = "Nhập đầy đủ thông tin sau: " + err_arr.join(', ');
                alert(errorMessage);
                return
            }
            if (parseInt(minSequenceNumber) > parseInt(maxSequenceNumber)) {
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
            const res = await FrunoGenator_new(dataBarcode)
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

    const formatString_sothutulo=(so_thu_tu_lo)=>{
        console.log(so_thu_tu_lo)
       if(so_thu_tu_lo.length==1){
           return "0"+so_thu_tu_lo
       }
       else if(so_thu_tu_lo.length==2){
           return so_thu_tu_lo
       }
       else{
        return "00"
       }

    }

    const handleSubmit = async () => {
        const err_arr = []
      //  console.log(typeof(so_thu_tu_lo_lon))
        const sothutulo_tonghop = formatString_sothutulo(so_thu_tu_lo_lon) + formatString_sothutulo(so_thu_tu_lo_nho)
        console.log(sothutulo_tonghop)
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
        if (so_thu_tu_lo_nho == 0 || so_thu_tu_lo_lon == 0) {
            err_arr.push("Bottle number")
        }
        if (lotNumber == 0) {
            err_arr.push("Lot Number")
        }

        if (err_arr.length > 0) {
            const errorMessage = "Nhập đầy đủ thông tin sau: " + err_arr.join(', ');
            alert(errorMessage);
            return
        }

        if (parseInt(lotNumber) > 999) {
            alert("Lot Number tối đa gồm 3 chữ số");
            return;
        }
        const numericPattern = /^[0-9]+$/;
        if (!numericPattern.test(lotNumber)) {
            alert("Mã vạch không bao gồm ký tự chữ!")
            return
        }
        if (!numericPattern.test(sothutulo_tonghop)) {
            alert("Mã vạch không bao gồm ký tự chữ!")
            return
        }
        if (parseInt(sothutulo_tonghop) > 9999) {
            alert("Số thứ tự lọ tối đa gồm 4 chữ số");
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
            MinSequenceNumber: sothutulo_tonghop,
            MaxSequenceNumber: sothutulo_tonghop,
            SequenceNumber: sequenceNumber,
        }
        //console.log(dataBarcode)
        try {
            setLoading(true)
            setIsExport(false)
            const data = await FrunoGenator_new(dataBarcode)
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
        setMaxSequenceNumber(parseInt(e.target.value)+200)


    };
    const handleMinchange_once = (e) => {
        // const newMin = parseInt(e.target.value);
        setMinSequenceNumber_once(e.target.value);
        setMaxSequenceNumber_once(e.target.value)
    }
    useEffect(() => {
        if (so_thu_tu_lo_lon.length > 2 || so_thu_tu_lo_nho.length > 2) {
            setErrSothutu(true)
        }
        else { setErrSothutu(false) }

    }, [so_thu_tu_lo_lon, so_thu_tu_lo_nho])
    useEffect(() => {
        if (parseInt(minSequenceNumber_once) > 9999 || parseInt(maxSequenceNumber_once) > 9999) {
            setError(true)
        } else {
            setError(false)
        }
    }, [minSequenceNumber_once, maxSequenceNumber_once])
    useEffect(() => {
        if (parseInt(minSequenceNumber) > 9999 || parseInt(maxSequenceNumber) > 9999) {
            setError1(true)
        } else {
            setError1(false)
        }
    }, [minSequenceNumber, maxSequenceNumber])
    const handleMaxChange = (e) => {
        setMaxSequenceNumber(e.target.value);
    };
    const transformArray = (inputArray) => {
        return inputArray.map((code, index) => ({
            "Số thứ tự lọ": code.bottleLot,
            "Bar Code": code.code
        }));
    };

     useEffect(()=>{
        if(parseInt(methodCode)==13){
            setBottleSizeCode(3)
        }else{
            if(parseInt(reagentTypeCode)==1){
                setBottleSizeCode(3)
            }
            if(parseInt(reagentTypeCode)==2){
                setBottleSizeCode(1)
            }
        }
     },[methodCode,reagentTypeCode ])

    


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
            const data = await FrunoRead_new(barcode)
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
            case "2":
                setExpiry_Month(18)
                break;
            case "3":
                setExpiry_Month(18)
                break;

            case "4":
                setExpiry_Month(18)
                break;
            case "5":
                setExpiry_Month(24)
                break;
            case "6":
                setExpiry_Month(24)
                break;
            case "7":
                setExpiry_Month(24)
                break;
            case "8":
                setExpiry_Month(18)
                break;
            case "9":
                setExpiry_Month(18)
                break;
            case "10":
                setExpiry_Month(12)
                break;
            case "11":
                setExpiry_Month(18)
                break;
            case "12":
                setExpiry_Month(18)
                break;
            case "13":
                setExpiry_Month(12)
                break;
            case "14":
                setExpiry_Month(18)
                break;
            case "15":
                setExpiry_Month(18)
                break;
            case "16":
                setExpiry_Month(12)
                break;
            case "17":
                setExpiry_Month(18)
                break;
            case "18":
                setExpiry_Month(18)
                break;
            case "19":
                setExpiry_Month(18)
                break;
            case "20":
                setExpiry_Month(18)
                break;
            case "21":
                setExpiry_Month(18)
                break;
            case "22":
                setExpiry_Month(18)
                break;
            case "23":
                setExpiry_Month(12)
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
                                <option value={2}>UN (Urea)</option>
                                <option value={3}>ALT</option>
                                <option value={4}>AST</option>
                                <option value={5}>UA (Uric Acid)</option>
                                <option value={6}>TP (Total Protein)</option>
                                <option value={7}>HbA1c</option>
                                <option value={8}>ALP</option>
                                <option value={9}>AMY (Amylase)</option>
                                <option value={10}>CK</option>
                                <option value={11}>CK-MB</option>
                                <option value={12}>CRE (Creatinine)</option>
                                <option value={13}>CRP</option>
                                <option value={14}>D-BIL (Direct Bilirubin)</option>
                                <option value={15}>GGT</option>
                                <option value={16}>GLU (Glucose)</option>
                                <option value={17}>HDL (HDL-Cholesterol)</option>
                                <option value={18}>LDH (Lactate Dehydrogenase)</option>
                                <option value={19}>LDL (LDL-Cholesterol)</option>
                                <option value={20}>TBIL (Total Bilirubin)</option>
                                <option value={21}>TC (Total Cholesterol)</option>
                                <option value={22}>TG (Total Triglycerides)</option>
                                <option value={23}>GLU-HK (Glucose HK)</option>

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
                        <div className="barcode_item" style={{ display: "flex", flexDirection: "column" }}>
                            <div style={{ display: "flex", flexDirection: "row", marginBottom: "10px" }}>
                                <div>
                                    <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Số thự tự lọ lớn:</span>
                                    <input type="number" required value={so_thu_tu_lo_lon} onChange={(e) => setSo_thu_tu_lo_lon(e.target.value)}></input>
                                </div>

                                <div>
                                    <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Số thự tự lọ nhỏ:</span>
                                    <input type="number" required value={so_thu_tu_lo_nho} onChange={(e) => setSo_thu_tu_lo_nho(e.target.value)}></input>
                                </div>
                            </div>




                            {errSothutu && <span style={{ color: "red" }}> Số thứ tự tối đa 2 chữ số!</span>}

                        </div>
                        {!error && !errSothutu&&
                            <div className={`barcode_item sumbit_contain button-container login-form ${loading ? 'loading' : ''}`} style={{ "width": "150px", "margin": "auto", }}>

                                <div className="button_submit" style={{ width: "100%" }} onClick={handleSubmit}>Tạo mã</div>
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

                            {isExport && code?.data?.length !== 0 && machineCode == 1 && code?.data?.map((item, index) => (
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
                                <option value={2}>UN (Urea)</option>
                                <option value={3}>ALT</option>
                                <option value={4}>AST</option>
                                <option value={5}>UA (Uric Acid)</option>
                                <option value={6}>TP (Total Protein)</option>
                                <option value={7}>HbA1c</option>
                                <option value={8}>ALP</option>
                                <option value={9}>AMY (Amylase)</option>
                                <option value={10}>CK</option>
                                <option value={11}>CK-MB</option>
                                <option value={12}>CRE (Creatinine)</option>
                                <option value={13}>CRP</option>
                                <option value={14}>D-BIL (Direct Bilirubin)</option>
                                <option value={15}>GGT</option>
                                <option value={16}>GLU (Glucose)</option>
                                <option value={17}>HDL (HDL-Cholesterol)</option>
                                <option value={18}>LDH (Lactate Dehydrogenase)</option>
                                <option value={19}>LDL (LDL-Cholesterol)</option>
                                <option value={20}>TBIL (Total Bilirubin)</option>
                                <option value={21}>TC (Total Cholesterol)</option>
                                <option value={22}>TG (Total Triglycerides)</option>
                                <option value={23}>GLU-HK (Glucose HK)</option>

                            </select>



                            <span >Code  : {formatNumber(methodCode)}  </span>
                            <span >Tháng hết hạn của {getMethodNameByValue(methodCode)} : {expiry_Month} tháng!</span>






                        </div>
                        {/* <div className="barcode_item">
                            <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Bottle size ( Kích cỡ lọ)</span>

                            <select value={bottleSizeCode} onChange={(e) => setBottleSizeCode(e.target.value)}>
                                <option value={1}>20ml (square)</option>
                                <option value={3}>70ml</option>
                            </select>

                        </div> */}
                       
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
                        {!error1 &&
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

                        {!loading && barcodeInfo.bottlesequence &&
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
        { value: 2, label: 'UN (Urea)' },
        { value: 3, label: 'ALT' },
        { value: 4, label: 'AST' },
        { value: 5, label: 'UA (Uric Acid)' },
        { value: 6, label: 'TP (Total Protein)' },
        { value: 7, label: 'HbA1c (HbA1c)' },
        { value: 8, label: 'ALP' },
        { value: 9, label: 'AMY (Amylase)' },
        { value: 10, label: 'CK' },
        { value: 11, label: 'CK-MB' },
        { value: 12, label: 'CRE (Creatinine)' },
        { value: 13, label: 'CRP' },
        { value: 14, label: 'D-BIL (Direct Bilirubin)' },
        { value: 15, label: 'GGT' },
        { value: 16, label: 'GLU (Glucose)' },
        { value: 17, label: 'HDL (HDL-Cholesterol)' },
        { value: 18, label: 'LDH (Lactate Dehydrogenase)' },
        { value: 19, label: 'LDL (LDL-Cholesterol)' },
        { value: 20, label: 'T-BIL (Total Bilirubin)' },
        { value: 21, label: 'TC (Total Cholesterol)' },
        { value: 22, label: 'TG (Total Triglycerides)' },
        { value: 23, label: 'GLU-HK (Glucose HK)' },
    ];

    const selectedMethod = methodOptions.find(method => method.value === valueInt);

    return selectedMethod ? selectedMethod.label : null;
}

export default Fruno_new