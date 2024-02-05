import modify from '@/utils/modify'
import replace from './replace'
import insert from './insert'
import event from './event'

modify(async () => {
  replace()
  insert()
  await event()
})
