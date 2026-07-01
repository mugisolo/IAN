import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './db/index.ts';
import { users, events, rsvps, tasks } from './db/schema.ts';
import { adminAuth, DecodedIdToken } from './services/firebase-admin.ts';
import { eq, and } from 'drizzle-orm';
import { sendMessageToArchie, analyzeResearchTopic as gAnalyzeTopic, vaultSearch as gVaultSearch } from './services/geminiService.ts';

interface AuthenticatedRequest extends Request {
  user?: DecodedIdToken;
  dbUser?: typeof users.$inferSelect;
}

// Authentication Middleware to verify Firebase ID Token
async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;

    // Fetch the user from the relational database
    const dbUserList = await db.select().from(users).where(eq(users.uid, decodedToken.uid));
    if (dbUserList.length > 0) {
      req.dbUser = dbUserList[0];
    }
    next();
  } catch (error) {
    console.error('Auth verification failed:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
}

// Optional Auth Middleware to parse token if it exists but not require it
async function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split('Bearer ')[1];
    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      req.user = decodedToken;
      const dbUserList = await db.select().from(users).where(eq(users.uid, decodedToken.uid));
      if (dbUserList.length > 0) {
        req.dbUser = dbUserList[0];
      }
    } catch (e) {
      // Ignore invalid optional tokens
    }
  }
  next();
}

