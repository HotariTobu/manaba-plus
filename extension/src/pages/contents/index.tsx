import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { usePageContextProvider } from '@/modifiers/home/dock/hooks/usePageContext';
import { AssignmentsContainer } from '@/modifiers/home/dock/items/assignment/components/assignments-container';
import { t } from '@/utils/i18n';
import { mount } from "@/utils/mount";
import { local, managed, session, sync } from '@/utils/useStorage';
import { useState } from 'react';

const interval = 1000

const getScrapingContext = () => {

}

const App = () => {
  const [cancelHandlers, setCancelHandlers] = useState<(() => void)[]>([])
  const downloading = cancelHandlers.length > 0

  const startDownload = () => {

  }

  const cancelDownload = () => {
    for (const cancelHandler of cancelHandlers) {
      cancelHandler()
    }
    setCancelHandlers([])
  }

  return (
    <div className='flex'>
      <div className='flex flex-col'>
        {downloading ? (
          <Button onClick={cancelDownload}>ダウンロードをキャンセルする</Button>
        ) : (
          <Button onClick={startDownload}>ダウンロードを開始する</Button>
        )}
      </div>
      <div className='flex-1'>

      </div>
    </div>
  )
}

mount(<App />, '#app')
