# 🎯 Dek 71 Dashboard — แดชบอร์ดวางแผนชีวิต & เตรียมสอบเข้ามหาวิทยาลัย

เว็บแอป React + Vite + Tailwind CSS สำหรับเด็ก 71 พร้อมฟีเจอร์:

- **⏱ นับถอยหลังเรียลไทม์** — วัน / ชั่วโมง / นาที / วินาที ถึงวันสอบสำคัญ (TGAT/TPAT, A-Level, รอบ TCAS) + เพิ่ม/ตั้ง/ลบวันสอบของตัวเองได้
- **📅 ไทม์ไลน์ TCAS** — แยกตามประเภทกิจกรรม พร้อมสถานะ "ใกล้เข้ามาแล้ว / อยู่ในกระบวนการ / ผ่านแล้ว"
- **✅ วางแผนอ่านหนังสือ** — เช็คลิสต์หัวข้อรายวิชา (คณิต ฟิสิกส์ เคมี ชีว อังกฤษ ไทย สังคม) + Progress Bar รวมและรายวิชา + แผนอ่านรายวัน/รายสัปดาห์
- **💡 กลยุทธ์การเตรียมตัว** — Active Recall / Pomodoro / Past Exams / Spaced Repetition + สุขภาพใจและกาย + คำคมเปลี่ยนทุกวัน
- **💾 LocalStorage** — ทุกอย่างที่ติ๊ก/แก้ไขเก็บไว้ในเครื่องอัตโนมัติ ปิดเปิดใหม่ไม่หาย

## วิธีรัน

```bash
cd dek71-dashboard
npm install
npm run dev        # เปิดปกติ http://localhost:5173
```

Build สำหรับ deploy:

```bash
npm run build      # ผลลัพธ์อยู่ใน dist/
npm run preview
```

## โครงสร้างโปรเจกต์

```
index.html
tailwind.config.js  · postcss.config.js  · vite.config.js
src/
  main.jsx            — จุดเข้า React
  App.jsx             — โครงหลัก + แท็บนำทาง + LocalStorage ทั้งหมด
  index.css           — Tailwind + ธีมและ component class
  data/defaults.js    — วันสอบ TCAS68(~71), วิชาที่ต้องเคลียร์, เทคนิค, quote
  hooks/
    useLocalStorage.js— persist state ลง localStorage
    useNow.js         — นาฬิกาเรียลไทม์
  utils/format.js     — วันที่ไทย (พ.ศ.) + ตัวช่วย
  components/
    Dashboard.jsx     — ภาพรวม
    Countdown.jsx     — นับถอยหลัง + กำหนดวันสอบเอง
    Timeline.jsx      — ไทม์ไลน์แยกประเภท
    StudyPlanner.jsx  — เช็คลิสต์วิชา + แผนอ่านรายวัน
    Strategy.jsx      — เทคนิค + สุขภาพ + แผนระยะ
```

> ⚠️ วันสอบในระบบเป็นค่าโดยประมาณจากรุ่นก่อน หน้าต่าง "นับถอยหลัง" สามารถลบ/เพิ่มวันจริงจากประกาศของ สทศ. และ ทปอ. ได้เอง ข้อมูลที่แก้จะถูกเก็บไว้ในเครื่อง (ผ่านปุ่ม ⟲ ที่มุมขวาบนเพื่อรีเซ็ต)
