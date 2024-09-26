// variaveis e constantes
const dq = (el) => document.querySelector(el);
const dqa = (el) => document.querySelectorAll(el);
let modalQt = 0;
let cart = [];
let modalKey = 0;

//eventos listagem de pizza
pizzaJson.map((pizza, index) => {
  let pizzaItem = dq(".models .pizza-item").cloneNode(true);

  pizzaItem.setAttribute("data-key", index);
  pizzaItem.querySelector(".pizza-item--name").innerHTML = pizza.name;
  pizzaItem.querySelector(
    ".pizza-item--price"
  ).innerHTML = `R$ ${pizza.price.toFixed(2)}`;
  pizzaItem.querySelector(".pizza-item--desc").innerHTML = pizza.description;
  pizzaItem.querySelector(".pizza-item--img img").src = pizza.img;
  pizzaItem.querySelector("a").addEventListener("click", (e) => {
    e.preventDefault(); // tela não atualiza
    let key = e.target.closest(".pizza-item").getAttribute("data-key"); // procura o elemento proximo e atribui a variavel
    modalQt = 1;
    modalKey = key;
    dq(".pizzaInfo h1").innerHTML = pizzaJson[key].name;
    dq(".pizzaInfo--desc").innerHTML = pizzaJson[key].description;
    dq(".pizzaBig img").src = pizzaJson[key].img;
    dq(".pizzaInfo--actualPrice").innerHTML = `R$ ${pizzaJson[
      key
    ].price.toFixed(2)}`;
    dq(".pizzaInfo--size.selected").classList.remove("selected");
    dqa(".pizzaInfo--size").forEach((size, indexSize) => {
      if (indexSize == 2) {
        size.classList.add("selected");
      }
      size.querySelector("span").innerHTML = pizzaJson[key].sizes[indexSize];
    });

    dq(".pizzaInfo--qt").innerHTML = modalQt;
    dq(".pizzaWindowArea").style.opacity = 0;
    dq(".pizzaWindowArea").style.display = "flex";
    setTimeout(() => {
      dq(".pizzaWindowArea").style.opacity = 1; // animação de transição
    }, 200);
  });

  dq(".pizza-area").append(pizzaItem);
});

//eventos modal
dqa(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach(
  (item) => {
    item.addEventListener("click", closeModal);
  }
);
dq(".pizzaInfo--qtmenos").addEventListener("click", () => {
  if (modalQt > 1) {
    modalQt--;
    dq(".pizzaInfo--qt").innerHTML = modalQt;
  }
});
dq(".pizzaInfo--qtmais").addEventListener("click", () => {
  modalQt++;
  dq(".pizzaInfo--qt").innerHTML = modalQt;
});
dqa(".pizzaInfo--size").forEach((size, indexSize) => {
  size.addEventListener("click", (e) => {
    dq(".pizzaInfo--size.selected").classList.remove("selected");
    size.classList.add("selected");
  });
});
dq(".pizzaInfo--addButton").addEventListener("click", () => {
  let size = parseInt(dq(".pizzaInfo--size.selected").getAttribute("data-key"));
  let identifier = pizzaJson[modalKey].id + "@" + size;
  let key = cart.findIndex((item) => item.identifier == identifier);
  if (key > -1) {
    cart[key].qt += modalQt;
  } else {
    cart.push({
      identifier,
      id: pizzaJson[modalKey].id,
      size,
      qt: modalQt,
    });
  }
  updateCart();
  closeModal();
});
dq(".menu-openner").addEventListener("click", () => {
  if (cart.length > 0) {
    dq("aside").style.left = "0";
  }
});
dq(".menu-closer").addEventListener("click", () => {
  dq("aside").style.left = "100vw";
});

//funções
function closeModal() {
  dq(".pizzaWindowArea").style.opacity = 0;
  setTimeout(() => {
    dq(".pizzaWindowArea").style.display = "none";
  }, 500);
}

function updateCart() {
  dq(".menu-openner span").innerHTML = cart.length;

  if (cart.length > 0) {
    dq("aside").classList.add("show");
    dq(".cart").innerHTML = "";

    let subtotal = 0;
    let desconto = 0;
    let total = 0;

    for (let i in cart) {
      let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
      subtotal += pizzaItem.price * cart[i].qt;
      let cartItem = dq(".models .cart--item").cloneNode(true);
      let pizzaSizeName;
      switch (cart[i].size) {
        case 0:
          pizzaSizeName = "P";
          break;
        case 1:
          pizzaSizeName = "M";
          break;
        case 2:
          pizzaSizeName = "G";
          break;
      }
      let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

      cartItem.querySelector("img").src = pizzaItem.img;
      cartItem.querySelector(".cart--item-nome").innerHTML = pizzaName;
      cartItem.querySelector(".cart--item--qt").innerHTML = cart[i].qt;
      cartItem
        .querySelector(".cart--item-qtmenos")
        .addEventListener("click", () => {
          if (cart[i].qt > 1) {
            cart[i].qt--;
          } else {
            cart.splice(i, 1);
          }
          updateCart();
        });
      cartItem
        .querySelector(".cart--item-qtmais")
        .addEventListener("click", () => {
          cart[i].qt++;
          updateCart();
        });

      dq(".cart").append(cartItem);
    }
    desconto = subtotal * 0.1;
    total = subtotal - desconto;

    dq(".subtotal span:last-child").innerHTML = `R$ ${subtotal.toFixed(2)}`;
    dq(".desconto span:last-child").innerHTML = `R$ ${desconto.toFixed(2)}`;
    dq(".total span:last-child").innerHTML = `R$ ${total.toFixed(2)}`;
  } else {
    dq("aside").classList.remove("show");
    dq("aside").style.left = "100vw";
  }
}
