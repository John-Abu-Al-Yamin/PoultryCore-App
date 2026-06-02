import { View, Text } from 'react-native'
import AppScreen from "@/src/components/custom/AppScreen";
import AppText from '@/src/components/custom/AppText';

const expenses = () => {
  return (
    <AppScreen
      className="bg-background-light dark:bg-background-dark"
      contentContainerClassName="items-center justify-center px-4 flex-1"
    >
    <View>
        <AppText variant="body">المصروفات</AppText>
    </View>
 </AppScreen>
  )
}

export default expenses