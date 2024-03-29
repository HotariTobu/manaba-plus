import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { usePageContextProvider } from '@/modifiers/home/dock/hooks/usePageContext';
import { AssignmentsContainer } from '@/modifiers/home/dock/items/assignment/components/assignments-container';
import { t } from '@/utils/i18n';
import { mount } from "@/utils/mount";
import { local, managed, session, sync } from '@/utils/useStorage';

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
  return (
    <Provider {...providerProps}>
      <ScrollArea className='w-[48rem] h-[32rem]'>
        <div className='m-2 gap-2 flex flex-col'>
          <AssignmentsContainer />
          <ScrollBar orientation="vertical" />
          <div className='gap-2 flex items-center'>
            {t('popup_reset_label')}
            <Button onClick={() => sync.clear()}>{t('popup_reset_button')}</Button>
          </div>
        </div>
      </ScrollArea>
    </Provider>
  )
}

mount(<Popup />, '#app')
