const validation = (n) => {
  if (
    n.replace(/([^а-яА-ЯёЁ\s]+$)/, "") !== "" &&
    n.trim().split(" ").length === 2
  ) {
    return true;
  } else {
    return false;
  }
};

const nameInput = document.querySelector(".name-input");

nameInput.addEventListener("change", () => {
  if (!validation(nameInput.value)) {
    document.querySelector(".error").textContent =
      "ФИО должно состоять из двух слов";
    nameInput.style.borderBottom = "2px solid #ef5350";
  }
});

M.Tabs.init(document.querySelectorAll(".tabs"));
