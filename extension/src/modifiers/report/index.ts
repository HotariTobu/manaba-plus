import { modify } from '@/utils/modify'
import addFileButton from './add-file-button'
import backupText from './backup-text'

modify(() => {
  addFileButton()
  backupText()
})
