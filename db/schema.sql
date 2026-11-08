-- C&B Data Mornitoring Dashboard - Schema v4
PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;
PRAGMA busy_timeout = 5000;

BEGIN;

-- =========================================================
-- 1. Reference tables
-- =========================================================

CREATE TABLE dept (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  detail TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  created_by TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_by TEXT
);

CREATE TABLE source_group (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  trust_level INTEGER NOT NULL CHECK (trust_level BETWEEN 0 AND 100),
  can_be_effective INTEGER NOT NULL DEFAULT 1 CHECK (can_be_effective IN (0,1)),
  detail TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  created_by TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_by TEXT
);

CREATE TABLE source (
  id TEXT PRIMARY KEY,
  group_id TEXT NOT NULL REFERENCES source_group(id) ON UPDATE CASCADE,
  detail TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  created_by TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_by TEXT
);
CREATE INDEX ix_source_group ON source(group_id);

CREATE TABLE source_alias (
  alias TEXT PRIMARY KEY COLLATE NOCASE,
  source_id TEXT NOT NULL REFERENCES source(id) ON DELETE CASCADE
);

CREATE TABLE domain (
  id TEXT PRIMARY KEY,
  detail TEXT,
  data_schema TEXT NOT NULL CHECK (json_valid(data_schema)),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  created_by TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_by TEXT
);

-- =========================================================
-- 2. Person and employment
-- =========================================================

CREATE TABLE person (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  pid TEXT,
  pid_type TEXT CHECK (pid_type IN ('cccd','cmnd','passport','other')),
  name TEXT NOT NULL,
  name_romanized TEXT,
  phone TEXT,
  email TEXT,
  deleted_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  created_by TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_by TEXT,
  CHECK (
    (pid IS NULL AND pid_type IS NULL) OR
    (pid IS NOT NULL AND length(trim(pid)) > 0 AND pid_type IS NOT NULL)
  )
);
CREATE UNIQUE INDEX ux_person_pid
  ON person(pid_type, pid)
  WHERE pid IS NOT NULL AND deleted_at IS NULL;
CREATE INDEX ix_person_pid ON person(pid) WHERE pid IS NOT NULL;
CREATE INDEX ix_person_name ON person(name);

