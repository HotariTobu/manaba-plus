import { modify } from '@/utils/modify'
import notes from './notes'
import externalAnchors from './external-anchors'
import responsive from './responsive'

modify(() => {
  responsive()
  notes()
  externalAnchors()
})
