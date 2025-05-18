export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      crash_bets: {
        Row: {
          amount: number
          cashed_out_at: string | null
          cashout_multiplier: number | null
          created_at: string | null
          game_id: string
          id: string
          status: string
          user_id: string
          won_amount: number | null
        }
        Insert: {
          amount: number
          cashed_out_at?: string | null
          cashout_multiplier?: number | null
          created_at?: string | null
          game_id: string
          id?: string
          status?: string
          user_id: string
          won_amount?: number | null
        }
        Update: {
          amount?: number
          cashed_out_at?: string | null
          cashout_multiplier?: number | null
          created_at?: string | null
          game_id?: string
          id?: string
          status?: string
          user_id?: string
          won_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "crash_bets_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "crash_games"
            referencedColumns: ["id"]
          },
        ]
      }
      crash_games: {
        Row: {
          completed_at: string | null
          crash_point: number | null
          id: string
          started_at: string | null
          status: string
        }
        Insert: {
          completed_at?: string | null
          crash_point?: number | null
          id?: string
          started_at?: string | null
          status?: string
        }
        Update: {
          completed_at?: string | null
          crash_point?: number | null
          id?: string
          started_at?: string | null
          status?: string
        }
        Relationships: []
      }
      game_history: {
        Row: {
          bet_amount: number
          created_at: string | null
          game_type: string
          id: string
          result: string
          user_id: string
          won_amount: number | null
        }
        Insert: {
          bet_amount: number
          created_at?: string | null
          game_type: string
          id?: string
          result: string
          user_id: string
          won_amount?: number | null
        }
        Update: {
          bet_amount?: number
          created_at?: string | null
          game_type?: string
          id?: string
          result?: string
          user_id?: string
          won_amount?: number | null
        }
        Relationships: []
      }
      games: {
        Row: {
          amount: number
          completed_at: string | null
          created_at: string
          creator_choice: string
          creator_id: string
          id: string
          joiner_id: string | null
          status: string
          winner_id: string | null
        }
        Insert: {
          amount: number
          completed_at?: string | null
          created_at?: string
          creator_choice: string
          creator_id: string
          id?: string
          joiner_id?: string | null
          status?: string
          winner_id?: string | null
        }
        Update: {
          amount?: number
          completed_at?: string | null
          created_at?: string
          creator_choice?: string
          creator_id?: string
          id?: string
          joiner_id?: string | null
          status?: string
          winner_id?: string | null
        }
        Relationships: []
      }
      level_rewards: {
        Row: {
          amount: number
          claimed_at: string | null
          id: number
          level: number
          user_id: string
        }
        Insert: {
          amount: number
          claimed_at?: string | null
          id?: number
          level: number
          user_id: string
        }
        Update: {
          amount?: number
          claimed_at?: string | null
          id?: number
          level?: number
          user_id?: string
        }
        Relationships: []
      }
      players: {
        Row: {
          cash: number | null
          clicks_per_second: number | null
          created_at: string | null
          id: string
          last_updated: string | null
          username: string
        }
        Insert: {
          cash?: number | null
          clicks_per_second?: number | null
          created_at?: string | null
          id: string
          last_updated?: string | null
          username: string
        }
        Update: {
          cash?: number | null
          clicks_per_second?: number | null
          created_at?: string | null
          id?: string
          last_updated?: string | null
          username?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          is_admin: boolean | null
          is_owner: boolean | null
          username: string
        }
        Insert: {
          id: string
          is_admin?: boolean | null
          is_owner?: boolean | null
          username: string
        }
        Update: {
          id?: string
          is_admin?: boolean | null
          is_owner?: boolean | null
          username?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          balance: number
          last_reward_claim: string | null
          level: number | null
          total_games: number
          total_wagered: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          last_reward_claim?: string | null
          level?: number | null
          total_games?: number
          total_wagered?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          last_reward_claim?: string | null
          level?: number | null
          total_games?: number
          total_wagered?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
