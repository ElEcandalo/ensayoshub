const TARIFFS = {
  rehearsal: {
    weekday: 17000,
    weekend_holiday: 18000,
  },
  class: {
    weekday: 19000,
    weekend_holiday: 20000,
  },
} as const;

export function getTariff(serviceType: 'rehearsal' | 'class', isWeekendOrHoliday: boolean): number {
  const tariffs = TARIFFS[serviceType];
  return isWeekendOrHoliday ? tariffs.weekend_holiday : tariffs.weekday;
}

export function isWeekendOrHoliday(date: Date): boolean {
  const dayOfWeek = date.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6;
}

export function calculateExcess(
  scheduledEnd: Date,
  actualEnd: Date,
  serviceType: 'rehearsal' | 'class'
): { extraMinutes: number; extraAmount: number; applyHolidayRate: boolean } | null {
  const diffMs = actualEnd.getTime() - scheduledEnd.getTime();
  const extraMinutes = Math.floor(diffMs / 60000);

  if (extraMinutes <= 15) return null;

  let extraAmount = 0;
  let applyHolidayRate = false;

  if (extraMinutes > 15 && extraMinutes <= 45) {
    extraAmount = getTariff(serviceType, false) / 2;
  } else if (extraMinutes > 45) {
    extraAmount = getTariff(serviceType, true);
    applyHolidayRate = true;
  }

  return { extraMinutes, extraAmount, applyHolidayRate };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function calculateHours(startTime: string, endTime: string): number {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  return (endHour - startHour) + (endMin - startMin) / 60;
}
