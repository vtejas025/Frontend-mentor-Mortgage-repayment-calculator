let radioChoosen=null;
const firstSection=document.querySelector(".inputs");
const inputNumbers=document.querySelectorAll("input[type='number']");
let inputRadio=document.querySelector("input[name='radio']");
const inputText=document.querySelector("input[type='text']");
const sole=document.querySelector("#sole");
const form=document.querySelector("form");
const empty=document.querySelector(".empty");
const completed=document.querySelector(".completed");
const monthly=document.querySelector(".monthly");
const final=document.querySelector(".total");
const clear=document.querySelector("button[type='reset']");
clear.click();

function removeError(ele){

    const parent=ele.parentElement;
    const symbol=parent.querySelector(".symbol");
    const sibling=parent.nextElementSibling;

    if(parent && parent.classList.contains("error")){
        parent.classList.remove("error");
    }
    if(symbol && symbol.classList.contains("error")){
        symbol.classList.remove("error");
    }
    if(sibling && sibling.classList.contains("display")){
        sibling.classList.remove("display");
    }
}

function removeErrorRadio(){

    if(sole.classList.contains("display")){
        sole.classList.remove("display");
    }

}

function changeRadio(e){

    const radioButton=e.children[0];

    if(radioButton===radioChoosen){
        radioButton.checked=false;
        radioChoosen=null;
    }
    else{
        if(radioChoosen){
            radioChoosen.checked=false;
        }
        radioButton.checked=true;
        radioChoosen=radioButton;
    }

    removeErrorRadio();

}

function changeColor(ele){

    const input=ele.parentElement.querySelector("input");
    input.focus();

    removeError(ele);
}

function showError(ele){

    if(ele.getAttribute("type")==="number" || ele.getAttribute("type")==="text"){

        const parent=ele.parentElement;
        const symbol=parent.querySelector(".symbol");
        const sibling=parent.nextElementSibling;

        parent.classList.add("error");
        symbol.classList.add("error");
        sibling.classList.add("display");
    }
    else{
        ele.classList.add("display");
    }
}

function calculate(){

    let amount=Number(inputText.value.replaceAll(",",""));
    let term=null;
    let rate=null;

    inputNumbers.forEach(ele=>{
        if(ele.id==="term"){
            term=Number(ele.value);
        }
        if(ele.id==="rate"){
            rate=Number(ele.value);
        }
    });

    rate=rate/(12*100);
    term=term*12;
    let emi=null;
    let total=null;

    if(radioChoosen && radioChoosen.id==="repayment"){
        emi=amount*((rate * Math.pow(1+rate,term))/(Math.pow(1+rate,term)-1));
        total=emi*term;
    }
    else{
        emi=amount*rate;
        total=(emi*term)+amount;
    }

    emi=emi.toFixed(2);
    emi= new Intl.NumberFormat('en-US',{
        style: 'currency',
        currency: 'GBP'
    }).format(emi);

    total=total.toFixed(2);
    total= new Intl.NumberFormat('en-US',{
        style: 'currency',
        currency: 'GBP'
    }).format(total);

    monthly.textContent=emi;
    final.textContent=total;
}

function show(value){

    empty.classList.toggle("showNone",value);
    completed.classList.toggle("showAll",value);

}

firstSection.addEventListener("click",(e)=>{

    if(e.target.closest(".option")){
        const ele=e.target.closest(".option");
        changeRadio(ele);
    }
    if(e.target.closest(".symbol")){
        const ele=e.target.closest(".symbol");
        changeColor(ele);
    }
    if(e.target.closest("button[type='reset']")){
        show(false);
    }

});
firstSection.addEventListener("focusin",(e)=>{

    if(e.target.matches("input[type='number']")){
        removeError(e.target);
    }
    if(e.target.matches("input[type='text']")){
        removeError(e.target);
    }
    if(e.target.matches("input[type='radio']")){
        removeErrorRadio(e.target);
    }

});
inputText.addEventListener("focusin",()=>{

    if(inputText.value.trim()!==""){
        inputText.value=inputText.value.replaceAll(",","");
    }
});
inputText.addEventListener("focusout",()=>{

    if(inputText.value.trim()!==""){
        if(!isNaN(inputText.value)){
            inputText.value=Number(inputText.value).toLocaleString("en-US");
        }
    }
});
form.addEventListener("submit",(e)=>{
    e.preventDefault();

    if(!inputText.checkValidity()){
        showError(inputText);
    }
    inputNumbers.forEach(ele=>{
        if(!ele.checkValidity()){
            showError(ele);
        }
    });
    if(!inputRadio.checkValidity()){
        showError(sole);
    }
    if(form.checkValidity()){
        calculate();
        show(true);
    }
});