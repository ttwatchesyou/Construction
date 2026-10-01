create table if not exists users (
  id bigint unsigned not null auto_increment,
  username varchar(80) not null,
  password_hash varchar(255) not null,
  role varchar(40) not null default 'admin',
  display_name varchar(160) null,
  is_active tinyint(1) not null default 1,
  created_at timestamp not null default current_timestamp,
  updated_at timestamp not null default current_timestamp on update current_timestamp,
  primary key (id),
  unique key users_username_unique (username)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

create table if not exists projects (
  id bigint unsigned not null auto_increment,
  code varchar(40) not null,
  name varchar(255) not null,
  client_name varchar(255) not null,
  status enum('active', 'completed', 'delivered') not null default 'active',
  assigned_today int unsigned not null default 0,
  income_total decimal(14,2) not null default 0,
  budget_total decimal(14,2) not null default 0,
  expense_total decimal(14,2) not null default 0,
  created_at timestamp not null default current_timestamp,
  updated_at timestamp not null default current_timestamp on update current_timestamp,
  primary key (id),
  unique key projects_code_unique (code)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

create table if not exists dashboard_counters (
  id tinyint unsigned not null,
  pending_expenses int unsigned not null default 0,
  pending_materials int unsigned not null default 0,
  checkins_today int unsigned not null default 0,
  updated_at timestamp not null default current_timestamp on update current_timestamp,
  primary key (id)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

insert into dashboard_counters (id, pending_expenses, pending_materials, checkins_today)
values (1, 8, 5, 18)
on duplicate key update id = values(id);

create or replace view dashboard_projects as
select
  code,
  name,
  client_name,
  status,
  assigned_today,
  income_total,
  budget_total,
  expense_total,
  updated_at
from projects;

create or replace view dashboard_stats as
select
  count(p.id) as projects,
  coalesce(sum(p.income_total), 0) as income,
  coalesce(sum(p.income_total - p.expense_total), 0) as balance,
  c.pending_expenses as pendingExpenses,
  c.pending_materials as pendingMaterials,
  c.checkins_today as checkins
from dashboard_counters c
left join projects p on true
where c.id = 1
group by c.pending_expenses, c.pending_materials, c.checkins_today;

insert into projects (code, name, client_name, status, assigned_today, income_total, budget_total, expense_total)
values
  ('PRJ-20260405-001', 'งานต่อเติมอาคารธรรมชาติ', 'บริษัท ธรรมชาติ จำกัด', 'active', 4, 100000.00, 450000.00, 47521.92),
  ('PRJ-20260401-002', 'โครงการนิทรรศการกลางแจ้ง', 'ศูนย์เรียนรู้เมือง', 'active', 8, 280000.00, 600000.00, 120400.00),
  ('PRJ-20260320-003', 'ปรับปรุงสำนักงานชั้น 2', 'บริษัท เอ จำกัด', 'completed', 0, 320000.00, 320000.00, 276500.00)
on duplicate key update
  name = values(name),
  client_name = values(client_name),
  status = values(status),
  assigned_today = values(assigned_today),
  income_total = values(income_total),
  budget_total = values(budget_total),
  expense_total = values(expense_total);
