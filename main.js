// Navigate to a specific URL
function navigateTo(url) {
  history.pushState(null, null, url);
  renderContent(url);
}
// HTML templates
function getHomePageTemplate() {
  return `
   <div id="content" >
      <div class="events flex items-center justify-center flex-wrap tb">
      </div>
    </div>
  `;
}

function getOrdersPageTemplate() {
  return `
    <div id="content">
    <h1 class="text-2xl mb-4 mt-8 text-center">Purchased Tickets</h1>
    <div class="order-row-primu">
        <div class="order-column-primu"><p>Name</p></div>
        <div class="order-column-primu">#Tickets</div>
        <div class="order-column-primu">Category</div>
        <div class="order-column-primu">Date</div>
        <div class="order-column-primu">Price</div>
      </div>
    </div>
    <div class="orders"></div>
  `;
}

function setupNavigationEvents() {
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const href = link.getAttribute('href');
      navigateTo(href);
    });
  });
}

function setupMobileMenuEvent() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

function setupPopstateEvent() {
  window.addEventListener('popstate', () => {
    const currentUrl = window.location.pathname;
    renderContent(currentUrl);
  });
}

function setupInitialPage() {
  const initialUrl = window.location.pathname;
  renderContent(initialUrl);
}


async function fetchEvents(){
  const response = await fetch('http://localhost:8080/api/getAllEvents', {mode:'cors'});
  const eventList = await response.json();
  console.log(response);
  console.log(eventList);
  return eventList;
}


async function renderHomePage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getHomePageTemplate();

  const eventList = await fetchEvents();

  eventList.forEach(event => {
    const image = addImage(event.eventName);
    const selectorID = event.eventID+'s';
    const numberID = event.eventID+'n';
    const ibtn = event.eventID+'i';
    const dbtn = event.eventID+'d';

    const ticketCategoryList = event.ticketCategory;
    const categoriesOptions = ticketCategoryList.map(tk =>
      ` <option>${tk.description} - ${tk.price}</option>`
      );

    const eventCard = document.createElement('div');
    eventCard.classList.add('event-card'); 
    const contentMarkup = `
      <header></header>
      <div class="event-card-content tb">
        <div class="event-card-image tb">
          <img class="event-image" src="${image}">
        </div>
      <div class="event-card-data tb">
        <h2 class="event-title font-bold tb">${event.eventName}</h2>
        <p class="description text-white tb">${event.eventDescription}</p>
        <p class="description text-white tb">${event.startDate.slice(0,10)}</p>
      </div>

      <div class="action-container tb">
      <div class="row tb">
        <p class="description text-white tb">Ticket category:</p>
        <select name="Select Category" class="ticket-selector" id="${selectorID}"> ${categoriesOptions.join('\n')} </select>
      </div>
      <div class="row tb">
        <p class="description text-white">Number of tickets:</p>
        
        <input class="ticket-number" type="number" id="${numberID}">
        <button class="increase-btn" id="${ibtn}"><i class="fa-solid fa-plus" style="background-color:#ffffff00"></i></button>
        <button class="decrease-btn" id="${dbtn}"><i class="fa-solid fa-minus" style="background-color:#ffffff00"></i></button>
        
      </div>
      
      <div class="row tb">
        <button class="text-white buy" id="${event.eventID}" >Buy now!</button> 
      </div>
      </div>
      </div>
    `;

    eventCard.innerHTML = contentMarkup;
    const eventsContainer = document.querySelector('.events');
    eventsContainer.appendChild(eventCard);
    
    const buy_btn = document.getElementById(event.eventID);
    const numberInput = document.getElementById(numberID);
    numberInput.min = 0;
    numberInput.value = 0;
    buy_btn.disabled = true;  

    increaseTicketNumber(numberInput, ibtn, buy_btn);
    decreaseTicketNumber(numberInput, dbtn, buy_btn);

    numberInput.addEventListener('input', ()=>{
      const quantity = parseInt(numberInput.value);
      if(quantity > 0)
        buy_btn.disabled = false;
      else
        buy_btn.disabled = true;  
    });
    
    buy_btn.addEventListener("click",function(){
        fetch('http://localhost:8080/api/placeOrder', 
        {
          mode:'cors',
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body:JSON.stringify({
            eventID: event.eventID,
            ticketCategoryDescription: document.getElementById(selectorID).value.replace(/[^a-zA-Z]/g, ''),
            numberOfTickets: document.getElementById(numberID).value
          })
        });
        numberInput.value=0;
        buy_btn.disabled = true;
        toastr.success("Order placed!");
        
    }, false);
  });
}
function increaseTicketNumber(numberInput, ibtn, buy_btn){
  const increaseButton = document.getElementById(ibtn);
    increaseButton.addEventListener('click', () =>{
      numberInput.value++;
      buy_btn.disabled = false;
    });
}
function decreaseTicketNumber(numberInput, dbtn, buy_btn){
  const decreaseButton = document.getElementById(dbtn);
    decreaseButton.addEventListener('click', () =>{
      if(numberInput.value > 0)
        numberInput.value --;
      if(numberInput.value == 0)
      buy_btn.disabled = true;
    });
}

