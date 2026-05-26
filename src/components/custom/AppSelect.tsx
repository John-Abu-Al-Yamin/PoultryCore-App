import { useState, useMemo, useEffect } from "react";
import type { ReactNode } from "react";
import {
  View,
  TextInput,
  Modal,
  FlatList,
  Pressable,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { ChevronDown, Search, X } from "lucide-react-native";
import { useTheme } from "@/src/contexts/ThemeContext";
import AppText from "./AppText";
import FormError from "./FormError";

export interface SelectOption<T = string | number> {
  label: string;
  value: T;
}

interface AppSelectProps<T = string | number> {
  value?: T;
  onChange?: (value: T) => void;
  onBlur?: () => void;
  options: SelectOption<T>[];
  placeholder?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerClassName?: string;
  className?: string;
  label?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  loading?: boolean;
  emptyMessage?: string;
  disabled?: boolean;
}

export default function AppSelect<T = string | number>({
  value,
  onChange,
  onBlur,
  options,
  placeholder = "اختر...",
  error,
  leftIcon,
  rightIcon,
  containerClassName = "",
  className = "",
  label,
  searchable = true,
  searchPlaceholder = "بحث...",
  loading = false,
  emptyMessage = "لا توجد خيارات",
  disabled = false,
}: AppSelectProps<T>) {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!modalVisible) {
      setSearchQuery("");
    }
  }, [modalVisible]);

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const q = searchQuery.trim().toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        String(opt.value).toLowerCase().includes(q),
    );
  }, [options, searchQuery]);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (option: SelectOption<T>) => {
    onChange?.(option.value);
    onBlur?.();
    setModalVisible(false);
  };

  const handleOpen = () => {
    if (disabled) return;
    Keyboard.dismiss();
    setModalVisible(true);
  };

  const handleClose = () => {
    onBlur?.();
    setModalVisible(false);
  };

  const renderItem = ({ item }: { item: SelectOption<T> }) => {
    const isSelected = item.value === value;
    return (
      <Pressable
        className={`flex-row items-center py-3.5 px-4 ${
          isSelected
            ? "bg-primary-light dark:bg-primary-dark"
            : "active:bg-muted-light dark:active:bg-muted-dark"
        }`}
        onPress={() => handleSelect(item)}
      >
        <AppText
          className={`flex-1 text-right ${
            isSelected
              ? "text-background-light dark:text-background-dark font-medium"
              : ""
          }`}
        >
          {item.label}
        </AppText>
        {isSelected && (
          <View className="w-5 h-5 rounded-full border-2 border-background-light dark:border-background-dark items-center justify-center ms-2">
            <View className="w-2.5 h-2.5 rounded-full bg-background-light dark:bg-background-dark" />
          </View>
        )}
      </Pressable>
    );
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
            color: selectedOption ? colors.text : colors.mutedForeground,
          }}
          numberOfLines={1}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </AppText>

        {rightIcon ? (
          <View className="absolute end-3 top-0 bottom-0 justify-center">
            {rightIcon}
          </View>
        ) : (
          <View className="absolute end-3 top-0 bottom-0 justify-center">
            <ChevronDown size={18} color={colors.mutedForeground} />
          </View>
        )}
      </Pressable>

      <FormError message={error} />

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-center px-4"
          onPress={handleClose}
        >
          <Pressable
            className="bg-background-light dark:bg-background-dark rounded-2xl max-h-[70%] overflow-hidden"
            onPress={() => {}}
          >
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-border-light dark:border-border-dark">
              <AppText variant="h3">
                {selectedOption ? selectedOption.label : placeholder}
              </AppText>
              <Pressable onPress={handleClose} hitSlop={10}>
                <X size={20} color={colors.mutedForeground} />
              </Pressable>
            </View>

            {searchable && (
              <View className="px-4 py-2">
                <View className="flex-row items-center bg-muted-light dark:bg-muted-dark rounded-xl px-3">
                  <Search size={16} color={colors.mutedForeground} />
                  <TextInput
                    className="flex-1 text-right text-text-light dark:text-text-dark py-2.5 pe-2 text-base"
                    placeholder={searchPlaceholder}
                    placeholderTextColor={colors.mutedForeground}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    textAlign="right"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {searchQuery.length > 0 && (
                    <Pressable onPress={() => setSearchQuery("")} hitSlop={8}>
                      <X size={16} color={colors.mutedForeground} />
                    </Pressable>
                  )}
                </View>
              </View>
            )}

            {loading && options.length === 0 ? (
              <View className="py-10 items-center">
                <ActivityIndicator color={colors.mutedForeground} />
              </View>
            ) : (
              <FlatList
                data={filteredOptions}
                renderItem={renderItem}
                keyExtractor={(item) => String(item.value)}
                ListEmptyComponent={
                  <View className="py-10 items-center">
                    <AppText muted className="text-center">
                      {emptyMessage}
                    </AppText>
                  </View>
                }
                contentContainerClassName="py-1"
                keyboardShouldPersistTaps="handled"
              />
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
