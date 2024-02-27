import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { store } from "../store"
import { t } from "@/utils/i18n"

export const CoursesContainer = () => {
  return (
    <Tabs defaultValue={store.tab} onValueChange={tab => store.tab = tab}>
      <TabsList className="bg-primary rounded-b-none">
        <TabsTrigger value="timetable">{t('home_courses_timetable')}</TabsTrigger>
        <TabsTrigger value="cards">{t('home_courses_cards')}</TabsTrigger>
        <TabsTrigger value="list">{t('home_courses_list')}</TabsTrigger>
      </TabsList>
      <div className="p-2 pt-0 rounded-b-lg border-primary border">
        <TabsContent value="timetable">timetable</TabsContent>
        <TabsContent value="cards">cards</TabsContent>
        <TabsContent value="list">list</TabsContent>
      </div>
    </Tabs>
  )
}
