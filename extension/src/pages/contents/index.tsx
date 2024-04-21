import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from '@/components/ui/button';
import { mount } from "@/utils/mount";
import { useDownload } from './hooks/useDownload';
import { ContentsTree } from './components/contents-tree';
import { Toaster } from 'sonner';
import { isStoreInitializationRequired } from '@/store';
import { InitAlert } from '@/components/init-alert';
import { t } from "@/utils/i18n";

document.title = t('contents_page_title')

const App = () => {
  const { downloading, contentsStats, contentsItems, startDownload, cancelDownload } = useDownload()

  if (isStoreInitializationRequired()) {
    return (
      <div className='w-[30rem] h-fit inset-1/2 -translate-x-1/2 -translate-y-1/2 absolute'>
        <InitAlert />
      </div>
    )
  }

  return (
    <>
      <div className='h-screen grid grid-cols-[auto_minmax(0,_1fr)]'>
        <ScrollArea>
          <div className='flex flex-col'>
            <div>{t('contents_page_description')}</div>
            {downloading ? (
              <Button onClick={cancelDownload}>ダウンロードをキャンセルする</Button>
            ) : (
              <Button onClick={startDownload}>ダウンロードを開始する</Button>
            )}
            <div>
              {JSON.stringify(contentsStats)}
            </div>
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
        <ScrollArea>
          <ContentsTree contentsItems={contentsItems} />
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </div>
      <Toaster richColors />
    </>
  )
}

mount(<App />, '#app')
