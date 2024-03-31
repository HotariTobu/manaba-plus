import { modify } from '@/utils/modify'
import notes from './notes'
import externalAnchors from './external-anchors'
import responsive from './responsive'
import { addClass } from '@/utils/element'
import { arrangeMap } from './config'

debug: {
  addClass(arrangeMap.privacy)
}

modify(() => {
  responsive()
  notes()
  externalAnchors()
})
