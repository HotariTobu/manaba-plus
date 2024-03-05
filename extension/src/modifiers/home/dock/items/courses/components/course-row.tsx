import { t } from "@/utils/i18n"
import { Truncated } from "@/components/truncated"
import { type Course } from "../types/course"
import { CourseStar } from "./course-star"
import { CourseStatus } from "./course-status"
import { CourseLink } from "./course-link"

export const CourseHeader = () => (
  <div className="bg-primary text-primary-foreground text-center font-bold grid grid-cols-subgrid col-span-full">
    <div className="p-2">{t('home_courses_course_name')}</div>
    <div className="p-2">{t('home_courses_course_year')}</div>
    <div className="p-2">{t('home_courses_course_remarks')}</div>
    <div className="p-2">{t('home_courses_course_teachers')}</div>
  </div>
)

export const CourseRow = (props: {
  course: Course
}) => (
  <div className="even:bg-slate-700/5 grid grid-cols-subgrid col-span-full">
    <div className="my-1 grid-cols-[auto_2rem_minmax(6rem,_1fr)_auto_auto] grid items-center">
      <CourseStar courseId={props.course.id} />
      <img src={props.course.icon} />
      <a className="ms-1" href={props.course.url}><Truncated text={props.course.title} /></a>
      <CourseLink className="ms-1" linked={props.course.linked} />
      <div className="ms-1 flex">
        <CourseStatus course={props.course} />
      </div>
    </div>
    <div className="p-1 border-primary border-s grid items-center justify-center">{props.course.year}</div>
    <div className="p-1 border-primary border-s flex items-center"><Truncated text={props.course.remarks} /></div>
    <div className="p-1 border-primary border-s flex items-center"><Truncated text={props.course.teachers} /></div>
  </div>
)
