import { Card } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { View } from 'react-native'

export function DashboardSummary() {
  const stats = [
    { value: 4, label: 'Classes Today', color: 'text-summary-green' },
    { value: 4, label: 'Upcoming Tests', color: 'text-summary-brown' },
    { value: 24, label: 'Assignments to submit', color: 'text-summary-red' },
  ]

  return (
    <Card className="mt-4 mx-auto w-full h-24 flex-row justify-around items-center p-1 py-2 rounded-xl shadow-sm ">
      {stats.map((item, index) => (
        <View key={index} className="flex-1 items-center">
          <Text className={`text-2xl font-semibold ${item.color}`}>
            {item.value}
          </Text>
          <Text className="text-xs text-muted-foreground text-center mt-1">
            {item.label}
          </Text>
        </View>
      ))}
    </Card>
  )
}
