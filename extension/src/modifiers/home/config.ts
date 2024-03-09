import { defineArrangeMap, defineClassMap, defineSelectorMap } from "@/types/config"

export const arrangeMap = defineArrangeMap({
  html: {
    selector: 'html',
    className: 'overflow-visible',
  },
  contents: {
    notes: {
      selector: '.coursememo',
      className: 'min-h-4 p-2 m-0 rounded overflow-hidden'
    },
    alertList: {
      selector: '.alertlist div',
      className: 'm-0'
    },
    myInfoList: {
      container: {
        selector: '.my-infolist',
        className: 'border border-primary border-solid rounded-lg overflow-hidden'
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
})

export const selectorMap = defineSelectorMap({
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
    trash: '',
  },
  courses: {
    status: ':is(.course-card-status, .coursestatus) img',
    thumbnail: {
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
      source: '.courselistweekly-c, .courselistweekly-r',
      url: 'a:first-of-type',
      title: 'a:first-of-type',
      year: '.my-infolist-mycourses select:nth-child(2)',
      linked: '.registration-state',
    },
  },
})

export const classMap = defineClassMap({
  dropzone: {
    1: "min-h-8 outline-dashed outline-offset-2 outline-red-300",
    2: "min-h-8 outline-dashed outline-offset-2 outline-yellow-300",
    3: "min-h-8 outline-dashed outline-offset-2 outline-green-300",
    4: "min-h-8 outline-dashed outline-offset-2 outline-blue-300",
    trash: "min-h-8 outline-dashed outline-offset-2 outline-slate-300",
  }
})

export const statusRegex = /.+on\.\w+$/

/**
 * Convert a home url into a root url.
 * @param rootUrl The home url
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
 * Convert a date into a Japanese fiscal year.
 * @param date The date
 * @returns The fiscal year
 */
export const getFiscalYear = (date: Date = new Date()) => {
  if (date.getMonth() < 4) {
    return date.getFullYear() - 1;
  }
  return date.getFullYear();
}

export const getDefaultYear = () => {
  return getFiscalYear().toString()
}


/**
 * Suffixes of URLs related to status icons.
 */
const statusSuffix = [
  '_news',
  '',
  '_grade',
  '_topics',
  '_coursecollection_user',
]
