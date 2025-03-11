import NewDM from "./components/new-dm";
import ProfileInfo from "./components/profile-info";
import { apiClient } from "@/lib/api-client";
import {GET_DM_CONTACTS_ROUTES,GET_USER_CHANNELS_ROUTE } from "@/utils/constants";
import { useAppStore } from "@/store";
import { useEffect} from "react";
import ContactList from "../../../../components/contact-list";
import CreateChannel from "./components/create-channel";
const ContactsContainer = () => {

const { setDirectMessagesContacts ,  directMessagesContacts ,channels,setChannels} = useAppStore();

  useEffect(() => {
    const getContacts = async () => {
      const response = await apiClient.get(GET_DM_CONTACTS_ROUTES,{
        withCredentials:true
      });
    if ( response.data.contacts){
     setDirectMessagesContacts(response.data.contacts)
    }
    }
    const getChannels = async () => {
      const response = await apiClient.get(GET_USER_CHANNELS_ROUTE,{
        withCredentials:true
      });
    if ( response.data.channels){
     setChannels(response.data.channels)
    }
    }
    getContacts();
    getChannels();
  }, [setDirectMessagesContacts,setChannels]);
  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
      <div className="pt-3">
        <Logo />
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Direct Messages" />
          <NewDM />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={directMessagesContacts}  />
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Channels" />
          <CreateChannel/>
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={channels} isChannel={true} />
        </div>
      </div>
      <ProfileInfo />
    </div>
  );
};

export default ContactsContainer;
const Logo = () => {
  return (
    <div className="flex items-center p-4 justify-start"> {/* Reduced gap */}
      <svg
        width="84"
        height="36"
        viewBox="0 0 80 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Bold & Thick Lightning Bolt */}
        <path
          d="M20 2L40 20L30 20L50 30L35 15H45L20 2Z"
          fill="none"
          stroke="#8338ec"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-3xl font-semibold tracking-wide">
        VibeChat
      </span>
    </div>
  );
};

const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  );
};
