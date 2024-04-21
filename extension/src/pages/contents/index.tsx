import { homePageUrl } from '@/../../constants.json'
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from '@/components/ui/button';
import { mount } from "@/utils/mount";
import { useDownload } from './hooks/useDownload';
import { ContentsTree } from './components/contents-tree';
import { Toaster } from 'sonner';
import { isStoreInitializationRequired } from '@/store';
import { InitAlert } from '@/components/init-alert';
import { t } from "@/utils/i18n";
import { PageContainer } from "../components/page-container";
import { ContentsStatsPanel } from "./components/contents-stats-panel";
import { ExternalLink } from "@/components/external-link";
import { Separator } from '@/components/ui/separator';

document.title = t('contents_page_title')

const Page = () => {
  const { downloading, contentsStats, contentsItems, startDownload, cancelDownload } = useDownload()

  if (isStoreInitializationRequired()) {
    return (
      <div className='w-[30rem] h-fit inset-1/2 -translate-x-1/2 -translate-y-1/2 absolute'>
        <InitAlert />
      </div>
    )
  }

  return (
    <PageContainer className='grid grid-cols-[auto_auto_minmax(0,_1fr)]'>
      <ScrollArea>
        <div className='mx-4 my-2 w-96 gap-4 flex flex-col'>
          <div className='text-lg'>{t('contents_page_description')}</div>
          <div className='grid'>
            {downloading ? (
              <Button onClick={cancelDownload}>{t('contents_cancel_download')}</Button>
            ) : (
              <Button onClick={startDownload}>{t('contents_start_download')}</Button>
            )}
          </div>
          <ContentsStatsPanel contentsStats={contentsStats} />
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
