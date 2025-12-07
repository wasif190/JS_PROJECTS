document.addEventListener("DOMContentLoaded", () => {
  const expenseForm = document.querySelector("#expense-form");
  const expenseNameInput = document.querySelector("#expense-name");
  const expenseAmountInput = document.querySelector("#expense-amount");
  const expenseList = document.querySelector("#expense-list"); // ✅ matches HTML
  const totalWrapper = document.querySelector("#total");
  const totalAmountDisplay = document.querySelector("#total-amount");
  const emptyMessage = document.querySelector("#empty-message"); // ✅ from UI

  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  renderExpenses();
  updateTotal();

  expenseForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = expenseNameInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value.trim());

    if (name !== "" && !isNaN(amount) && amount > 0) {
      const newExpense = {
        id: Date.now(),
        name,
        amount,
      };

      expenses.push(newExpense);

      saveExpensesToLocal();

      renderExpenses();
      updateTotal();

      expenseNameInput.value = "";
      expenseAmountInput.value = "";
      expenseNameInput.focus();
    } else {
      alert("Enter a valid name and amount greater than 0");
    }
  });


  function renderExpenses() {
    expenseList.innerHTML = "";

    if (expenses.length === 0) {
      if (emptyMessage) {
        emptyMessage.textContent = "No expenses added yet.";
      }
  
      if (totalWrapper) {
        totalWrapper.classList.add("opacity-60");
      }
      return;
    }

    expenses.forEach((expense) => {
      const li = document.createElement("li");

      li.className =
        "flex items-center justify-between bg-slate-700 rounded-lg px-3 py-2 text-sm";

      li.innerHTML = `
        <div class="flex flex-col">
          <span class="font-medium text-slate-100">${expense.name}</span>
          <span class="text-xs text-slate-300">₹${expense.amount.toFixed(
            2
          )}</span>
        </div>
        <button 
          data-id="${expense.id}" 
          class="text-xs px-2 py-1 rounded-md bg-red-500 hover:bg-red-600 text-white"
        >
          Delete
        </button>
      `;

      expenseList.appendChild(li);
    });
  }


  function calculateTotal() {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }


  function saveExpensesToLocal() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }

  function updateTotal() {
    const totalAmount = calculateTotal();
    totalAmountDisplay.textContent = totalAmount.toFixed(2);
  }

  expenseList.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const expenseId = parseInt(e.target.getAttribute("data-id"));

      expenses = expenses.filter((expense) => expense.id !== expenseId);

      saveExpensesToLocal();
      renderExpenses();
      updateTotal();
    }
  });
});
