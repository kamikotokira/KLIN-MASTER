function formatHours(hours) {
  const forms = ["час", "часа", "часов"];
  const n = Math.abs(hours) % 100;
  const n1 = n % 10;
  if (n > 10 && n < 20) return hours + " " + forms[2];
  if (n1 > 1 && n1 < 5) return hours + " " + forms[1];
  if (n1 === 1) return hours + " " + forms[0];
  return hours + " " + forms[2];
}

function setQuickEstimate() {
  const form = document.getElementById("quickForm");
  if (!form) return;

  const type = document.getElementById("quickType").value;
  const area = Number(document.getElementById("quickArea").value);
  const result = document.getElementById("quickResult");
  const time = document.getElementById("quickTime");

  if (!area || area < 10 || area > 500) {
    result.textContent = "Укажите площадь от 10 до 500 м².";
    time.textContent = "";
    return;
  }

  const price = calculatePrice(type, area, []);
  result.textContent = "Примерная стоимость: " + formatRub(price.total);
  time.textContent = "Ориентировочно " + formatHours(estimateDuration(type, area, []));
}

function initQuickForm() {
  const form = document.getElementById("quickForm");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    setQuickEstimate();
  });

  document.getElementById("quickType").addEventListener("change", setQuickEstimate);
  document.getElementById("quickArea").addEventListener("input", setQuickEstimate);
  setQuickEstimate();
}

function readExtras() {
  return Array.from(document.querySelectorAll(".extra:checked")).map((item) => item.value);
}

function renderSummary() {
  const typeSelect = document.getElementById("orderType");
  const areaInput = document.getElementById("orderArea");
  const list = document.getElementById("summaryList");
  const total = document.getElementById("totalPrice");
  if (!typeSelect || !areaInput || !list || !total) return;

  const type = typeSelect.value;
  const area = Number(areaInput.value) || 0;
  const selected = readExtras();
  const price = calculatePrice(type, area, selected);

  list.innerHTML = "";
  const baseRow = document.createElement("div");
  const baseLabel = document.createElement("dt");
  const baseValue = document.createElement("dd");
  baseLabel.textContent = services[type].title + ", " + area + " м²";
  baseValue.textContent = formatRub(price.base);
  baseRow.append(baseLabel, baseValue);
  list.append(baseRow);

  selected.forEach((code) => {
    const row = document.createElement("div");
    const label = document.createElement("dt");
    const value = document.createElement("dd");
    label.textContent = extras[code].title;
    value.textContent = formatRub(extras[code].price);
    row.append(label, value);
    list.append(row);
  });

  total.textContent = formatRub(price.total);
  document.getElementById("totalTime").textContent = formatHours(estimateDuration(type, area, selected));
}

function initOrderForm() {
  const form = document.getElementById("orderForm");
  if (!form) return;

  const dateInput = document.getElementById("orderDate");
  const today = new Date();
  const iso = today.toISOString().slice(0, 10);
  dateInput.min = iso;

  ["orderType", "orderArea"].forEach((id) => {
    document.getElementById(id).addEventListener("input", renderSummary);
  });
  document.querySelectorAll(".extra").forEach((input) => {
    input.addEventListener("change", renderSummary);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const message = document.getElementById("formMessage");
    const price = calculatePrice(
      document.getElementById("orderType").value,
      Number(document.getElementById("orderArea").value),
      readExtras()
    );

    message.textContent = "Заявка принята. " +
      document.getElementById("orderName").value.trim() +
      ", стоимость уборки: " + formatRub(price.total) +
      ", ориентировочное время: " + formatHours(estimateDuration(
        document.getElementById("orderType").value,
        Number(document.getElementById("orderArea").value),
        readExtras()
      )) +
      ". Мы свяжемся по указанному телефону.";
    message.classList.add("is-visible");
  });

  renderSummary();
}

document.addEventListener("DOMContentLoaded", () => {
  initQuickForm();
  initOrderForm();
});
