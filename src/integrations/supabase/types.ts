export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ai_analyses: {
        Row: {
          created_at: string
          draft_document: string | null
          extracted_data: Json | null
          id: string
          notes: string | null
          reviewed: boolean
          reviewed_at: string | null
          reviewed_by: string | null
          submission_id: string
          suggested_action_type: string | null
          suggested_thesis: string | null
          technical_summary: string | null
          updated_at: string
          viability_score: Database["public"]["Enums"]["viability_score"] | null
        }
        Insert: {
          created_at?: string
          draft_document?: string | null
          extracted_data?: Json | null
          id?: string
          notes?: string | null
          reviewed?: boolean
          reviewed_at?: string | null
          reviewed_by?: string | null
          submission_id: string
          suggested_action_type?: string | null
          suggested_thesis?: string | null
          technical_summary?: string | null
          updated_at?: string
          viability_score?:
            | Database["public"]["Enums"]["viability_score"]
            | null
        }
        Update: {
          created_at?: string
          draft_document?: string | null
          extracted_data?: Json | null
          id?: string
          notes?: string | null
          reviewed?: boolean
          reviewed_at?: string | null
          reviewed_by?: string | null
          submission_id?: string
          suggested_action_type?: string | null
          suggested_thesis?: string | null
          technical_summary?: string | null
          updated_at?: string
          viability_score?:
            | Database["public"]["Enums"]["viability_score"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_analyses_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: true
            referencedRelation: "document_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          assigned_to: string | null
          case_id: string | null
          client_id: string
          created_at: string
          description: string | null
          id: string
          scheduled_at: string
          status: Database["public"]["Enums"]["appointment_status"]
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          case_id?: string | null
          client_id: string
          created_at?: string
          description?: string | null
          id?: string
          scheduled_at: string
          status?: Database["public"]["Enums"]["appointment_status"]
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          case_id?: string | null
          client_id?: string
          created_at?: string
          description?: string | null
          id?: string
          scheduled_at?: string
          status?: Database["public"]["Enums"]["appointment_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      blog_leads: {
        Row: {
          created_at: string
          email: string
          id: string
          interest_tag: string | null
          name: string
          post_id: string | null
          whatsapp: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          interest_tag?: string | null
          name: string
          post_id?: string | null
          whatsapp: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          interest_tag?: string | null
          name?: string
          post_id?: string | null
          whatsapp?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_leads_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string
          category_id: string | null
          content: string
          cover_image_url: string | null
          created_at: string
          excerpt: string | null
          featured: boolean
          id: string
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          scheduled_at: string | null
          slug: string
          status: string
          subtitle: string | null
          tags: string[] | null
          title: string
          updated_at: string
          views: number
        }
        Insert: {
          author_id: string
          category_id?: string | null
          content: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          featured?: boolean
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          scheduled_at?: string | null
          slug: string
          status?: string
          subtitle?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          views?: number
        }
        Update: {
          author_id?: string
          category_id?: string | null
          content?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          featured?: boolean
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          scheduled_at?: string | null
          slug?: string
          status?: string
          subtitle?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          views?: number
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_topics_used: {
        Row: {
          created_at: string
          id: string
          keyword: string
          legal_area: string
          post_id: string | null
          secondary_keywords: string[] | null
        }
        Insert: {
          created_at?: string
          id?: string
          keyword: string
          legal_area: string
          post_id?: string | null
          secondary_keywords?: string[] | null
        }
        Update: {
          created_at?: string
          id?: string
          keyword?: string
          legal_area?: string
          post_id?: string | null
          secondary_keywords?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_topics_used_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      cases: {
        Row: {
          assigned_to: string | null
          client_id: string
          created_at: string
          description: string | null
          id: string
          status: Database["public"]["Enums"]["case_status"]
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          client_id: string
          created_at?: string
          description?: string | null
          id?: string
          status?: Database["public"]["Enums"]["case_status"]
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          client_id?: string
          created_at?: string
          description?: string | null
          id?: string
          status?: Database["public"]["Enums"]["case_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cases_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          cpf: string | null
          created_at: string
          created_by: string | null
          email: string
          full_name: string
          id: string
          notes: string | null
          phone: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          cpf?: string | null
          created_at?: string
          created_by?: string | null
          email: string
          full_name: string
          id?: string
          notes?: string | null
          phone: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          cpf?: string | null
          created_at?: string
          created_by?: string | null
          email?: string
          full_name?: string
          id?: string
          notes?: string | null
          phone?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          message: string
          phone: string
          read: boolean | null
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          message: string
          phone: string
          read?: boolean | null
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          message?: string
          phone?: string
          read?: boolean | null
        }
        Relationships: []
      }
      document_submissions: {
        Row: {
          client_id: string
          created_at: string
          description: string
          id: string
          legal_area: Database["public"]["Enums"]["legal_area"]
          status: Database["public"]["Enums"]["submission_status"]
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          description: string
          id?: string
          legal_area: Database["public"]["Enums"]["legal_area"]
          status?: Database["public"]["Enums"]["submission_status"]
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          description?: string
          id?: string
          legal_area?: Database["public"]["Enums"]["legal_area"]
          status?: Database["public"]["Enums"]["submission_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_submissions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          case_id: string | null
          client_id: string | null
          content: string
          created_at: string
          id: string
          read: boolean | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          case_id?: string | null
          client_id?: string | null
          content: string
          created_at?: string
          id?: string
          read?: boolean | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          case_id?: string | null
          client_id?: string | null
          content?: string
          created_at?: string
          id?: string
          read?: boolean | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      submission_documents: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          submission_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          submission_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "submission_documents_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "document_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      tjpr_logs_consulta: {
        Row: {
          comarca: string | null
          created_at: string
          erro: string | null
          id: string
          processo_id: string
          resposta_raw: Json | null
          status_anterior: string | null
          status_novo: string | null
          sucesso: boolean
          vara: string | null
        }
        Insert: {
          comarca?: string | null
          created_at?: string
          erro?: string | null
          id?: string
          processo_id: string
          resposta_raw?: Json | null
          status_anterior?: string | null
          status_novo?: string | null
          sucesso?: boolean
          vara?: string | null
        }
        Update: {
          comarca?: string | null
          created_at?: string
          erro?: string | null
          id?: string
          processo_id?: string
          resposta_raw?: Json | null
          status_anterior?: string | null
          status_novo?: string | null
          sucesso?: boolean
          vara?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tjpr_logs_consulta_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: false
            referencedRelation: "tjpr_processos_monitorados"
            referencedColumns: ["id"]
          },
        ]
      }
      tjpr_processos_monitorados: {
        Row: {
          area_direito: string | null
          cliente_id: string | null
          comarca: string | null
          created_at: string
          created_by: string
          id: string
          numero_processo: string
          observacoes: string | null
          status_atual: string | null
          ultima_verificacao: string | null
          updated_at: string
          vara: string | null
        }
        Insert: {
          area_direito?: string | null
          cliente_id?: string | null
          comarca?: string | null
          created_at?: string
          created_by: string
          id?: string
          numero_processo: string
          observacoes?: string | null
          status_atual?: string | null
          ultima_verificacao?: string | null
          updated_at?: string
          vara?: string | null
        }
        Update: {
          area_direito?: string | null
          cliente_id?: string | null
          comarca?: string | null
          created_at?: string
          created_by?: string
          id?: string
          numero_processo?: string
          observacoes?: string | null
          status_atual?: string | null
          ultima_verificacao?: string | null
          updated_at?: string
          vara?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tjpr_processos_monitorados_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "staff" | "client"
      appointment_status: "scheduled" | "confirmed" | "completed" | "cancelled"
      case_status: "pending" | "in_progress" | "completed" | "cancelled"
      legal_area:
        | "bancario"
        | "trabalhista"
        | "empresarial"
        | "consumidor"
        | "familia"
        | "imobiliario"
        | "tributario"
        | "outro"
      submission_status: "submitted" | "analyzing" | "in_review" | "completed"
      viability_score: "low" | "medium" | "high"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "staff", "client"],
      appointment_status: ["scheduled", "confirmed", "completed", "cancelled"],
      case_status: ["pending", "in_progress", "completed", "cancelled"],
      legal_area: [
        "bancario",
        "trabalhista",
        "empresarial",
        "consumidor",
        "familia",
        "imobiliario",
        "tributario",
        "outro",
      ],
      submission_status: ["submitted", "analyzing", "in_review", "completed"],
      viability_score: ["low", "medium", "high"],
    },
  },
} as const