CREATE TABLE employment (
  eid TEXT PRIMARY KEY,
  person_id TEXT NOT NULL REFERENCES person(id) ON DELETE RESTRICT,
  dept_id TEXT REFERENCES dept(id) ON UPDATE CASCADE,
  start_date TEXT NOT NULL,
  end_date TEXT,
  work_type TEXT NOT NULL CHECK (work_type IN ('C01','C02','C03')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  created_by TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_by TEXT,
  CHECK (end_date IS NULL OR end_date >= start_date)
);
-- At most one current employment episode per person.
CREATE UNIQUE INDEX ux_employment_active
  ON employment(person_id)
  WHERE end_date IS NULL;
CREATE INDEX ix_employment_person ON employment(person_id, start_date DESC);
CREATE INDEX ix_employment_dept ON employment(dept_id);
CREATE INDEX ix_employment_end ON employment(end_date);

-- =========================================================
-- 3. Department contacts
-- =========================================================

CREATE TABLE dept_contact (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  dept_id TEXT NOT NULL REFERENCES dept(id) ON DELETE CASCADE,
  eid TEXT NOT NULL REFERENCES employment(eid) ON DELETE RESTRICT,
  role TEXT NOT NULL CHECK (role IN ('head','assistant')),
  hotline TEXT,
  email TEXT,
  is_primary INTEGER NOT NULL DEFAULT 0 CHECK (is_primary IN (0,1)),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  created_by TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_by TEXT,
  UNIQUE (dept_id, eid, role)
);
-- Deliberately no unique index on is_primary:
-- multiple primary heads/assistants are allowed.
CREATE INDEX ix_dept_contact_eid ON dept_contact(eid);
CREATE INDEX ix_dept_contact_dept ON dept_contact(dept_id);

CREATE TRIGGER trg_dept_contact_validate_insert
BEFORE INSERT ON dept_contact
BEGIN
  SELECT CASE
    WHEN NOT EXISTS (
      SELECT 1
      FROM employment e
      WHERE e.eid = NEW.eid
        AND e.dept_id = NEW.dept_id
        AND e.end_date IS NULL
    )
    THEN RAISE(ABORT, 'dept_contact requires an active employee in the same department')
  END;
END;

CREATE TRIGGER trg_dept_contact_validate_update
BEFORE UPDATE OF dept_id, eid ON dept_contact
BEGIN
  SELECT CASE
    WHEN NOT EXISTS (
      SELECT 1
      FROM employment e
      WHERE e.eid = NEW.eid
        AND e.dept_id = NEW.dept_id
        AND e.end_date IS NULL
    )
    THEN RAISE(ABORT, 'dept_contact requires an active employee in the same department')
  END;
END;

-- Historical validity is checked at write time only.
-- This view exposes contacts made stale by a later transfer or termination.
CREATE VIEW v_dept_contact_stale AS
SELECT
  dc.id AS dept_contact_id,
  dc.dept_id AS contact_dept_id,
  d.name AS contact_dept_name,
  dc.eid,
  e.person_id,
  p.name AS employee_name,
  e.dept_id AS current_dept_id,
  current_dept.name AS current_dept_name,
  e.end_date,
  dc.role,
  dc.is_primary,
  CASE
    WHEN e.eid IS NULL THEN 'EMPLOYMENT_MISSING'
    WHEN e.end_date IS NOT NULL THEN 'EMPLOYMENT_ENDED'
    WHEN e.dept_id IS NOT dc.dept_id THEN 'DEPARTMENT_MISMATCH'
    ELSE 'VALID'
  END AS stale_reason
FROM dept_contact dc
LEFT JOIN employment e ON e.eid = dc.eid
LEFT JOIN person p ON p.id = e.person_id
LEFT JOIN dept d ON d.id = dc.dept_id
LEFT JOIN dept current_dept ON current_dept.id = e.dept_id
WHERE e.eid IS NULL
   OR e.end_date IS NOT NULL
   OR e.dept_id IS NOT dc.dept_id;

-- =========================================================
-- 4. Import configuration and batches
-- =========================================================

CREATE TABLE import_mapping (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  source_id TEXT REFERENCES source(id),
  domain_id TEXT REFERENCES domain(id), -- NULL = person/employment import
  key_field TEXT NOT NULL,
  fallback_key TEXT,
  upsert_rule TEXT NOT NULL DEFAULT 'overwrite'
    CHECK (upsert_rule IN ('overwrite','skip_existing','flag_conflict')),
  column_map TEXT NOT NULL CHECK (json_valid(column_map)),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  created_by TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_by TEXT
);

CREATE TABLE import_batch (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  file_name TEXT,
  source_id TEXT REFERENCES source(id),
  mapping_id INTEGER REFERENCES import_mapping(id) ON DELETE SET NULL,
  key_field TEXT,
  fallback_key TEXT,
  stats TEXT CHECK (stats IS NULL OR json_valid(stats)),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  created_by TEXT
);

-- =========================================================
-- 5. C&B values
-- =========================================================

CREATE TABLE c (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  person_id TEXT REFERENCES person(id) ON DELETE RESTRICT,
  pid TEXT,
  pid_type TEXT CHECK (pid_type IN ('cccd','cmnd','passport','other')),
  source_id TEXT NOT NULL REFERENCES source(id),
  domain_id TEXT NOT NULL REFERENCES domain(id),
  data TEXT NOT NULL CHECK (json_valid(data)),
  value_key TEXT,
  batch_id INTEGER REFERENCES import_batch(id),
  owner_key TEXT GENERATED ALWAYS AS (
    CASE
      WHEN person_id IS NOT NULL THEN 'person:' || person_id
      ELSE 'pid:' || pid_type || ':' || pid
    END
  ) VIRTUAL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  created_by TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_by TEXT,
  CHECK (
    (person_id IS NOT NULL) OR
    (pid IS NOT NULL AND length(trim(pid)) > 0 AND pid_type IS NOT NULL)
  ),
  CHECK (
    (pid IS NULL AND pid_type IS NULL) OR
    (pid IS NOT NULL AND pid_type IS NOT NULL)
  )
);

-- One record per owner/source/domain for all domains except BANK_OTHER.
-- BANK_OTHER is unique per owner/source/domain/bank_code.
CREATE UNIQUE INDEX ux_c_owner_src_dom
  ON c(owner_key, source_id, domain_id)
  WHERE domain_id <> 'BANK_OTHER';

CREATE UNIQUE INDEX ux_c_bank_other_per_bank
  ON c(
    owner_key,
    source_id,
    domain_id,
    upper(trim(json_extract(data, '$.bank_code')))
  )
  WHERE domain_id = 'BANK_OTHER'
    AND json_type(data, '$.bank_code') = 'text'
    AND length(trim(json_extract(data, '$.bank_code'))) > 0;

CREATE INDEX ix_c_domain_source ON c(domain_id, source_id);
CREATE INDEX ix_c_value ON c(domain_id, value_key) WHERE value_key IS NOT NULL;
CREATE INDEX ix_c_pid ON c(pid_type, pid) WHERE pid IS NOT NULL;
CREATE INDEX ix_c_person_domain ON c(person_id, domain_id);

-- Application must normalize value_key by domain. Keep original data unchanged.
-- Suggested value_key rules:
-- BANK_VCB: digits only from $.vcb_account
-- BANK_OTHER: UPPER(TRIM($.bank_code)) || ':' || account with spaces/hyphens removed
-- TAX: remove whitespace and uppercase $.tax_code
-- SS: digits only from $.ss_number
-- The app must validate values before INSERT/UPDATE.

-- =========================================================
-- 6. C history / audit
-- =========================================================

CREATE TABLE c_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  c_id INTEGER NOT NULL,
  person_id TEXT,
  pid TEXT,
  pid_type TEXT,
  owner_key TEXT,
  source_id TEXT NOT NULL,
  domain_id TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('insert','update','delete')),
  old_data TEXT,
  new_data TEXT,
  old_value_key TEXT,
  new_value_key TEXT,
  old_batch_id INTEGER,
  new_batch_id INTEGER,
  changed_by TEXT,
  changed_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX ix_hist_c ON c_history(c_id, changed_at);
