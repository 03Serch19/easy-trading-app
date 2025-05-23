import STRIPE_KEYS from "./stripe-keysobtenidas.js"

Promise.all([STRIPE_KEYS.getPublic(),STRIPE_KEYS.getSecret()])
.then(([publicc,secret])=>{
    console.log(publicc)
    console.log(secret) 
    execute(secret,publicc)
})
function execute(secret,publicc){
const d=document,
$frutas=d.getElementById("frutas"),
$template=d.getElementById("fruta-template").content,
$fragment=d.createDocumentFragment(),
fetchOptions={
    headers:{
        Authorization: `Bearer ${secret}`
    }
}
let products,prices
const moneyFormat=(num)=>`$${num.slice(0,-2)}.${num.slice(-2)}`

Promise.all([ 
    fetch("https://api.stripe.com/v1/products",fetchOptions),
    fetch("https://api.stripe.com/v1/prices",fetchOptions)
])
.then(responses=>Promise.all(responses.map(res=>(res.ok)?res.json():Promise.reject(res))))
.then(json=>{
    //console.log(json)
    products=json[0].data
    prices=json[1].data
    console.log(products,prices)
    prices.forEach(el => {
        let productData=products.filter(pro=>pro.id===el.product)
        console.log(productData)
        $template.querySelector(".fruta").setAttribute("data-price",el.id)
        $template.querySelector("img").src=productData[0].images[0]
        $template.querySelector("img").alt=productData[0].name
        $template.querySelector("figcaption").innerHTML=
        `${productData[0].name}
        <br>
        ${moneyFormat(el.unit_amount_decimal)} ${el.currency}`

        let $clone=d.importNode($template,true)
        $fragment.appendChild($clone)
    })
    $frutas.appendChild($fragment)
})
.catch(err=>{
    console.log(err)
    let message=err.statusText||"Ocurrio un error al conectarse con la API de Stripe"
    $frutas.innerHTML=`<p>Error ${err.status}:${message}</p>`
})
d.addEventListener("click",(e)=>{
    if(e.target.matches(".fruta *")){
        //console.log(e.target)
       // alert("fruta")
       let price=e.target.parentElement.getAttribute("data-price")
      // console.log(price)
      Stripe(publicc)
      .redirectToCheckout({
        lineItems:[{price,quantity:1}],
        mode:"subscription",
        successUrl:"http://127.0.0.1:5500/assets/stripe-success.html",
        cancelUrl:"http://127.0.0.1:5500/assets/stripe-cancel.html"
      })
      .then(res=>{
        console.log(res)
        if(res.error){
            $frutas.insertAdjacentHTML("afterend",res.error.message)
        }
      })
    }
})
}