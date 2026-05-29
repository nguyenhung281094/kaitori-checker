const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1osglVJ_ahVbA-QSW9mQfc7okBKaVpJPo_cgiPeLxy_I/export?format=csv&gid=0";

async function searchJAN() {
  const jan = document.getElementById("janInput").value.trim();
  const result = document.getElementById("result");

  if (!jan) {
    result.innerHTML = "JANを入力してください。";
    return;
  }

  result.innerHTML = "検索中...";

  const res = await fetch(SHEET_CSV_URL);
  const text = await res.text();

  const rows = text.split("\n").slice(1).map(row => row.split(","));

  const matches = rows.filter(row => row[0]?.trim() === jan);

  if (matches.length === 0) {
    result.innerHTML = "該当商品がありません。";
    return;
  }

  matches.sort((a, b) => Number(b[3]) - Number(a[3]));

  const top = matches[0];

  result.innerHTML = `
    <div class="card">
      <div>JAN: ${top[0]}</div>
      <h2>${top[1]}</h2>
      <div class="highest">最高価格: ${Number(top[3]).toLocaleString()}円</div>
      <div>Shop: ${top[2]}</div>
      <hr>
      ${matches.map(row => `
        <div>
          ${row[2]}：${Number(row[3]).toLocaleString()}円
        </div>
      `).join("")}
    </div>
  `;
}
