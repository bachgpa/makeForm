

// Object Validator

function Validator (options){

    function validate (inputElement, rule){
        // Trong mỗi rule, tạo và gán errorMessage bằng value của inputElement trong rule
        var errorMessage = rule.test(inputElement.value)
        var errorElement = inputElement.parentElement.querySelector('.form__message')


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

        // Đối với mỗi rule trong Object Agrument (được dùng để gọi 2 function khác), thực hiện lần lượt với các rule đó:
        options.rules.forEach(function (rule) {

            // Chưa có gì cả, khỏi tạo biến đã
            // Đặt biến cho phần selector để nhặt ra phần tử html 

            //(cái selector được khai báo trong 2 function Validator.isRequired và Validator.isEmail)
            var inputElement = formElement.querySelector(rule.selector)

            // Từ thẻ con, chọn daddy qua ".parentElement" rối nhặt thằng con ".form__message" của daddy  để chỉnh sửa nó


            // Nếu đã nhặt được inputElement
            if (inputElement){

                // Khi nhấp ra ngoài khỏi inputElement thì:
                inputElement.onblur = function (){
                    validate(inputElement, rule)
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
        test: function (){
        }
    }
}