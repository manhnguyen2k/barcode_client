import beckmanMethodMap1 from "../../constant/Beckman.constant/Beckman.constant";
const transformArray = (inputArray) => {
    return inputArray.map((code, index) => ({
        "Số thứ tự lọ": code.bottleLot,
        "Bar Code": code.code
    }));
};

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
    if (!seq) {
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
    if (inputString.length > 5) {
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
   // console.log(newYear)
    // Định dạng tháng để có hai chữ số
    const formattedMonth = newMonth < 10 ? '0' + newMonth : newMonth;

    // Định dạng ngày để có hai chữ số
    const formattedYear = newYear.toString().slice(-2);
    //console.log(formattedYear)
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



// Hàm nhận vào một chuỗi giá trị và trả về tên tương ứng
function getMethodName(value) {
    return beckmanMethodMap1[value].name || 'Không tìm thấy tên tương ứng';
}
export {transformArray, convertToFiveDigitString, reverseConvert, convertSEQ, validateString, calculateMonthYear, formatNumber,getMethodName }