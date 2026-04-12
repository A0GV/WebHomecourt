import { supabase } from "../lib/supabase"
import { useEffect } from "react";

useEffect(() => {
 supabase.auth.getSession().then(({ data }) => {
 console.log("Session:", data.session);
 });
}, []);

function UserSession() {
    return (
        <div>
            <p>Usuario con sesión</p>
        </div>
    )
}

export default UserSession