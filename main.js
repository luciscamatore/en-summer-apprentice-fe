import * as eveniment from "./event-functions.js";
import * as comanda from "./order-functions.js";

$(window).load(function() {
  setTimeout(function() {
    $('body').addClass('loaded');
  }, 200);
});


// Navigate to a specific URL
function navigateTo(url) {
  history.pushState(null, null, url);
  renderContent(url);
}

// HTML templates
function getHomePageTemplate(eventList) {
  //coding monkey style?
  let eventTypeOptions = '';
  let venueOptions = '';
  let venueList = new Array();
  let typeList = new Array();
  eventList.forEach(event =>{
    venueList.push(event.venue.location);
    typeList.push(event.eventType);
  });
  let newVenue = [...new Set(venueList)];
  newVenue.forEach(venueElem =>{
    venueOptions = venueOptions + ` <option>${venueElem}</option>` + '\n';
  });
  let newType = [...new Set(typeList)];
  newType.forEach(typeElem =>{
    eventTypeOptions = eventTypeOptions + ` <option>${typeElem}</option>` + '\n';
  });

  const markup= `
  <div class="search-filter">
    <div class="sf-row">
      <input type="text" placeholder="Search &#x1F50D;" spellcheck="false" id="sbar">
      <button class="filter-btn" id="fbtn"><i class="fa-solid fa-filter" id="filter-icon"></i></button>
    </div>
    <div class="sf-row-select">
      <div class="select-holder">
        <select style="margin-bottom: 5%" id="filter-select-location">
          <option value="location" selected disabled>Location</option>
          ${venueOptions}
        </select>
        <select style="" id="filter-select-type">
          <option value="type" selected disabled>Type</option>
          ${eventTypeOptions}
        </select>
      </div>
      <div class="button-holder">
        <button class="apply-filter-btn" id="fabtn" style="margin-bottom: 15%" disabled><i class="fa-solid fa-check" id="filter-icon"></i></button>
        <button class="apply-filter-btn" id="faabtn" disabled><i class="fa-solid fa-trash-can" id="filter-icon"></i></button>
      </div>
      
    </div>
  </div>
   <div id="content" >
      <div class="events flex items-center justify-center flex-wrap tb">
      </div>
    </div>
  `;
  return markup;
}

function getOrdersPageTemplate() {
  return `
    <div id="content">
    <h1 class="text-2xl mb-4 mt-8 text-center">Purchased Tickets</h1>
    <div class="order-row-primu">
        <div class="order-column-primu">
          Name
          <buttton class="order-sort-button" style="margin-left: 10%" id="order-name-sort"><i id="namei" class="fa-solid fa-arrow-up-a-z" style="color: #de411b;"></i></button>
        </div>
        <div class="order-column-primu">
          #Tickets
          <buttton class="order-sort-button" style="margin-left: 10%" id="order-ticket-sort"><i id="tki" class="fa-solid fa-arrow-up-1-9" style="color: #de411b;"></i></button>
        </div>
        <div class="order-column-primu">
          Category
          <buttton class="order-sort-button" style="margin-left: 10%" id="order-cat-sort"><i id="cati" class="fa-solid fa-arrow-up-a-z" style="color: #de411b;"></i></button>  
        </div>
        <div class="order-column-primu">
          Date
          <buttton class="order-sort-button" style="margin-left: 10%" id="order-date-sort"><i id="datei" class="fa-solid fa-arrow-up-a-z" style="color: #de411b;"></i></button>
          </div>
        <div class="order-column-primu">
          Price
          <buttton class="order-sort-button" style="margin-left: 10%" id="order-price-sort"><i id="pricei" class="fa-solid fa-arrow-up-1-9" style="color: #de411b;"></i></button>
        </div>
      </div>
    </div>
    <div class="orders"></div>
  `;
}

/* 
 /$$$$$$$$ /$$    /$$ /$$$$$$$$ /$$   /$$ /$$$$$$$$ /$$$$$$ 
| $$_____/| $$   | $$| $$_____/| $$$ | $$|__  $$__//$$__  $$
| $$      | $$   | $$| $$      | $$$$| $$   | $$  | $$  \__/
| $$$$$   |  $$ / $$/| $$$$$   | $$ $$ $$   | $$  |  $$$$$$ 
| $$__/    \  $$ $$/ | $$__/   | $$  $$$$   | $$   \____  $$
| $$        \  $$$/  | $$      | $$\  $$$   | $$   /$$  \ $$
| $$$$$$$$   \  $/   | $$$$$$$$| $$ \  $$   | $$  |  $$$$$$/
|________/    \_/    |________/|__/  \__/   |__/   \______/ 
                                    
*/

