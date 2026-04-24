import { supabase } from "../lib/supabase";
import React from "react";
import { useAuth } from "../context/AuthContext";
export interface UserReport {
    ureport_id: number;
    event_id: number;
    reported_user_id: string;
    reporter_user_id: string;
    comment: string;
    status: string;
    created_at: string;
    key_words: string[];
}

export async function submitUReport(  eventId: number, reportedUserId: string, reportType: string, description: string): Promise<UserReport>  {
    const {user} = useAuth();
    if (!user) {
        throw new Error("User has not logged in");
    }
    const {data,error} = await supabase
    .from("user_report")
    .insert

}