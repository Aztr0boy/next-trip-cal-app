"use client";

import { useMemo, useState } from "react";

type Member = { id: number; name: string; role: string };
type Expense = { id: number; label: string; amount: number; payer: number };

const initialMembers: Member[] = [
  { id: 1, name: "คุณกมล", role: "Project lead" },
  { id: 2, name: "คุณนภา", role: "Operations" },
  { id: 3, name: "คุณธนา", role: "Sales" },
  { id: 4, name: "คุณฟ้า", role: "Design" },
];

const initialExpenses: Expense[] = [
  { id: 1, label: "ค่าที่พัก", amount: 4200, payer: 4 },
  { id: 2, label: "ค่าทางด่วน", amount: 380, payer: 1 },
];

const money = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
  maximumFractionDigits: 0,
});

export default function Home() {
  const [members, setMembers] = useState(initialMembers);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [distance, setDistance] = useState(486);
  const [efficiency, setEfficiency] = useState(14);
  const [fuelPrice, setFuelPrice] = useState(34.5);
  const [tripName, setTripName] = useState("ทริปท่องเที่ยวประจำปี");

  const fuelCost = useMemo(
    () => (distance / Math.max(efficiency, 1)) * fuelPrice,
    [distance, efficiency, fuelPrice],
  );
  const otherCost = expenses.reduce((total, expense) => total + expense.amount, 0);
  const totalCost = fuelCost + otherCost;
  const perPerson = members.length ? totalCost / members.length : 0;

  const addMember = () => {
    const nextId = Math.max(...members.map((member) => member.id), 0) + 1;
    setMembers([...members, { id: nextId, name: `ผู้ร่วมทริป ${nextId}`, role: "New member" }]);
  };

  const addExpense = () => {
    const nextId = Math.max(...expenses.map((expense) => expense.id), 0) + 1;
    setExpenses([...expenses, { id: nextId, label: "ค่าใช้จ่ายใหม่", amount: 0, payer: 1 }]);
  };

  return (
    <main className="app-shell">
      <section className="workspace" id="calculator">
        <header className="topbar">
          <div className="simple-brand"><span>◒</span><strong>Trip Cost Calculator</strong></div>
          <div className="top-actions"><button className="outline-button" onClick={() => window.print()}>พิมพ์สรุปผล <span>↗</span></button></div>
        </header>

        <div className="content-wrap">
          <div className="page-heading"><div><p className="kicker">วางแผนค่าใช้จ่ายทริป</p><h1>คำนวณค่าเดินทาง</h1><p className="subheading">กรอกข้อมูลด้านล่าง ยอดรวมจะอัปเดตให้อัตโนมัติ</p></div></div>

          <div className="trip-title"><input value={tripName} onChange={(event) => setTripName(event.target.value)} aria-label="ชื่อทริป" /><span>ชื่อทริป</span></div>

          <div className="dashboard-grid">
            <section className="panel inputs-panel">
              <div className="panel-heading"><h2>ข้อมูลการเดินทาง</h2></div>
              <div className="field-grid"><label>ระยะทางรวม <span>กิโลเมตร</span><div className="input-with-unit"><input type="number" value={distance} onChange={(event) => setDistance(Number(event.target.value))} min="0" /><b>km</b></div></label><label>อัตราสิ้นเปลือง <span>กิโลเมตร / ลิตร</span><div className="input-with-unit"><input type="number" value={efficiency} onChange={(event) => setEfficiency(Number(event.target.value))} min="1" step="0.1" /><b>km/L</b></div></label><label>ราคาน้ำมันต่อลิตร <span>ราคาปัจจุบัน</span><div className="input-with-unit"><input type="number" value={fuelPrice} onChange={(event) => setFuelPrice(Number(event.target.value))} min="0" step="0.5" /><b>฿/L</b></div></label></div>
            </section>

            <section className="panel members-panel" id="members"><div className="panel-heading"><h2>สมาชิกในทริป</h2><button className="text-button" onClick={addMember}>＋ เพิ่มสมาชิก</button></div><div className="member-list">{members.map((member) => <div className="member-row" key={member.id}><span className="avatar avatar-small">{member.name.slice(0, 1)}</span><div><input className="inline-input" value={member.name} onChange={(event) => setMembers(members.map((item) => item.id === member.id ? { ...item, name: event.target.value } : item))} aria-label="ชื่อสมาชิก" /></div><button className="remove-button" onClick={() => setMembers(members.filter((item) => item.id !== member.id))} aria-label={`ลบ ${member.name}`}>×</button></div>)}</div></section>

            <section className="panel expenses-panel"><div className="panel-heading"><h2>ค่าใช้จ่ายอื่น ๆ</h2><button className="text-button" onClick={addExpense}>＋ เพิ่มรายการ</button></div><div className="expense-list">{expenses.map((expense) => <div className="expense-row" key={expense.id}><div className="expense-icon">฿</div><input className="inline-input" value={expense.label} onChange={(event) => setExpenses(expenses.map((item) => item.id === expense.id ? { ...item, label: event.target.value } : item))} aria-label="รายการค่าใช้จ่าย" /><div className="expense-amount"><span>฿</span><input type="number" value={expense.amount} onChange={(event) => setExpenses(expenses.map((item) => item.id === expense.id ? { ...item, amount: Number(event.target.value) } : item))} aria-label="จำนวนเงิน" /></div><select value={expense.payer} onChange={(event) => setExpenses(expenses.map((item) => item.id === expense.id ? { ...item, payer: Number(event.target.value) } : item))} aria-label="จำนวนผู้จ่าย"><option value={1}>1 คนจ่าย</option><option value={members.length}>{members.length} คนจ่าย</option></select><button className="remove-button" onClick={() => setExpenses(expenses.filter((item) => item.id !== expense.id))} aria-label={`ลบ ${expense.label}`}>×</button></div>)}</div><div className="expense-total"><span>รวมค่าใช้จ่ายอื่น ๆ</span><strong>{money.format(otherCost)}</strong></div></section>

            <section className="summary-card" id="insights"><div className="summary-top"><span className="kicker">สรุปค่าใช้จ่าย</span></div><div className="total-cost">{money.format(totalCost)}</div><p>ค่าใช้จ่ายรวมทั้งหมด</p><div className="cost-breakdown"><div><span><i className="dot fuel-dot" />ค่าน้ำมัน</span><strong>{money.format(fuelCost)}</strong></div><div><span><i className="dot expense-dot" />ค่าใช้จ่ายอื่น ๆ</span><strong>{money.format(otherCost)}</strong></div></div><div className="per-person"><span>เฉลี่ยต่อคน</span><strong>{money.format(perPerson)}</strong></div><button className="summary-button" onClick={() => window.print()}>พิมพ์ผลลัพธ์ <span>→</span></button></section>
          </div>
          <footer className="page-footer"><span>เครื่องคำนวณค่าเดินทาง</span></footer>
        </div>
      </section>
    </main>
  );
}
