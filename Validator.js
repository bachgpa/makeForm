

// Object Validator

function Validator (options){

    function validate (inputElement, rule){
        // tạo errorMessage, gắn nó bằng  giá trị của inputElement.value thông qua method test nằm trong rule (Validator.isEmail or isRequired)
        var errorMessage = rule.test(inputElement.value)
        
        // Từ inputElement, chọn daddy của nó bằng ".parentElement" rối nhặt thằng con ".form__message" của daddy và gắn nó vào errorElement
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector)

        
        if(errorMessage) {
            errorElement.innerText = errorMessage
            inputElement.parentElement.classList.add('invalid');
        } else {
            errorElement.innerText = ""
            inputElement.parentElement.classList.remove('invalid');
        }

    }



    // Nhặt ra phần tử cần được chỉnh sửa qua keyword "form" trong Object Agrument
    var formElement = document.querySelector(options.form);


    // Nếu đã nhặt ra được phần tử muốn chỉnh sửa thí thực hiện tiếp
    if (formElement) {

        // Với mỗi rule trong Object Agrument
        options.rules.forEach(function (rule) {

            // Khởi tạo inputElement với selector được chỉ định ở dưới .isRequied & .isEmail
            var inputElement = formElement.querySelector(rule.selector)

            // với inputElement
            if (inputElement){

                // Khi nhấp ra ngoài khỏi inputElement thì gọi hàm validate
                inputElement.onblur = function (){
                    // rule trong validate là Validator.isRequired hoặc Validator.isEmail
                    validate(inputElement, rule)
                }


                inputElement.oninput = function(){
                    var errorElement = inputElement.parentElement.querySelector(options.errorSelector)

                    errorElement.innerText = ""
                    inputElement.parentElement.classList.remove('invalid');
        
                }
            }
           
        });
    }
}


// Define rules
// nguyen tac cua rule:
// 1: khi co loi => tra ra message loi
// 2: khi hop le => khong tra ra cai gi ca (undefine)


Validator.isRequired = function (selector){ 
    return {

        // Key là Selector, giá trị của nó là agrument dược truyền vào
        selector: selector,

        // Trả ra một phương thức tên là test, truyền vào agrument "value"
        test: function (value){

            // Viết tắt của câu lệnh if

            // Nếu value.trim() không phải là chuỗi rỗng (tương đương với TRUE) thì trả ra return là Undefined
            // Nếu value.trim() nếu là chuỗi rỗng hoặc toàn dấu cách (tương đương FALSE) thì return ra "Vui lòng nhập trường này"
            return value.trim() ? undefined : 'Vui lòng nhập trường này'
        }
    }
}

Validator.isEmail = function (selector){
    return {
        selector: selector,
        test: function (value){
            console.log(value)
            var regex =  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

            return regex.test(value) ? undefined : 'Trường này phải là email'
        }
    }
}

Validator.Length = function (selector, min, max){ 
    return {

        selector: selector,
        test: function (value){

            return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} ký tự`
        }
    }
}


Validator.isConfirmed = function (selector, getConfirmValue) {
    return {
        selector: selector,
        test: function (value){
            return value === getConfirmValue() ? undefined : 'Gía trị nhập vào không chính xác'
        }    }
}