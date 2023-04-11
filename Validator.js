

// Object Validator
function Validator (options){
    var formElement = document.querySelector(options.form);

    if (formElement) {
        options.rules.forEach(function (rule) {
            var inputElement = formElement.querySelector(rule.selector)
            var errorElement = inputElement.parentElement.querySelector('.form__message')

            if (inputElement){
                var errorMessage = rule.test(inputElement.value)

                inputElement.onblur = function (){
                    if(errorMessage) {
                        errorElement.innerText = "dsadfasdf"
                    }
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