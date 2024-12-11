import React, { useEffect, useState } from "react";
import "../barcode.css"
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import copy from 'clipboard-copy';
import * as XLSX from 'xlsx';
import { LazyLoadComponent } from 'react-lazy-load-image-component';
import CachedIcon from '@mui/icons-material/Cached';
import Barcode from 'react-jsbarcode';
import { useNavigate } from 'react-router-dom';
import { BeckmanGenator, BeckmanRead } from "../api/beckman.api";
import { ClipLoader } from 'react-spinners';
import beckmanMethodMap1 from "../constant/Beckman.constant/Beckman.constant";
import { transformArray, convertToFiveDigitString, reverseConvert, convertSEQ, validateString, calculateMonthYear, formatNumber, getMethodName } from "../helper/Beckman.helper/Beckman.helper";
import "../Pages/styles.css"
const numericPattern = /^[0-9]+$/;
const Beckman = () => {

    const [BeckmanCode, setBeckmancode] = useState()
    const [BeckmanmethodCode, setBeckmanMethodCode] = useState('801')
    const [BeckmanBottleSize, setBeckmanBottleSize] = useState('03')
    const [BeckmanMonth, setBeckmanMonth] = useState(1)
    const [BeckmanLot, setBeckmanLot] = useState('0001')
    const [BeckmanNumber, setBeckmanNumber] = useState('0001')
    const [BeckmanminNumber, setBeckmanMinNumber] = useState('1')
    const [BeckmanmaxNumber, setBeckmanMaxNumber] = useState('1')
    const [reagentTypeCode, setReagentTypeCode] = useState(1)
    const [dayProduce, setDayProduce] = useState("")
    const [monthProduce, setMonthProduce] = useState("")
    const [yearProduce, setYearProduce] = useState("")
    const [isCopy, setIsCopy] = useState(false);
    const [isExport1, setIsExport1] = useState(false);
    const [error, setError] = useState(false);
    const [error1, setError1] = useState(false);
    const [selectedTab, setSelectedTab] = useState(1);
    const [changeImage, setChangeImage] = useState("1");
    const [barcode, setBarcode] = useState("00203105260001000013")
    const [barcodeInfo, setBarcodeInfo] = useState({})
    const [loading, setLoading] = useState(false);
    const [so_thu_tu_lo_lon, setSo_thu_tu_lo_lon] = useState("1");
    const [so_thu_tu_lo_nho, setSo_thu_tu_lo_nho] = useState("1");
    const [errSothutu, setErrSothutu] = useState(false)
    //console.log(token)



    const exportToExcel2 = async () => {
        try {
            if (BeckmanLot.length != 4) {
                alert("Lot number gồm đủ 4 chữ số!")
                return
            }
            if (!numericPattern.test(BeckmanLot)) {
                alert("Mã vạch không bao gồm ký tự chữ!")
                return
            }
            // console.log(BeckmanminNumber, BeckmanmaxNumber);
            if (BeckmanminNumber.length > 5 || BeckmanmaxNumber.length > 5) {
                //  console.log(BeckmanminNumber, BeckmanmaxNumber);
                alert("Số SEQ tối đa gồm 5 chữ số!");
                return;
            }


            if (parseInt(BeckmanminNumber) > parseInt(BeckmanmaxNumber)) {
                //  console.log(BeckmanminNumber, BeckmanmaxNumber);
                alert("Số bắt đầu phải nhỏ hơn số kết thúc");
                return;
            }
            const day = `${yearProduce}-${formatNumber(monthProduce)}-${formatNumber(dayProduce)}`

            const uncheck = `${BeckmanmethodCode}${BeckmanBottleSize}${reagentTypeCode}${calculateMonthYear(day, BeckmanMonth)}${BeckmanLot}`
            const minSEQ = parseInt(convertToFiveDigitString(BeckmanminNumber))
            const maxSEQ = parseInt(convertToFiveDigitString(BeckmanmaxNumber))
            const dataUncheck = {
                uncheckcode: uncheck,
                minSEQ: minSEQ,
                maxSEQ: maxSEQ
            }


            //console.log(res)
            setLoading(true);
            const res = await BeckmanGenator(dataUncheck)
            setLoading(false);
            if (res) {
                const data = transformArray(res.data.checkedcodes);
                const ws = XLSX.utils.json_to_sheet(data);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
                XLSX.writeFile(wb, `Beckman.xlsx`);
                setTimeout(() => {
                    alert('Export file thành công! Kiểm tra trong thư mục Tải xuống');
                }, 500); // 1000ms = 1s, bạn có thể thay đổi giá trị này nếu cần
            }

        }
        catch (error) {
            setLoading(false);
            //console.error(error)
        }
        // console.log(BeckmanmethodCode,BeckmanBottleSize,reagentTypeCode,calculateMonthYear(day,BeckmanMonth),BeckmanLot,`0${BeckmanminNumber}`,`0${BeckmanmaxNumber}`)
    }

    const formatString_sothutulo=(so_thu_tu_lo)=>{
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


    const handleSubmit1 = async () => {
       // const soSEQ = 
       const sothutulo_tonghop = formatString_sothutulo(so_thu_tu_lo_lon) + formatString_sothutulo(so_thu_tu_lo_nho)
        try {
            if (parseInt(dayProduce) > 31 || parseInt(dayProduce) < 1 || parseInt(monthProduce) > 12 || parseInt(monthProduce) < 1 || parseInt(yearProduce) < 2010 || parseInt(yearProduce) > 2150) {
                alert("Thời gian không hợp lệ!")
                return
            }
            if (BeckmanLot.length != 4) {
                alert("Lot number phải đủ 4 chữ số!")
                return
            }
            if (!validateString(BeckmanNumber)) {
                alert("SEQ không hợp lệ")
                return
            }

            if (!numericPattern.test(BeckmanLot)) {
                alert("Mã vạch không bao gồm ký tự chữ!")
                return
            }

            //console.log()
            const day = `${yearProduce}-${formatNumber(monthProduce)}-${formatNumber(dayProduce)}`
            // alert(day)

            const uncheckcode = `${BeckmanmethodCode}${BeckmanBottleSize}${reagentTypeCode}${calculateMonthYear(day, BeckmanMonth)}${BeckmanLot}`
            //  console.log(uncheckcode)
            const minSEQ = parseInt(convertToFiveDigitString(sothutulo_tonghop))
            const maxSEQ = parseInt(convertToFiveDigitString(sothutulo_tonghop))
            const data = {
                uncheckcode: uncheckcode,
                minSEQ: minSEQ,
                maxSEQ: maxSEQ
            }

            setLoading(true);
            setIsExport1(false)
            const res = await BeckmanGenator(data)

            // console.log(res)
            if (res) {
                setBeckmancode(res.data.checkedcodes[0].code)
                setIsExport1(true)
                setLoading(false);
            }


        } catch (error) {
            setLoading(false);
            //  console.error(error)
        }

    }



    const handleReload = (id, item) => {
        // console.log(id)
        const element = document.getElementById(id)

        element.innerHTML = '  <img style="width: 250px; height: 60px;" alt="Barcode Generator TEC-IT -' + item + '" src="https://barcode.tec-it.com/barcode.ashx?data=' + item + '&code=Code25IL" style= "maxWidth: 250px" /> '
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



    useEffect(() => {
        const selectedMethod = beckmanMethodMap1[BeckmanmethodCode];
        setBeckmanMonth(selectedMethod ? selectedMethod.month : 24);
    }, [BeckmanmethodCode])



    useEffect(() => {
        handleSetToday()
    }, [])


    const handleRead = async () => {
        const numericPattern = /^[0-9]+$/;
        if (!numericPattern.test(barcode)) {
            alert("Mã vạch không bao gồm ký tự chữ!")
            return
        }
        if (barcode.length != 20) {
            alert("Mã vạch phải đủ 20 kí tự!")
            return
        }


        try {
            setLoading(true)
            const data = await BeckmanRead(barcode)
            setLoading(false)
            // console.log(data)
            if (data.status === 200 && data.data.info_code.length != 0) {
                // console.log(data.data.methodcode)
                setBarcodeInfo({
                    chemicalCode: data.data.info_code.chemicalCode,
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
            setLoading(false)
            //console.error(error)
        }

    }


    useEffect(() => {
        if (parseInt(BeckmanNumber) > 32999) {
            setError(true)
        } else {
            setError(false)
        }
    }, [BeckmanNumber])


    useEffect(() => {
        if (parseInt(BeckmanmaxNumber) > 32999 || parseInt(BeckmanminNumber) > 32999) {
            setError1(true)
        } else {
            setError1(false)
        }
    }, [BeckmanmaxNumber, BeckmanminNumber])

    useEffect(() => {
        if (so_thu_tu_lo_lon.length > 2 || so_thu_tu_lo_nho.length > 2) {
            setErrSothutu(true)
        }
        else { setErrSothutu(false) }

    }, [so_thu_tu_lo_lon, so_thu_tu_lo_nho])



     const handleChangeMinNumber = (value) => {
        if(value){setBeckmanMinNumber(value)
            setBeckmanMaxNumber((parseInt(value) + 200).toString())}
        
     }

     useEffect(()=>{
        if(parseInt(BeckmanmethodCode)==813){
            setBeckmanBottleSize('03')
        }
        else{
            if(reagentTypeCode==1){
                setBeckmanBottleSize('03')
            }
            if(reagentTypeCode==2){
                setBeckmanBottleSize('05')}
        }
     }, [BeckmanmethodCode, reagentTypeCode])

    return (
        <div className="main_contain">
            <div className={`tab_container`}>
                <div onClick={() => setSelectedTab(1)} className={`tab_container-item ${selectedTab == 1 && "active"}`}>Tạo mã lẻ</div>
                <div onClick={() => setSelectedTab(2)} className={`tab_container-item ${selectedTab == 2 && "active"}`}>Tạo nhiều mã</div>
                <div onClick={() => setSelectedTab(3)} className={`tab_container-item ${selectedTab == 3 && "active"}`}>Đọc</div>
            </div>

            <div className="container">
                {selectedTab == 1 &&
                    <div className="container_barcode">
                        <div className="barcode_item">
                            <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Method (Loại hóa chất)</span>
                            <select value={BeckmanmethodCode} onChange={(e) => setBeckmanMethodCode(e.target.value)}>
                                {Object.entries(beckmanMethodMap1).map(([code, { name }]) => (
                                    <option key={code} value={code}>{name}</option>
                                ))}
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
                            <input type="number" value={BeckmanLot} onChange={(e) => setBeckmanLot(e.target.value)}></input>
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
                        {!error &&!errSothutu&&
                            <div className={`barcode_item sumbit_contain button-container login-form ${loading ? 'loading' : ''}`} style={{ marginBottom: "30px" }}>
                                <div className="button_submit" style={{ width: "100%" }} onClick={handleSubmit1}>Tạo mã Benckman</div>
                                {loading &&
                                    <div className="loading-overlay">
                                        <ClipLoader color="#000" loading={loading} size={50} />
                                    </div>
                                }
                            </div>
                        }


                        <div className="barcode_item barcode_render_contain" style={{ "margin": "auto" }} >
                            {isExport1 &&
                                <select style={{ width: "100px", marginBottom: "10px" }} value={changeImage} onChange={(e) => setChangeImage(e.target.value)}>
                                    <option value={1}>Js Barcode </option>
                                    <option value={2}>Tec-it</option>
                                </select>}

                            {isExport1 &&
                                <div className="barcode_render">
                                    <div className="barcode_render_img" >
                                        <LazyLoadComponent delayTime={200}>

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
                                                    <Barcode value={BeckmanCode} options={{ format: 'itf', height: "80px", width: "3px" }} renderer="image" />

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

                                </div>
                            }

                        </div>
                    </div>
                }
                {selectedTab == 2 &&
                    <div className="container_barcode">
                        <div className="barcode_item">
                            <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Method (Loại hóa chất)</span>
                            <select value={BeckmanmethodCode} onChange={(e) => setBeckmanMethodCode(e.target.value)}>
                                {Object.entries(beckmanMethodMap1).map(([code, { name }]) => (
                                    <option key={code} value={code}>{name}</option>
                                ))}
                            </select>
                            <span >Code  : {BeckmanmethodCode}  </span>
                            <span >Tháng hết hạn của {getMethodName(BeckmanmethodCode)} : {BeckmanMonth} tháng!</span>
                        </div>
                        {/** <div className="barcode_item">
                            <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Bottle size ( Kích cỡ lọ)</span>


                            <select value={BeckmanBottleSize} onChange={(e) => setBeckmanBottleSize(e.target.value)}>

                                <option value={'03'}>70ml</option>
                                <option value={'05'}>20ml</option>
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
                            <input type="number" value={BeckmanLot} onChange={(e) => setBeckmanLot(e.target.value)}></input>
                        </div>
                        <div className="barcode_item">
                            <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Số SEQ:
                            </span>
                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", }}>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <span>Bắt đầu từ</span>
                                    <input style={{ width: "100px" }} type="text" min={0} value={BeckmanminNumber} onChange={(e)=>handleChangeMinNumber(e.target.value)}></input>
                                    {!error1 && <span >SEQ: {convertToFiveDigitString(BeckmanminNumber)} - {reverseConvert(convertToFiveDigitString(BeckmanminNumber))} </span>}
                                </div>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <span>Kết thúc</span>
                                    <input disabled style={{ width: "100px" }} type="text" min={0} value={BeckmanmaxNumber} onChange={(e) => setBeckmanMaxNumber(e.target.value)}></input>
                                    {!error1 && <span >SEQ: {convertToFiveDigitString(BeckmanmaxNumber)} - {reverseConvert(convertToFiveDigitString(BeckmanmaxNumber))} </span>}
                                </div>

                            </div>
                            {error1 && <span style={{ color: "red" }}> Bạn đang nhập số SEQ lớn hơn 32999!</span>}


                        </div>
                        {!error1 &&
                            <div className={`barcode_item sumbit_contain button-container login-form ${loading ? 'loading' : ''}`} style={{ "width": "150px", "margin": "auto", }}>

                                <div style={{ "width": "100%", }} onClick={exportToExcel2}>Xuất File Exels</div>
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
                        <div className={`barcode_item sumbit_contain button-container login-form ${loading ? 'loading' : ''}`}>
                            <div onClick={() => handleRead()} style={{ "width": "100%", }}>Đọc</div>
                            {loading &&
                                <div className="loading-overlay">
                                    <ClipLoader color="#000" loading={loading} size={50} />
                                </div>
                            }
                        </div>

                        {!loading && barcodeInfo.SEQ &&
                            <ul className="barcode_render_detail" style={{ marginBottom: "0", fontSize: "14px" }}>
                                <li><span>Mã hóa chất: </span>{barcodeInfo.chemicalCode}</li>
                                <li><span>Kích thước lọ:</span> {barcodeInfo.bottleSize}</li>
                                <li><span>Loại mã:</span> {barcodeInfo.typeCode}</li>
                                <li><span>Tháng hết hạn:</span> {`${barcodeInfo.month} - 20${barcodeInfo.year}`} </li>
                                <li><span>Số Lot:</span> {barcodeInfo.lotNumber} </li>
                                <li><span>Số SEQ:</span>  {`${convertSEQ(barcodeInfo.SEQ)} - ${barcodeInfo.SEQ}`}</li>
                            </ul>}

                    </div>
                }
                
            </div>
        </div>
    )
}


const BeckmanPage = () => {
    const navigate = useNavigate()
    return (
        <div style={{ display: "flex", flexDirection: 'column', marginBottom: "10px" }}>
            <span style={{ fontWeight: "bold", fontSize: "1.5rem", marginBottom: "10px" }}>Beckman coulter AU</span>
            <button style={{ width: "80px", height: "30px", margin: "auto", marginBottom: "20px" }} onClick={() => { navigate('/fruno') }}>Đổi máy</button>
            <Beckman />

        </div>
    )
}
export default Beckman