CREATE INDEX ix_hist_person ON c_history(person_id, domain_id, changed_at);
CREATE INDEX ix_hist_owner ON c_history(owner_key, domain_id, changed_at);

CREATE TRIGGER trg_c_history_insert
AFTER INSERT ON c
BEGIN
  INSERT INTO c_history(
    c_id, person_id, pid, pid_type, owner_key, source_id, domain_id,
    action, new_data, new_value_key, new_batch_id, changed_by
  )
  VALUES (
    NEW.id, NEW.person_id, NEW.pid, NEW.pid_type, NEW.owner_key,
    NEW.source_id, NEW.domain_id, 'insert', NEW.data, NEW.value_key,
    NEW.batch_id, NEW.created_by
  );
END;

CREATE TRIGGER trg_c_history_update
AFTER UPDATE OF
  person_id, pid, pid_type, source_id, domain_id, data, value_key, batch_id
ON c
WHEN
     OLD.person_id IS NOT NEW.person_id
  OR OLD.pid IS NOT NEW.pid
  OR OLD.pid_type IS NOT NEW.pid_type
  OR OLD.source_id IS NOT NEW.source_id
  OR OLD.domain_id IS NOT NEW.domain_id
  OR OLD.data IS NOT NEW.data
  OR OLD.value_key IS NOT NEW.value_key
  OR OLD.batch_id IS NOT NEW.batch_id
BEGIN
  INSERT INTO c_history(
    c_id, person_id, pid, pid_type, owner_key, source_id, domain_id,
    action, old_data, new_data, old_value_key, new_value_key,
    old_batch_id, new_batch_id, changed_by
  )
  VALUES (
    NEW.id, NEW.person_id, NEW.pid, NEW.pid_type, NEW.owner_key,
    NEW.source_id, NEW.domain_id, 'update',
    OLD.data, NEW.data, OLD.value_key, NEW.value_key,
    OLD.batch_id, NEW.batch_id, NEW.updated_by
  );
END;

CREATE TRIGGER trg_c_history_delete
AFTER DELETE ON c
BEGIN
  INSERT INTO c_history(
    c_id, person_id, pid, pid_type, owner_key, source_id, domain_id,
    action, old_data, old_value_key, old_batch_id, changed_by
  )
  VALUES (
    OLD.id, OLD.person_id, OLD.pid, OLD.pid_type, OLD.owner_key,
    OLD.source_id, OLD.domain_id, 'delete',
    OLD.data, OLD.value_key, OLD.batch_id, OLD.updated_by
  );
