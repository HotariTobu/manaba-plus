import { homePageUrl } from '@/../../constants.json'
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from '@/components/ui/button';
import { mount } from "@/utils/mount";
import { useDownload } from './hooks/useDownload';
import { ContentsTree } from './components/contents-tree';
import { isStoreInitializationRequired } from '@/store';
import { InitAlert } from '@/components/init-alert';
import { t } from "@/utils/i18n";
import { PageContainer } from "../components/page-container";
import { ContentsStatsPanel } from "./components/contents-stats-panel";
import { ExternalLink } from "@/components/external-link";
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { localStore } from './store';
import { ContentsProgress } from './components/contents-progress';

document.title = t('contents_page_title')

const Page = () => {
  const { status, contentsStats, contentsItems, startDownload, cancelDownload } = useDownload()

  if (isStoreInitializationRequired()) {
    return (
      <div className='w-[30rem] h-fit inset-1/2 -translate-x-1/2 -translate-y-1/2 absolute'>
        <InitAlert />
      </div>
    )
  }

  return (
    <PageContainer className='grid grid-cols-[auto_auto_minmax(0,_1fr)] grid-rows-[auto_minmax(0,_1fr)]'>
      <div className='col-span-3'>
        {status === 'downloading' && (
          <ContentsProgress contentsStats={contentsStats} />
        )}
      </div>
      <ScrollArea>
        <div className='mx-4 my-2 w-96 gap-4 flex flex-col'>
          <div className='text-lg'>{t('contents_page_description')}</div>
          {status === 'downloading' ? (
            <AlertDialog>
              <Button asChild>
                <AlertDialogTrigger>
                  {t('contents_cancel_download')}
                </AlertDialogTrigger>
              </Button>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('contents_cancel_download_title')}</AlertDialogTitle>
                  <AlertDialogDescription>{t('contents_cancel_download_description')}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('contents_cancel_download_cancel')}</AlertDialogCancel>
                  <AlertDialogAction onClick={cancelDownload}>{t('contents_cancel_download_action')}</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Button onClick={startDownload}>{t('contents_start_download')}</Button>
          )}
          {status === 'canceled' ? (
            <div className='text-base'>{t('contents_message_canceled')}</div>
          ) : status === 'completed' && (
            <div className='text-base'>{t('contents_message_completed')}</div>
          )}
          <ContentsStatsPanel contentsStats={contentsStats} />
          {localStore.lastDownloadTime === null || (
            <div>{t('contents_last_download_date', new Date(localStore.lastDownloadTime).toLocaleString())}</div>
          )}
          <ExternalLink href={homePageUrl + t('contents_download_dialog_guide_path')} label={t('contents_download_dialog_guide_label')} />
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
      <div className='my-4'>
        <Separator orientation="vertical" />
      </div>
      <ScrollArea>
        <ContentsTree contentsItems={contentsItems} />
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </PageContainer>
  )
}

mount(<Page />, '#app')
