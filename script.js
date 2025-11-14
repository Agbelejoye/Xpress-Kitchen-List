const foods = [
    { name: 'Jollof Rice', price: 1500, location: 'Lagos' },
    { name: 'Pounded Yam', price: 2000, location: 'Abuja' },
    { name: 'Egusi Soup', price: 1800, location: 'Port Harcourt' },
    { name: 'Suya', price: 1200, location: 'Kano' },
    {name: 'Eba', price: 2000, location: 'Ibadan'},
    {name: 'Iyan', price: 100, location: 'Lagos'}
];

let cart = [];

const foodSelect = document.getElementById('food-select');
const addFoodBtn = document.getElementById('add-food');
const cartBody = document.getElementById('cart-body');
const totalEl = document.getElementById('total');

function populateSelect() {
    foods.forEach((food, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${food.name} - $${food.price} (${food.location})`;
        foodSelect.appendChild(option);
    });
}

function renderCart() {
    cartBody.innerHTML = '';
    cart.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>$${item.price}</td>
            <td>${item.location}</td>
            <td>
                <button onclick="changeQuantity(${index}, -1)">-</button>
                ${item.quantity}
                <button onclick="changeQuantity(${index}, 1)">+</button>
            </td>
            <td>
                <button onclick="editFood(${index})">Edit</button>
                <button onclick="deleteFood(${index})">Delete</button>
            </td>
        `;
        cartBody.appendChild(row);
    });
    updateTotal();
}

function addFood() {
    const selectedIndex = foodSelect.value;
    if (selectedIndex !== '') {
        const food = foods[selectedIndex];
        const existing = cart.find(item => item.name === food.name);
        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ ...food, quantity: 1 });
        }
        renderCart();
    }
}

function changeQuantity(index, delta) {
    cart[index].quantity = Math.max(0, cart[index].quantity + delta);
    if (cart[index].quantity === 0) {
        cart.splice(index, 1);
    }
    renderCart();
}

function editFood(index) {
    const options = {};
    foods.forEach((food, i) => {
        options[i] = `${food.name} - $${food.price} (${food.location})`;
    });
    Swal.fire({
        title: 'Select New Food',
        input: 'select',
        inputOptions: options,
        inputPlaceholder: 'Select a food',
        showCancelButton: true,
        confirmButtonText: 'Update',
        preConfirm: (selectedIndex) => {
            if (selectedIndex !== null && selectedIndex !== '') {
                const selectedFood = foods[selectedIndex];
                cart[index] = { ...selectedFood, quantity: cart[index].quantity };
                renderCart();
            }
        }
    });
}

function deleteFood(index) {
    Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            cart.splice(index, 1);
            renderCart();
            Swal.fire('Deleted!', 'Your food item has been deleted.', 'success');
        }
    });
}

function updateTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalEl.textContent = `Total: $${total}`;
}

addFoodBtn.addEventListener('click', addFood);
populateSelect();
renderCart();