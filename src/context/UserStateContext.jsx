// import type { PropsWithChildren } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import { usePostHog } from "posthog-js/react";
import { v4 as uuidv4 } from "uuid";

// interface UserStateContextProps {
//   bearer: any;
//   appId: any;
//   email: any;
//   avatarUrl: any;
//   fullName: any;
//   userId: any;
// }

const UserStateContext = createContext();

export function UserStateProvider({ children }) {
  const [bearer, setBearer] = useState(null);
  const [email, setEmail] = useState(null);
  const [appId, setAppId] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [fullName, setFullName] = useState(null);
  const [userId, setUserId] = useState("");

  const posthog = usePostHog();

  const fetchData = async () => {
    // TODO #1: Replace with your JWT template name
    console.log("fetching data");
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
    //   let metadata = user!.user_metadata; --> in ts 
      let metadata = user ? user.user_metadata : null; 
    //   let metadata = user ? user_metadata : null;--> in js


      console.log(metadata);
      const email = metadata.email;
    //   const id = user!.id;
     const id =  user ? user.id:null
      // Select the row corresponding to this userId
      const { data } = await supabase.from("ragstack_users").select().eq("id", id);
      console.log(data);
      if (data && data[0]) {
        setBearer(data[0]["secret_key"]);
        setAppId(data[0]["app_id"]);
        setEmail(email);
        setAvatarUrl(metadata.avatar_url);
        setFullName(metadata.full_name);
        setUserId(id);
        posthog? posthog.identify(id, {
          email: email,
          app_id: data[0]["app_id"],
        }):null;
      } else {
        // Create the user row if it doesn't exist

        const response = await supabase
          .from("ragstack_users")
          .insert({
            id: id,
            secret_key: uuidv4(),
            app_id: uuidv4(),
            email: email,
            avatar_url: metadata.avatar_url,
            full_name: metadata.full_name,
          })
          .select();

        if (response.data && response.data[0]) {
          const data = response.data[0];
          setBearer(data["secret_key"]);
          setAppId(data["app_id"]);
          setEmail(email);
          setAvatarUrl(metadata.avatar_url);
          setFullName(metadata.full_name);
          setUserId(id);
          posthog ? posthog.identify(id, {
            email: email,
            app_id: data["app_id"],
          }):null;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <UserStateContext.Provider
      value={{
        bearer: bearer,
        appId: appId,
        email: email,
        avatarUrl: avatarUrl,
        fullName: fullName,
        userId: userId,
      }}
    >
      {children}
    </UserStateContext.Provider>
  );
}

export function useUserStateContext() {
  const context = useContext(UserStateContext);

  return context;
}
