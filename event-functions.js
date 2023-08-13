export const addEvents = (events) => {
  const eventsDiv = document.querySelector('.events');
  eventsDiv.innerHTML = 'No events available';

  if(events.length){
    eventsDiv.innerHTML = '';
    events.forEach((eventElem) => {
      createEventCard(eventElem); //if it works dont touch it
    });
  }
}
export function createEventCard(event){
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
            customerID: sessionStorage.getItem('customerID'),
            eventID: event.eventID,
            ticketCategoryDescription: document.getElementById(selectorID).value.replace(/[^a-zA-Z]/g, ''),
            numberOfTickets: document.getElementById(numberID).value
          })
        });
        numberInput.value=0;
        buy_btn.disabled = true;
        toastr.success("Order placed!");
        
    }, false);
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

export function filterButtonEvents(){
    const filterButton = document.getElementById('fbtn');
    const filterApplyButton = document.getElementById('fabtn');
    const filterClearButton = document.getElementById('faabtn');
    const filterOptionsLocation = document.getElementById('filter-select-location');
    const filterOptionsType = document.getElementById('filter-select-type');
    const filterIcon = document.getElementById('filter-icon');
  
    filterButton.addEventListener('click', () =>{
      filterApplyButton.disabled = false;
      filterClearButton.disabled = false;
      filterApplyButton.classList.toggle('visible');
      filterOptionsLocation.classList.toggle('visible');
      filterOptionsType.classList.toggle('visible');
      filterClearButton.classList.toggle('visible');
    });
  }

function liverSearch(eventList){
    const searchInput = document.getElementById('sbar');
    if(searchInput){
      const searchValue = searchInput.value;
      if(searchValue != undefined){
        const filteredEvents = eventList.filter((event) => event.eventName.toLowerCase().includes(searchValue.toLowerCase()));
        addEvents(filteredEvents);
      }
    }
  }
export function setUpFilterEvent(eventList){
    const searchBarInput = document.getElementById('sbar');
    if(searchBarInput){
      searchBarInput.addEventListener('keyup', () =>{
        setTimeout(liverSearch(eventList), 300);
      });
    }
  }
  