END;

-- =========================================================
-- 7. Import conflicts
-- =========================================================

CREATE TABLE import_conflict (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  c_id INTEGER NOT NULL REFERENCES c(id) ON DELETE RESTRICT,
  batch_id INTEGER REFERENCES import_batch(id) ON DELETE SET NULL,
  mapping_id INTEGER REFERENCES import_mapping(id) ON DELETE SET NULL,
  incoming_data TEXT NOT NULL CHECK (json_valid(incoming_data)),
  incoming_value_key TEXT,
  existing_data TEXT NOT NULL CHECK (json_valid(existing_data)),
  existing_value_key TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','resolved','ignored')),
  resolution_note TEXT,
  detected_at TEXT NOT NULL DEFAULT (datetime('now')),
  detected_by TEXT,
  resolved_at TEXT,
  resolved_by TEXT
);
CREATE INDEX ix_import_conflict_status ON import_conflict(status, detected_at);
CREATE INDEX ix_import_conflict_c ON import_conflict(c_id, status);

-- import behavior implemented by application:
-- overwrite: update existing c row with incoming data/value_key.
-- skip_existing: do not modify existing c row.
-- flag_conflict: if incoming value differs, preserve c and INSERT import_conflict.

-- =========================================================
-- 8. Events / payroll work
-- =========================================================

CREATE TABLE event (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('monthly_payroll','leaver_payroll','other')),
  range_start TEXT,
  range_end TEXT,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open','closed','archived')),
  note TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  created_by TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_by TEXT
);

CREATE TABLE event_member (
  event_id INTEGER NOT NULL REFERENCES event(id) ON DELETE CASCADE,
  eid TEXT NOT NULL REFERENCES employment(eid) ON DELETE RESTRICT,
  added_by TEXT,
  added_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_reminded_at TEXT,
  remind_count INTEGER NOT NULL DEFAULT 0 CHECK (remind_count >= 0),
  note TEXT,
  PRIMARY KEY (event_id, eid)
);
-- Deliberately no additional index on event_member(eid), per design decision.

-- =========================================================
-- 9. Working sheets
-- =========================================================

CREATE TABLE working_sheet (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','archived')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  created_by TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_by TEXT
);

CREATE TABLE working_sheet_row (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sheet_id INTEGER NOT NULL REFERENCES working_sheet(id) ON DELETE CASCADE,
  key_type TEXT NOT NULL CHECK (key_type IN ('pid','eid','other')),
  key_value TEXT NOT NULL,
  person_id TEXT REFERENCES person(id) ON DELETE RESTRICT,
  match_status TEXT NOT NULL DEFAULT 'unmatched'
    CHECK (match_status IN ('matched','unmatched','ambiguous')),
  raw_data TEXT CHECK (raw_data IS NULL OR json_valid(raw_data)),
  review_note TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (sheet_id, key_type, key_value),
  CHECK (
    (match_status = 'matched' AND person_id IS NOT NULL) OR
    (match_status IN ('unmatched','ambiguous') AND person_id IS NULL)
  )
);
CREATE INDEX ix_working_sheet_row_person ON working_sheet_row(person_id);
CREATE INDEX ix_working_sheet_row_status ON working_sheet_row(sheet_id, match_status);

-- Matching policy in application:
-- 1. If PID exists, key_type='pid'. Include document type in key_value to avoid
--    collisions, e.g. 'cccd:0123...' or 'passport:X123...'.
-- 2. Else if EID exists, key_type='eid'; resolve employment.eid -> person_id.
-- 3. Else key_type='other'; requires manual matching.
-- 4. If one key maps to multiple people, person_id=NULL and match_status='ambiguous'.
-- 5. Never auto-select one candidate from an ambiguous match.

-- =========================================================
-- 10. Views
-- =========================================================

