

// Object Validator là một thư viện độc lập

function Validator (options){


    function getParents(element, selector) {
        while(element.parentElement){
            if (element.parentElement.matches(selector)){
                return element.parentElement; 
            }
            element = element.parentElement;
        }
    }

    var selectorRules = {};
    
    // hàm validate chạy khi onblur, onblur nằm trong forEach lặp qua từng inputElement; sau khi thực hiện lệnh trong validate sẽ return 
    function validate (inputElement, rule){
        // var errorElement = getParent(inputElement, ".form__group")
        // từ input chọn ra thẻ cha, từ thẻ cha chọn thẻ error message
        var errorElement = getParents(inputElement, options.formGroupSelector).querySelector(options.errorSelector)
        console.log(errorElement)
        var errorMessage;
        
        
        var rules = selectorRules[rule.selector];
        for (var i = 0; i < rules.length; ++i) {
            switch (inputElement.type){
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](formElement.querySelector(rule.selector + ":checked"));

                break;
                default:
                    // gọi function (is required hoặc is email) và truyền vào value của input
                    errorMessage = rules[i](inputElement.value);

            }
            
            // không có value => giá trị là undefined, câu if sẽ sai và không break, nếu có value thì thực hiện hàm luôn và break luôn
            if (errorMessage) break;
        }
        
        // errorMessage không phải undefined thì gán text của errorElement bằng giá trị của errorMessage và thêm class "invalid" cho thẻ cha của input (là form__group)
        if(errorMessage) {
            errorElement.innerText = errorMessage
            getParents(inputElement, options.formGroupSelector).classList.add('invalid');
        } else {
            errorElement.innerText = ""
            getParents(inputElement, options.formGroupSelector).classList.remove('invalid');
        }
        return !!errorMessage;

    }

    var formElement = document.querySelector(options.form);
    if (formElement) {
        // xử lý submmit form
        // chặn default của nút submit, lặp qua từng phần tử form để lấy dữ liệu và validate nếu không hợp lệ
        formElement.onsubmit = function(e) {
            e.preventDefault();

            var isFormValid = true;

            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);

                // isValid được gắn bằng giá trị của validate sau khi truyển inputElement
                // validate trả ra boolean, nếu là undefined => false (hai lần phủ định sẽ trả lại giá trị ban đầu)
                var isValid = validate(inputElement, rule)
                if (isValid){
                    isFormValid = false 
                }
            });

            // Nếu isFormValid true, log ra không lỗi
            if (isFormValid){
                // Gán enableInput bằng nodelist (same array nhưng không tương tác đước) của những element có attribute "name"
                var enableInput = formElement.querySelectorAll('[name]');    
                // Đổi enableInput thành array và dùng reduce với đối số truyền vào là values (kết quả) & input (phần tử hiện tại); giá trị khởi tạo của reduce là một Object
                var formValues = Array.from(enableInput).reduce(function(values, input) {
                    // Trả ra values là object với key là tên của phần tử (ở đây là input) và giá trị là value được lấy từ phần input
                    switch(input.type) {
                        case 'radio':
                            values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                            break;

                        case 'checkbox':
                            if (!input.matches(':checked')) {
                                values[input.name] = '';

                                return values;
                            };
                            if (!Array.isArray(values[input.name])) {
                                values[input.name] = [];
                            }
                            values[input.name].push(input.value);
                            break;
                        case 'file':
                            values[input.name] = input.files;
                            break;
                        default: 
                            values[input.name] = input.value;

                    }
                    return  values;
                
                }, {});
                console.log('Không có lỗi')
                if (typeof options.onSubmit === 'function'){

                    
                    options.onSubmit(formValues)
                }
            } 
            // Trường hợp submit với hành vi mặc định
            else {
                options.onSubmit(formValues);
                // formElement.submit();
            }
        }

        options.rules.forEach(function (rule) {

            //Lưu lại các rule cho mỗi input
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test)
            } else {
                selectorRules[rule.selector] = [rule.test]
            };

            var inputElements = formElement.querySelectorAll(rule.selector);

            Array.from(inputElements).forEach(function(inputElement){
                // Khi nhấp ra ngoài khỏi inputElement thì gọi hàm validate
                inputElement.onblur = function (){
                    // rule trong validate là Validator.isRequired hoặc Validator.isEmail
                    validate(inputElement, rule)
                }
                inputElement.oninput = function(){
                    var errorElement = getParents(inputElement, options.formGroupSelector).querySelector(options.errorSelector)

                    errorElement.innerText = ""
                    getParents(inputElement, options.formGroupSelector).classList.remove('invalid'); 
                }

            })

            // với inputElement
        });
    }
}


// Define rules
// nguyen tac cua rule:
// 1: khi co loi => tra ra message loi
// 2: khi hop le => khong tra ra cai gi ca (undefine)

// trả ra object gồn selector và function
Validator.isRequired = function (selector){ 
    return {

        // Key là Selector, giá trị của nó là agrument dược truyền vào
        selector: selector,

        // Trả ra một phương thức tên là test, truyền vào agrument "value"
        test: function (value){
            return value ? undefined : 'Vui lòng nhập trường này'
        }
    }
}

Validator.isEmail = function (selector){
    return {
        selector: selector,
        test: function (value){
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


Validator.isConfirmed = function (selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function (value){
            return value === getConfirmValue() ? undefined : message || 'Gía trị nhập vào không chính xác'
        }    
    }
}