//coding monkey style
function addImage(eventName){
  if(eventName == "Electric Castle")
    var imageUrl = "https://happ.ro/wp-content/uploads/2023/07/electric-castle-2023-1.jpg";
  if(eventName == "Untold")
    var imageUrl = "https://weraveyou.com/wp-content/uploads/2023/03/UNTOLD.jpeg";
  if(eventName == "Meci de fotbal")
    var imageUrl = "https://www.basic-fit.com/dw/image/v2/BDFP_PRD/on/demandware.static/-/Library-Sites-basic-fit-shared-library/default/dw5927c613/Roots/Blog/Blog-Header/528x352/19-03-Blog-Fitness-Training-Football-Soccer.jpg?sw=600";
  if(eventName == "Wine Festival")
    var imageUrl = "https://www.northeastchartertour.com/wp-content/uploads/2017/11/Wine-Festival.jpg";
  if(eventName == "SYF")
    var imageUrl = "https://timponline.ro/wp-content/uploads/2018/08/festival-singeorz.jpg";
  return imageUrl;
}

async function fetchOrders(){
  const response = await fetch('http://localhost:8080/api/getAllOrders', {mode:'cors'});
  const orderList = await response.json();
  console.log(orderList);
  return orderList;
}
async function renderOrdersPage(categories) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getOrdersPageTemplate();

  const orderData = await fetchOrders();
  const orderList = orderData.reverse();

  orderList.forEach(order => {

    //coding monkey style la greu :))
    let secodDescription = 'VIP';
    if(secodDescription == order.ticketCategoryDTO.description){
       secodDescription = 'Standard';
    }else{
       secodDescription = 'VIP';
    }
    const deleteID = order.orderID+'d';
    const editID = order.orderID+'e';
    const inputID = order.orderID+'i';
    const selectID = order.orderID+'s';
    const iconID = order.orderID+'ii';
    const trashID = order.orderID+'t';

    const orderCard = document.createElement('div');
    orderCard.classList.add('order-card'); 
    const orderMarkup = `
    <div class="order-row tb">
      <div class="order-column tb">${order.eventName}</div>
      <div class="order-column tb"><input class="order-column" placeholder="${order.nrTickets}" id="${inputID}" disabled/></div>
      <div class="order-column tb">
        <select id="${selectID}"disabled>
          <option>${order.ticketCategoryDTO.description}</option>
          <option>${secodDescription}</option>
        </select> 
      </div>
      <div class="order-column tb">Date</div>
      <div class="order-column tb">${order.price} $</div>
    </div>
    <div class="order-buttons">
      <button class="edit-button tb" id="${editID}"><i id="${iconID}" class="fa-solid fa-pen" style="background-color:#ffffff00;"></i></button>
      <button class="delete-button tb" id="${deleteID}"><i id="${trashID}" class="fa-solid fa-trash-can" style="color: #fffffff;background-color:#ffffff00;"></i></button>
    </div>
    `;
    
    orderCard.innerHTML = orderMarkup;
    const orderContainer = document.querySelector('.orders');
    orderContainer.appendChild(orderCard);

    //coding monkey style ?
    const deleteButton = document.getElementById(deleteID);
    const nrTicketOrder = document.getElementById(inputID);
    const ticketCategoryOrder = document.getElementById(selectID);
    const editButton = document.getElementById(editID);
    const icon = document.getElementById(iconID);
    const trash = document.getElementById(trashID);
    
    editButton.addEventListener('click', ()=>{
    nrTicketOrder.disabled = !nrTicketOrder.disabled;
    ticketCategoryOrder.disabled = !ticketCategoryOrder.disabled;
    ticketCategoryOrder.classList.toggle('active');
    nrTicketOrder.classList.toggle('active');
      
    if(!nrTicketOrder.disabled){
      icon.classList.remove('fa-pen');
      icon.classList.toggle('fa-check');

      trash.classList.remove('fa-trash-can');
      trash.classList.toggle('fa-xmark');

      deleteButton.addEventListener('click', ()=>{
        icon.classList.remove('fa-check');
        icon.classList.toggle('fa-pen');
        nrTicketOrder.disabled = !nrTicketOrder.disabled;
        ticketCategoryOrder.disabled = !ticketCategoryOrder.disabled;
        ticketCategoryOrder.classList.remove('active');
        nrTicketOrder.classList.remove('active');
        trash.classList.toggle('fa-trash-can');
        trash.classList.remove('fa-xmark');
      });
    }else{
      icon.classList.remove('fa-check');
      icon.classList.toggle('fa-pen');
      fetch('http://localhost:8080/api/patchOrder', 
      {
        mode:'cors',
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body:JSON.stringify({
          orderID: order.orderID,
          ticketCategoryDescription: document.getElementById(selectID).value.replace(/[^a-zA-Z]/g, ''),
          nrTickets: document.getElementById(inputID).value
        })
      });
      location.reload();
      }    
    });
    
    deleteButton.addEventListener('click', ()=>{
      if(nrTicketOrder.disabled){
      fetch('http://localhost:8080/api/deleteOrder/'+ order.orderID ,{  
        mode: 'cors',
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      });
      //coding monkey style ?
      location.reload();
      }
    });
  });
}

// Render content based on URL
function renderContent(url) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = '';

  if (url === '/') {
    renderHomePage();
  } else if (url === '/orders') {
    renderOrdersPage()
  }
}

// Call the setup functions
setupNavigationEvents();
setupMobileMenuEvent();
setupPopstateEvent();
setupInitialPage();
