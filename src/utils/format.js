import { useEffect, useState } from 'react';

/** หัวเดือนภาษาไทยแบบย่อ */
export const TH_MONTHS = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.',
  'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.',
  'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
];

export const TH_DAYS = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสฯ', 'ศุกร์', 'เสาร์'];

/** วันนี้ ณ เวลา 00:00 (ใช้เทียบสถานะ "ผ่านแล้ว/ยังไม่ถึง") */
export function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/** วันที่แบบไทย เช่น "12 พ.ย. 2710" */
export function thaiDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'รูปแบบวันที่ไม่ถูกต้อง';
  return `${d.getDate()} ${TH_MONTHS[d.getMonth()]} ${d.getFullYear() + 543}`;
}

/** วันที่แบบไทย พร้อมเวลา เช่น "12 พ.ย. 2710 · 08:30" */
export function thaiDateTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'รูปแบบวันที่ไม่ถูกต้อง';
  const time = `0${d.getHours()}`.slice(-2) + ':' + `0${d.getMinutes()}`.slice(-2);
  return `${thaiDate(iso)} · ${time} น.`;
}

export function thaiDateShort(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return `${d.getDate()} ${TH_MONTHS[d.getMonth()]}`;
}

/** จำนวนวันจากวันนี้ถึงวันสอบ (ลบหากผ่านไปแล้ว) */
export function daysUntil(iso, now = Date.now()) {
  const target = new Date(iso).getTime();
  if (Number.isNaN(target)) return null;
  return Math.ceil((target - now) / 86_400_000);
}

/** หยิบ quote ประจำวัน */
export function dailyIndex(length) {
  const d = new Date();
  const dayOfYear = Math.floor(
    (d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86_400_000
  );
  return (dayOfYear + d.getFullYear()) % length;
}
