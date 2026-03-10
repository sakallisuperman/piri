import { supabase } from "./supabase"

export async function saveConversation(userId: string, role: string, message: string) {
  const { error } = await supabase
    .from("conversations")
    .insert([
      {
        user_id: userId,
        role: role,
        message: message
      }
    ])

  if (error) {
    console.error("Supabase error:", error)
  }
}
