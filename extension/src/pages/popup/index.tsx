import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { usePageContextProvider } from '@/modifiers/home/dock/hooks/usePageContext';
import { AssignmentsContainer } from '@/modifiers/home/dock/items/assignment/components/assignments-container';
import { t } from '@/utils/i18n';
import { mount } from "@/utils/mount";
import { local, managed, session, sync } from '@/utils/useStorage';
import { useState } from 'react';
import browser from "webextension-polyfill";

debug: {
  const areas = {
    local: local,
    managed: managed,
    session: session,
    sync: sync,
  }
  for (const [name, area] of Object.entries(areas)) {
    const values = await area.get()
    console.log(name)
    console.log(values)
  }
}

const Popup = () => {
  const { Provider, providerProps } = usePageContextProvider()
  const [reset, setReset] = useState(false)

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
          <Button asChild>
            <a href={browser.runtime.getURL('src/pages/contents/index.html')} target="_blank">コンテンツ</a>
          </Button>
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
