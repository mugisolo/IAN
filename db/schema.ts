import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, boolean, timestamp } from 'drizzle-orm/pg-core';

// Users table matching the Firebase authenticated user
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name').notNull(),
  role: text('role').default('Professional Member'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

// App events synced with Google Calendar and Google Meet
export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  location: text('location').default('Vault Virtual Auditorium'),
  date: text('date').notNull(), // YYYY-MM-DD
  time: text('time').notNull(),
  type: text('type').default('Social'), // 'Social' | 'Webinar' | 'Official'
  host: text('host').notNull(),
  attendees: integer('attendees').default(0),
  maxGuests: integer('max_guests').default(100),
  googleEventId: text('google_event_id'),
  googleMeetLink: text('google_meet_link'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relational RSVP table to track who is attending which event
export const rsvps = pgTable('rsvps', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  eventId: integer('event_id')
    .references(() => events.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// User tasks synced with Google Tasks
export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  title: text('title').notNull(),
  completed: boolean('completed').default(false).notNull(),
  googleTaskId: text('google_task_id'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define relations for our database tables
export const usersRelations = relations(users, ({ many }) => ({
  rsvps: many(rsvps),
  tasks: many(tasks),
}));

export const eventsRelations = relations(events, ({ many }) => ({
  rsvps: many(rsvps),
}));

export const rsvpsRelations = relations(rsvps, ({ one }) => ({
  user: one(users, {
    fields: [rsvps.userId],
    references: [users.id],
  }),
  event: one(events, {
    fields: [rsvps.eventId],
    references: [events.id],
  }),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
}));
