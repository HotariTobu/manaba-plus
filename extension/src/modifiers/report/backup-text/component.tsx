import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Textarea } from '@/components/ui/textarea'
import { t } from '@/utils/i18n'

export const BackupText = (props: { backupText: string }) => {
  return (
    <Collapsible className='my-2'>
      <Button variant="outline" asChild type='button'>
        <CollapsibleTrigger>
          {t('report_backup_text')}
        </CollapsibleTrigger>
      </Button>
      <CollapsibleContent>
        <Textarea className='mt-1' readOnly value={props.backupText} />
      </CollapsibleContent>
    </Collapsible>
  )
}
