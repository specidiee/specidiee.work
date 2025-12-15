import { generateTimeSlots } from './timeSlots';

function testExclusions() {
    console.log('--- Excluded Time Test ---');

    const now = new Date('2025-12-16T08:00:00Z'); // 8 AM
    // Range 8-20 (12h = 48 slots)

    const exclusions = [
        { type: 'MEAL', start_time: '12:00:00', end_time: '13:00:00', is_active: true }
    ];

    const slots = generateTimeSlots(now, 8, 20, exclusions as any);

    console.log(`Total Slots generated: ${slots.length}`);
    // Expected: 48 - 4 (1 hour) = 44 slots

    // Check around 12:00
    const noonSlots = slots.filter(s => {
        const h = s.start.getHours();
        return h === 12; // Should be none if 12:00-13:00 is excluded exactly? 
        // Wait, startOfDay uses Local Time usually unless specified. 
        // addMinutes uses Date object. 
        // My generateTimeSlots uses addMinutes from startOfDay(date). 
        // If I pass '2025-12-16T08:00:00Z', startOfDay might be 00:00 Z. 
        // 8*60 = 480 mins = 08:00 Z.
        // 12*60 = 720 mins = 12:00 Z.
        // So 12:00 slot starts at 12:00. End at 12:15.
        // Excluded: 12:00:00 to 13:00:00.
        // 12:00 < 13:00 and 12:15 > 12:00. Excluded? Yes.
    });

    console.log(`Slots starting at 12: ${noonSlots.length}`);

    if (slots.length === 44 && noonSlots.length === 0) {
        console.log('PASS: Lunch hour excluded correctly');
    } else {
        console.log(`FAIL: Expected 44 slots, 0 noon slots. Got ${slots.length}, ${noonSlots.length}`);
    }
}

testExclusions();
