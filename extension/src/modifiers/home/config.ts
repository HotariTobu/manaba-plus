import { ArrangeMap, ClassMap, SelectorMap, } from "@/types/config"
import { StatusType } from "./dock/items/courses/types/course"

export const arrangeMap = {
  html: {
    selector: 'html',
    className: 'overflow-visible',
  },
  contents: {
    notes: {
      selector: '.coursememo',
      className: 'min-h-4 p-2 m-0 rounded-md overflow-hidden'
    },
    alertList: {
      selector: '.alertlist div',
      className: 'm-0 h-fit bg-left-top'
    },
    myInfoList: {
      container: {
        selector: '.my-infolist',
        className: 'border border-primary border-solid rounded-md overflow-hidden'
      },
      children: {
        selector: '.my-infolist *',
        className: 'm-0 p-0 bg-none'
      },
      header: {
        div: {
          selector: '.my-infolist-header',
          className: 'bg-primary flex items-center h-fit p-0 border-none'
        },
        h2: {
          selector: '.my-infolist-header h2',
          className: 'm-2 p-0'
        }
      },
      body: {
        selector: '.my-infolist-body',
        className: 'm-2 h-fit border-none'
      },
      others: {
        search: {
          form: {
            selector: '.newssearch-box form',
            className: 'gap-1 flex'
          },
          textBox: {
            selector: '.newssearch-box [name="search"]',
            className: 'px-1 w-full'
          }
        },
        details: {
          selector: [
            '.showmore',
            '[style*="text-align:right"]:not(:has(input))',
            '[style*="padding-top:5px"]',
            '.right:has(img+a) :is(li)',
          ].join(', '),
          className: 'pt-2 h-fit'
        },
        subHeader: {
          selector: '.my-infolist-body h3',
          className: 'mb-2 indent-0'
        },
        eventList: {
          date: {
            selector: '.center.eventlist-day',
            className: 'pe-1'
          },
          anchors: {
            selector: '.event-title a',
            className: 'inline'
          }
        },
        kikuzou: {
          container: {
            selector: '.my-infolist-kikuzou table',
            className: 'w-full'
          },
          banners: {
            selector: '.my-infolist-kikuzou tr:has(.right > a)',
            className: 'flex justify-evenly'
          }
        }
      }
    },
    bannerList: {
      container: {
        selector: '.banner-list ul',
        className: 'flex justify-evenly flex-wrap text-[0]'
      },
      children: {
        listItems: {
          selector: '.banner-list li',
          className: 'block p-0'
        }
      }
    }
  }
} satisfies ArrangeMap

export const hiddenPosition = 'trash'

export const selectorMap = {
  pageBody: '.pagebody',
  pageElements: {
    top: [
      '.pageheader-course',
      '.memo',
      '.alertlist',
    ].join(', '),
    left: '.contentbody-left .my-infolist:not(.my-infolist-mycourses)',
    right: [
      '.contentbody-right .my-infolist',
      '.banner-list',
    ].join(', '),
    bottom: '',
    [hiddenPosition]: '',
  },
  courses: {
    status: ':is(.course-card-status, .coursestatus) img',
    thumbnail: {
      tab: 'a[href*="=thumbnail"]',
      source: '.coursecard-c, .coursecard-r',
      url: '.course-card-title a',
      code: '.coursecode',
      icon: '.course-card-img img',
      title: '.course-card-title a',
      year: '.courseitemdetail:first-of-type',
      linked: '.courselink-state',
      remarks: '.courseitemdetail:first-of-type span',
      teachers: '.courseitemdetail:last-of-type',
    },
    list: {
      tab: 'a[href*="=list"]',
      source: '.courselist-c, .courselist-r, .my-infolist-deactivecourse tr:not(.title)',
      url: '.courselist-title a',
      icon: 'img.inline',
      title: '.courselist-title',
      year: 'td:nth-of-type(2)',
      linked: 'span[style]',
      remarks: 'td:nth-of-type(3)',
      teachers: 'td:nth-of-type(4)',
    },
    timetable: {
      tab: 'a[href*="=timetable"]',
      source: '.courselistweekly-c, .courselistweekly-r',
      url: 'a:first-of-type',
      title: 'a:first-of-type',
      year: '.my-infolist-mycourses select:nth-child(2)',
      linked: '.registration-state',
    },
    assignments: {
      menus: '.course-menu-query, .course-menu-report, .course-menu-survey',
      counter: '.my-unreadcount',
    }
  },
  assignments: {
    row: 'table.stdlist tr:not(.title)',
    type: 'td:first-of-type a',
    assignment: '.myassignments-title a',
    course: '.mycourse-title a',
    deadline: 'td:nth-last-of-type(2)',
  }
} satisfies SelectorMap

export const classMap = {
  dropzone: {
    1: "outline-dashed outline-offset-2 outline-red-300",
    2: "outline-dashed outline-offset-2 outline-yellow-300",
    3: "outline-dashed outline-offset-2 outline-green-300",
    4: "outline-dashed outline-offset-2 outline-blue-300",
    [hiddenPosition]: "outline-dashed outline-offset-2 outline-slate-300",
  }
} satisfies ClassMap

/** The regex to determine whether a status icon is on or off */
export const statusRegex = /.+on\.\w+$/

/**
 * Convert a home url into a root url.
 * @param homeUrl The home url
 * @returns The root url
 */
export const getRootUrl = (homeUrl: string) => {
  const match = /(.+?)home.*/.exec(homeUrl)
  if (match === null) {
    return null
  }
  return match[1]
}

/**
 * Add a course format parameter to a home url.
 * @param homeUrl The home url
 * @returns The thumbnail formatted page url
 */
export const getThumbnailFormatUrl = (homeUrl: string) => {
  const url = new URL(homeUrl)
  url.searchParams.set('chglistformat', 'thumbnail')
  return url.href
}

/**
 * Convert a date into a Japanese fiscal year.
 * @param date The date
 * @returns The fiscal year
 */
export const getFiscalYear = (date: Date = new Date()) => {
  if (date.getMonth() < 3) {
    return date.getFullYear() - 1;
  }
  return date.getFullYear();
}

/** The relative path to the top page that has all courses */
export const allCoursesPath = 'home__all'

/** The relative path to the top page that has current courses only */
export const currentCoursesPath = 'home'

/**
 * Suffixes of URLs related to status icons.
 */
export const statusSuffixes: Record<StatusType, string> = {
  news: '_news',
  assignment: '',
  grade: '_grade',
  topic: '_topics',
  collection: '_coursecollection_user',
}

/** The regex to extract date-time from a string in the page */
export const dateTimeRegex = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})/

/** The relative path to the top page that lists all assignments */
export const allAssignmentsPath = 'home_library_query'
