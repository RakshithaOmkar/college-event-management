const eventForm = document.getElementById("eventForm");
const eventList = document.getElementById("eventList");
const search = document.getElementById("search");
const filterStatus = document.getElementById("filterStatus");

let events = JSON.parse(localStorage.getItem("events")) || [];
let editId = null;

function saveEvents() {
  localStorage.setItem("events", JSON.stringify(events));
}

function getStatus(date) {
  const today = new Date().setHours(0,0,0,0);
  const eventDate = new Date(date).setHours(0,0,0,0);

  if (eventDate > today) return "Upcoming";
  if (eventDate === today) return "Ongoing";
  return "Completed";
}

function updateDashboard() {
  upcomingCount.textContent = events.filter(e => e.status === "Upcoming").length;
  ongoingCount.textContent = events.filter(e => e.status === "Ongoing").length;
  completedCount.textContent = events.filter(e => e.status === "Completed").length;
}

function renderEvents() {
  eventList.innerHTML = "";

  let filtered = events.filter(e => {
    const textMatch =
      e.title.toLowerCase().includes(search.value.toLowerCase()) ||
      e.club.toLowerCase().includes(search.value.toLowerCase());
    const statusMatch =
      filterStatus.value === "All" || e.status === filterStatus.value;
    return textMatch && statusMatch;
  });

  filtered.forEach(event => {
    const card = document.createElement("div");
    card.className = "event-card";

    card.innerHTML = `
      <span class="badge ${event.status}">${event.status}</span>
      <h3>${event.title}</h3>
      <p><strong>Club:</strong> ${event.club}</p>
      <p><strong>Date:</strong> ${event.date}</p>
      <p><strong>Venue:</strong> ${event.venue}</p>
      <p><strong>Participants:</strong> ${event.participants || 0}</p>
      <div class="actions">
        <button class="edit" onclick="editEvent(${event.id})">Edit</button>
        <button class="delete" onclick="deleteEvent(${event.id})">Delete</button>
      </div>
    `;

    eventList.appendChild(card);
  });

  updateDashboard();
}

eventForm.addEventListener("submit", e => {
  e.preventDefault();

  const status = getStatus(date.value);

  const data = {
    id: editId || Date.now(),
    title: title.value,
    club: club.value,
    date: date.value,
    venue: venue.value,
    participants: participants.value || 0,
    status
  };

  if (editId) {
    events = events.map(e => e.id === editId ? data : e);
    editId = null;
  } else {
    events.push(data);
  }

  saveEvents();
  renderEvents();
  eventForm.reset();
});

function editEvent(id) {
  const event = events.find(e => e.id === id);
  title.value = event.title;
  club.value = event.club;
  date.value = event.date;
  venue.value = event.venue;
  participants.value = event.participants;
  editId = id;
}

function deleteEvent(id) {
  events = events.filter(e => e.id !== id);
  saveEvents();
  renderEvents();
}

search.addEventListener("input", renderEvents);
filterStatus.addEventListener("change", renderEvents);

renderEvents();
