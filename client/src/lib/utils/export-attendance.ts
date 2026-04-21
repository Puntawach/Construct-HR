import * as XLSX from "xlsx-js-style"
import type { AttendanceWithEmployee } from "@/lib/api/attendance/attendance.type"
import type { Team } from "@/lib/api/admin/team.type"

function siteAbbr(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 4)
}

type SimpleEmployee = {
  id: string
  firstName: string
  lastName: string
  dailyRate: number | null
  allowancePerDay: number | null
}

function buildSheet(
  teamAttendances: AttendanceWithEmployee[],
  teamEmployees: SimpleEmployee[],
  month: number,
  year: number,
): XLSX.WorkSheet {
  const ws: XLSX.WorkSheet = {}
  const daysCount = new Date(year, month, 0).getDate()
  const days = Array.from({ length: daysCount }, (_, i) => i + 1)
  const monthLabel = new Date(year, month - 1, 1).toLocaleDateString("th-TH", {
    month: "long", year: "numeric",
  })

  let row = 0
  if (!ws["!merges"]) ws["!merges"] = []

  // Row 0: Title
  ws[XLSX.utils.encode_cell({ r: row, c: 1 })] = {
    v: monthLabel, t: "s",
    s: { font: { bold: true, sz: 14 }, alignment: { horizontal: "center" } },
  }
  ws["!merges"].push({ s: { r: 0, c: 1 }, e: { r: 0, c: 2 + daysCount } })
  row++

  // Row 1: Column headers
  const headerStyle = {
    font: { bold: true, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "1F4E79" } },
    alignment: { horizontal: "center" },
  }

  ;["ลำดับ", "ชื่อ - นามสกุล", "อัตรา"].forEach((h, i) => {
    ws[XLSX.utils.encode_cell({ r: row, c: i })] = { v: h, t: "s", s: headerStyle }
  })

  days.forEach((d, i) => {
    ws[XLSX.utils.encode_cell({ r: row, c: 3 + i })] = {
      v: d, t: "n", s: { ...headerStyle, alignment: { horizontal: "center" } },
    }
  })

  const summaryHeaders = ["รวมวัน", "รวมชม.", "ค่าแรง", "เบี้ยเลี้ยง", "หักภาษี 5%", "รวมเงิน"]
  summaryHeaders.forEach((h, i) => {
    ws[XLSX.utils.encode_cell({ r: row, c: 3 + daysCount + i })] = {
      v: h, t: "s", s: headerStyle,
    }
  })
  row++

  // Row 2: Site abbreviations
  days.forEach((d, i) => {
    const dayAtts = teamAttendances.filter((a) => {
      const wd = new Date(a.workDate)
      return wd.getFullYear() === year && wd.getMonth() + 1 === month && wd.getDate() === d
    })
    const sites = [...new Set(dayAtts.map((a) => a.site?.name ?? ""))]
      .filter(Boolean)
      .map(siteAbbr)
      .join("/")
    ws[XLSX.utils.encode_cell({ r: row, c: 3 + i })] = {
      v: sites, t: "s",
      s: { alignment: { horizontal: "center" }, font: { sz: 8, color: { rgb: "888888" } } },
    }
  })
  row++

  // Employee rows
  let seq = 1
  for (const emp of teamEmployees) {
    const empAtts = teamAttendances.filter((a) => a.employee.id === emp.id)
    const dailyRate = emp.dailyRate ?? 0
    const allowancePerDay = emp.allowancePerDay ?? 0
    const hourlyRate = dailyRate / 8

    const dayMap: Record<number, AttendanceWithEmployee> = {}
    empAtts.forEach((a) => { dayMap[new Date(a.workDate).getDate()] = a })

    const workDays = empAtts.filter((a) => a.status === "APPROVED").length
    const totalNormal = empAtts.reduce((s, a) => s + a.normalHours, 0)
    const totalOT = empAtts.reduce((s, a) => s + a.otHours, 0)
    const normalPay = totalNormal * hourlyRate
    const otPay = totalOT * hourlyRate * 1.5
    const allowanceTotal = workDays * allowancePerDay
    const gross = normalPay + otPay + allowanceTotal
    const tax = gross * 0.05
    const net = gross - tax

    // Normal row
    ws[XLSX.utils.encode_cell({ r: row, c: 0 })] = { v: seq, t: "n", s: { alignment: { horizontal: "center" } } }
    ws[XLSX.utils.encode_cell({ r: row, c: 1 })] = { v: `${emp.firstName} ${emp.lastName}`, t: "s" }
    ws[XLSX.utils.encode_cell({ r: row, c: 2 })] = { v: dailyRate, t: "n" }

    days.forEach((d, i) => {
      const att = dayMap[d]
      if (att) {
        ws[XLSX.utils.encode_cell({ r: row, c: 3 + i })] = {
          v: att.normalHours > 0 ? +att.normalHours.toFixed(1) : 1,
          t: "n", s: { alignment: { horizontal: "center" } },
        }
      }
    })

    ws[XLSX.utils.encode_cell({ r: row, c: 3 + daysCount })] = { v: workDays, t: "n" }
    ws[XLSX.utils.encode_cell({ r: row, c: 4 + daysCount })] = { v: +totalNormal.toFixed(1), t: "n" }
    ws[XLSX.utils.encode_cell({ r: row, c: 5 + daysCount })] = { v: +normalPay.toFixed(2), t: "n", s: { numFmt: "#,##0.00" } }
    ws[XLSX.utils.encode_cell({ r: row, c: 6 + daysCount })] = { v: +allowanceTotal.toFixed(2), t: "n", s: { numFmt: "#,##0.00" } }
    ws[XLSX.utils.encode_cell({ r: row, c: 7 + daysCount })] = { v: +tax.toFixed(2), t: "n", s: { numFmt: "#,##0.00" } }
    ws[XLSX.utils.encode_cell({ r: row, c: 8 + daysCount })] = {
      v: +net.toFixed(2), t: "n",
      s: { font: { bold: true }, numFmt: "#,##0.00" },
    }
    row++

    // OT row
    if (totalOT > 0) {
      const otStyle = { font: { color: { rgb: "E26B0A" } }, alignment: { horizontal: "center" } }
      ws[XLSX.utils.encode_cell({ r: row, c: 1 })] = { v: "OT X1.5", t: "s", s: otStyle }
      ws[XLSX.utils.encode_cell({ r: row, c: 2 })] = { v: +(hourlyRate * 1.5).toFixed(2), t: "n", s: otStyle }

      days.forEach((d, i) => {
        const att = dayMap[d]
        if (att && att.otHours > 0) {
          ws[XLSX.utils.encode_cell({ r: row, c: 3 + i })] = {
            v: +att.otHours.toFixed(1), t: "n", s: otStyle,
          }
        }
      })

      ws[XLSX.utils.encode_cell({ r: row, c: 4 + daysCount })] = { v: +totalOT.toFixed(1), t: "n", s: otStyle }
      ws[XLSX.utils.encode_cell({ r: row, c: 5 + daysCount })] = { v: +otPay.toFixed(2), t: "n", s: { ...otStyle, numFmt: "#,##0.00" } }
      row++
    }

    row++ // blank separator
    seq++
  }

  // Column widths
  ws["!cols"] = [
    { wch: 6 }, { wch: 22 }, { wch: 8 },
    ...days.map(() => ({ wch: 4 })),
    { wch: 8 }, { wch: 8 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 14 },
  ]

  ws["!ref"] = XLSX.utils.encode_range({
    s: { r: 0, c: 0 },
    e: { r: row, c: 3 + daysCount + 5 },
  })

  return ws
}

