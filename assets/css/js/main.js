// ----------------------
// ตั้งค่าตามจริงของเด่น
// ----------------------

// ใส่ URL endpoint ที่ใช้เก็บข้อมูลฟอร์ม (เช่น Google Apps Script, Formspree ฯลฯ)
const FORM_ENDPOINT = "https://YOUR_FORM_ENDPOINT_HERE";

// ถ้ายังไม่ใช้ลิงก์จ่ายเงินจริง สามารถคอมเมนต์ส่วนนี้ไว้ก่อนได้
// const PAYMENT_LINKS = {
//   course: "https://...", // ลิงก์จ่ายเงินคอร์ส
//   ebook: "https://..."   // ลิงก์จ่ายเงิน E-book
// };

// ----------------------
// โค้ดหลัก ทำงานหลัง DOM โหลดเสร็จ
// ----------------------
document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // 1) เมนูมือถือ (hamburger)
  // =========================
  const menuBtn = document.getElementById("mobile-menu");
  const navMenu = document.getElementById("nav-menu");

  // เช็กก่อนว่ามี element จริงไหม (บางหน้าจะไม่มี navbar)
  if (menuBtn && navMenu) {
    menuBtn.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });
  }

  // =========================
  // 2) ฟอร์ม checkout (ไปหน้าชำระเงิน)
  // =========================
  const form = document.getElementById("checkout-form");
  if (!form) return; // ถ้าในหน้านี้ไม่มีฟอร์ม ก็จบแค่นี้

  const messageEl = document.getElementById("form-message");

  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // กันไม่ให้รีเฟรชหน้า

    // ดึงค่าจากฟอร์ม
    const formData = new FormData(form);
    const name = formData.get("name")?.trim();
    const email = formData.get("email")?.trim();
    const lineId = formData.get("lineId")?.trim();
    const product = formData.get("product");

    // เช็คข้อมูลเบื้องต้น
    if (!name || !email || !lineId || !product) {
      if (messageEl) {
        messageEl.textContent = "กรุณากรอกข้อมูลให้ครบทุกช่องค่ะ";
        messageEl.style.color = "#f97316";
      }
      return;
    }

    // (ถ้ายังไม่ได้ใช้ PAYMENT_LINKS จริง ๆ ให้ตัดบล็อกนี้ออกไปก่อนก็ได้)
    /*
    if (!PAYMENT_LINKS || !PAYMENT_LINKS[product]) {
      if (messageEl) {
        messageEl.textContent = "ยังไม่ได้ตั้งค่าลิงก์ชำระเงินสำหรับสินค้านี้";
        messageEl.style.color = "#f97316";
      }
      return;
    }
    */

    // แจ้งสถานะกำลังบันทึก
    if (messageEl) {
      messageEl.textContent = "กำลังบันทึกข้อมูลและไปหน้าชำระเงิน...";
      messageEl.style.color = "#e5e7eb";
    }

    // เตรียมข้อมูลส่งไปเก็บ (เช่น Google Sheet)
    const payload = {
      name,
      email,
      lineId,
      product,
      timestamp: new Date().toISOString(),
    };

    try {
      if (FORM_ENDPOINT && FORM_ENDPOINT.startsWith("http")) {
        await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
    } catch (err) {
      console.error("ส่งข้อมูลฟอร์มไม่สำเร็จ แต่จะพาไปหน้าชำระเงินต่อ", err);
    }

    // ไปหน้าชำระเงินในเว็บ พร้อมบอกว่าเป็นสินค้าอะไร
    window.location.href = "payment.html?product=" + encodeURIComponent(product);
  });
});
