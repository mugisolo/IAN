import { getAccessToken } from './firebase.ts';

// Helper to make Google API requests with proper Bearer token headers
async function googleApiFetch(url: string, options: RequestInit = {}) {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('User is not authenticated with Google');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...(options.headers || {}),
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Google API error from ${url}:`, errorBody);
    throw new Error(`Google API request failed: ${response.statusText}`);
  }

  return response.json();
}

// ==========================================
// 1. GOOGLE CALENDAR & GOOGLE MEET INTEGRATION
// ==========================================

export interface CalendarEventInput {
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  durationMinutes?: number;
}

export async function createGoogleCalendarEvent(input: CalendarEventInput) {
  // Translate human date/time to ISO string
  const startDateTime = new Date(`${input.date}T${input.time.split(' ')[0]}:00`).toISOString();
  const endDateTime = new Date(new Date(startDateTime).getTime() + (input.durationMinutes || 60) * 60 * 1000).toISOString();

  const url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1';
  
  const payload = {
    summary: input.title,
    description: input.description,
    start: {
      dateTime: startDateTime,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    end: {
      dateTime: endDateTime,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    // Request automatic creation of a Google Meet space
    conferenceData: {
      createRequest: {
        requestId: `meet-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        conferenceSolutionKey: {
          type: 'hangoutsMeet',
        },
      },
    },
  };

  const event = await googleApiFetch(url, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return {
    eventId: event.id,
    htmlLink: event.htmlLink,
    meetLink: event.hangoutLink || null, // Meet URL is returned in hangoutLink
  };
}

// ==========================================
// 2. GOOGLE DOCS INTEGRATION
// ==========================================

export interface DocCreationInput {
  title: string;
  content: string;
}

export async function createGoogleDoc(input: DocCreationInput) {
  // Create an empty document first
  const createUrl = 'https://docs.googleapis.com/v1/documents';
  const doc = await googleApiFetch(createUrl, {
    method: 'POST',
    body: JSON.stringify({ title: input.title }),
  });

  const documentId = doc.documentId;

  // Insert content into the document using batchUpdate
  const updateUrl = `https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`;
  await googleApiFetch(updateUrl, {
    method: 'POST',
    body: JSON.stringify({
      requests: [
        {
          insertText: {
            text: input.content,
            location: {
              index: 1,
            },
          },
        },
      ],
    }),
  });

  return {
    documentId,
    htmlLink: `https://docs.google.com/document/d/${documentId}/edit`,
  };
}

// ==========================================
// 3. GOOGLE TASKS INTEGRATION
// ==========================================

export interface GoogleTaskInput {
  title: string;
}

export async function listGoogleTasks() {
  const url = 'https://www.googleapis.com/tasks/v1/lists/@default/tasks';
  const data = await googleApiFetch(url);
  return data.items || [];
}

export async function createGoogleTask(title: string) {
  const url = 'https://www.googleapis.com/tasks/v1/lists/@default/tasks';
  const task = await googleApiFetch(url, {
    method: 'POST',
    body: JSON.stringify({ title, status: 'needsAction' }),
  });
  return task;
}

export async function updateGoogleTaskStatus(taskId: string, completed: boolean) {
  const url = `https://www.googleapis.com/tasks/v1/lists/@default/tasks/${taskId}`;
  const task = await googleApiFetch(url, {
    method: 'PUT',
    body: JSON.stringify({
      id: taskId,
      status: completed ? 'completed' : 'needsAction',
    }),
  });
  return task;
}

export async function deleteGoogleTask(taskId: string) {
  const url = `https://www.googleapis.com/tasks/v1/lists/@default/tasks/${taskId}`;
  const token = await getAccessToken();
  if (!token) {
    throw new Error('User is not authenticated with Google');
  }

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete Google task: ${response.statusText}`);
  }

  return true;
}
