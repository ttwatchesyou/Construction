import { query } from "./db.js";

const fallbackProjects = [
  { code: "PRJ-20260405-001", name: "งานต่อเติมอาคารธรรมชาติ", client: "บริษัท ธรรมชาติ จำกัด", status: "active", assigned: 4, income: 100000, budget: 450000, expense: 47521.92 },
  { code: "PRJ-20260401-002", name: "โครงการนิทรรศการกลางแจ้ง", client: "ศูนย์เรียนรู้เมือง", status: "active", assigned: 8, income: 280000, budget: 600000, expense: 120400 },
  { code: "PRJ-20260320-003", name: "ปรับปรุงสำนักงานชั้น 2", client: "บริษัท เอ จำกัด", status: "completed", assigned: 0, income: 320000, budget: 320000, expense: 276500 },
];

export async function loadDashboard() {
  try {
    const projects = await query(`
      select
        code,
        name,
        client_name as client,
        status,
        assigned_today as assigned,
        income_total as income,
        budget_total as budget,
        expense_total as expense
      from dashboard_projects
      order by updated_at desc
      limit 5
    `);

    const statsRows = await query("select * from dashboard_stats limit 1");
    const stats = statsRows[0] || buildStats(projects);
    return withActivity({ stats, projects });
  } catch {
    return withActivity({ stats: buildStats(fallbackProjects), projects: fallbackProjects });
  }
}

function buildStats(projects) {
  const income = projects.reduce((sum, project) => sum + Number(project.income || 0), 0);
  const expense = projects.reduce((sum, project) => sum + Number(project.expense || 0), 0);
  return {
    projects: 12,
    income,
    balance: income - expense,
    pendingExpenses: 8,
    pendingMaterials: 5,
    checkins: 18,
  };
}

function withActivity(data) {
  return {
    ...data,
    expenses: [
      { title: "ค่าวัสดุก่อสร้าง", detail: "งานต่อเติมอาคารธรรมชาติ", value: "฿24,500.00" },
      { title: "ค่าน้ำมันรถขนของ", detail: "โครงการนิทรรศการ", value: "฿3,200.00" },
    ],
    attendance: [
      { title: "นที แสงทอง", detail: "ไซต์งาน PRJ-20260405-001", value: "08:02 น.", avatar: "น" },
      { title: "กิตติ ช่างดี", detail: "ออฟฟิศ", value: "07:48 น.", avatar: "ก" },
    ],
  };
}
