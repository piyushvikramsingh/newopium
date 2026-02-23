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
      admin_audit_logs: {
        Row: {
          action: string
          actor_user_id: string
          created_at: string
          id: string
          metadata: Json
          target_report_id: string | null
          target_user_id: string | null
          target_video_id: string | null
        }
        Insert: {
          action: string
          actor_user_id: string
          created_at?: string
          id?: string
          metadata?: Json
          target_report_id?: string | null
          target_user_id?: string | null
          target_video_id?: string | null
        }
        Update: {
          action?: string
          actor_user_id?: string
          created_at?: string
          id?: string
          metadata?: Json
          target_report_id?: string | null
          target_user_id?: string | null
          target_video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_audit_logs_target_report_id_fkey"
            columns: ["target_report_id"]
            isOneToOne: false
            referencedRelation: "video_reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_audit_logs_target_video_id_fkey"
            columns: ["target_video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      blocked_users: {
        Row: {
          blocked_id: string
          blocker_id: string
          created_at: string
          id: string
          reason: string | null
        }
        Insert: {
          blocked_id: string
          blocker_id: string
          created_at?: string
          id?: string
          reason?: string | null
        }
        Update: {
          blocked_id?: string
          blocker_id?: string
          created_at?: string
          id?: string
          reason?: string | null
        }
        Relationships: []
      }
      bookmarks: {
        Row: {
          created_at: string
          id: string
          user_id: string
          video_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          video_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      broadcast_channels: {
        Row: {
          avatar_url: string | null
          created_at: string
          creator_id: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          subscriber_count: number | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          creator_id: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          subscriber_count?: number | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          creator_id?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          subscriber_count?: number | null
        }
        Relationships: []
      }
      challenge_participants: {
        Row: {
          challenge_id: string
          id: string
          joined_at: string
          user_id: string
          video_id: string | null
        }
        Insert: {
          challenge_id: string
          id?: string
          joined_at?: string
          user_id: string
          video_id?: string | null
        }
        Update: {
          challenge_id?: string
          id?: string
          joined_at?: string
          user_id?: string
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "challenge_participants_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenge_participants_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          created_at: string
          creator_id: string
          description: string | null
          end_date: string | null
          hashtag: string
          id: string
          is_official: boolean | null
          participant_count: number | null
          prize_description: string | null
          start_date: string
          thumbnail_url: string | null
          title: string
          video_count: number | null
        }
        Insert: {
          created_at?: string
          creator_id: string
          description?: string | null
          end_date?: string | null
          hashtag: string
          id?: string
          is_official?: boolean | null
          participant_count?: number | null
          prize_description?: string | null
          start_date?: string
          thumbnail_url?: string | null
          title: string
          video_count?: number | null
        }
        Update: {
          created_at?: string
          creator_id?: string
          description?: string | null
          end_date?: string | null
          hashtag?: string
          id?: string
          is_official?: boolean | null
          participant_count?: number | null
          prize_description?: string | null
          start_date?: string
          thumbnail_url?: string | null
          title?: string
          video_count?: number | null
        }
        Relationships: []
      }
      channel_messages: {
        Row: {
          channel_id: string
          content: string
          created_at: string
          id: string
          media_url: string | null
        }
        Insert: {
          channel_id: string
          content: string
          created_at?: string
          id?: string
          media_url?: string | null
        }
        Update: {
          channel_id?: string
          content?: string
          created_at?: string
          id?: string
          media_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "channel_messages_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "broadcast_channels"
            referencedColumns: ["id"]
          },
        ]
      }
      channel_subscribers: {
        Row: {
          channel_id: string
          id: string
          subscribed_at: string
          user_id: string
        }
        Insert: {
          channel_id: string
          id?: string
          subscribed_at?: string
          user_id: string
        }
        Update: {
          channel_id?: string
          id?: string
          subscribed_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "channel_subscribers_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "broadcast_channels"
            referencedColumns: ["id"]
          },
        ]
      }
      close_friends: {
        Row: {
          created_at: string
          friend_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          friend_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          friend_id?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      collection_videos: {
        Row: {
          added_at: string
          collection_id: string
          id: string
          video_id: string
        }
        Insert: {
          added_at?: string
          collection_id: string
          id?: string
          video_id: string
        }
        Update: {
          added_at?: string
          collection_id?: string
          id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_videos_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_videos_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          cover_url: string | null
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          updated_at: string
          user_id: string
          video_count: number | null
        }
        Insert: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          updated_at?: string
          user_id: string
          video_count?: number | null
        }
        Update: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          updated_at?: string
          user_id?: string
          video_count?: number | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          user_id: string
          video_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          user_id: string
          video_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          user_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      content_warnings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          video_id: string
          warning_type: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          video_id: string
          warning_type: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          video_id?: string
          warning_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_warnings_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          id: string
          joined_at: string
          last_read_at: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          id?: string
          joined_at?: string
          last_read_at?: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          id?: string
          joined_at?: string
          last_read_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_settings: {
        Row: {
          archived: boolean
          conversation_id: string
          id: string
          muted: boolean
          pinned: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          archived?: boolean
          conversation_id: string
          id?: string
          muted?: boolean
          pinned?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          archived?: boolean
          conversation_id?: string
          id?: string
          muted?: boolean
          pinned?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_settings_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          name: string | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      earnings: {
        Row: {
          amount_cents: number
          created_at: string
          currency: string | null
          id: string
          reference_id: string | null
          source: string
          status: string | null
          user_id: string
        }
        Insert: {
          amount_cents: number
          created_at?: string
          currency?: string | null
          id?: string
          reference_id?: string | null
          source: string
          status?: string | null
          user_id: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          currency?: string | null
          id?: string
          reference_id?: string | null
          source?: string
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      follow_requests: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      hashtag_follows: {
        Row: {
          created_at: string
          hashtag: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          hashtag: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          hashtag?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      hidden_videos: {
        Row: {
          created_at: string
          id: string
          user_id: string
          video_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          video_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hidden_videos_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string
          id: string
          user_id: string
          video_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          video_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      live_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          stream_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          stream_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          stream_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "live_comments_stream_id_fkey"
            columns: ["stream_id"]
            isOneToOne: false
            referencedRelation: "live_streams"
            referencedColumns: ["id"]
          },
        ]
      }
      live_streams: {
        Row: {
          created_at: string
          description: string | null
          ended_at: string | null
          id: string
          peak_viewers: number | null
          scheduled_start: string | null
          started_at: string | null
          status: string | null
          stream_key: string
          stream_url: string | null
          thumbnail_url: string | null
          title: string
          user_id: string
          viewer_count: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          ended_at?: string | null
          id?: string
          peak_viewers?: number | null
          scheduled_start?: string | null
          started_at?: string | null
          status?: string | null
          stream_key: string
          stream_url?: string | null
          thumbnail_url?: string | null
          title: string
          user_id: string
          viewer_count?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          ended_at?: string | null
          id?: string
          peak_viewers?: number | null
          scheduled_start?: string | null
          started_at?: string | null
          status?: string | null
          stream_key?: string
          stream_url?: string | null
          thumbnail_url?: string | null
          title?: string
          user_id?: string
          viewer_count?: number | null
        }
        Relationships: []
      }
      live_viewers: {
        Row: {
          id: string
          joined_at: string
          left_at: string | null
          stream_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          left_at?: string | null
          stream_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          left_at?: string | null
          stream_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "live_viewers_stream_id_fkey"
            columns: ["stream_id"]
            isOneToOne: false
            referencedRelation: "live_streams"
            referencedColumns: ["id"]
          },
        ]
      }
      message_reactions: {
        Row: {
          created_at: string
          emoji: string
          id: string
          message_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emoji: string
          id?: string
          message_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          emoji?: string
          id?: string
          message_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string | null
          conversation_id: string
          created_at: string
          deleted_at: string | null
          disappear_after_seconds: number | null
          edited_at: string | null
          id: string
          is_disappearing: boolean | null
          is_snap: boolean
          media_type: string | null
          media_url: string | null
          reply_to_message_id: string | null
          sender_id: string
          snap_duration: number | null
          status: string
          viewed: boolean
          voice_duration: number | null
        }
        Insert: {
          content?: string | null
          conversation_id: string
          created_at?: string
          deleted_at?: string | null
          disappear_after_seconds?: number | null
          edited_at?: string | null
          id?: string
          is_disappearing?: boolean | null
          is_snap?: boolean
          media_type?: string | null
          media_url?: string | null
          reply_to_message_id?: string | null
          sender_id: string
          snap_duration?: number | null
          status?: string
          viewed?: boolean
          voice_duration?: number | null
        }
        Update: {
          content?: string | null
          conversation_id?: string
          created_at?: string
          deleted_at?: string | null
          disappear_after_seconds?: number | null
          edited_at?: string | null
          id?: string
          is_disappearing?: boolean | null
          is_snap?: boolean
          media_type?: string | null
          media_url?: string | null
          reply_to_message_id?: string | null
          sender_id?: string
          snap_duration?: number | null
          status?: string
          viewed?: boolean
          voice_duration?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_reply_to_message_id_fkey"
            columns: ["reply_to_message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      muted_words: {
        Row: {
          created_at: string
          id: string
          user_id: string
          word: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          word: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          word?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          actor_id: string | null
          body: string | null
          created_at: string
          entity_id: string | null
          id: string
          is_read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          actor_id?: string | null
          body?: string | null
          created_at?: string
          entity_id?: string | null
          id?: string
          is_read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          actor_id?: string | null
          body?: string | null
          created_at?: string
          entity_id?: string | null
          id?: string
          is_read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      poll_votes: {
        Row: {
          created_at: string
          id: string
          option_index: number
          poll_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          option_index: number
          poll_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          option_index?: number
          poll_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "poll_votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
        ]
      }
      polls: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          options: string[]
          question: string
          story_id: string | null
          total_votes: number | null
          user_id: string
          video_id: string | null
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          options: string[]
          question: string
          story_id?: string | null
          total_votes?: number | null
          user_id: string
          video_id?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          options?: string[]
          question?: string
          story_id?: string | null
          total_votes?: number | null
          user_id?: string
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "polls_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "polls_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_highlights: {
        Row: {
          cover_url: string | null
          created_at: string
          id: string
          story_count: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cover_url?: string | null
          created_at?: string
          id?: string
          story_count?: number
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cover_url?: string | null
          created_at?: string
          id?: string
          story_count?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profile_links: {
        Row: {
          created_at: string
          id: string
          label: string
          link_type: string
          updated_at: string
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          link_type?: string
          updated_at?: string
          url: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          link_type?: string
          updated_at?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          affiliate_url: string | null
          allow_comments: boolean
          allow_mentions: boolean
          allow_messages_from: string
          avatar_url: string | null
          bio: string | null
          category: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          display_name: string
          id: string
          interests: string[]
          is_admin: boolean
          is_monetized: boolean
          is_private: boolean
          is_verified: boolean
          last_active_at: string | null
          login_alerts: boolean
          professional_account: boolean
          push_comments: boolean
          push_likes: boolean
          push_messages: boolean
          shop_url: string | null
          show_last_active: boolean
          two_factor_enabled: boolean
          updated_at: string
          user_id: string
          username: string
          website_url: string | null
        }
        Insert: {
          affiliate_url?: string | null
          allow_comments?: boolean
          allow_mentions?: boolean
          allow_messages_from?: string
          avatar_url?: string | null
          bio?: string | null
          category?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          display_name?: string
          id?: string
          interests?: string[]
          is_admin?: boolean
          is_monetized?: boolean
          is_private?: boolean
          is_verified?: boolean
          last_active_at?: string | null
          login_alerts?: boolean
          professional_account?: boolean
          push_comments?: boolean
          push_likes?: boolean
          push_messages?: boolean
          shop_url?: string | null
          show_last_active?: boolean
          two_factor_enabled?: boolean
          updated_at?: string
          user_id: string
          username: string
          website_url?: string | null
        }
        Update: {
          affiliate_url?: string | null
          allow_comments?: boolean
          allow_mentions?: boolean
          allow_messages_from?: string
          avatar_url?: string | null
          bio?: string | null
          category?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          display_name?: string
          id?: string
          interests?: string[]
          is_admin?: boolean
          is_monetized?: boolean
          is_private?: boolean
          is_verified?: boolean
          last_active_at?: string | null
          login_alerts?: boolean
          professional_account?: boolean
          push_comments?: boolean
          push_likes?: boolean
          push_messages?: boolean
          shop_url?: string | null
          show_last_active?: boolean
          two_factor_enabled?: boolean
          updated_at?: string
          user_id?: string
          username?: string
          website_url?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          code: string
          created_at: string
          id: string
          invitee_id: string | null
          inviter_id: string
          status: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          invitee_id?: string | null
          inviter_id: string
          status?: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          invitee_id?: string | null
          inviter_id?: string
          status?: string
        }
        Relationships: []
      }
      scheduled_posts: {
        Row: {
          created_at: string
          description: string | null
          id: string
          published_video_id: string | null
          scheduled_for: string
          status: string | null
          thumbnail_url: string | null
          user_id: string
          video_url: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          published_video_id?: string | null
          scheduled_for: string
          status?: string | null
          thumbnail_url?: string | null
          user_id: string
          video_url: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          published_video_id?: string | null
          scheduled_for?: string
          status?: string | null
          thumbnail_url?: string | null
          user_id?: string
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_posts_published_video_id_fkey"
            columns: ["published_video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      search_history: {
        Row: {
          created_at: string
          id: string
          query: string
          search_type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          query: string
          search_type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          query?: string
          search_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      stories: {
        Row: {
          background_color: string | null
          caption: string | null
          created_at: string
          duration: number | null
          expires_at: string
          id: string
          media_type: string
          media_url: string
          thumbnail_url: string | null
          user_id: string
          view_count: number | null
        }
        Insert: {
          background_color?: string | null
          caption?: string | null
          created_at?: string
          duration?: number | null
          expires_at?: string
          id?: string
          media_type: string
          media_url: string
          thumbnail_url?: string | null
          user_id: string
          view_count?: number | null
        }
        Update: {
          background_color?: string | null
          caption?: string | null
          created_at?: string
          duration?: number | null
          expires_at?: string
          id?: string
          media_type?: string
          media_url?: string
          thumbnail_url?: string | null
          user_id?: string
          view_count?: number | null
        }
        Relationships: []
      }
      story_replies: {
        Row: {
          created_at: string
          id: string
          message: string
          sender_id: string
          story_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          sender_id: string
          story_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          sender_id?: string
          story_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_replies_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      story_views: {
        Row: {
          id: string
          story_id: string
          viewed_at: string
          viewer_id: string
        }
        Insert: {
          id?: string
          story_id: string
          viewed_at?: string
          viewer_id: string
        }
        Update: {
          id?: string
          story_id?: string
          viewed_at?: string
          viewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_views_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_tiers: {
        Row: {
          benefits: string[] | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          price_cents: number
          subscriber_count: number | null
          user_id: string
        }
        Insert: {
          benefits?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          price_cents: number
          subscriber_count?: number | null
          user_id: string
        }
        Update: {
          benefits?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          price_cents?: number
          subscriber_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          auto_renew: boolean | null
          creator_id: string
          expires_at: string | null
          id: string
          price_cents: number
          started_at: string
          status: string | null
          subscriber_id: string
          tier: string
        }
        Insert: {
          auto_renew?: boolean | null
          creator_id: string
          expires_at?: string | null
          id?: string
          price_cents: number
          started_at?: string
          status?: string | null
          subscriber_id: string
          tier: string
        }
        Update: {
          auto_renew?: boolean | null
          creator_id?: string
          expires_at?: string | null
          id?: string
          price_cents?: number
          started_at?: string
          status?: string | null
          subscriber_id?: string
          tier?: string
        }
        Relationships: []
      }
      tagged_videos: {
        Row: {
          created_at: string
          id: string
          user_id: string
          video_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          video_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tagged_videos_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      tips: {
        Row: {
          amount_cents: number
          created_at: string
          from_user_id: string
          id: string
          message: string | null
          status: string | null
          to_user_id: string
          video_id: string | null
        }
        Insert: {
          amount_cents: number
          created_at?: string
          from_user_id: string
          id?: string
          message?: string | null
          status?: string | null
          to_user_id: string
          video_id?: string | null
        }
        Update: {
          amount_cents?: number
          created_at?: string
          from_user_id?: string
          id?: string
          message?: string | null
          status?: string | null
          to_user_id?: string
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tips_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      trending_hashtags: {
        Row: {
          category: string | null
          hashtag: string
          id: string
          trend_score: number | null
          updated_at: string
          video_count: number | null
          view_count: number | null
        }
        Insert: {
          category?: string | null
          hashtag: string
          id?: string
          trend_score?: number | null
          updated_at?: string
          video_count?: number | null
          view_count?: number | null
        }
        Update: {
          category?: string | null
          hashtag?: string
          id?: string
          trend_score?: number | null
          updated_at?: string
          video_count?: number | null
          view_count?: number | null
        }
        Relationships: []
      }
      typing_status: {
        Row: {
          conversation_id: string
          id: string
          is_typing: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          id?: string
          is_typing?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          id?: string
          is_typing?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "typing_status_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_analytics: {
        Row: {
          date: string
          engagement_rate: number | null
          id: string
          impressions: number | null
          new_followers: number | null
          profile_views: number | null
          reach: number | null
          total_comments: number | null
          total_likes: number | null
          total_shares: number | null
          total_video_views: number | null
          user_id: string
        }
        Insert: {
          date?: string
          engagement_rate?: number | null
          id?: string
          impressions?: number | null
          new_followers?: number | null
          profile_views?: number | null
          reach?: number | null
          total_comments?: number | null
          total_likes?: number | null
          total_shares?: number | null
          total_video_views?: number | null
          user_id: string
        }
        Update: {
          date?: string
          engagement_rate?: number | null
          id?: string
          impressions?: number | null
          new_followers?: number | null
          profile_views?: number | null
          reach?: number | null
          total_comments?: number | null
          total_likes?: number | null
          total_shares?: number | null
          total_video_views?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_blocks: {
        Row: {
          blocked_user_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          blocked_user_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          blocked_user_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_mutes: {
        Row: {
          created_at: string
          id: string
          muted_user_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          muted_user_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          muted_user_id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          accessibility: Json
          ads: Json
          app: Json
          content: Json
          created_at: string
          id: string
          interactions: Json
          notifications: Json
          privacy: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          accessibility?: Json
          ads?: Json
          app?: Json
          content?: Json
          created_at?: string
          id?: string
          interactions?: Json
          notifications?: Json
          privacy?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          accessibility?: Json
          ads?: Json
          app?: Json
          content?: Json
          created_at?: string
          id?: string
          interactions?: Json
          notifications?: Json
          privacy?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      video_analytics: {
        Row: {
          audience_demographics: Json | null
          avg_watch_time_seconds: number | null
          comments: number | null
          completion_rate: number | null
          date: string
          id: string
          likes: number | null
          saves: number | null
          shares: number | null
          traffic_sources: Json | null
          unique_viewers: number | null
          video_id: string
          views: number | null
        }
        Insert: {
          audience_demographics?: Json | null
          avg_watch_time_seconds?: number | null
          comments?: number | null
          completion_rate?: number | null
          date?: string
          id?: string
          likes?: number | null
          saves?: number | null
          shares?: number | null
          traffic_sources?: Json | null
          unique_viewers?: number | null
          video_id: string
          views?: number | null
        }
        Update: {
          audience_demographics?: Json | null
          avg_watch_time_seconds?: number | null
          comments?: number | null
          completion_rate?: number | null
          date?: string
          id?: string
          likes?: number | null
          saves?: number | null
          shares?: number | null
          traffic_sources?: Json | null
          unique_viewers?: number | null
          video_id?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "video_analytics_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      video_drafts: {
        Row: {
          created_at: string
          description: string | null
          draft_data: Json | null
          hashtags: string[] | null
          id: string
          location: string | null
          media_url: string | null
          mentions: string[] | null
          music_id: string | null
          thumbnail_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          draft_data?: Json | null
          hashtags?: string[] | null
          id?: string
          location?: string | null
          media_url?: string | null
          mentions?: string[] | null
          music_id?: string | null
          thumbnail_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          draft_data?: Json | null
          hashtags?: string[] | null
          id?: string
          location?: string | null
          media_url?: string | null
          mentions?: string[] | null
          music_id?: string | null
          thumbnail_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      video_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          user_id: string
          video_id: string
          watch_ms: number | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          user_id: string
          video_id: string
          watch_ms?: number | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          user_id?: string
          video_id?: string
          watch_ms?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "video_events_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      video_reports: {
        Row: {
          created_at: string
          details: string | null
          id: string
          reason: string
          reporter_id: string
          status: string
          video_id: string
        }
        Insert: {
          created_at?: string
          details?: string | null
          id?: string
          reason: string
          reporter_id: string
          status?: string
          video_id: string
        }
        Update: {
          created_at?: string
          details?: string | null
          id?: string
          reason?: string
          reporter_id?: string
          status?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_reports_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          audience: string
          bookmarks_count: number
          clip_settings: Json | null
          collaborators: string[]
          comments_count: number
          comments_enabled: boolean
          content_warning: boolean
          created_at: string
          cross_post_profile: boolean
          cross_post_reel: boolean
          cross_post_story: boolean
          description: string | null
          hashtags: string[]
          id: string
          is_pinned: boolean
          likes_count: number
          location: string | null
          mentions: string[]
          merge_mode: boolean
          music: string | null
          music_start_seconds: number
          scheduled_for: string | null
          shares_count: number
          stream_asset_id: string | null
          stream_error: string | null
          stream_playback_id: string | null
          stream_provider: string | null
          stream_status: string
          stream_upload_id: string | null
          tagged_people: string[]
          thumbnail_text: string | null
          thumbnail_url: string | null
          upload_group_id: string | null
          upload_group_index: number | null
          user_id: string
          video_url: string
          visibility: string
        }
        Insert: {
          audience?: string
          bookmarks_count?: number
          clip_settings?: Json | null
          collaborators?: string[]
          comments_count?: number
          comments_enabled?: boolean
          content_warning?: boolean
          created_at?: string
          cross_post_profile?: boolean
          cross_post_reel?: boolean
          cross_post_story?: boolean
          description?: string | null
          hashtags?: string[]
          id?: string
          is_pinned?: boolean
          likes_count?: number
          location?: string | null
          mentions?: string[]
          merge_mode?: boolean
          music?: string | null
          music_start_seconds?: number
          scheduled_for?: string | null
          shares_count?: number
          stream_asset_id?: string | null
          stream_error?: string | null
          stream_playback_id?: string | null
          stream_provider?: string | null
          stream_status?: string
          stream_upload_id?: string | null
          tagged_people?: string[]
          thumbnail_text?: string | null
          thumbnail_url?: string | null
          upload_group_id?: string | null
          upload_group_index?: number | null
          user_id: string
          video_url: string
          visibility?: string
        }
        Update: {
          audience?: string
          bookmarks_count?: number
          clip_settings?: Json | null
          collaborators?: string[]
          comments_count?: number
          comments_enabled?: boolean
          content_warning?: boolean
          created_at?: string
          cross_post_profile?: boolean
          cross_post_reel?: boolean
          cross_post_story?: boolean
          description?: string | null
          hashtags?: string[]
          id?: string
          is_pinned?: boolean
          likes_count?: number
          location?: string | null
          mentions?: string[]
          merge_mode?: boolean
          music?: string | null
          music_start_seconds?: number
          scheduled_for?: string | null
          shares_count?: number
          stream_asset_id?: string | null
          stream_error?: string | null
          stream_playback_id?: string | null
          stream_provider?: string | null
          stream_status?: string
          stream_upload_id?: string | null
          tagged_people?: string[]
          thumbnail_text?: string | null
          thumbnail_url?: string | null
          upload_group_id?: string | null
          upload_group_index?: number | null
          user_id?: string
          video_url?: string
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "videos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assert_mentions_allowed: {
        Args: { input_text: string }
        Returns: undefined
      }
      decrement_collection_video_count: {
        Args: { collection_id: string }
        Returns: undefined
      }
      extract_mentioned_usernames: {
        Args: { input_text: string }
        Returns: string[]
      }
      generate_stream_key: { Args: never; Returns: string }
      get_for_you_video_ids: {
        Args: { limit_count?: number }
        Returns: {
          score: number
          video_id: string
        }[]
      }
      get_creator_recommendation_experiment_admin: {
        Args: never
        Returns: {
          control_weights: Json
          exposure_cap_per_day: number
          id: string
          name: string
          status: string
          updated_at: string
          variant_weights: Json
        }[]
      }
      get_creator_recommendation_experiment_metrics: {
        Args: { window_days?: number }
        Returns: {
          cap_hit_rate_percent: number
          clicks: number
          ctr_percent: number
          exposures: number
          follow_conversion_percent: number
          follow_conversions: number
          unique_exposed_users: number
          variant: string
        }[]
      }
      get_creator_recommendation_experiment_alerts: {
        Args: { ctr_drop_threshold_percent?: number; window_days?: number }
        Returns: {
          control_ctr_percent: number
          control_follow_conversion_percent: number
          ctr_drop_percent: number
          message: string
          threshold_percent: number
          variant_ctr_percent: number
          variant_follow_conversion_percent: number
          warning_level: string
        }[]
      }
      get_priority_video_reports: {
        Args: { limit_count?: number }
        Returns: {
          created_at: string
          details: string
          owner_open_reports: number
          owner_user_id: string
          owner_username: string
          priority_score: number
          reason: string
          report_count_on_video: number
          report_id: string
          reporter_id: string
          reporter_username: string
          status: string
          video_id: string
        }[]
      }
      get_follow_recommendations: {
        Args: { limit_count?: number }
        Returns: {
          avatar_url: string
          display_name: string
          is_private: boolean
          is_verified: boolean
          score: number
          user_id: string
          username: string
        }[]
      }
      increment_collection_video_count: {
        Args: { collection_id: string }
        Returns: undefined
      }
      increment_poll_total_votes: {
        Args: { target_poll_id: string }
        Returns: undefined
      }
      increment_story_view_count: {
        Args: { story_id: string }
        Returns: undefined
      }
      is_current_user_admin: { Args: never; Returns: boolean }
      log_creator_recommendation_exposure_batch: {
        Args: { suggested_user_ids: string[]; surface_name?: string }
        Returns: undefined
      }
      log_creator_recommendation_click: {
        Args: { suggested_user_id_input: string; surface_name?: string }
        Returns: undefined
      }
      log_for_you_ranking_batch: {
        Args: { rows_payload: Json; surface_name?: string }
        Returns: undefined
      }
      log_admin_action: {
        Args: {
          action_name: string
          payload?: Json
          target_report?: string
          target_user?: string
          target_video?: string
        }
        Returns: undefined
      }
      run_abuse_moderation_automation: {
        Args: { max_updates?: number }
        Returns: {
          new_status: string
          priority_reason: string
          report_id: string
        }[]
      }
      run_retention_nudges: {
        Args: { limit_count?: number }
        Returns: {
          inserted_count: number
          kind: string
        }[]
      }
      upsert_creator_recommendation_experiment: {
        Args: {
          control_weights_input: Json
          experiment_name: string
          experiment_status: string
          exposure_cap_input?: number
          variant_weights_input: Json
        }
        Returns: string
      }
      user_is_in_conversation: { Args: { conv_id: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