export function exportAttendanceExcel(
  attendances: AttendanceWithEmployee[],
  teams: Team[],
  month: number,
  year: number,
) {
  const wb = XLSX.utils.book_new()

  // Sheet ตามทีม
  teams.forEach((team) => {
    const teamAtts = attendances.filter((a) => a.employee.teamId === team.id)
    if (teamAtts.length === 0) return

    const empIds = [...new Set(teamAtts.map((a) => a.employee.id))]
    const employees: SimpleEmployee[] = empIds.map((id) => {
      const att = teamAtts.find((a) => a.employee.id === id)!
      return {
        id,
        firstName: att.employee.firstName,
        lastName: att.employee.lastName,
        dailyRate: att.employee.dailyRate ?? null,
        allowancePerDay: att.employee.allowancePerDay ?? null,
      }
    })

    const ws = buildSheet(teamAtts, employees, month, year)
    XLSX.utils.book_append_sheet(wb, ws, team.name.slice(0, 31))
  })

  // Sheet รวมทั้งหมด
  const allEmpIds = [...new Set(attendances.map((a) => a.employee.id))]
  const allEmployees: SimpleEmployee[] = allEmpIds.map((id) => {
    const att = attendances.find((a) => a.employee.id === id)!
    return {
      id,
      firstName: att.employee.firstName,
      lastName: att.employee.lastName,
      dailyRate: att.employee.dailyRate ?? null,
      allowancePerDay: att.employee.allowancePerDay ?? null,
    }
  })

  const allWs = buildSheet(attendances, allEmployees, month, year)
  XLSX.utils.book_append_sheet(wb, allWs, "รวมทั้งหมด")

  XLSX.writeFile(wb, `attendance-${year}-${String(month).padStart(2, "0")}.xlsx`)
}