-- One row per non-deleted person, with latest/current employment if any.
CREATE VIEW iv_employee AS
WITH ranked_employment AS (
  SELECT
    e.*,
    ROW_NUMBER() OVER (
      PARTITION BY e.person_id
      ORDER BY (e.end_date IS NULL) DESC, e.start_date DESC, e.eid DESC
    ) AS rn
  FROM employment e
)
SELECT
  p.id AS person_id,
  p.pid,
  p.pid_type,
  p.name,
  p.name_romanized,
  p.phone,
  p.email,
  e.eid,
  e.dept_id,
  d.name AS dept_name,
  e.start_date,
  e.end_date,
  e.work_type,
  CASE
    WHEN e.eid IS NULL THEN 'NONE'
    WHEN e.end_date IS NULL THEN 'ACTIVE'
    ELSE 'ENDED'
  END AS employment_state
FROM person p
LEFT JOIN ranked_employment e
  ON e.person_id = p.id AND e.rn = 1
LEFT JOIN dept d ON d.id = e.dept_id
WHERE p.deleted_at IS NULL;

-- Effective C&B value: only source groups allowed to be effective.
CREATE VIEW v_c_effective AS
WITH ranked AS (
  SELECT
    c.*,
    ROW_NUMBER() OVER (
      PARTITION BY c.owner_key, c.domain_id
      ORDER BY g.trust_level DESC, c.updated_at DESC, c.id DESC
    ) AS rn
  FROM c
  JOIN source s ON s.id = c.source_id
  JOIN source_group g ON g.id = s.group_id
  WHERE g.can_be_effective = 1
)
SELECT
  owner_key, person_id, pid, pid_type, domain_id,
  source_id, data, value_key, updated_at
FROM ranked
WHERE rn = 1;

-- Pick at most one latest record per person/domain/source_group before pivoting.
-- This prevents row multiplication when a group has multiple source records.
CREATE VIEW v_c_status AS
WITH ranked_group AS (
  SELECT
    c.*,
    s.group_id,
    ROW_NUMBER() OVER (
      PARTITION BY c.person_id, c.domain_id, s.group_id
      ORDER BY c.updated_at DESC, c.id DESC
    ) AS rn
  FROM c
  JOIN source s ON s.id = c.source_id
  WHERE c.person_id IS NOT NULL
    AND s.group_id IN ('HRIS','VERIFIED','DECL')
),
picked AS (
  SELECT * FROM ranked_group WHERE rn = 1
),
pivoted AS (
  SELECT
    person_id,
    domain_id,
    MAX(CASE WHEN group_id = 'HRIS' THEN value_key END) AS hris_value,
    MAX(CASE WHEN group_id = 'VERIFIED' THEN value_key END) AS verified_value,
    MAX(CASE WHEN group_id = 'DECL' THEN value_key END) AS decl_value,
    MAX(CASE WHEN group_id = 'HRIS' THEN id END) AS hris_c_id,
    MAX(CASE WHEN group_id = 'VERIFIED' THEN id END) AS verified_c_id,
    MAX(CASE WHEN group_id = 'DECL' THEN id END) AS decl_c_id
  FROM picked
  GROUP BY person_id, domain_id
)
SELECT
  p.id AS person_id,
  d.id AS domain_id,
  x.hris_value,
  x.verified_value,
  x.decl_value,
  CASE
    WHEN x.hris_c_id IS NOT NULL
     AND x.verified_c_id IS NOT NULL
     AND x.hris_value IS x.verified_value THEN 'MATCH'
    WHEN x.hris_c_id IS NOT NULL
     AND x.verified_c_id IS NOT NULL THEN 'CONFLICT'
    WHEN x.verified_c_id IS NOT NULL THEN 'PENDING_PUSH'
    WHEN x.hris_c_id IS NOT NULL THEN 'HRIS_ONLY'
    ELSE 'MISSING'
  END AS status
FROM person p
CROSS JOIN domain d
LEFT JOIN pivoted x
  ON x.person_id = p.id AND x.domain_id = d.id
WHERE p.deleted_at IS NULL;

CREATE VIEW v_c_duplicates AS
SELECT
  domain_id,
  value_key,
  COUNT(DISTINCT owner_key) AS owners_count,
  GROUP_CONCAT(DISTINCT owner_key) AS owners
FROM c
WHERE value_key IS NOT NULL
GROUP BY domain_id, value_key
HAVING COUNT(DISTINCT owner_key) > 1;

