var cart = {
	hPdt : null, //HTML products list - refers to <div id="productsContainer"></div>
	hItems : null, // HTML current cart - refers to <div id="cartContainer"></div>
	items: {}, //current items in cart
	iURL: "images/", //product images URL folder



//saves current cart to storange
save : () => {
	localStorage.setItem("cart", JSON.stringify(cart.items));
},


//loads cart from localStorage
load : () => {
	cart.items = localStorage.getItem("cart");
	if (cart.items == null) {
		cart.items = {};
	}
	else {
		cart.items = JSON.parse(cart.items);
	}
},


//empties cart contents
nuke : () => {
	if (confirm("Empty cart?")) {
		cart.items = {};
		localStorage.removeItem("cart");
		cart.list();
	}
},


//initializes the cart
init : () => {
	cart.hPdt = document.getElementById("cart-products");
	cart.hItems = document.getElementById("cart-items");

	cart.hPdt.innerHTML = "";
	let p, item, part;
	for (let id in products) {
		//product wrapper
		p = products[id];
		item = document.createElement("div");
		item.className = "p-item";
		cart.hPdt.appendChild(item);

		//products image
		part = document.createElement("img");
      	part.src = cart.iURL + p.img;
		part.className = "p-img";
		item.appendChild(part);

		//product name
		part = document.createElement("div");
		part.innerHTML = p.name;
		part.className = "p-name";
		item.appendChild(part);

		//product price
		part = document.createElement("div");
		part.innerHTML = "$" + p.price;
		part.className = "p-price";
		item.appendChild(part);

		//product description
		part = document.createElement("div");
		part.innerHTML = p.desc;
		part.className = "p-desc";
		item.appendChild(part);

		//add to cart
		part = document.createElement("input");
		part.type = "button";
		part.value = "Add to Cart";
		part.className = "cart p-add";
		part.onclick = () => {
			cart.add(id);
		};
		item.appendChild(part);
	}
	cart.load();
	cart.list();
},


//list current cart items
list : () => {
	cart.hItems.innerHTML = "";
	let item, part, pdt;
	let empty = true;
	for (let key in cart.items) {
		if (cart.items.hasOwnProperty(key)) {
			empty = false;
			break;
		}
	}

	if (empty) {
		item = document.createElement("div");
		item.innerHTML = "Cart is empty";
		cart.hItems.appendChild(item);
	}
	else {
		let p, total = 0, subtotal = 0; 
		for (let id in cart.items) {
			//item
			p = products[id];
			item = document.createElement("div");
			item.className = "c-item";
			cart.hItems.appendChild(item);

			//name
			part = document.createElement("span");
			part.innerHTML = p.name;
			part.className = "c-name";
			item.appendChild(part);

			//remove
			part = document.createElement("input");
			part.type = "button";
			part.value = "X";
			part.className = "c-del cart";
			part.onclick = () => {
				cart.remove(id);
			};
			item.appendChild(part);

			//quantity
			part = document.createElement("input");
			part.type = "number";
			part.min = 0;
			part.value = cart.items[id];
			part.className = "c-qty";
			part.onchange = function () {
				cart.change(id, this.value);
			};
			item.appendChild(part);

			//subtotal
			subtotal = cart.items[id] * p.price;
			total += subtotal;
		}

		//total amount
		item = document.createElement("div");
		item.className = "c-total";
		item.id = "c-total";
		item.innerHTML = "Total: $" + total;
		cart.hItems.appendChild(item);

		//empty button 
		item = document.createElement("input");
		item.type = "button";
		item.value = "Empty";
		item.onclick = cart.nuke;
		item.classList.add("c-empty");
		cart.hItems.appendChild(item);

		//checkout button
		item = document.createElement("input");
		item.type = "button";
		item.value = "Checkout";
		item.onclick = cart.checkout;
		item.classList.add("c-checkout");
		cart.hItems.appendChild(item);
	}
},


//add item to cart
add : (id) => {
	if (cart.items[id] == undefined) {
		cart.items[id] =  1;
	}
	else {
		cart.items[id]++;
	}
	cart.save(); cart.list();
},


//change quantity
change : (pid, qty) => {
	if (qty <= 0) {
		delete cart.items[pid];
		cart.save(); cart.list();
	}
	else {
		cart.items[pid] = qty;
		var total = 0;
		for (let id in cart.items) {
			total += cart.items[id] * products[id].price;
			document.getElementById("c-total").innerHTML = "Total: $" + total;
		}
	}
},


//remove item from cart
remove : (id) => {
	delete cart.items[id];
	cart.save(); cart.list();
},


//checkout
checkout : () => {
	alert("Checking Out Stuff Here");
}
};

window.addEventListener("DOMContentLoaded", cart.init);
