import { ChangeEvent } from 'react'
import { submitAll } from './submit'
import { Button } from '@/components/ui/button'
import { t } from '@/utils/i18n'
import { FilePlusIcon } from '@radix-ui/react-icons'

export const AddFileButtonPanel = () => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()

    // Submit files
    const files = event.target.files
    if (files instanceof FileList) {
      submitAll(files)
    }
  }

  return (
    <div className='mt-2'>
      <Button className=' bg-[white] hover:bg-sky-200 cursor-pointer' asChild type='button'>
        <label>
          <input hidden type="file" multiple onChange={handleChange} />
          <FilePlusIcon className='me-1' />{t('report_add_file')}
        </label>
      </Button>
      <div className='my-1'>
        {t('report_dnd_message')}
      </div>
    </div>
  )
}
