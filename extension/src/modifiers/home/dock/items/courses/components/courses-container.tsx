import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { store } from "../store"
import { t } from "@/utils/i18n"
import { useCourses } from "../hooks/useCourses"
import { ChatBubbleIcon, Pencil1Icon, PersonIcon, ReaderIcon, SpeakerLoudIcon, StarFilledIcon, StarIcon } from "@radix-ui/react-icons"
import { StatusType } from "../types/course"
import { Component, ForwardRefExoticComponent, ReactComponentElement, ReactNode } from "react"
import { IconProps } from "@radix-ui/react-icons/dist/types"

const Icons: { [key in StatusType]: ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>> } = {
  [StatusType.News]: SpeakerLoudIcon,
  [StatusType.Assignment]: Pencil1Icon,
  [StatusType.Grade]: ReaderIcon,
  [StatusType.Topic]: ChatBubbleIcon,
  [StatusType.Collection]: PersonIcon,
}

export const CoursesContainer = () => {
  const courses = useCourses()

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
        <TabsContent value="list">
          <div className="overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-primary text-primary-foreground text-center font-bold shadow">
                  <th className="border" scope="col">{t('home_courses_course_name')}</th>
                  <th className="border" scope="col">{t('home_courses_course_year')}</th>
                  <th className="border" scope="col">{t('home_courses_course_remarks')}</th>
                  <th className="border" scope="col">{t('home_courses_course_teachers')}</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => (
                  <tr className="even:bg-slate-900/5" key={course.id}>
                    <td className="min-w-64 border-x">
                      <div className="my-1 grid-cols-[auto_2rem_1fr_auto_auto] grid items-center">
                        {/* <StarIcon className=" fill-red-400" /> */}
                        <StarFilledIcon className=" text-red-500"/>
                        <img src={course.icon} />
                        <a className="truncate" href={course.url}>{course.title}</a>
                        <div className="text-orange-300">{course.linked && t('home_courses_course_linked')}</div>
                        <div className="flex">
                          {Object.entries(course.status).map(([type, value]) => {
                            const Icon = Icons[parseInt(type) as StatusType]
                            return (
                              <a key={type}>
                                <Icon />
                              </a>
                            )
                          })}
                        </div>
                      </div>
                    </td>
                    <td className="w-fit text-center border-x">{course.year}</td>
                    <td className="max-w-16 truncate border-x">{course.remarks}</td>
                    <td className="max-w-12 truncate border-x">{course.teachers}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </div >
    </Tabs >
  )
}
