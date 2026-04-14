let radioChoosen=null;
const firstSection=document.querySelector(".inputs");
const inputNumbers=document.querySelectorAll(".form-field__input");
const inputAmount=document.querySelector(".amount");
const formatted=document.querySelector(".form-field__formatted");
const lastError=document.querySelector(".lastErrorText");
const form=document.querySelector("form");
const empty=document.querySelector(".empty");
const completed=document.querySelector(".completed");
const monthly=document.querySelector(".monthly");
const final=document.querySelector(".total");
const clear=document.querySelector(".reset");
if(clear){
    window.addEventListener("load", () => {
        clear.click();
    });
}
function formatInputAmount(){
    if(formatted && inputAmount){

        if(inputAmount.validity.badInput){
            formatted.classList.toggle("visible",true);
            inputAmount.classList.toggle("notVisible",true);

            formatted.textContent="Enter a valid amount";
        }
        else if(inputAmount.validity.valueMissing){
            formatted.classList.toggle("visible",false);
            inputAmount.classList.toggle("notVisible",false);
        }
        else if(inputAmount.validity.valid){
            const parsed=Number(inputAmount.value.trim());

            formatted.classList.toggle("visible",true);
            inputAmount.classList.toggle("notVisible",true);

            formatted.textContent=new Intl.NumberFormat('en-US').format(parsed);
        }
           
    }
}
function removeError(ele){

    const parent=ele.parentElement;
    const symbol=parent.querySelector(".symbol");
    const sibling=parent.nextElementSibling;

    if(parent && parent.classList.contains("error")){
        parent.classList.remove("error");
        parent.classList.remove("noMargin");
    }
    if(symbol && symbol.classList.contains("error")){
        symbol.classList.remove("error");
    }
    if(sibling && sibling.classList.contains("display")){
        sibling.classList.remove("display");
    }
}

function removeErrorRadio(){

    if(lastError && lastError.classList.contains("display")){
        lastError.classList.remove("display");
        lastError.classList.remove("addMargin");
        if(lastError.parentElement){
            lastError.parentElement.classList.remove("noMargin");
        }
    }

}
function changeRadio(ele){

    const parent=ele.parentElement;
    if(radioChoosen === ele){
        radioChoosen.checked=false;
        radioChoosen=null;
        if(parent){
            parent.classList.toggle("colorChange",false);
        }    
    }
    else{
        if(radioChoosen){
            radioChoosen.parentElement.classList.toggle("colorChange",false);
        }
        radioChoosen=ele;
        if(parent){
            parent.classList.toggle("colorChange",true);
        }
    }

    removeErrorRadio();

}

function changeColor(ele){

    const input=ele.parentElement.querySelector("input");
    if(input) input.focus();

    removeError(ele);
}

function showError(ele){

    let parent=null;

    if(ele.getAttribute("type")==="number"){

        if(ele.id === "amount"){
            parent=ele?.parentElement?.parentElement;
        }
        else{
            parent=ele?.parentElement;
        }

        const symbol=parent.querySelector(".symbol");
        const sibling=parent.nextElementSibling;

        parent?.classList.add("error");
        parent?.classList.add("noMargin");
        symbol?.classList.add("error");
        sibling?.classList.add("display");
    }
    else{

        parent=ele?.parentElement;
        parent?.classList.add("noMargin");
        ele?.classList.add("display");
        ele?.classList.add("addMargin");
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

    if(amount <= 0 || rate <= 0 || term <= 0){
        if(monthly) monthly.textContent="£0.00";
        if(final) final.textContent="£0.00";
        return
    }
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

    if(monthly) monthly.textContent=emi;
    if(final) final.textContent=total;
}

function show(value){

    if(empty){
        empty.classList.toggle("showNone",value);
    }
    if(completed){
        completed.classList.toggle("showAll",value);
    }

}
if(firstSection){
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

        if(e.target.matches(".form-field__input")){
            let ele=null;

            if(e.target.id === "amount"){
                if(formatted && inputAmount){
                    formatted.classList.toggle("visible",false);
                    inputAmount.classList.toggle("notVisible",false);
                }
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
}
else{
    console.warn("element not found — handlers not attached");
}
if(inputAmount){
    inputAmount.addEventListener("focusout",formatInputAmount);
}
if(form){
    form.addEventListener("submit",(e)=>{
        e.preventDefault();

        inputNumbers.forEach(ele=>{
            if(!ele.checkValidity()){
                showError(ele);
            }
        });

        const checked = form.querySelector('input[name="calculationType"]:checked');
        const radioGroupValue = checked ? checked.value : null;

        if(!radioGroupValue){
            if(lastError){
                showError(lastError);
            }
        }
        if(form.checkValidity() && radioGroupValue){
            calculate();
            show(true);
        }
    });
    form.addEventListener("reset",()=>{
        if(formatted){
            formatted.textContent="";
        }
        if(radioChoosen){
            radioChoosen.parentElement.classList.remove("colorChange");
            radioChoosen=null;
        }
    });
}
else{
    console.warn("element not found — handlers not attached");
}
