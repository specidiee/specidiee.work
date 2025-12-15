import { addMinutes, format, parse, isBefore, isAfter, startOfDay, addDays } from 'date-fns';

export interface TimeSlot {
    start: Date;
    end: Date;
    isAvailable: boolean;
}

export const TIME_SLOT_DURATION = 15; // minutes

export interface ExcludedTime {
    type: 'SLEEP' | 'MEAL' | 'TRAVEL' | 'OTHER';
    start_time: string; // HH:mm:ss
    end_time: string; // HH:mm:ss
    is_active: boolean;
}

/**
 * Generates time slots for a given day within the specified range, filtering out excluded times.
 */
export function generateTimeSlots(
    date: Date,
    startHour: number = 6,
    endHour: number = 24,
    excludedTimes: ExcludedTime[] = []
): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const dayStart = startOfDay(date);

    let currentTime = addMinutes(dayStart, startHour * 60);
    const endTime = addMinutes(dayStart, endHour * 60);

    while (isBefore(currentTime, endTime)) {
        const nextTime = addMinutes(currentTime, TIME_SLOT_DURATION);

        // Check if this slot overlaps with any excluded time
        const slotStartStr = format(currentTime, 'HH:mm');
        let slotEndStr = format(nextTime, 'HH:mm');

        // Handle midnight wrapping for comparison: "00:00" should be "24:00" if it's the end of the day slot
        if (slotEndStr === '00:00') {
            slotEndStr = '24:00';
        }

        const isExcluded = excludedTimes.some(ex => {
            if (!ex.is_active) return false;

            // Case 1: Standard Time Range (09:00 - 18:00)
            if (ex.start_time < ex.end_time) {
                return slotStartStr < ex.end_time && slotEndStr > ex.start_time;
            }
            // Case 2: Wrapping Time Range (22:00 - 06:00)
            // Excluded if slot is AFTER 22:00 OR BEFORE 06:00
            else {
                // e.g. Slot 23:00. Start 23:00 > 22:00 (True)
                // e.g. Slot 05:00. End 05:15 < 06:00 (True)

                // Logic: Intersection with [Start, 24:00) OR [00:00, End)

                const overlapsLate = slotEndStr > ex.start_time; // Slot ends after Start (e.g. 22:15 > 22:00)
                const overlapsEarly = slotStartStr < ex.end_time; // Slot starts before End (e.g. 05:45 < 06:00)

                return overlapsLate || overlapsEarly;
            }
        });

        if (!isExcluded) {
            slots.push({
                start: currentTime,
                end: nextTime,
                isAvailable: true,
            });
        }
        currentTime = nextTime;
    }

    return slots;
}

/**
 * Checks if a task of duration (minutes) fits in a sequence of slots starting at index.
 */
export function canFitTask(
    slots: TimeSlot[],
    startIndex: number,
    durationMinutes: number
): boolean {
    const slotsNeeded = Math.ceil(durationMinutes / TIME_SLOT_DURATION);

    if (startIndex + slotsNeeded > slots.length) {
        return false;
    }

    for (let i = 0; i < slotsNeeded; i++) {
        if (!slots[startIndex + i].isAvailable) {
            return false;
        }
    }

    return true;
}

/**
 * Marks slots as unavailable.
 */
export function occupySlots(
    slots: TimeSlot[],
    startIndex: number,
    durationMinutes: number
): void {
    const slotsNeeded = Math.ceil(durationMinutes / TIME_SLOT_DURATION);
    for (let i = 0; i < slotsNeeded; i++) {
        if (slots[startIndex + i]) {
            slots[startIndex + i].isAvailable = false;
        }
    }
}
