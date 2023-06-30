function itemTemplate(item) {
  return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
  <span class="item-text">${item.text}</span>
  <div>
    <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
    <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
  </div>
</li>`
}

// Initial Page Load Render
let itemHTML = items.map(function(item) {
    return itemTemplate(item);
}).join('');
document.getElementById("item-list").insertAdjacentHTML("beforeend", itemHTML);

// Create Feature
let createInput = document.getElementById("create-input");

document.getElementById("create-form").addEventListener("submit", function(e) {
    e.preventDefault();
    axios.post('/create-item', {text: createInput.value}).then(function(response) {
      // Create HTML for new item
      document.getElementById("item-list").insertAdjacentHTML("beforeend", itemTemplate(response.data));
      createInput.value = "";
      createInput.focus();
    }).catch(function() {
      console.error(">>> Catch <<<");
    });
});

document.addEventListener("click", function(e) {
    // Delete Feature
    if (e.target.classList.contains("delete-me")) {
        if (confirm("Do you really want to delete this item permanently?")) {
          axios.post('/delete-item', {id: e.target.getAttribute("data-id")}).then(function() {
            e.target.parentElement.parentElement.remove();
          }).catch(function() {
            console.error(">>> Catch <<<");
          });
        }
    }
    // Update Feature
    if (e.target.classList.contains("edit-me")) {
      let userInput = prompt("Enter Your Updated Text.", e.target.parentElement.parentElement.querySelector(".item-text").innerHTML);
      if (userInput) {
        axios.post('/update-item', {text: userInput, id: e.target.getAttribute("data-id")}).then(function() {
          e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = userInput;
        }).catch(function() {
          console.error(">>> Catch <<<");
        });
      }
    }
});