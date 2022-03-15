
const template = document.createElement('template');
template.innerHTML = `


<link rel="stylesheet" href="/public/css/cards.css">

<div class="card">

        <div class="icon-green">
            <p>PRONTA CONSEGNA</p>
        </div>
        <div class="icon-red">
            <p>SUPER OFFERTA</p>
        </div>
        <div class="icon-grey">
            <p>NON DISPONIBILE</p>
        </div>

    <div class="img">
        <img src=""> </img>
    </div>
    <div class=text>
        <h3 class="title"></h3>
        <img class="heart-icon" src="/public/img/empty-heart-icon.jpeg" />
        <p class="equip"></p>
        <div class="price-container">
            <p class="value">€</p>
            <h1 class="price"></h1>
            <p class="mese">mese</p>
        </div>
    </div>
    <div class="button"> <button>SCOPRI I DETTAGLI</button> </div> 
</div>
`;

class CardElement extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' }); 
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.shadowRoot.querySelector('img').src = this.getAttribute('photo');
        this.shadowRoot.querySelector('.title').innerHTML = this.getAttribute('title');
        this.shadowRoot.querySelector('.equip').innerHTML = this.getAttribute('equip');
        this.shadowRoot.querySelector('.price').innerHTML = this.getAttribute('price');
        const heartIcon = this.shadowRoot.querySelector('.heart-icon');

        if(this.getAttribute('delivery') == "false"){
            this.shadowRoot.querySelector('.icon-green').remove();
            this.shadowRoot.querySelector('.icon-red').style.top = "20px";           
        }
        if(this.getAttribute('isOffer') == "false"){
            this.shadowRoot.querySelector('.icon-red').remove();
        }
        if(this.getAttribute('available') == "true"){
            this.shadowRoot.querySelector('.icon-grey').remove();
        }
        if(this.getAttribute('favorites') === "true"){
            heartIcon.src= "/public/img/heart-icon.jpeg";
        }


        heartIcon.addEventListener('click', async () => { 
            let id = this.getAttribute('_id'); 

            const result = await fetch('/favorites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id })
            }).then((res) => res.json())

            
           if(result.status === 'ok'){
                if(result.data.favorites == "true"){
                    heartIcon.src= "/public/img/heart-icon.jpeg";
                }else{
                    heartIcon.src="/public/img/empty-heart-icon.jpeg";
                }
                console.log(result.data);
            }else{
                alert("Login required for this operation");
                location.assign('/login');
                console.log(error); 
            }
        })
    }
    
}

customElements.define('card-element', CardElement);