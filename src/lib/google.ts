import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

export const getGoogleCalendarClient = () => {
    const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    if (!serviceAccountJson) {
        throw new Error('Missing GOOGLE_SERVICE_ACCOUNT_JSON');
    }

    let credentials;
    try {
        credentials = JSON.parse(serviceAccountJson);
    } catch (e) {
        // Handle case where it might be base64 encoded if user prefers that
        try {
            credentials = JSON.parse(Buffer.from(serviceAccountJson, 'base64').toString('utf-8'));
        } catch (e2) {
            throw new Error('Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON');
        }
    }

    const auth = new JWT({
        email: credentials.client_email,
        key: credentials.private_key,
        scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    });

    return google.calendar({ version: 'v3', auth });
};

export const fetchCalendarEvents = async (timeMin: Date, timeMax: Date) => {
    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    if (!calendarId) {
        throw new Error('Missing GOOGLE_CALENDAR_ID');
    }

    const calendar = getGoogleCalendarClient();

    const response = await calendar.events.list({
        calendarId,
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
    });

    return response.data.items || [];
};