async function startServer() {
  const app = express();
  app.use(express.json());

  const PORT = 3000;

  // Core API: Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', database: 'connected' });
  });

  // API: Archie message
  app.post('/api/gemini/archie', optionalAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const { message, isPublic, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }
      const response = await sendMessageToArchie(message, !!isPublic, history || []);
      res.json(response);
    } catch (error) {
      console.error('Archie endpoint failed:', error);
      res.status(500).json({ error: 'Signal interference detected. Please rephrase your query.' });
    }
  });

  // API: Analyze research topic
  app.post('/api/gemini/analyze', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const { topicTitle, content } = req.body;
      if (!topicTitle || !content) {
        return res.status(400).json({ error: 'Topic title and content are required' });
      }
      const text = await gAnalyzeTopic(topicTitle, content);
      res.json({ text });
    } catch (error) {
      console.error('Analyze topic endpoint failed:', error);
      res.status(500).json({ error: 'The analytical engine encountered a processing error.' });
    }
  });

  // API: Vault Search
  app.post('/api/gemini/search', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const { query, dataContext } = req.body;
      if (!query || !dataContext) {
        return res.status(400).json({ error: 'Query and data context are required' });
      }
      const text = await gVaultSearch(query, dataContext);
      res.json({ text });
    } catch (error) {
      console.error('Vault search endpoint failed:', error);
      res.status(500).json({ error: 'The search engine failed to retrieve results.' });
    }
  });

  // API: Sync user details from Firebase to Cloud SQL PostgreSQL
  app.post('/api/auth/sync', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userPayload = req.user!;
      const name = userPayload.name || userPayload.email?.split('@')[0] || 'Anonymous Fellow';
      const email = userPayload.email || '';
      const avatarUrl = userPayload.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;

      // Use upsert to safely synchronize the user profile to PostgreSQL
      const syncedUser = await db.insert(users)
        .values({
          uid: userPayload.uid,
          email,
          name,
          role: 'Professional Member',
          avatarUrl,
        })
        .onConflictDoUpdate({
          target: users.uid,
          set: {
            email,
            name,
            avatarUrl,
          },
        })
        .returning();

      res.json(syncedUser[0]);
    } catch (error) {
      console.error('User sync failed:', error);
      res.status(500).json({ error: 'Failed to synchronize user profile' });
    }
  });

  // API: Get app events with user RSVP status
  app.get('/api/events', optionalAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const allEvents = await db.select().from(events).orderBy(events.date);
      
      let userRsvps: number[] = [];
      if (req.dbUser) {
        const rsvpRecords = await db.select().from(rsvps).where(eq(rsvps.userId, req.dbUser.id));
        userRsvps = rsvpRecords.map(r => r.eventId);
      }

      const responseEvents = allEvents.map(event => ({
        ...event,
        isRsvped: userRsvps.includes(event.id),
      }));

      res.json(responseEvents);
    } catch (error) {
      console.error('Failed to retrieve events:', error);
      res.status(500).json({ error: 'Failed to fetch events' });
    }
  });

  // API: Create a new event (with Google Calendar or Google Meet integration capability)
  app.post('/api/events', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const { title, description, location, date, time, type, maxGuests, googleEventId, googleMeetLink } = req.body;
      const hostName = req.dbUser?.name || 'Fellow Member';

      const newEvent = await db.insert(events)
        .values({
          title,
          description,
          location: location || 'Vault Virtual Auditorium',
          date,
          time,
          type: type || 'Social',
          host: hostName,
          attendees: 0,
          maxGuests: maxGuests || 100,
          googleEventId,
          googleMeetLink,
        })
        .returning();

      res.json(newEvent[0]);
    } catch (error) {
      console.error('Failed to create event:', error);
      res.status(500).json({ error: 'Failed to create event' });
    }
  });

  // API: Toggle RSVP for an event
  app.post('/api/events/:id/rsvp', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const eventId = parseInt(req.params.id as string);
      const dbUser = req.dbUser;

      if (!dbUser) {
        return res.status(401).json({ error: 'User profiles not synced yet' });
      }

      // Check if event exists
      const eventCheck = await db.select().from(events).where(eq(events.id, eventId));
      if (eventCheck.length === 0) {
        return res.status(404).json({ error: 'Event not found' });
      }

      // Check if already RSVPed
      const existingRsvp = await db.select().from(rsvps).where(
        and(
          eq(rsvps.userId, dbUser.id),
          eq(rsvps.eventId, eventId)
        )
      );

      if (existingRsvp.length > 0) {
        // Cancel RSVP
        await db.delete(rsvps).where(eq(rsvps.id, existingRsvp[0].id));
        // Decrement attendees
        await db.update(events)
          .set({ attendees: Math.max(0, (eventCheck[0].attendees || 1) - 1) })
          .where(eq(events.id, eventId));

        res.json({ rsvped: false });
      } else {
        // Add RSVP
        await db.insert(rsvps).values({
          userId: dbUser.id,
          eventId: eventId,
        });
        // Increment attendees
        await db.update(events)
          .set({ attendees: (eventCheck[0].attendees || 0) + 1 })
          .where(eq(events.id, eventId));

        res.json({ rsvped: true });
      }
    } catch (error) {
      console.error('RSVP toggle failed:', error);
      res.status(500).json({ error: 'Failed to update RSVP status' });
    }
  });

  // API: Get user tasks
  app.get('/api/tasks', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const dbUser = req.dbUser;
      if (!dbUser) {
        return res.json([]);
      }

      const userTasks = await db.select().from(tasks).where(eq(tasks.userId, dbUser.id)).orderBy(tasks.createdAt);
      res.json(userTasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      res.status(500).json({ error: 'Failed to retrieve task list' });
    }
  });

  // API: Create a new task
  app.post('/api/tasks', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const dbUser = req.dbUser;
      if (!dbUser) {
        return res.status(401).json({ error: 'User profile not synchronized' });
      }

      const { title, googleTaskId } = req.body;
      const newTask = await db.insert(tasks)
        .values({
          userId: dbUser.id,
          title,
          googleTaskId,
          completed: false,
        })
        .returning();

      res.json(newTask[0]);
    } catch (error) {
      console.error('Failed to create task:', error);
      res.status(500).json({ error: 'Failed to add task' });
    }
  });

  // API: Update a task (toggle completion)
  app.put('/api/tasks/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const taskId = parseInt(req.params.id as string);
      const { completed, googleTaskId } = req.body;
      const dbUser = req.dbUser;

      if (!dbUser) {
        return res.status(401).json({ error: 'User profile not synced' });
      }

      const updatedTask = await db.update(tasks)
        .set({ 
          completed,
          googleTaskId: googleTaskId !== undefined ? googleTaskId : undefined,
        })
        .where(
          and(
            eq(tasks.id, taskId),
            eq(tasks.userId, dbUser.id)
          )
        )
        .returning();

      if (updatedTask.length === 0) {
        return res.status(404).json({ error: 'Task not found or unauthorized' });
      }

      res.json(updatedTask[0]);
    } catch (error) {
      console.error('Failed to update task:', error);
      res.status(500).json({ error: 'Failed to update task' });
    }
  });

  // API: Delete a task
  app.delete('/api/tasks/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const taskId = parseInt(req.params.id as string);
      const dbUser = req.dbUser;

      if (!dbUser) {
        return res.status(401).json({ error: 'User profile not synced' });
      }

      const deleted = await db.delete(tasks)
        .where(
          and(
            eq(tasks.id, taskId),
            eq(tasks.userId, dbUser.id)
          )
        )
        .returning();

      if (deleted.length === 0) {
        return res.status(404).json({ error: 'Task not found or unauthorized' });
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Failed to delete task:', error);
      res.status(500).json({ error: 'Failed to delete task' });
    }
  });

  // Seed events database if it's currently empty
  try {
    const existingEvents = await db.select().from(events);
    if (existingEvents.length === 0) {
      console.log('Seeding initial app events into PostgreSQL...');
      await db.insert(events).values([
        {
          title: 'Annual IAN Gala Dinner - Lyon',
          description: 'Celebrating our 40th anniversary of the Lyon headquarters move. This black-tie event will bring together founders and members for a night of reflection and forward-looking strategy.',
          location: 'Château de Montchat, Lyon',
          date: '2026-12-05',
          time: '19:00 CET',
          type: 'Official',
          host: 'Michel Duval',
          attendees: 120,
          maxGuests: 150,
        },
        {
          title: 'Webinar: Digital Forensics Trends',
          description: 'A technical session for members only on deepfake detection and its implications for transnational criminal investigations.',
          location: 'Vault Virtual Auditorium',
          date: '2026-11-20',
          time: '14:00 GMT',
          type: 'Official',
          host: 'Dr. Hiroshi Tanaka',
          attendees: 55,
          maxGuests: 500,
        },
        {
          title: 'Rome Alumni Coffee Morning',
          description: 'Casual networking for those based in Southern Europe. A chance to catch up and discuss ongoing local initiatives.',
          location: 'Piazza Navona Area',
          date: '2026-11-15',
          time: '10:00 CET',
          type: 'Social',
          host: 'Valentina Rossi',
          attendees: 12,
          maxGuests: 20,
        }
      ]);
      console.log('Seeding completed successfully.');
    }
  } catch (err) {
    console.error('Error during initial event seeding:', err);
  }

  // Vite Integration for Asset Serving and Hot Reloading
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('/:any*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
