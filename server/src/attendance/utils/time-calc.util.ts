export function roundToHalfHour(hours: number): number {
  const wholeHours = Math.floor(hours);
  const minutes = (hours - wholeHours) * 60;

  let fraction: number;
  if (minutes < 15) fraction = 0;
  else if (minutes < 45) fraction = 0.5;
  else fraction = 1.0;

  return wholeHours + fraction;
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function calculateHours(
  checkInTime: Date,
  checkOutTime: Date,
  workDate: Date,
  shiftStart: string,
  shiftEnd: string,
): {
  totalHours: number;
  normalHours: number;
  otHours: number;
} {
  const [startH, startM] = shiftStart.split(':').map(Number);
  const [endH, endM] = shiftEnd.split(':').map(Number);

  const shiftStartMs = new Date(workDate);
  shiftStartMs.setHours(startH, startM, 0, 0);

  const shiftEndMs = new Date(workDate);
  shiftEndMs.setHours(endH, endM, 0, 0);

  const weekend = isWeekend(workDate);

  let normalHours = 0;
  let otHours = 0;

  if (weekend) {
    // วันเสาร์-อาทิตย์ — ทุกชั่วโมงเป็น OT
    const raw =
      (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
    otHours = roundToHalfHour(raw);
  } else {
    // เข้าก่อน shift start → ส่วนนั้นเป็น OT
    if (checkInTime < shiftStartMs) {
      const earlyOT =
        (shiftStartMs.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
      otHours += roundToHalfHour(earlyOT);
    }

    // ออกหลัง shift end → ส่วนนั้นเป็น OT
    if (checkOutTime > shiftEndMs) {
      const lateOT =
        (checkOutTime.getTime() - shiftEndMs.getTime()) / (1000 * 60 * 60);
      otHours += roundToHalfHour(lateOT);
    }

    // Normal hours — ช่วง overlap ระหว่าง checkin-checkout กับ shift
    const normalStart = checkInTime > shiftStartMs ? checkInTime : shiftStartMs;
    const normalEnd = checkOutTime < shiftEndMs ? checkOutTime : shiftEndMs;

    if (normalEnd > normalStart) {
      const raw =
        (normalEnd.getTime() - normalStart.getTime()) / (1000 * 60 * 60);
      normalHours = roundToHalfHour(raw);
    }
  }

  return {
    totalHours: normalHours + otHours,
    normalHours,
    otHours,
  };
}
