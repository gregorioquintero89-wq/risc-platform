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
    PostgrestVersion: "14.15"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      auditoria: {
        Row: {
          accion: string
          actor_user_id: string | null
          created_at: string
          detalle: Json | null
          entidad: string
          entidad_id: string
          id: string
        }
        Insert: {
          accion: string
          actor_user_id?: string | null
          created_at?: string
          detalle?: Json | null
          entidad: string
          entidad_id: string
          id?: string
        }
        Update: {
          accion?: string
          actor_user_id?: string | null
          created_at?: string
          detalle?: Json | null
          entidad?: string
          entidad_id?: string
          id?: string
        }
        Relationships: []
      }
      centros_acopio: {
        Row: {
          created_at: string
          horario: string
          id: string
          nodo_id: string
          nombre: string
          responsable_user_id: string
          ubicacion: string
        }
        Insert: {
          created_at?: string
          horario: string
          id?: string
          nodo_id: string
          nombre: string
          responsable_user_id: string
          ubicacion: string
        }
        Update: {
          created_at?: string
          horario?: string
          id?: string
          nodo_id?: string
          nombre?: string
          responsable_user_id?: string
          ubicacion?: string
        }
        Relationships: [
          {
            foreignKeyName: "centros_acopio_nodo_id_fkey"
            columns: ["nodo_id"]
            isOneToOne: false
            referencedRelation: "nodos"
            referencedColumns: ["id"]
          },
        ]
      }
      donaciones: {
        Row: {
          cantidad: number
          centro_id: string
          codigo: string
          contacto_nombre: string | null
          contacto_telefono: string | null
          created_at: string
          estado: Database["public"]["Enums"]["estado_donacion"]
          id: string
          necesidad_id: string | null
          origen: Database["public"]["Enums"]["origen_donacion"]
          recibida_en: string | null
          recibida_por: string | null
        }
        Insert: {
          cantidad: number
          centro_id: string
          codigo?: string
          contacto_nombre?: string | null
          contacto_telefono?: string | null
          created_at?: string
          estado?: Database["public"]["Enums"]["estado_donacion"]
          id?: string
          necesidad_id?: string | null
          origen?: Database["public"]["Enums"]["origen_donacion"]
          recibida_en?: string | null
          recibida_por?: string | null
        }
        Update: {
          cantidad?: number
          centro_id?: string
          codigo?: string
          contacto_nombre?: string | null
          contacto_telefono?: string | null
          created_at?: string
          estado?: Database["public"]["Enums"]["estado_donacion"]
          id?: string
          necesidad_id?: string | null
          origen?: Database["public"]["Enums"]["origen_donacion"]
          recibida_en?: string | null
          recibida_por?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donaciones_centro_id_fkey"
            columns: ["centro_id"]
            isOneToOne: false
            referencedRelation: "centros_acopio"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donaciones_necesidad_id_fkey"
            columns: ["necesidad_id"]
            isOneToOne: false
            referencedRelation: "necesidades"
            referencedColumns: ["id"]
          },
        ]
      }
      inventario_movimientos: {
        Row: {
          cantidad: number
          centro_id: string
          created_at: string
          created_by: string | null
          donacion_id: string | null
          id: string
          producto: string
          tipo: Database["public"]["Enums"]["tipo_movimiento"]
        }
        Insert: {
          cantidad: number
          centro_id: string
          created_at?: string
          created_by?: string | null
          donacion_id?: string | null
          id?: string
          producto: string
          tipo: Database["public"]["Enums"]["tipo_movimiento"]
        }
        Update: {
          cantidad?: number
          centro_id?: string
          created_at?: string
          created_by?: string | null
          donacion_id?: string | null
          id?: string
          producto?: string
          tipo?: Database["public"]["Enums"]["tipo_movimiento"]
        }
        Relationships: [
          {
            foreignKeyName: "inventario_movimientos_centro_id_fkey"
            columns: ["centro_id"]
            isOneToOne: false
            referencedRelation: "centros_acopio"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventario_movimientos_donacion_id_fkey"
            columns: ["donacion_id"]
            isOneToOne: false
            referencedRelation: "donaciones"
            referencedColumns: ["id"]
          },
        ]
      }
      necesidades: {
        Row: {
          albergue: string | null
          cantidad_necesaria: number
          cantidad_recibida: number
          categoria: string
          created_at: string
          estado: Database["public"]["Enums"]["estado_necesidad"]
          faltante: number | null
          fecha_limite: string
          id: string
          motivo_descarte: string | null
          nodo_id: string
          responsable: string
          titulo: string
          verificado_en: string | null
          verificado_por: string | null
        }
        Insert: {
          albergue?: string | null
          cantidad_necesaria: number
          cantidad_recibida?: number
          categoria: string
          created_at?: string
          estado?: Database["public"]["Enums"]["estado_necesidad"]
          faltante?: number | null
          fecha_limite: string
          id?: string
          motivo_descarte?: string | null
          nodo_id: string
          responsable: string
          titulo: string
          verificado_en?: string | null
          verificado_por?: string | null
        }
        Update: {
          albergue?: string | null
          cantidad_necesaria?: number
          cantidad_recibida?: number
          categoria?: string
          created_at?: string
          estado?: Database["public"]["Enums"]["estado_necesidad"]
          faltante?: number | null
          fecha_limite?: string
          id?: string
          motivo_descarte?: string | null
          nodo_id?: string
          responsable?: string
          titulo?: string
          verificado_en?: string | null
          verificado_por?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "necesidades_nodo_id_fkey"
            columns: ["nodo_id"]
            isOneToOne: false
            referencedRelation: "nodos"
            referencedColumns: ["id"]
          },
        ]
      }
      nodos: {
        Row: {
          activo: boolean
          created_at: string
          departamento: string
          id: string
          municipio: string
        }
        Insert: {
          activo?: boolean
          created_at?: string
          departamento: string
          id?: string
          municipio: string
        }
        Update: {
          activo?: boolean
          created_at?: string
          departamento?: string
          id?: string
          municipio?: string
        }
        Relationships: []
      }
      usuario_roles: {
        Row: {
          created_at: string
          id: string
          nodo_id: string | null
          rol: Database["public"]["Enums"]["rol_risc"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          nodo_id?: string | null
          rol: Database["public"]["Enums"]["rol_risc"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          nodo_id?: string | null
          rol?: Database["public"]["Enums"]["rol_risc"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usuario_roles_nodo_id_fkey"
            columns: ["nodo_id"]
            isOneToOne: false
            referencedRelation: "nodos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      inventario_disponible: {
        Row: {
          centro_id: string | null
          disponible: number | null
          producto: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventario_movimientos_centro_id_fkey"
            columns: ["centro_id"]
            isOneToOne: false
            referencedRelation: "centros_acopio"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      buscar_donacion_por_codigo: {
        Args: { p_codigo: string }
        Returns: {
          cantidad: number
          centro_nombre: string
          codigo: string
          estado: Database["public"]["Enums"]["estado_donacion"]
        }[]
      }
      contador_necesidades_resueltas: { Args: never; Returns: number }
      crear_donacion_publica: {
        Args: {
          p_cantidad: number
          p_centro_id: string
          p_contacto_nombre: string
          p_contacto_telefono: string
          p_necesidad_id: string
        }
        Returns: {
          centro_nombre: string
          codigo: string
        }[]
      }
      mi_rol: {
        Args: never
        Returns: {
          nodo_id: string
          rol: Database["public"]["Enums"]["rol_risc"]
        }[]
      }
      registrar_auditoria: {
        Args: {
          p_accion: string
          p_detalle?: Json
          p_entidad: string
          p_entidad_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      estado_donacion: "comprometida" | "recibida"
      estado_necesidad: "reportada" | "publicada" | "resuelta" | "descartada"
      origen_donacion: "online" | "presencial"
      rol_risc: "lider" | "suplente" | "operador" | "admin_nacional"
      tipo_movimiento: "entrada" | "salida"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      estado_donacion: ["comprometida", "recibida"],
      estado_necesidad: ["reportada", "publicada", "resuelta", "descartada"],
      origen_donacion: ["online", "presencial"],
      rol_risc: ["lider", "suplente", "operador", "admin_nacional"],
      tipo_movimiento: ["entrada", "salida"],
    },
  },
} as const
