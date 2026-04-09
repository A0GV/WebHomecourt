import { supabase } from "../lib/supabase";
export interface Court {
  court_id: number;
  name: string;
  direction: string;
  longitude: number;
  latitude: number;
  allow_court: boolean;
}

export async function getCourts(){
  const { data: court, error } = await supabase
  .from('court')
  .select('*')
  if (error){
    console.error(error.message)
    return null
  }
  return court
}