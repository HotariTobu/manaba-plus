import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { t } from '@/utils/i18n';

export const InitAlert = () => (
  <Alert>
    <InfoCircledIcon className="h-4 w-4" />
    <AlertTitle>{t('alert_info_initialization_required_title')}</AlertTitle>
    <AlertDescription>{t('alert_info_initialization_required_description')}</AlertDescription>
  </Alert>
)
