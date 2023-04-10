

// Object Validator
function Validator (options){
    var formElement = document.querySelector(options.form);

    if (formElement) {
        options.rules.forEach(function (rule) {
            var inputElement = formElement.querySelector(rule.selector)

            if (inputElement){
                inputElement.onblur = function (){
                    // test func: lấy qua rule.test
                    // value: lấy qua inputElement.value
                
                    console.log(inputElement.value)
                    var errorMessage = rule.test(inputElement.value)
                    console.log(errorMessage)
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
        selector: selector,
        test: function (value){
            return value.trim() ? undefine : 'Vui long nhap truong nay'
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