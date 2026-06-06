import React from "react";
import { View, Modal } from "react-native";
import { AlertTriangle } from "lucide-react-native";
import AppText from "./AppText";
import AppButton from "./AppButton";

interface AppDeleteModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

export default function AppDeleteModal({
  visible,
  onClose,
  onConfirm,
  title = "تأكيد الحذف",
  description = "هل أنت متأكد من رغبتك في الحذف؟ لا يمكن التراجع عن هذا الإجراء.",
  confirmText = "حذف",
  cancelText = "إلغاء",
  loading = false,
}: AppDeleteModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 items-center justify-center px-6">
        <View className="w-full bg-background-light dark:bg-background-dark rounded-[32px] p-6 border border-border-light dark:border-border-dark shadow-xl">
          <View className="items-center mb-6">
            <View className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/30 items-center justify-center mb-4">
              <AlertTriangle size={32} color="#ef4444" />
            </View>
            <AppText variant="h2" className="text-center mb-2">
              {title}
            </AppText>
            <AppText variant="body" muted className="text-center px-2">
              {description}
            </AppText>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <AppButton
                variant="outline"
                onPress={onClose}
                disabled={loading}
              >
                {cancelText}
              </AppButton>
            </View>
            <View className="flex-1">
              <AppButton
                className="bg-red-500"
                onPress={onConfirm}
                loading={loading}
              >
                {confirmText}
              </AppButton>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