let vlocation  ='';
let type ='';
async function apllyFilters(){
  const filterApplyButton = document.getElementById('fabtn');
  const filterClearButton = document.getElementById('faabtn');
  const filterOptionsLocation = document.getElementById('filter-select-location');
  const filterOptionsType = document.getElementById('filter-select-type');

  filterApplyButton.addEventListener('click', async () =>{
    filterApplyButton.disabled = true;
    filterClearButton.disabled = true;
    filterApplyButton.classList.toggle('visible');
    filterOptionsLocation.classList.toggle('visible');
    filterOptionsType.classList.toggle('visible');
    filterClearButton.classList.toggle('visible');
    vlocation = filterOptionsLocation.value;
    type = filterOptionsType.value;
    
    const eventList = await fetchEvents(vlocation, type);
    eveniment.addEvents(eventList);
    
  });
  filterClearButton.addEventListener('click', async () =>{
    vlocation = '';
    type = '';
    filterOptionsLocation.value = 'location';
    filterOptionsType.value = 'type';
    const eventList = await fetchEvents(vlocation, type);
    eveniment.addEvents(eventList);
  });
}
async function fetchEvents(vlocation, type){
  let response = '';
  if(vlocation == '' && type == ''){
    response = await fetch('http://localhost:8080/api/getAllEvents', {mode:'cors'});
  }else{
    response = await fetch('http://localhost:8080/api/getEventsByFilter/'+ vlocation + '/' + type, 
    {mode: 'cors',
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"}
      });
    }

  const eventsList = await response.json();

  return eventsList;
}

async function renderHomePage() {
  const eventList = await fetchEvents(vlocation, type);

  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getHomePageTemplate(eventList);
  

  eveniment.setUpFilterEvent(eventList);
  eveniment.filterButtonEvents();
  apllyFilters();

  eventList.forEach(event => {
    eveniment.createEventCard(event);
  });
}

/* 
  /$$$$$$  /$$$$$$$  /$$$$$$$  /$$$$$$$$ /$$$$$$$   /$$$$$$ 
 /$$__  $$| $$__  $$| $$__  $$| $$_____/| $$__  $$ /$$__  $$
| $$  \ $$| $$  \ $$| $$  \ $$| $$      | $$  \ $$| $$  \__/
| $$  | $$| $$$$$$$/| $$  | $$| $$$$$   | $$$$$$$/|  $$$$$$ 
| $$  | $$| $$__  $$| $$  | $$| $$__/   | $$__  $$ \____  $$
| $$  | $$| $$  \ $$| $$  | $$| $$      | $$  \ $$ /$$  \ $$
|  $$$$$$/| $$  | $$| $$$$$$$/| $$$$$$$$| $$  | $$|  $$$$$$/
 \______/ |__/  |__/|_______/ |________/|__/  |__/ \______/ 
*/


async function fetchOrders(){
  const customerID = sessionStorage.getItem('customerID');
  const response = await fetch('http://localhost:8080/api/orderByID/' + customerID, {mode:'cors'});
  const orderList = await response.json();
  return orderList;
}
async function renderOrdersPage(categories) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getOrdersPageTemplate();
  
  const orderData = await fetchOrders();
  const orderList = orderData.reverse();

  comanda.sortOrders(orderList);

  orderList.forEach(order => {
    comanda.createOrderCard(order);
    comanda.deleteOrderHnadler(order, orderList);
    comanda.patchOrderHandler(order, orderList);
  });
}
function renderLoginPage(){
  const mainContentDiv = document.querySelector('.login-main-content-component');
  mainContentDiv.innerHTML = `
  <div class="container tb">
  <div class="column tb"></div>
  <div class="column tb">
    <div class="login-container tb">
      <div class="row tb">
        <p class="tb" style="margin-top: 10%;">Login</p></div>
      <div class="row tb">
        <p class="input-text tb">Email</p>	
        <input placeholder="email"></div>
      <div class="row tb">
        <p class="input-text tb">Password</p>	
        <input placeholder="password" type="password"></div>
      <div class="row tb">
        <button>Login</button></div>
    </div>
  </div>
  <div class="column tb"></div>
</div>
  `;
}
// Render content based on URL
function renderContent(url) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = '';

  if (url === '/') {
    location.href = 'http://localhost:5173/login.html';
  }else if(url === '/home'){
    renderHomePage();
  }else if (url === '/orders') {
    renderOrdersPage()
  }
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
// Call the setup functions
setupNavigationEvents();
setupMobileMenuEvent();
setupPopstateEvent();
setupInitialPage();
