import Toast from "react-native-toast-message";

let toastIdCounter = 0;

function nextId(): string {
  return `toast_${++toastIdCounter}`;
}

export const toast = {
  loading: (message: string): string => {
    const id = nextId();
    Toast.show({
      type: "loading",
      text1: message,
      autoHide: false,
    });
    return id;
  },

  success: (message: string, _options?: { id?: string | number; duration?: number }) => {
    Toast.show({
      type: "success",
      text1: message,
      visibilityTime: _options?.duration ?? 2000,
      autoHide: true,
    });
  },

  error: (message: string, _options?: { id?: string | number; duration?: number }) => {
    Toast.show({
      type: "error",
      text1: message,
      visibilityTime: _options?.duration ?? 4000,
      autoHide: true,
    });
  },

  dismiss: (_id?: string | number) => {
    Toast.hide();
  },
};
