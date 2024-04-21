import { InitAlert } from '@/components/init-alert';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { usePageContextProvider } from '@/modifiers/home/dock/hooks/usePageContext';
import { AssignmentsContainer } from '@/modifiers/home/dock/items/assignment/components/assignments-container';
import { isStoreInitializationRequired } from '@/store';
import { downloadText } from '@/utils/downloadText';
import { t } from '@/utils/i18n';
import { mount } from "@/utils/mount";
import { local, managed, session, sync } from '@/utils/useStorage';
import { useState } from 'react';
import { ContentsButton } from '../contents/components/contents-button';

let DumpButton = () => <></>

debug: {
  const areas = {
    local,
    managed,
    session,
    sync,
  }

  const areaEntries = Object.entries(areas)
  const dataPromises = areaEntries.map(async ([name, area]) => {
    const values = await area.get()
    return [name, values]
  })

  const dataEntries = await Promise.all(dataPromises)
  const data = Object.fromEntries(dataEntries)

  console.log(data)

  DumpButton = () => {
    const handleDump = () => {
      const dataText = JSON.stringify(data, null, 2)
      downloadText('storage.txt', dataText)
    }

    return (
      <div className='gap-2 flex items-center'>
        {t('popup_dump_storage_label')}
        <Button onClick={handleDump}>{t('popup_dump_storage_button')}</Button>
      </div>
    )
  }
}


const Popup = () => {
  const { Provider, providerProps } = usePageContextProvider()
  const [reset, setReset] = useState(false)

  if (isStoreInitializationRequired()) {
    return (
      <div className='m-4 w-[30rem]'>
        <InitAlert />
      </div>
    )
  }

  const handleReset = () => {
    setReset(true)
    local.clear()
    session.clear()
    sync.clear()
  }

  return (
    <Provider {...providerProps}>
      <ScrollArea className='w-[48rem] h-[32rem]'>
        <div className='m-2 gap-2 flex flex-col'>
          <DumpButton />
          <ContentsButton />
          <AssignmentsContainer />
          <ScrollBar orientation="vertical" />
          <div className='gap-2 flex items-center'>
            {t('popup_reset_label')}
            <Button onClick={handleReset} disabled={reset}>{t('popup_reset_button')}</Button>
          </div>
        </div>
      </ScrollArea>
    </Provider>
  )
}

mount(<Popup />, '#app')
