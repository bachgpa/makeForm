

// Object Validator
function Validator (options){
    var formElement = document.querySelector(options.form);

    if (formElement) {
        options.rules.forEach( function(rule) {
            var inputElement = formElement.querySelector(rule.selector)
            console.log(inputElement)
        });
    }
}


// Define rules
Validator.isRequired = function (){
    return 1
    
}

Validator.isEmail = function (){
    
}