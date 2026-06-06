import * as Contacts from "expo-contacts";

export const useContactPicker = () => {
  const pickContact = async (): Promise<string | null> => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== "granted") return null;

    const contact = await Contacts.presentContactPickerAsync();
    if (!contact) return null;

    const phone = contact.phoneNumbers?.[0]?.number;
    return phone || null;
  };

  return { pickContact };
};
