import { supabase } from "../lib/supabase";
import React from "react";
import { useAuth } from "../context/AuthContext";
export interface UserReport {
    ureport_id: number;
    event_id: number;
    reported_user_id: string;
    reporter_user_id: string;
    comment: string;
    // status: string | null;
    created_at: string;
    // key_words: string[] | null;
    report_type: number;
}

export async function submitUReport(  eventId: number, reportedUserId: string, reportType: string, description: string, reportType:number)  {
    const {user} = useAuth();
    if (!user) {
        throw new Error("User has not logged in");
    }

    const payload = {
        event_id: eventId,
        reported_user_id: reportedUserId,
        reporter_user_id: user.id,
        comment: description,
        priority: reportType,

        // status: "pending",
        // key_words: [reportType.toLowerCase().replace(/\s+/g, "_")],
    }
    const {error} = await supabase
    .from("user_report")
    .insert([payload])

}