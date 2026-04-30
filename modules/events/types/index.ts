export type RsvpStatus = "going" | "maybe";

export interface EventRecord {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  starts_at: string;
  ends_at: string | null;
  capacity: number | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface RsvpRecord {
  event_id: string;
  user_id: string;
  status: RsvpStatus;
  created_at: string;
  updated_at: string;
}

export interface RsvpWithEvent {
  status: RsvpStatus;
  event: EventRecord;
}
