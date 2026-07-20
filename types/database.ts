export type UserRole = "user" | "admin";
export type Plan = "free" | "pro" | "team";
export type TeamMemberRole = "owner" | "member";
export type TeamMemberStatus = "pending" | "active";
export type ContractFileType = "pdf" | "docx";
export type ContractStatus = "uploaded" | "processing" | "analyzed" | "failed";
export type ChatRole = "user" | "assistant";

export interface Paragraph {
  id: number;
  text: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          role: UserRole;
          plan: Plan;
          stripe_customer_id: string | null;
          team_id: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          plan?: Plan;
          stripe_customer_id?: string | null;
          team_id?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      teams: {
        Row: {
          id: string;
          name: string;
          owner_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          owner_id: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["teams"]["Insert"]>;
      };
      team_members: {
        Row: {
          id: string;
          team_id: string;
          user_id: string | null;
          invited_email: string;
          role: TeamMemberRole;
          status: TeamMemberStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          user_id?: string | null;
          invited_email: string;
          role?: TeamMemberRole;
          status?: TeamMemberStatus;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["team_members"]["Insert"]>;
      };
      folders: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["folders"]["Insert"]>;
      };
      contracts: {
        Row: {
          id: string;
          user_id: string;
          folder_id: string | null;
          title: string;
          original_filename: string;
          file_type: ContractFileType;
          file_path: string;
          status: ContractStatus;
          is_favorite: boolean;
          paragraphs: Paragraph[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          folder_id?: string | null;
          title: string;
          original_filename: string;
          file_type: ContractFileType;
          file_path: string;
          status?: ContractStatus;
          is_favorite?: boolean;
          paragraphs?: Paragraph[];
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["contracts"]["Insert"]>;
      };
      analyses: {
        Row: {
          id: string;
          contract_id: string;
          risk_score: number | null;
          summary: string | null;
          sections: unknown[];
          timeline: unknown[];
          recommended_questions: unknown[];
          model: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          contract_id: string;
          risk_score?: number | null;
          summary?: string | null;
          sections?: unknown[];
          timeline?: unknown[];
          recommended_questions?: unknown[];
          model?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["analyses"]["Insert"]>;
      };
      chat_messages: {
        Row: {
          id: string;
          contract_id: string;
          user_id: string;
          role: ChatRole;
          content: string;
          refs: number[];
          created_at: string;
        };
        Insert: {
          id?: string;
          contract_id: string;
          user_id: string;
          role: ChatRole;
          content: string;
          refs?: number[];
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["chat_messages"]["Insert"]>;
      };
      shared_links: {
        Row: {
          id: string;
          contract_id: string;
          token: string;
          created_at: string;
          expires_at: string | null;
        };
        Insert: {
          id?: string;
          contract_id: string;
          token: string;
          created_at?: string;
          expires_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["shared_links"]["Insert"]>;
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_subscription_id: string | null;
          plan: Plan;
          status: string;
          current_period_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_subscription_id?: string | null;
          plan?: Plan;
          status?: string;
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Insert"]>;
      };
      payments: {
        Row: {
          id: string;
          user_id: string;
          stripe_id: string;
          amount: number;
          currency: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_id: string;
          amount: number;
          currency?: string;
          status: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["payments"]["Insert"]>;
      };
      blog_posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string | null;
          content: string | null;
          cover_image: string | null;
          published: boolean;
          author_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt?: string | null;
          content?: string | null;
          cover_image?: string | null;
          published?: boolean;
          author_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["blog_posts"]["Insert"]>;
      };
    };
  };
}
