import { useState } from "react";
import type { ReactNode } from "react";
import { View, Pressable, Platform } from "react-native";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Calendar } from "lucide-react-native";
import { useTheme } from "@/src/contexts/ThemeContext";
import AppText from "./AppText";
import FormError from "./FormError";

interface AppDatePickerProps {
  value?: string;
  onChange?: (dateStr: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerClassName?: string;
  className?: string;
  label?: string;
  disabled?: boolean;
  minimumDate?: Date;
  maximumDate?: Date;
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseDate(dateStr: string): Date | undefined {
  if (!dateStr) return undefined;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? undefined : d;
}

export default function AppDatePicker({
  value,
  onChange,
  onBlur,
  placeholder = "اختر تاريخ",
  error,
  leftIcon,
  rightIcon,
  containerClassName = "",
  className = "",
  label,
  disabled = false,
  minimumDate,
  maximumDate,
}: AppDatePickerProps) {
  const { colors } = useTheme();
  const [show, setShow] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(new Date());

  const currentDate = parseDate(value ?? "");

  const handleOpen = () => {
    if (disabled) return;
    setTempDate(currentDate ?? new Date());
    setShow(true);
  };

  const handleChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShow(false);
      if (selectedDate && _event.type !== "dismissed") {
        onChange?.(formatDate(selectedDate));
      }
      onBlur?.();
    } else {
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    }
  };

  const handleDone = () => {
    onChange?.(formatDate(tempDate));
    onBlur?.();
    setShow(false);
  };

  const handleDismiss = () => {
    onBlur?.();
    setShow(false);
  };

  return (
    <View className={containerClassName}>
      {label && (
        <AppText variant="label" className="mb-2">
          {label}
        </AppText>
      )}

      <Pressable
        className={`flex-row items-center bg-background-light dark:bg-background-dark border rounded-xl py-3.5 ${
          error
            ? "border-error-light dark:border-error-dark"
            : "border-border-light dark:border-border-dark"
        } ${leftIcon ? "ps-11" : "ps-4"} pe-12 ${className} ${
          disabled ? "opacity-50" : ""
        }`}
        onPress={handleOpen}
        disabled={disabled}
      >
        {leftIcon && (
          <View className="absolute start-3 top-0 bottom-0 justify-center z-10">
            {leftIcon}
          </View>
        )}

        <AppText
          className="flex-1 text-right text-base"
          style={{
            color: value ? colors.text : colors.mutedForeground,
          }}
          numberOfLines={1}
        >
          {value || placeholder}
        </AppText>

        {rightIcon ? (
          <View className="absolute end-3 top-0 bottom-0 justify-center">
            {rightIcon}
          </View>
        ) : (
          <View className="absolute end-3 top-0 bottom-0 justify-center">
            <Calendar size={18} color={colors.mutedForeground} />
          </View>
        )}
      </Pressable>

      <FormError message={error} />

      {show && (
        <View>
          <DateTimePicker
            value={tempDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleChange}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
          />
          {Platform.OS === "ios" && (
            <Pressable
              className="bg-primary-light dark:bg-primary-dark rounded-xl py-2.5 items-center mt-2"
              onPress={handleDone}
            >
              <AppText className="text-background-light dark:text-background-dark font-medium">
                تم
              </AppText>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}
