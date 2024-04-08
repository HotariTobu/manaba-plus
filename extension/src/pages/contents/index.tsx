import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { usePageContextProvider } from '@/modifiers/home/dock/hooks/usePageContext';
import { AssignmentsContainer } from '@/modifiers/home/dock/items/assignment/components/assignments-container';
import { t } from '@/utils/i18n';
import { mount } from "@/utils/mount";
import { local, managed, session, sync } from '@/utils/useStorage';
import { useState } from 'react';

const Popup = () => {
  return (
    <div className='flex'>
      <div className='flex flex-col'>
        <Button>ダウンロードを開始する</Button>
        <Button>スクレイピングテスト</Button>
      </div>
      <div className='flex-1'>

      </div>
    </div>
  )
}

mount(<Popup />, '#app')
