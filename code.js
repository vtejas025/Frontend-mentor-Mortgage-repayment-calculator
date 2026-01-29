let radio=document.querySelectorAll("input[type='radio']");
let unchecked=document.querySelector("input[type='radio']:checked");
if(unchecked){
    unchecked.checked=false;
}
let radioChecked=null;
radio.forEach(ele=>{
    ele.addEventListener("focus",()=>{
        if(unfilled.has(ele.name)){
            submit.previousElementSibling.remove();
            unfilled.delete(ele.name);
        }
        if(ele===radioChecked){
            ele.checked=false;
            radioChecked=null;
        }
        else{
            radioChecked=ele;
        }
    });
    ele.addEventListener("focusout",()=>{
        if(!ele.checked && ele.parentElement.classList.contains("color")){
            ele.parentElement.classList.remove("color");
        }
    });
});
let radioButton=document.querySelectorAll(".rgroup");
let radioButtonChecked=null;
radioButton.forEach(ele=>{
    let checked=ele.querySelector("input");
    if(checked.checked && !ele.classList.contains('color')){
        ele.classList.add("color");
    }
    ele.addEventListener("click",()=>{
        if(unfilled.has(ele.children[0].name)){
            submit.previousElementSibling.remove();
            unfilled.delete(ele.children[0].name);
        }
        if(radioButtonChecked===null){
            ele.classList.add('color');
            checked.checked=true;
            radioButtonChecked=ele;
        }
        else if(ele===radioButtonChecked){
            ele.classList.remove("color");
            checked.checked=false;
            radioButtonChecked=null;
        }
        else if(ele!==radioButtonChecked){
            radioButtonChecked.classList.remove("color");
            radioButtonChecked.checked=false;
            ele.classList.add("color");
            checked.checked=true;
            radioButtonChecked=ele;
        }
    })
});
function createp(){
    let p=document.createElement("p");
    p.style.color="red";
    p.style.marginBlock="0px";
    p.style.marginBlockEnd="1rem";
    p.textContent="This field is required";
    return p;
}
let input=document.querySelectorAll("input");
input.forEach(ele=>{
    if(ele.type==="text"){
        let box=ele.parentElement.querySelector(".box");
        ele.addEventListener("focus",()=>{
            if(unfilled.has(ele.id)){
                ele.parentElement.nextElementSibling.remove();
                ele.parentElement.classList.remove("error");
                box.classList.remove("error");
                unfilled.delete(ele.id);
            }
            ele.parentElement.classList.add("active");
            box.classList.add("active");
        });
        ele.addEventListener("focusout",()=>{
            ele.parentElement.classList.remove("active");
            box.classList.remove("active");
        });
    }
});
window.addEventListener("beforeunload",()=>{
    input.forEach(ele=>{
        if(ele.type==="text" && ele.value.trim()!==""){
            ele.value="";
        }
    })
});
let form=document.querySelector("form");
let empty=document.querySelector(".empty");
let complete=document.querySelector(".complete");
let hr=document.querySelector(".final hr");
function createp2(color,size,weight,margin,message){
    let p=document.createElement("p");
    p.style.color=color;
    p.style.fontSize=size;
    p.style.fontWeight=weight;
    p.style.marginBlock=margin;
    p.textContent=message;
    return p;
}
let flag=false;
form.addEventListener("submit",ele=>{
    ele.preventDefault();
    let term=Number(document.querySelector("#term").value);
    let rate=Number(document.querySelector("#rate").value);
    let amountObject=document.querySelector("#amount");
    amountObject.value=amountObject.value.replace(/,/g,"");
    let amount=Number(amountObject.value);
    amountObject.value=new Intl.NumberFormat('en-US').format(amountObject.value);
    empty.style.display="none";
    complete.style.display="block";  
    rate=rate/(12*100);
    term=term*12;
    let check=document.querySelector("input[type='radio']:checked");
    if(check.id==="repayment"){  
        let emi=amount*((rate * Math.pow(1+rate,term))/(Math.pow(1+rate,term)-1));
        let total=emi*term;
        emi=emi.toFixed(2);
        emi= new Intl.NumberFormat('en-US',{
            style: 'currency',
            currency: 'GBP'
        }).format(emi);
        total=total.toFixed(2);
        if(flag){
            hr.nextElementSibling.nextElementSibling.remove();
            hr.previousElementSibling.remove();
            flag=false;
        }
        hr.insertAdjacentElement("beforebegin",createp2("hsl(61, 70%, 52%)","2.5rem",500,"1rem",emi));
        total= new Intl.NumberFormat('en-US',{
            style: 'currency',
            currency: 'GBP'
        }).format(total);
        hr.nextElementSibling.insertAdjacentElement("afterend",createp2("white","1.5rem",500,"0.5rem",total));
        flag=true;
    }
    else{  
        let emi=amount*rate;
        let total=(emi*term)+amount;
        emi=emi.toFixed(2);
        emi= new Intl.NumberFormat('en-US',{
            style: 'currency',
            currency: 'GBP'
        }).format(emi);
        total=total.toFixed(2);
        if(flag){
            hr.nextElementSibling.nextElementSibling.remove();
            hr.previousElementSibling.remove();
            flag=false;
        }
        hr.insertAdjacentElement("beforebegin",createp2("hsl(61, 70%, 52%)","2.5rem",500,"1rem",emi));
        total= new Intl.NumberFormat('en-US',{
            style: 'currency',
            currency: 'GBP'
        }).format(total);
        hr.nextElementSibling.insertAdjacentElement("afterend",createp2("white","1.5rem",500,"0.5rem",total));
        flag=true;
    }
});
form.addEventListener("reset",()=>{
    let uncheck=document.querySelector("input[type='radio']:checked");
    requestAnimationFrame(() => {
        if(uncheck){
            uncheck.parentElement.classList.remove("color");
        }
    });
    if(flag){
        hr.nextElementSibling.nextElementSibling.remove();
        hr.previousElementSibling.remove();
        flag=false;
        empty.style.display="flex";
        empty.style.alignItems="center";
        complete.style.display="none";
    }
});
let unfilled=new Map();
let submit=document.querySelector("button[type='submit']");
submit.addEventListener("focus",()=>{
    input.forEach(ele=>{
        if(ele.type==="text" && ele.value.trim()==="" && !unfilled.has(ele.id)){
            let box=ele.parentElement.querySelector(".box");
            ele.parentElement.classList.add("error");
            box.classList.add("error");
            ele.parentElement.insertAdjacentElement("afterend",createp());
            unfilled.set(ele.id,true);
        }
        else if(ele.name==="group" && !unfilled.has(ele.name)){
            let check=document.querySelector("input[type='radio']:checked");
            if(!check){
                submit.insertAdjacentElement("beforebegin",createp());
                unfilled.set(ele.name,true);
            }
        }
    });
});
