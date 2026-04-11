let radioChoosen=null;
const firstSection=document.querySelector(".inputs");
const inputNumbers=document.querySelectorAll(".numberInput");
const inputAmount=document.querySelector(".amount");
const formatted=document.querySelector(".formatted");
const sole=document.querySelector("#sole");
const form=document.querySelector("form");
const empty=document.querySelector(".empty");
const completed=document.querySelector(".completed");
const monthly=document.querySelector(".monthly");
const final=document.querySelector(".total");
const clear=document.querySelector(".reset");
clear.click();
function formatInputAmount(){
    if(inputAmount.value.trim()!==""){
        formatted.classList.toggle("show",true);
        inputAmount.classList.toggle("show",true);

        const num=inputAmount.value;
        formatted.textContent=new Intl.NumberFormat('en-US').format(num);
    }
    else{
        formatted.classList.toggle("show",false);
        inputAmount.classList.toggle("show",false);
    }
}
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

function changeRadio(ele){

    if(radioChoosen === ele){
        radioChoosen.checked=false;
        radioChoosen=null;
    }

    removeErrorRadio();

}

function changeColor(ele){

    const input=ele.parentElement.querySelector("input");
    input.focus();

    removeError(ele);
}

function showError(ele){

    if(ele.getAttribute("type")==="number"){

        let parent=null;
        if(ele.id === "amount"){
            parent=ele.parentElement.parentElement;
        }
        else{
            parent=ele.parentElement;
        }

        const symbol=parent.querySelector(".symbol");
        const sibling=parent.nextElementSibling;

        parent.classList.add("error");
        symbol.classList.add("error");

        if(sibling){
            sibling.classList.add("display");
        }
    }
    else{
        ele.classList.add("display");
    }
}

function calculate(){

    const amount=Number(inputAmount.value);
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

    emi=Number(emi.toFixed(2));
    emi= new Intl.NumberFormat('en-US',{
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2
    }).format(emi);

    total=total.toFixed(2);
    total= new Intl.NumberFormat('en-US',{
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2
    }).format(total);

    monthly.textContent=emi;
    final.textContent=total;
}

function show(value){

    empty.classList.toggle("showNone",value);
    completed.classList.toggle("showAll",value);

}
firstSection.addEventListener("change",(e)=>{
    if(e.target.matches("input[type='radio']")){
        radioChoosen=e.target;
    }
});
firstSection.addEventListener("click",(e)=>{

    if(e.target.matches("input[type='radio']")){
        changeRadio(e.target);
    }
    if(e.target.closest(".symbol")){
        const ele=e.target.closest(".symbol");
        changeColor(ele);
    }
    if(e.target.closest(".reset")){
        show(false);
    }

});
firstSection.addEventListener("focusin",(e)=>{

    if(e.target.matches(".numberInput")){
        let ele=null;

        if(e.target.id === "amount"){
            formatted.classList.toggle("show",false);
            inputAmount.classList.toggle("show",false);
            ele=e.target.parentElement;
            removeError(ele);
        }
        else{
            removeError(e.target);
        }
    }
    if(e.target.matches("input[type='radio']")){
        removeErrorRadio(e.target);
    }

});
inputAmount.addEventListener("focusout",formatInputAmount);
form.addEventListener("submit",(e)=>{
    e.preventDefault();

    inputNumbers.forEach(ele=>{
        if(!ele.checkValidity()){
            showError(ele);
        }
    });

    const radioGroup = form.elements['radio'];
    const radioGroupValue=radioGroup.value;

    if(!radioGroupValue){
        showError(sole);
    }
    if(form.checkValidity() && radioGroupValue){
        calculate();
        show(true);
    }
});