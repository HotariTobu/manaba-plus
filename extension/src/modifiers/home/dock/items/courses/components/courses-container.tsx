import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { dynamicStore, store } from "../store"
import { t } from "@/utils/i18n"
import { useCourses } from "../hooks/useCourses"
import { ChatBubbleIcon, Pencil1Icon, PersonIcon, ReaderIcon, SpeakerLoudIcon, StarFilledIcon, StarIcon } from "@radix-ui/react-icons"
import { StatusType } from "../types/course"
import { Component, ForwardRefExoticComponent, ReactComponentElement, ReactNode, useState } from "react"
import { IconProps } from "@radix-ui/react-icons/dist/types"
import { cn } from "@/lib/utils"

const CourseStar = (props: {
  courseId: string
}) => {
  const [starred, setStarred] = useState(dynamicStore.star.get(props.courseId))
  const Icon = starred ? StarFilledIcon : StarIcon

  const handleClick = () => {
    setStarred(!starred)
    dynamicStore.star.set(props.courseId, !starred)
  }

  return (
    <div className={cn(starred ? "text-yellow-400 hover:text-slate-400" : "text-slate-400 hover:text-yellow-400")} onClick={handleClick}>
      <Icon className="m-1" />
    </div>
  )
}

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
      <TabsList className="bg-primary">
        <TabsTrigger value="timetable">{t('home_courses_timetable')}</TabsTrigger>
        <TabsTrigger value="cards">{t('home_courses_cards')}</TabsTrigger>
        <TabsTrigger value="list">{t('home_courses_list')}</TabsTrigger>
      </TabsList>
      <TabsContent value="timetable">timetable</TabsContent>
      <TabsContent value="cards">cards</TabsContent>
      <TabsContent value="list">
        <div className="overflow-x-auto rounded-lg border-primary border">
          <table className="w-full">
            <thead>
              <tr className="bg-primary text-primary-foreground text-center font-bold">
                <th className="p-2" scope="col">{t('home_courses_course_name')}</th>
                <th className="p-2" scope="col">{t('home_courses_course_year')}</th>
                <th className="p-2" scope="col">{t('home_courses_course_remarks')}</th>
                <th className="p-2" scope="col">{t('home_courses_course_teachers')}</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr className="even:bg-slate-700/5" key={course.id}>
                  <td className="min-w-64 max-w-96">
                    <div className="my-1 grid-cols-[auto_2rem_1fr_auto_auto] grid items-center">
                      <CourseStar courseId={course.id} />
                      <img src={course.icon} />
                      <a className="ms-1 truncate" href={course.url}>{course.title}</a>
                      <div className="ms-1 text-orange-300">{course.linked && t('home_courses_course_linked')}</div>
                      <div className="ms-1 flex">
                        {Object.entries(course.status).map(([type, value]) => {
                          const Icon = Icons[parseInt(type) as StatusType]
                          return (
                            <a className={cn(value ? 'text-red-500 animate-pulse' : 'text-slate-400', 'hover:text-red-500 hover:animate-none')} key={type}>
                              <Icon className="m-1" />
                            </a>
                          )
                        })}
                      </div>
                    </div>
                  </td>
                  <td className="p-1 w-fit text-center border-primary border-s">{course.year}</td>
                  <td className="p-1 max-w-24 truncate border-primary border-s">{course.remarks}</td>
                  <td className="p-1 max-w-20 truncate border-primary border-s">{course.teachers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TabsContent>
    </Tabs >
  )
}
