const paymentForm = document.getElementById("paymentForm");
const paymentTableBody = document.getElementById("paymentTableBody");
const totalRevenueEl = document.getElementById("totalRevenue");
const successCountEl = document.getElementById("successCount");
const pendingCountEl = document.getElementById("pendingCount");
const failedCountEl = document.getElementById("failedCount");

let paymentId = 1;
let totalRevenue = 0;
let successCount = 0;
let pendingCount = 0;
let failedCount = 0;

function formatCurrency(value) {
  return `₹${Number(value).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

function updateSummary() {
  totalRevenueEl.textContent = formatCurrency(totalRevenue);
  successCountEl.textContent = successCount;
  pendingCountEl.textContent = pendingCount;
  failedCountEl.textContent = failedCount;
}

function createStatusChip(status) {
  const chip = document.createElement("span");
  chip.classList.add("status-chip");

  if (status === "Paid") {
    chip.classList.add("status-paid");
    chip.textContent = "Paid";
  } else if (status === "Failed") {
    chip.classList.add("status-failed");
    chip.textContent = "Failed";
  } else {
    chip.classList.add("status-refunded");
    chip.textContent = "Refunded";
  }

  return chip;
}

paymentForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const orderId = document.getElementById("orderId").value.trim();
  const amount = Number(document.getElementById("amount").value);
  const paymentMethod = document.getElementById("paymentMethod").value;
  const paymentStatus = document.getElementById("paymentStatus").value;

  const row = document.createElement("tr");
  const statusCell = document.createElement("td");
  const actionCell = document.createElement("td");

  statusCell.appendChild(createStatusChip(paymentStatus));
  actionCell.innerHTML = `<button class="refund-btn">Refund</button>`;

  row.innerHTML = `
    <td>${paymentId}</td>
    <td>${orderId}</td>
    <td>${formatCurrency(amount)}</td>
    <td>${paymentMethod}</td>
  `;

  row.appendChild(statusCell);
  row.appendChild(actionCell);
  paymentTableBody.prepend(row);

  if (paymentStatus === "Paid") {
    totalRevenue += amount;
    successCount += 1;
  } else if (paymentStatus === "Failed") {
    failedCount += 1;
  } else {
    pendingCount += 1;
  }

  updateSummary();
  paymentId += 1;
  paymentForm.reset();

  const refundBtn = actionCell.querySelector(".refund-btn");
  refundBtn.addEventListener("click", function () {
    const currentStatus = statusCell.textContent.trim();
    if (currentStatus === "Refunded") {
      return;
    }

    if (currentStatus === "Paid") {
      totalRevenue -= amount;
      successCount = Math.max(0, successCount - 1);
      pendingCount += 1;
    } else if (currentStatus === "Failed") {
      failedCount = Math.max(0, failedCount - 1);
      pendingCount += 1;
    }

    statusCell.innerHTML = "";
    statusCell.appendChild(createStatusChip("Refunded"));
    updateSummary();
  });
});