-- =========================================================
-- 11. updated_at maintenance
-- =========================================================
-- The app may explicitly supply updated_at. If it leaves it unchanged during
-- UPDATE, these triggers refresh it automatically. They do not overwrite a
-- deliberately supplied updated_at value.
CREATE TRIGGER trg_dept_updated_at AFTER UPDATE ON dept
WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE dept SET updated_at = datetime('now') WHERE id = NEW.id;
END;
CREATE TRIGGER trg_source_group_updated_at AFTER UPDATE ON source_group
WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE source_group SET updated_at = datetime('now') WHERE id = NEW.id;
END;
CREATE TRIGGER trg_source_updated_at AFTER UPDATE ON source
WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE source SET updated_at = datetime('now') WHERE id = NEW.id;
END;
CREATE TRIGGER trg_domain_updated_at AFTER UPDATE ON domain
WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE domain SET updated_at = datetime('now') WHERE id = NEW.id;
END;
CREATE TRIGGER trg_person_updated_at AFTER UPDATE ON person
WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE person SET updated_at = datetime('now') WHERE id = NEW.id;
END;
CREATE TRIGGER trg_employment_updated_at AFTER UPDATE ON employment
WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE employment SET updated_at = datetime('now') WHERE eid = NEW.eid;
END;
CREATE TRIGGER trg_dept_contact_updated_at AFTER UPDATE ON dept_contact
WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE dept_contact SET updated_at = datetime('now') WHERE id = NEW.id;
END;
CREATE TRIGGER trg_import_mapping_updated_at AFTER UPDATE ON import_mapping
WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE import_mapping SET updated_at = datetime('now') WHERE id = NEW.id;
END;
CREATE TRIGGER trg_event_updated_at AFTER UPDATE ON event
WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE event SET updated_at = datetime('now') WHERE id = NEW.id;
END;
CREATE TRIGGER trg_working_sheet_updated_at AFTER UPDATE ON working_sheet
WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE working_sheet SET updated_at = datetime('now') WHERE id = NEW.id;
END;
CREATE TRIGGER trg_working_sheet_row_updated_at AFTER UPDATE ON working_sheet_row
WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE working_sheet_row SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- =========================================================
-- 12. Seed data
-- =========================================================

INSERT INTO source_group(id, name, trust_level, can_be_effective, detail) VALUES
  ('HRIS',     'HRIS',                 100, 1, 'Nguồn chuẩn cho thông tin nhân sự và tài khoản HRIS'),
  ('VERIFIED', 'C&B đã xác thực',       90, 1, 'Dữ liệu C&B đã được HR xác thực'),
  ('OTHER',    'Nguồn đối chiếu khác',  80, 1, 'Excel, email hoặc nguồn bên thứ ba đã được xác thực'),
  ('DECL',     'NLĐ tự kê khai',        10, 0, 'Chỉ dùng đối chiếu, không được chọn làm dữ liệu hiệu lực');

INSERT INTO source(id, group_id, detail) VALUES
  ('HRIS',  'HRIS',     'Dữ liệu nhân sự và tài khoản từ HRIS'),
  ('VER',   'VERIFIED', 'Dữ liệu C&B đã xác thực'),
  ('DECL',  'DECL',     'Form tự kê khai của người lao động'),
  ('OTHER', 'OTHER',    'Nguồn đối chiếu khác');

INSERT INTO source_alias(alias, source_id) VALUES
  ('hris', 'HRIS'),
  ('ver', 'VER'),
  ('verified', 'VER'),
  ('decl', 'DECL'),
  ('declaration', 'DECL'),
  ('other', 'OTHER');

INSERT INTO domain(id, detail, data_schema) VALUES
  ('BANK_VCB', 'Số tài khoản Vietcombank',
   '{"value_key_field":"vcb_account","fields":{"vcb_account":{"type":"string","pattern":"^[0-9]{10,13}$","required":true}}}'),
  ('BANK_OTHER', 'Tài khoản ngân hàng khác',
   '{"value_key_field":["bank_code","bank_account"],"fields":{"bank_account":{"type":"string","required":true},"bank_code":{"type":"string","required":true}}}'),
  ('TAX', 'Mã số thuế',
   '{"value_key_field":"tax_code","fields":{"tax_code":{"type":"string","pattern":"^[0-9]{10}(-[0-9]{3})?$","required":true}}}'),
  ('SS', 'Số bảo hiểm xã hội',
   '{"value_key_field":"ss_number","fields":{"ss_number":{"type":"string","pattern":"^[0-9]{10}$","required":true}}}');

COMMIT;
