import { t } from "@/utils/i18n"
import { type Course } from "../types/course"
import { CourseStar } from "./course-star"
import { CourseStatus } from "./course-status"

export const CourseHeader = () => (
  <tr className="bg-primary text-primary-foreground text-center font-bold">
    <th className="p-2" scope="col">{t('home_courses_course_name')}</th>
    <th className="p-2" scope="col">{t('home_courses_course_year')}</th>
    <th className="p-2" scope="col">{t('home_courses_course_remarks')}</th>
    <th className="p-2" scope="col">{t('home_courses_course_teachers')}</th>
  </tr>
)

export const CourseRow = (props: {
  course: Course
}) => (
  <tr className="even:bg-slate-700/5">
    <td className="min-w-64 max-w-96">
      <div className="my-1 grid-cols-[auto_2rem_1fr_auto_auto] grid items-center">
        <CourseStar courseId={props.course.id} />
        <img src={props.course.icon} />
        <a className="ms-1 truncate" href={props.course.url}>{props.course.title}</a>
        <div className="ms-1 text-orange-300">{props.course.linked && t('home_courses_course_linked')}</div>
        <div className="ms-1 flex">
          <CourseStatus course={props.course} />
        </div>
      </div>
    </td>
    <td className="p-1 w-fit text-center border-primary border-s">{props.course.year}</td>
    <td className="p-1 max-w-24 truncate border-primary border-s">{props.course.remarks}</td>
    <td className="p-1 max-w-20 truncate border-primary border-s">{props.course.teachers}</td>
  </tr>
)
