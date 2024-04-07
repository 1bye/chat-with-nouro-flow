import { type Session, SupabaseClient, type User } from '@supabase/supabase-js';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient
			safeGetSession(): Promise<{ session: Session | null; user: User | null }>
		}
		interface PageData {
			session: Session | null
			user: User | null
		}
		// interface Error {}
		// interface Platform {}
		// interface Error {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
